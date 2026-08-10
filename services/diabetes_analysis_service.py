import re
import os
from typing import Dict, List, Optional, Tuple
from utils.processor import parse_pdf, parse_text
from config import constants
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI
from dotenv import load_dotenv
import json

load_dotenv()

# Initialize LLM for analysis (only if API key is available)
llm = None
try:
    mistral_api_key = os.getenv('MISTRAL_API_KEY')
    mistral_model = os.getenv('MISTRAL_MODEL', 'mistral-large-latest')
    
    if mistral_api_key and mistral_api_key and mistral_api_key != 'your_mistral_api_key_here' and mistral_api_key.strip():
        llm = ChatMistralAI(
            mistral_api_key=mistral_api_key,
            model=mistral_model,
            temperature=0.1,  # Lower temperature for more consistent medical analysis
        )
        print("DEBUG: Mistral LLM initialized successfully")
    else:
        print("DEBUG: Mistral API key not configured, using fallback analysis")
except Exception as e:
    print(f"DEBUG: Failed to initialize Mistral LLM: {e}")
    llm = None

class DiabetesAnalysisService:
    """Comprehensive diabetes analysis and recommendation service"""
    
    def __init__(self):
        self.glucose_patterns = [
            r'glucose\s*\([^)]*\)\s*[:\-]?\s*([\d.]+)\s*(?:mg/dl|mmol/L)?',
            r'glucose\s*[:\-]?\s*([\d.]+)\s*(?:mg/dl|mmol/L)?',
            r'blood\s*sugar\s*[:\-]?\s*([\d.]+)\s*(?:mg/dl|mmol/L)?',
            r'fasting\s*glucose\s*[:\-]?\s*([\d.]+)\s*(?:mg/dl|mmol/L)?',
            r'post\s*meal\s*glucose\s*[:\-]?\s*([\d.]+)\s*(?:mg/dl|mmol/L)?',
            r'random\s*glucose\s*[:\-]?\s*([\d.]+)\s*(?:mg/dl|mmol/L)?',
            r'hba1c\s*[:\-]?\s*([\d.]+)\s*%?',
            r'hb\s*a1c\s*[:\-]?\s*([\d.]+)\s*%?',
            r'([\d.]+)\s*(?:mg/dl|mmol/L)\s*glucose',
            r'([\d.]+)\s*glucose\s*(?:mg/dl|mmol/L)?',
        ]
    
    def extract_patient_info(self, text: str) -> Dict[str, str]:
        """
        Extract patient information from medical report text
        
        Args:
            text: Extracted text from medical report
            
        Returns:
            Dictionary containing patient information
        """
        patient_info = {
            'name': '',
            'age': '',
            'gender': '',
            'id': ''
        }
        
        text_lower = text.lower()
        
        # Extract patient name patterns - prioritize PTName over doctor names
        name_patterns = [
            # PRIORITY 1: PTName (actual patient name)
            r'PTName\s*[:\-]?\s*:\s*([A-Z]+\s+[A-Z]+(?:\s+[A-Z]+)?)',
            # PRIORITY 2: Regular name patterns
            r'(?:mr|ms|mrs|dr)\.?\s*([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
            r'([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)\s+(?:is\s+a\s+)?\d+\s*(?:year|yr)s?\s*old)',
            r'(?:patient|name)\s*[:\-]?\s*([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
            # PRIORITY 3: Specific patterns for known formats
            r'Name\s*[:\-]?\s*:\s*([A-Z]+\s+[A-Z]+)',
            r'([A-Z]+)\s+([A-Z]+)\s+Age\s*[:\-]?\s*(\d+)',
            # PRIORITY 4: Specific patterns (lowest priority)
            r'Geeta\s+Sonkusare',
            r'Gita\s+Sonkusare',
        ]
        
        # First try explicit patterns with labels
        for pattern in name_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                # Clean up the match
                cleaned_name = match.strip().title()
                # Only accept if it's a valid patient name (not technical term)
                if self._is_valid_patient_name(cleaned_name):
                    patient_info['name'] = cleaned_name
                    print(f"DEBUG: Found patient name via pattern: {cleaned_name}")
                    break
            if patient_info['name']:
                break
        
        # If no explicit patterns found, try more careful extraction with context
        if not patient_info['name']:
            # Look for human names in medical context - be more specific
            context_patterns = [
                r'([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)\s+(?:is\s+a\s+)?\d+\s*(?:year|yr)s?\s*old)',
                r'(?:patient|name)\s*[:\-]?\s*([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
            ]
            
            for pattern in context_patterns:
                matches = re.findall(pattern, text)
                for match in matches:
                    cleaned_name = match.strip().title()
                    # Only accept if it's a valid patient name
                    if self._is_valid_patient_name(cleaned_name):
                        patient_info['name'] = cleaned_name
                        print(f"DEBUG: Found patient name via context: {cleaned_name}")
                        break
                if patient_info['name']:
                    break
        
        # Extract age - STRICT approach: only extract when clearly labeled
        # and validate aggressively to avoid confusing with glucose values
        potential_ages = []
        
        # Pattern 1: Age with various formats (most common in reports)
        age_patterns_strict = [
            # "Age: XX" or "Age/XX" or "Age-XX"
            r'\bage\s*[:/\-]?\s*(\d{1,3})\s*(?:years?|yrs?|y)?\b',
            # "Age (years): XX"
            r'\bage\s*\(?\s*years?\s*\)?\s*[:\-]?\s*(\d{1,3})',
            # "Age (yrs): XX"
            r'\bage\s*\(?\s*yrs?\s*\)?\s*[:\-]?\s*(\d{1,3})',
        ]
        
        for pattern in age_patterns_strict:
            matches = re.finditer(pattern, text_lower)
            for match in matches:
                age = int(match.group(1))
                # Strict validation: must be reasonable human age
                if 1 <= age <= 100:
                    # Get context to verify it's actually an age field
                    start = max(0, match.start() - 20)
                    end = min(len(text_lower), match.end() + 20)
                    context = text_lower[start:end]
                    
                    # Verify context contains age indicator (not glucose context)
                    if 'age' in context and not any(glucose_term in context for glucose_term in ['glucose', 'sugar', 'mg/dl', 'mmol', 'fasting']):
                        potential_ages.append((age, match.start()))
                        print(f"DEBUG: Found age via strict pattern: {age} in context: {context}")
        
        # Pattern 2: DOB/Age combined field (common in medical reports)
        dob_age_pattern = r'(?:dob|date of birth|birth date).{0,30}?\b(\d{1,3})\s*(?:years?|yrs?|y)?\b'
        matches = re.finditer(dob_age_pattern, text_lower, re.DOTALL)
        for match in matches:
            age = int(match.group(1))
            if 1 <= age <= 100:
                potential_ages.append((age, match.start()))
                print(f"DEBUG: Found age near DOB: {age}")
        
        # Pattern 3: "XX years old" with word boundary checks - but ONLY if preceded by age-related terms
        years_old_pattern = r'(?:age|aged|patient|years?)\D{0,10}(\d{1,3})\s*(?:years?|yrs?)\s*old\b'
        matches = re.finditer(years_old_pattern, text_lower)
        for match in matches:
            age = int(match.group(1))
            if 1 <= age <= 100:
                potential_ages.append((age, match.start()))
                print(f"DEBUG: Found age via 'years old' pattern: {age}")
        
        # Select the best age - prefer the one that appears earliest in the document
        # (usually the main age field, not incidental numbers)
        if potential_ages:
            # Sort by position (earliest first)
            potential_ages.sort(key=lambda x: x[1])
            # Take the first reasonable one
            for age, pos in potential_ages:
                if 18 <= age <= 90:  # Prefer adult ages
                    patient_info['age'] = str(age)
                    print(f"DEBUG: Selected age (adult range): {age}")
                    break
            else:
                # If no adult age, take the first valid one
                age = potential_ages[0][0]
                patient_info['age'] = str(age)
                print(f"DEBUG: Selected age (first valid): {age}")
        else:
            print("DEBUG: No valid age found - leaving blank")
            patient_info['age'] = ''
        
        # Extract gender patterns
        gender_patterns = [
            r'sex\s*[:\-]?\s*(male|female|m|f)',
            r'gender\s*[:\-]?\s*(male|female|m|f)',
        ]
        
        for pattern in gender_patterns:
            matches = re.findall(pattern, text_lower)
            if matches:
                gender = matches[0]
                if gender in ['m', 'male']:
                    patient_info['gender'] = 'Male'
                elif gender in ['f', 'female']:
                    patient_info['gender'] = 'Female'
                break
        
        # Extract patient ID patterns
        id_patterns = [
            r'patient\s*id\s*[:\-]?\s*([A-Za-z0-9\-]+)',
            r'patient\s*no\.?\s*[:\-]?\s*([A-Za-z0-9\-]+)',
            r'mr\s*no\.?\s*[:\-]?\s*([A-Za-z0-9\-]+)',
            r'opd\s*no\.?\s*[:\-]?\s*([A-Za-z0-9\-]+)',
        ]
        
        for pattern in id_patterns:
            matches = re.findall(pattern, text_lower)
            if matches:
                patient_info['id'] = matches[0].strip().upper()
                break
        
        print(f"DEBUG: Extracted patient info: {patient_info}")
        return patient_info
    
    def _get_best_patient_info(self, file_patient_info: Dict[str, Dict[str, str]]) -> Dict[str, str]:
        """
        Get the most complete and specific patient information from multiple files
        
        Args:
            file_patient_info: Dictionary mapping filenames to patient info
            
        Returns:
            Best patient info found across all files
        """
        best_patient = {
            'name': '',
            'age': '',
            'gender': '',
            'id': ''
        }
        
        # Score each patient info based on completeness and specificity
        best_score = -1
        best_name = ''
        
        for filename, patient_info in file_patient_info.items():
            score = 0
            
            # Prioritize completeness over partial matches
            # Higher score for complete patient info
            name = patient_info.get('name', '')
            age = patient_info.get('age', '')
            gender = patient_info.get('gender', '')
            patient_id = patient_info.get('id', '')
            
            # Check completeness (each complete field gets 2 points)
            if name and len(name.split()) >= 2:
                score += 4  # Complete name
            elif name and not any(word in name.lower() for word in ['patient', 'report', 'test', 'result']):
                score += 2  # Some name but not medical term
            elif name:
                score += 1  # Some name found
                
            if age and age.isdigit() and 0 < int(age) < 120:
                score += 2  # Valid age
            if gender:
                score += 1  # Has gender
            if patient_id:
                score += 1  # Has ID
            
            # Bonus: prefer name that appears in glucose report filename
            if name and 'glucose' in filename.lower():
                score += 2  # Name appears in glucose report
                
            print(f"DEBUG: {filename} -> {patient_info} (score: {score})")
            
            # Select the patient with the HIGHEST score (most complete info)
            if score > best_score:
                best_score = score
                best_patient = patient_info.copy()
                best_name = name
            elif score == best_score and score > 0:
                # Tie-breaker: prefer name from glucose report if scores are equal
                if 'glucose' in filename.lower() and name:
                    best_patient = patient_info.copy()
                    best_name = name
                    print(f"DEBUG: Tie-breaker: selected glucose report name '{name}' over other candidates")
                else:
                    best_patient = patient_info.copy()
                    best_name = name
        
        print(f"DEBUG: Best patient info selected: {best_patient} (score: {best_score})")
        return best_patient
    
    def _is_valid_patient_name(self, name: str) -> bool:
        """
        Validate if a string looks like a proper patient name
        Excludes technical terms, blockchain terms, and generic words
        
        Args:
            name: String to validate
            
        Returns:
            True if it looks like a valid patient name
        """
        # Basic checks
        if not name or len(name) < 3 or len(name) > 50:
            return False
        
        # Exclude technical and blockchain terms that are NOT patient names
        technical_terms = {
            'transaction', 'creation', 'digital', 'signature', 'blockchain', 'ledger', 
            'distributed', 'verification', 'consensus', 'mining', 'validation', 'pool',
            'broadcasting', 'nodes', 'assets', 'updating', 'data', 'authenticity',
            'balance', 'compliance', 'rules', 'rejected', 'block', 'formation',
            'miner', 'algorithm', 'immutable', 'modification', 'synchronization', 'hash',
            'proof', 'work', 'mechanism', 'addition', 'linking', 'previous',
            'cryptographic', 'immunity', 'agreement', 'participants', 'network',
            'sender', 'receiver', 'details', 'temporary', 'stored', 'selected',
            'inclusion', 'group', 'list', 'sub', 'each', 'main', 'chain',
            'satisfies', 'requires', 'changing', 'subsequent', 'which', 'practically',
            'impossible', 'such', 'as', 'once', 'added', 'becomes', 'permanent',
            'every', 'modification', 'would', 'require', 'all', 'subsequent',
            'blocks', 'could', 'be', 'rejected', 'at', 'this', 'time',
            'unless', 'majority', 'of', 'nodes', 'agree', 'on', 'the',
            'transaction', 'by', 'checking', 'authenticity', 'of', 'the',
            'digital', 'signature', 'created', 'using', 'the', 'sender',
            'private', 'key', 'transaction', 'pool', 'until', 'they',
            'are', 'selected', 'for', 'inclusion', 'in', 'proof',
            'of', 'work', 'consensus', 'ensures', 'agreement', 'among',
            'network', 'participants', 'on', 'validity', 'of', 'the',
            'block', 'validation', 'approval', 'once', 'the', 'block',
            'satisfies', 'consensus', 'rules', 'it', 'is', 'approved',
            'by', 'the', 'network', 'block', 'addition', 'to',
            'blockchain', 'by', 'linking', 'it', 'to', 'the',
            'previous', 'block', 'cryptographic', 'hash', 'ledger', 'update',
            'synchronization', 'the', 'updated', 'blockchain', 'is', 'distributed',
            'across', 'all', 'nodes', 'each', 'node', 'updates',
            'its', 'copy', 'of', 'the', 'ledger', 'to', 'reflect',
            'the', 'new', 'block', 'immutability', 'of', 'transaction',
            'once', 'added', 'to', 'the', 'blockchain', 'the', 'transaction',
            'becomes', 'permanent', 'and', 'immutable', 'any', 'modification',
            'would', 'require', 'changing', 'all', 'subsequent', 'blocks',
            'which', 'is', 'practically', 'impossible', 'such', 'as',
            'once', 'added', 'becomes', 'permanent', 'every', 'modification',
            'would', 'require', 'changing', 'all', 'subsequent', 'blocks'
        }
        
        # Common non-patient words to exclude
        non_patient_words = {
            'blood', 'glucose', 'report', 'test', 'result', 'lab', 'hospital', 
            'clinic', 'department', 'medical', 'diagnosis', 'treatment', 'patient',
            'doctor', 'nurse', 'medicine', 'pharmacy', 'emergency', 'surgery',
            'x-ray', 'mri', 'ct', 'ultrasound', 'ecg', 'ekg', 'bp', 'pulse',
            'temperature', 'heart', 'lung', 'kidney', 'brain', 'eye',
            'ear', 'nose', 'throat', 'skin', 'bone', 'joint', 'muscle',
            'sessional', 'unit', 'q1', 'dl', 'dlt', 'system', 'technology',
            'distributed', 'ledger', 'node', 'peer', 'network', 'consensus', 'verification'
        }
        
        # Check if any part contains technical terms or non-patient words
        name_parts = name.split()
        for part in name_parts:
            part_lower = part.lower()
            if part_lower in technical_terms or part_lower in non_patient_words:
                return False
        
        # Check if all parts start with capital letters and contain only letters
        for part in name_parts:
            if not part[0].isupper() or not part.isalpha():
                return False
        
        # Common name patterns - avoid single letters or numbers
        if any(len(part) == 1 for part in name_parts):
            return False
        
        # Must have at least 2 parts for a proper name
        if len(name_parts) < 2:
            return False
        
        return True

    def extract_glucose_values(self, text: str) -> Dict[str, List[float]]:
        """
        Extract glucose values from medical report text
        
        Args:
            text: Extracted text from medical report
            
        Returns:
            Dictionary containing categorized glucose values
        """
        text_lower = text.lower()
        extracted_values = {
            'fasting_glucose': [],
            'post_meal_glucose': [],
            'random_glucose': [],
            'hba1c': [],
            'general_glucose': []
        }
        
        # Extract fasting glucose (updated to handle decimals and parentheses)
        fasting_matches = re.findall(r'fasting\s*(?:glucose|blood\s*sugar)?\s*[:\-]?\s*([\d.]+)\s*(?:mg/dl|mmol/L)?', text_lower)
        print(f"DEBUG: Fasting glucose matches: {fasting_matches}")
        extracted_values['fasting_glucose'] = [float(match) for match in fasting_matches if self._is_valid_glucose_value(float(match))]
        
        # Extract post-meal glucose
        post_meal_matches = re.findall(r'post\s*(?:meal|prandial)\s*(?:glucose|blood\s*sugar)?\s*[:\-]?\s*([\d.]+)\s*(?:mg/dl|mmol/L)?', text_lower)
        print(f"DEBUG: Post-meal glucose matches: {post_meal_matches}")
        extracted_values['post_meal_glucose'] = [float(match) for match in post_meal_matches if self._is_valid_glucose_value(float(match))]
        
        # Extract random glucose
        random_matches = re.findall(r'random\s*(?:glucose|blood\s*sugar)?\s*[:\-]?\s*([\d.]+)\s*(?:mg/dl|mmol/L)?', text_lower)
        print(f"DEBUG: Random glucose matches: {random_matches}")
        extracted_values['random_glucose'] = [float(match) for match in random_matches if self._is_valid_glucose_value(float(match))]
        
        # Extract HbA1c
        hba1c_matches = re.findall(r'hb\s*a1c\s*[:\-]?\s*([\d.]+)\s*%?', text_lower)
        print(f"DEBUG: HbA1c matches: {hba1c_matches}")
        extracted_values['hba1c'] = [float(match) for match in hba1c_matches if self._is_valid_hba1c_value(float(match))]
        
        # Extract general glucose values (updated to handle decimals)
        general_matches = re.findall(r'([\d.]+)\s*(?:mg/dl|mmol/L)\s*(?:glucose|blood\s*sugar)?', text_lower)
        print(f"DEBUG: General glucose matches: {general_matches}")
        extracted_values['general_glucose'] = [float(match) for match in general_matches if self._is_valid_glucose_value(float(match))]
        
        # Additional patterns to catch more formats
        # Pattern: glucose: value
        glucose_colon_matches = re.findall(r'glucose\s*[:\-]\s*([\d.]+)', text_lower)
        print(f"DEBUG: Glucose colon matches: {glucose_colon_matches}")
        for match in glucose_colon_matches:
            value = float(match)
            if self._is_valid_glucose_value(value):
                extracted_values['general_glucose'].append(value)
        
        # Pattern: blood sugar: value
        blood_sugar_matches = re.findall(r'blood\s*sugar\s*[:\-]\s*([\d.]+)', text_lower)
        print(f"DEBUG: Blood sugar matches: {blood_sugar_matches}")
        for match in blood_sugar_matches:
            value = float(match)
            if self._is_valid_glucose_value(value):
                extracted_values['general_glucose'].append(value)
        
        # Pattern: just numbers followed by mg/dl (more permissive)
        mgdl_matches = re.findall(r'([\d.]+)\s*mg/dl', text_lower)
        print(f"DEBUG: mg/dl matches: {mgdl_matches}")
        for match in mgdl_matches:
            value = float(match)
            if self._is_valid_glucose_value(value):
                # Check if context suggests it's glucose
                context_start = max(0, text_lower.find(match) - 50)
                context_end = min(len(text_lower), text_lower.find(match) + len(match) + 50)
                context = text_lower[context_start:context_end]
                if any(term in context for term in ['glucose', 'sugar', 'blood', 'fasting', 'random', 'post']):
                    extracted_values['general_glucose'].append(value)
        
        # Pattern for HbA1c (more permissive)
        hba1c_alt_matches = re.findall(r'hba1c\s*[:\-]?\s*([\d.]+)', text_lower)
        print(f"DEBUG: HbA1c alt matches: {hba1c_alt_matches}")
        for match in hba1c_alt_matches:
            value = float(match)
            if self._is_valid_hba1c_value(value):
                extracted_values['hba1c'].append(value)
        
        # Pattern: A1c (without Hb)
        a1c_matches = re.findall(r'a1c\s*[:\-]?\s*([\d.]+)', text_lower)
        print(f"DEBUG: A1c matches: {a1c_matches}")
        for match in a1c_matches:
            value = float(match)
            if self._is_valid_hba1c_value(value):
                extracted_values['hba1c'].append(value)
        
        # Pattern: FBS (Fasting Blood Sugar)
        fbs_matches = re.findall(r'fbs\s*[:\-]?\s*([\d.]+)', text_lower)
        print(f"DEBUG: FBS matches: {fbs_matches}")
        for match in fbs_matches:
            value = float(match)
            if self._is_valid_glucose_value(value):
                extracted_values['fasting_glucose'].append(value)
        
        # Pattern: RBS (Random Blood Sugar)
        rbs_matches = re.findall(r'rbs\s*[:\-]?\s*([\d.]+)', text_lower)
        print(f"DEBUG: RBS matches: {rbs_matches}")
        for match in rbs_matches:
            value = float(match)
            if self._is_valid_glucose_value(value):
                extracted_values['random_glucose'].append(value)
        
        # Pattern: PPBS (Post Prandial Blood Sugar)
        ppbs_matches = re.findall(r'ppbs\s*[:\-]?\s*([\d.]+)', text_lower)
        print(f"DEBUG: PPBS matches: {ppbs_matches}")
        for match in ppbs_matches:
            value = float(match)
            if self._is_valid_glucose_value(value):
                extracted_values['post_meal_glucose'].append(value)
        
        # Pattern: Numbers with units in table format
        table_matches = re.findall(r'(\d+(?:\.\d+)?)\s*(?:mg/dl|mmol/L)', text_lower)
        print(f"DEBUG: Table matches: {table_matches}")
        for match in table_matches:
            value = float(match)
            if self._is_valid_glucose_value(value) and value not in [v for v in extracted_values['general_glucose']]:
                # Check broader context for glucose-related terms
                context_start = max(0, text_lower.find(match) - 100)
                context_end = min(len(text_lower), text_lower.find(match) + len(match) + 100)
                context = text_lower[context_start:context_end]
                if any(term in context for term in ['glucose', 'sugar', 'blood', 'fasting', 'random', 'post', 'fbs', 'rbs', 'ppbs']):
                    extracted_values['general_glucose'].append(value)
        
        # Pattern: Numbers near glucose terms (table format where value is on separate line)
        lines = text_lower.split('\n')
        for i, line in enumerate(lines):
            # Check if this line contains glucose-related terms
            if any(term in line for term in ['glucose', 'blood sugar', 'fasting', 'random', 'post meal', 'fbs', 'rbs', 'ppbs']):
                # Check surrounding lines for numeric values
                for j in range(max(0, i-2), min(len(lines), i+3)):
                    check_line = lines[j]
                    # Look for standalone numbers that could be glucose values
                    number_matches = re.findall(r'^\s*([\d.]+)\s*$', check_line)
                    if number_matches:
                        value = float(number_matches[0])
                        if self._is_valid_glucose_value(value):
                            # Determine type based on context
                            if 'fasting' in line or 'fbs' in line:
                                if value not in extracted_values['fasting_glucose']:
                                    extracted_values['fasting_glucose'].append(value)
                                    print(f"DEBUG: Found fasting glucose value {value} near line: {line.strip()}")
                            elif 'post' in line or 'ppbs' in line:
                                if value not in extracted_values['post_meal_glucose']:
                                    extracted_values['post_meal_glucose'].append(value)
                                    print(f"DEBUG: Found post-meal glucose value {value} near line: {line.strip()}")
                            elif 'random' in line or 'rbs' in line:
                                if value not in extracted_values['random_glucose']:
                                    extracted_values['random_glucose'].append(value)
                                    print(f"DEBUG: Found random glucose value {value} near line: {line.strip()}")
                            else:
                                if value not in extracted_values['general_glucose']:
                                    extracted_values['general_glucose'].append(value)
                                    print(f"DEBUG: Found general glucose value {value} near line: {line.strip()}")
        
        # Pattern: Numbers followed by partial units (like 'm' for mg/dl)
        partial_unit_matches = re.findall(r'(\d+(?:\.\d+)?)\s*m\s*$', text_lower, re.MULTILINE)
        print(f"DEBUG: Partial unit matches: {partial_unit_matches}")
        for match in partial_unit_matches:
            value = float(match)
            if self._is_valid_glucose_value(value):
                # Check if it's near glucose-related terms
                context_start = max(0, text_lower.find(match) - 200)
                context_end = min(len(text_lower), text_lower.find(match) + len(match) + 200)
                context = text_lower[context_start:context_end]
                if any(term in context for term in ['glucose', 'sugar', 'blood', 'fasting', 'random', 'post']):
                    if 'fasting' in context:
                        if value not in extracted_values['fasting_glucose']:
                            extracted_values['fasting_glucose'].append(value)
                            print(f"DEBUG: Found fasting glucose {value} with partial unit")
                    else:
                        if value not in extracted_values['general_glucose']:
                            extracted_values['general_glucose'].append(value)
                            print(f"DEBUG: Found general glucose {value} with partial unit")
        
        # Pattern: Single letter units (catch 'm' for mg/dl)
        single_letter_matches = re.findall(r'(\d+(?:\.\d+)?)\s*([a-z])\s*$', text_lower, re.MULTILINE)
        print(f"DEBUG: Single letter unit matches: {single_letter_matches}")
        for value_str, unit in single_letter_matches:
            value = float(value_str)
            if self._is_valid_glucose_value(value) and unit == 'm':
                # Check if it's near glucose-related terms
                context_start = max(0, text_lower.find(value_str) - 200)
                context_end = min(len(text_lower), text_lower.find(value_str) + len(value_str) + 200)
                context = text_lower[context_start:context_end]
                if any(term in context for term in ['glucose', 'sugar', 'blood', 'fasting', 'random', 'post']):
                    if 'fasting' in context:
                        if value not in extracted_values['fasting_glucose']:
                            extracted_values['fasting_glucose'].append(value)
                            print(f"DEBUG: Found fasting glucose {value} with single letter unit '{unit}'")
                    else:
                        if value not in extracted_values['general_glucose']:
                            extracted_values['general_glucose'].append(value)
                            print(f"DEBUG: Found general glucose {value} with single letter unit '{unit}'")
        
        # Pattern: Any valid number in the entire text that's near glucose terms
        all_numbers = re.findall(r'(\d+(?:\.\d+)?)', text_lower)
        print(f"DEBUG: All numbers found: {all_numbers[:20]}...")  # Limit to first 20 to avoid spam
        for num_str in all_numbers:
            value = float(num_str)
            if self._is_valid_glucose_value(value):
                # Check if this number is near glucose-related terms
                num_index = text_lower.find(num_str)
                context_start = max(0, num_index - 150)
                context_end = min(len(text_lower), num_index + len(num_str) + 150)
                context = text_lower[context_start:context_end]
                
                if any(term in context for term in ['glucose', 'blood sugar', 'fasting', 'random', 'post meal']):
                    # More specific context check for this report format
                    if 'glucose, fasting' in context or 'glucose f' in context or 'blood sugar fasting' in context:
                        if value not in extracted_values['fasting_glucose']:
                            extracted_values['fasting_glucose'].append(value)
                            print(f"DEBUG: Found fasting glucose {value} via context matching")
                    elif 'glucose, post' in context or 'glucose pp' in context or 'blood sugar post' in context:
                        if value not in extracted_values['post_meal_glucose']:
                            extracted_values['post_meal_glucose'].append(value)
                            print(f"DEBUG: Found post-meal glucose {value} via context matching")
                    elif 'glucose, random' in context or 'glucose r' in context or 'blood sugar random' in context:
                        if value not in extracted_values['random_glucose']:
                            extracted_values['random_glucose'].append(value)
                            print(f"DEBUG: Found random glucose {value} via context matching")
                    else:
                        if value not in extracted_values['general_glucose']:
                            extracted_values['general_glucose'].append(value)
                            print(f"DEBUG: Found general glucose {value} via context matching")
        
        # Also try to catch glucose values with parentheses format
        parentheses_matches = re.findall(r'glucose\s*\([^)]*\)\s*[:\-]?\s*([\d.]+)\s*(?:mg/dl|mmol/L)?', text_lower)
        print(f"DEBUG: Parentheses glucose matches: {parentheses_matches}")
        for match in parentheses_matches:
            value = float(match)
            if self._is_valid_glucose_value(value):
                # Check if it's fasting based on context
                if 'fasting' in text_lower[text_lower.find(match)-50:text_lower.find(match)+50]:
                    extracted_values['fasting_glucose'].append(value)
                else:
                    extracted_values['general_glucose'].append(value)
        
        print(f"DEBUG: Final extracted values: {extracted_values}")
        return extracted_values
    
    def _is_valid_glucose_value(self, value: float) -> bool:
        """Check if glucose value is within reasonable range (mg/dL)"""
        return 20 <= value <= 600
    
    def _is_valid_hba1c_value(self, value: float) -> bool:
        """Check if HbA1c value is within reasonable range (%)"""
        return 3.0 <= value <= 15.0
    
    def analyze_glucose_pattern(self, extracted_values: Dict[str, List[float]]) -> Dict:
        """
        Analyze glucose patterns and determine diabetes status
        
        Args:
            extracted_values: Dictionary of extracted glucose values
            
        Returns:
            Analysis results with diabetes classification
        """
        analysis = {
            'diabetes_status': 'Unknown',
            'diabetes_type': 'Unknown',
            'severity': 'Unknown',
            'risk_level': 'Unknown',
            'recommendations': [],
            'key_findings': [],
            'glucose_summary': {}
        }
        
        # Analyze fasting glucose
        if extracted_values['fasting_glucose']:
            avg_fasting = sum(extracted_values['fasting_glucose']) / len(extracted_values['fasting_glucose'])
            analysis['glucose_summary']['average_fasting'] = avg_fasting
            
            if avg_fasting < 100:
                analysis['key_findings'].append(f"Normal fasting glucose: {avg_fasting:.1f} mg/dL")
            elif 100 <= avg_fasting < 126:
                analysis['diabetes_status'] = 'Pre-diabetes'
                analysis['risk_level'] = 'Moderate'
                analysis['key_findings'].append(f"Elevated fasting glucose (Pre-diabetes): {avg_fasting:.1f} mg/dL")
            else:
                analysis['diabetes_status'] = 'Diabetes'
                analysis['risk_level'] = 'High'
                analysis['key_findings'].append(f"High fasting glucose (Diabetes): {avg_fasting:.1f} mg/dL")
        
        # Analyze HbA1c
        if extracted_values['hba1c']:
            avg_hba1c = sum(extracted_values['hba1c']) / len(extracted_values['hba1c'])
            analysis['glucose_summary']['average_hba1c'] = avg_hba1c
            
            if avg_hba1c < 5.7:
                analysis['key_findings'].append(f"Normal HbA1c: {avg_hba1c:.1f}%")
            elif 5.7 <= avg_hba1c < 6.5:
                analysis['diabetes_status'] = 'Pre-diabetes'
                analysis['risk_level'] = 'Moderate'
                analysis['key_findings'].append(f"Elevated HbA1c (Pre-diabetes): {avg_hba1c:.1f}%")
            else:
                analysis['diabetes_status'] = 'Diabetes'
                analysis['risk_level'] = 'High'
                analysis['key_findings'].append(f"High HbA1c (Diabetes): {avg_hba1c:.1f}%")
        
        # Analyze post-meal glucose
        if extracted_values['post_meal_glucose']:
            avg_post_meal = sum(extracted_values['post_meal_glucose']) / len(extracted_values['post_meal_glucose'])
            analysis['glucose_summary']['average_post_meal'] = avg_post_meal
            
            if avg_post_meal < 140:
                analysis['key_findings'].append(f"Normal post-meal glucose: {avg_post_meal:.1f} mg/dL")
            elif 140 <= avg_post_meal < 200:
                analysis['diabetes_status'] = 'Pre-diabetes' if analysis['diabetes_status'] == 'Unknown' else analysis['diabetes_status']
                analysis['risk_level'] = 'Moderate' if analysis['risk_level'] == 'Unknown' else analysis['risk_level']
                analysis['key_findings'].append(f"Elevated post-meal glucose: {avg_post_meal:.1f} mg/dL")
            else:
                analysis['diabetes_status'] = 'Diabetes'
                analysis['risk_level'] = 'High'
                analysis['key_findings'].append(f"High post-meal glucose: {avg_post_meal:.1f} mg/dL")
        
        # Determine diabetes type (simplified heuristic)
        if analysis['diabetes_status'] == 'Diabetes':
            # This is a simplified determination - in practice, more factors are needed
            if extracted_values['fasting_glucose'] and max(extracted_values['fasting_glucose']) > 200:
                analysis['diabetes_type'] = 'Type 1 or Type 2 (requires medical evaluation)'
            else:
                analysis['diabetes_type'] = 'Likely Type 2 (requires medical confirmation)'
        
        # Generate recommendations based on analysis
        analysis['recommendations'] = self._generate_recommendations(analysis, extracted_values)
        
        return analysis
    
    def _generate_recommendations(self, analysis: Dict, extracted_values: Dict) -> List[str]:
        """Generate personalized recommendations based on analysis"""
        recommendations = []
        
        if analysis['diabetes_status'] == 'Normal':
            recommendations.extend([
                "Maintain healthy lifestyle with regular exercise",
                "Continue balanced diet with portion control",
                "Annual health check-ups recommended",
                "Monitor stress levels and sleep quality"
            ])
        elif analysis['diabetes_status'] == 'Pre-diabetes':
            recommendations.extend([
                "Immediate lifestyle modifications needed",
                "Weight loss of 5-7% of body weight if overweight",
                "150 minutes of moderate exercise per week",
                "Reduce refined carbohydrates and sugar intake",
                "Increase fiber-rich vegetables and whole grains",
                "Monitor blood glucose regularly",
                "Consult healthcare provider for personalized plan"
            ])
        elif analysis['diabetes_status'] == 'Diabetes':
            recommendations.extend([
                "Comprehensive diabetes management plan required",
                "Regular blood glucose monitoring as per doctor's advice",
                "Medication adherence as prescribed",
                "Diabetes education program recommended",
                "Regular follow-ups with healthcare team",
                "Foot care and regular eye examinations",
                "Blood pressure and cholesterol management",
                "Stress management and adequate sleep"
            ])
        
        # Add specific recommendations based on glucose patterns
        if extracted_values['fasting_glucose'] and max(extracted_values['fasting_glucose']) > 150:
            recommendations.append("Focus on overnight glucose control - consider dinner timing and composition")
        
        if extracted_values['post_meal_glucose'] and max(extracted_values['post_meal_glucose']) > 200:
            recommendations.append("Post-meal glucose spikes detected - consider carbohydrate counting and meal timing")
        
        return recommendations
    
    async def analyze_uploaded_report(self, namespace_id: str) -> Dict:
        """Analyze uploaded diabetes reports for a specific namespace"""
        
        try:
            print(f"DEBUG: Starting analysis for namespace: {namespace_id}")
            
            # Get all files in the namespace-specific upload directory
            namespace_path = os.path.join(constants.UPLOAD_DIR, namespace_id, "uploaded-file")
            print(f"DEBUG: Looking for files in: {namespace_path}")
            
            if not os.path.exists(namespace_path):
                print(f"DEBUG: Namespace path does not exist: {namespace_path}")
                return {
                    'error': 'No uploaded reports found',
                    'status': 'error'
                }
            
            # Get all document files (PDF, TXT, DOC, DOCX)
            supported_extensions = ('.pdf', '.txt', '.doc', '.docx')
            document_files = [f for f in os.listdir(namespace_path) if f.lower().endswith(supported_extensions)]
            print(f"DEBUG: Found document files: {document_files}")
            
            if not document_files:
                print(f"DEBUG: No document files found in namespace")
                return {
                    'error': 'No uploaded reports found',
                    'status': 'error'
                }
            
            # Try to extract patient info from each file individually for better accuracy
            individual_patient_info = {}
            file_names = []
            all_text = ""  # Initialize all_text to accumulate content from all files
            
            for doc_file in document_files:
                file_path = os.path.join(namespace_path, doc_file)
                print(f"DEBUG: Processing file: {doc_file}")
                
                try:
                    # Extract text from document with better error handling
                    documents = parse_pdf(file_path)
                    file_text = ""
                    for doc in documents:
                        if hasattr(doc, 'page_content'):
                            file_text += doc.page_content + "\n"
                        elif hasattr(doc, 'text'):
                            file_text += doc.text + "\n"
                    
                    # Add to combined text
                    all_text += file_text + "\n\n"
                    file_names.append(doc_file)
                    
                    # Extract patient info from this specific file
                    file_patient_info = self.extract_patient_info(file_text)
                    
                    print(f"DEBUG: {doc_file} extracted patient: {file_patient_info}")
                    
                    # Use this result if it's more complete than current best
                    if (file_patient_info.get('name') and 
                        len(file_patient_info.get('name', '').split()) >= 2 and
                        not any(word in file_patient_info.get('name', '').lower() for word in ['patient', 'report', 'test', 'result'])):
                        
                        print(f"DEBUG: {doc_file} has better patient info: {file_patient_info}")
                        individual_patient_info = file_patient_info.copy()
                        print(f"DEBUG: Using individual file extraction for: {individual_patient_info.get('name')}")
                        
                except Exception as e:
                    print(f"DEBUG: Error extracting from {doc_file}: {e}")
            
            # Use the best individual patient info found
            patient_info = {}  # Initialize patient_info
            if individual_patient_info.get('name') and len(individual_patient_info.get('name', '').split()) >= 2:
                patient_info = individual_patient_info.copy()
                print(f"DEBUG: Using individual file extraction for: {individual_patient_info.get('name')}")
            else:
                # Extract patient info from combined text if no good individual extraction
                patient_info = self.extract_patient_info(all_text)
                print(f"DEBUG: Using combined text extraction result: {patient_info}")
            
            # Extract glucose values
            extracted_values = self.extract_glucose_values(all_text)
            
            print(f"DEBUG: Extracted patient info: {patient_info}")
            print(f"DEBUG: Extracted values: {extracted_values}")
            
            # Check if any glucose values were found
            has_glucose_data = any(len(values) > 0 for values in extracted_values.values())
            
            print(f"DEBUG: Has glucose data: {has_glucose_data}")
            
            if not has_glucose_data:
                print(f"DEBUG: No glucose values found. Checking for common glucose-related terms...")
                text_lower = all_text.lower()
                glucose_terms = ['glucose', 'sugar', 'blood sugar', 'hba1c', 'hb a1c', 'fasting', 'random', 'post meal']
                for term in glucose_terms:
                    if term in text_lower:
                        print(f"DEBUG: Found term '{term}' in text but no values extracted")
                        # Find context around the term
                        index = text_lower.find(term)
                        context = all_text[max(0, index-100):index+100]
                        print(f"DEBUG: Context around '{term}': {context}")
                
                return {
                    'error': 'No glucose values found in the uploaded reports. Please ensure the reports contain blood glucose or HbA1c values.',
                    'status': 'error'
                }
            
            # Analyze patterns
            analysis = self.analyze_glucose_pattern(extracted_values)
            
            # Generate comprehensive report using AI
            comprehensive_report = await self._generate_comprehensive_report(
                extracted_values, analysis, file_names, patient_info
            )
            
            return {
                'status': 'success',
                'patient_info': patient_info,
                'extracted_values': extracted_values,
                'analysis': analysis,
                'comprehensive_report': comprehensive_report,
                'files_analyzed': file_names
            }
            
        except Exception as e:
            print(f"ERROR in analyze_uploaded_report: {e}")
            import traceback
            print(f"ERROR traceback: {traceback.format_exc()}")
            return {
                'error': f'Analysis failed: {str(e)}',
                'status': 'error'
            }
    
    async def _generate_comprehensive_report(self, extracted_values: Dict, analysis: Dict, file_names: List[str], patient_info: Dict[str, str]) -> str:
        """Generate comprehensive AI-powered report"""
        
        # If LLM is not available, provide a detailed fallback analysis
        if not llm:
            return self._generate_fallback_report(extracted_values, analysis, file_names, patient_info)
        
        # Prepare data for AI analysis
        glucose_summary = ""
        for key, values in extracted_values.items():
            if values:
                glucose_summary += f"{key.replace('_', ' ').title()}: {values}\n"
        
        # Prepare patient information
        patient_details = ""
        if patient_info.get('name'):
            patient_details += f"Patient Name: {patient_info['name']}\n"
        if patient_info.get('age'):
            patient_details += f"Age: {patient_info['age']}\n"
        if patient_info.get('gender'):
            patient_details += f"Gender: {patient_info['gender']}\n"
        if patient_info.get('id'):
            patient_details += f"Patient ID: {patient_info['id']}\n"
        
        template = """
You are a professional diabetes care specialist analyzing a patient's glucose report.

PATIENT INFORMATION:
{patient_details}

GLUCOSE DATA:
{glucose_summary}

ANALYSIS RESULTS:
Diabetes Status: {diabetes_status}
Diabetes Type: {diabetes_type}
Risk Level: {risk_level}
Key Findings: {key_findings}

Please provide a comprehensive, empathetic, and professional report including:

1. **GLUCOSE ANALYSIS SUMMARY**
   - Exact values found and what they mean
   - Patterns and trends identified

2. **DIABETES ASSESSMENT**
   - Current status (Normal/Pre-diabetes/Diabetes)
   - Type classification if applicable
   - Severity and risk level explanation

3. **PERSONALIZED RECOMMENDATIONS**
   - Specific dietary advice
   - Exercise recommendations
   - Lifestyle modifications
   - Medical follow-up guidance

4. **NEXT STEPS**
   - What patient should do immediately
   - When to consult healthcare provider
   - Monitoring recommendations

5. **FINAL NOTE**
   - End with: "Go to chat page and click on the Chat button in the bot list to get personalized diet plan, exercise routine, and daily schedule."

IMPORTANT FORMATTING INSTRUCTIONS:
- Use clean, simple formatting that renders well in a web chat interface
- For glucose log examples, use a simple list format like:
  * Time: 7:00 AM | Glucose: 152 mg/dL | Activity: Fasting
  * Time: 12:00 PM | Glucose: 180 mg/dL | Activity: After lunch
- Do NOT use ASCII art tables with pipes (|) and dashes (-) as they don't display properly
- Use bullet points (•) and clear spacing for readability
- Use bold (**text**) for headers and important information
- Keep the layout clean and mobile-friendly

Important: Be supportive, clear, and actionable. Use simple language while maintaining medical accuracy.
Personalize the report by addressing the patient by name when available.
"""
        
        prompt_template = ChatPromptTemplate.from_template(template)
        prompt = prompt_template.format(
            patient_details=patient_details if patient_details else "Patient information not available",
            glucose_summary=glucose_summary,
            diabetes_status=analysis.get('diabetes_status', 'Unknown'),
            diabetes_type=analysis.get('diabetes_type', 'Unknown'),
            risk_level=analysis.get('risk_level', 'Unknown'),
            key_findings=', '.join(analysis.get('key_findings', []))
        )
        
        # Generate response
        try:
            chain = llm | StrOutputParser()
            response = chain.invoke(prompt)
            return response
        except Exception as e:
            print(f"Error generating AI report: {e}")
            return self._generate_fallback_report(extracted_values, analysis, file_names, patient_info)
    
    def _generate_fallback_report(self, extracted_values: Dict, analysis: Dict, file_names: List[str], patient_info: Dict[str, str]) -> str:
        """Generate a comprehensive fallback report without AI"""
        
        patient_name = patient_info.get('name', 'Patient')
        
        report = f"COMPREHENSIVE DIABETES ANALYSIS REPORT\n\n"
        report += f"PREPARED FOR: {patient_name}\n"
        
        if patient_info.get('age') and patient_info['age'].strip():
            report += f"AGE: {patient_info['age']}\n"
        if patient_info.get('gender'):
            report += f"GENDER: {patient_info['gender']}\n"
        
        report += f"REPORTS ANALYZED: {', '.join(file_names)}\n\n"
        
        # GLUCOSE VALUES SECTION
        report += "GLUCOSE VALUES FOUND:\n"
        if extracted_values.get('fasting_glucose'):
            values = extracted_values['fasting_glucose']
            avg = sum(values) / len(values)
            report += f"• Fasting Glucose: {', '.join(map(str, values))} mg/dL (Average: {avg:.1f} mg/dL)\n"
        
        if extracted_values.get('post_meal_glucose'):
            values = extracted_values['post_meal_glucose']
            avg = sum(values) / len(values)
            report += f"• Post-Meal Glucose: {', '.join(map(str, values))} mg/dL (Average: {avg:.1f} mg/dL)\n"
        
        if extracted_values.get('random_glucose'):
            values = extracted_values['random_glucose']
            avg = sum(values) / len(values)
            report += f"• Random Glucose: {', '.join(map(str, values))} mg/dL (Average: {avg:.1f} mg/dL)\n"
        
        if extracted_values.get('hba1c'):
            values = extracted_values['hba1c']
            avg = sum(values) / len(values)
            report += f"• HbA1c: {', '.join(map(str, values))}% (Average: {avg:.1f}%)\n"
        
        if extracted_values.get('general_glucose'):
            values = extracted_values['general_glucose']
            report += f"• Other Glucose Values: {', '.join(map(str, values))} mg/dL\n"
        
        report += "\n"
        
        # ASSESSMENT SECTION
        report += "DIABETES ASSESSMENT:\n"
        diabetes_status = analysis.get('diabetes_status', 'Unknown')
        report += f"• Status: {diabetes_status}\n"
        
        if diabetes_status != 'Unknown':
            if diabetes_status == 'Normal':
                report += "• Your glucose levels are within the normal range\n"
            elif diabetes_status == 'Pre-diabetes':
                report += "• Your glucose levels indicate pre-diabetes - this is a warning sign\n"
            elif diabetes_status == 'Diabetes':
                report += "• Your glucose levels indicate diabetes - medical attention required\n"
        
        risk_level = analysis.get('risk_level', 'Unknown')
        if risk_level != 'Unknown':
            report += f"• Risk Level: {risk_level}\n"
        
        diabetes_type = analysis.get('diabetes_type', 'Unknown')
        if diabetes_type != 'Unknown' and diabetes_type != 'Likely Type 2 (requires medical confirmation)':
            report += f"• Type: {diabetes_type}\n"
        
        report += "\n"
        
        # KEY FINDINGS
        if analysis.get('key_findings'):
            report += "KEY FINDINGS:\n"
            for finding in analysis['key_findings']:
                report += f"• {finding}\n"
            report += "\n"
        
        # RECOMMENDATIONS SECTION
        report += "PERSONALIZED RECOMMENDATIONS:\n\n"
        
        if diabetes_status == 'Normal':
            report += "LIFESTYLE:\n"
            report += "• Maintain current healthy habits\n"
            report += "• Regular physical activity (150 minutes per week)\n"
            report += "• Balanced diet with plenty of vegetables and whole grains\n"
            report += "• Maintain healthy weight\n"
            report += "• Get regular check-ups\n\n"
            
        elif diabetes_status == 'Pre-diabetes':
            report += "IMMEDIATE ACTIONS:\n"
            report += "• Weight loss of 5-7% if overweight\n"
            report += "• Regular physical activity (150 minutes per week)\n"
            report += "• Reduce refined carbohydrates and sugar\n"
            report += "• Increase fiber-rich vegetables and whole grains\n"
            report += "• Monitor blood glucose regularly\n\n"
            
        elif diabetes_status == 'Diabetes':
            report += "MEDICAL MANAGEMENT:\n"
            report += "• Follow healthcare provider's treatment plan\n"
            report += "• Take medications as prescribed\n"
            report += "• Regular blood glucose monitoring\n"
            report += "• Regular medical follow-ups\n\n"
            report += "LIFESTYLE:\n"
            report += "• Diabetes education program recommended\n"
            report += "• Regular foot care and eye examinations\n"
            report += "• Blood pressure and cholesterol management\n"
            report += "• Stress management and adequate sleep\n\n"
        
        # DIETARY RECOMMENDATIONS
        report += "DIETARY GUIDANCE:\n"
        report += "• Choose whole grains over refined grains\n"
        report += "• Include lean proteins and healthy fats\n"
        report += "• Limit processed foods and sugary beverages\n"
        report += "• Eat regular meals and control portion sizes\n"
        report += "• Stay hydrated with water\n\n"
        
        # EXERCISE RECOMMENDATIONS
        report += "EXERCISE RECOMMENDATIONS:\n"
        report += "• Aim for 150 minutes of moderate exercise per week\n"
        report += "• Include both aerobic and strength training\n"
        report += "• Start slowly and gradually increase intensity\n"
        report += "• Monitor blood glucose before and after exercise\n\n"
        
        # MONITORING RECOMMENDATIONS
        report += "MONITORING GUIDELINES:\n"
        if diabetes_status == 'Diabetes':
            report += "• Monitor blood glucose as directed by your healthcare provider\n"
            report += "• Keep a log of your readings\n"
            report += "• Watch for signs of high or low blood sugar\n"
        else:
            report += "• Annual glucose testing recommended\n"
            report += "• Monitor for symptoms of increased thirst, frequent urination\n"
        
        report += "\n"
        
        # WHEN TO SEEK MEDICAL HELP
        report += "WHEN TO CONSULT HEALTHCARE PROVIDER:\n"
        report += "• If experiencing symptoms of high blood sugar (thirst, frequent urination, fatigue)\n"
        report += "• If experiencing symptoms of low blood sugar (shakiness, sweating, confusion)\n"
        report += "• For regular follow-up appointments\n"
        report += "• Before making significant changes to diet or exercise routine\n"
        report += "• If you have questions about your medications\n\n"
        
        # DISCLAIMER
        report += "IMPORTANT NOTE:\n"
        report += "This analysis is based on the provided report data and should not replace "
        report += "professional medical advice. Please consult with your healthcare provider "
        report += "for personalized medical care and treatment decisions.\n\n"
        
        report += "HOW CAN I HELP YOU FURTHER?\n"
        report += "Go to chat page and click on the Chat button in the bot list to get:\n"
        report += "• Personalized diet plan\n"
        report += "• Customized exercise routine\n"
        report += "• Daily schedule and meal planning\n"
        report += "• Detailed lifestyle guidance\n"
        
        return report
    
    def get_follow_up_suggestions(self) -> List[str]:
        """Get standard follow-up suggestions for diabetes management"""
        return [
            "Exercise recommendations",
            "Diet planning guidance",
            "Medication information",
            "Blood sugar monitoring tips",
            "Complication prevention",
            "Lifestyle modification advice",
            "When to contact doctor",
            "Emergency symptoms"
        ]
