import os
import time
from config import constants
from utils.backgroud_exeption import handleExceptions
from utils.processor import parse_pdf, parse_text
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
load_dotenv()
from langchain_pinecone import PineconeVectorStore
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI, MistralAIEmbeddings

# Initialize embedding model
embed_model = MistralAIEmbeddings(
    model="mistral-embed"
)

# Initialize LLM
llm = ChatMistralAI(
    mistral_api_key=os.getenv('MISTRAL_API_KEY'),
    model=os.getenv('MISTRAL_MODEL'),
    temperature=0,
)

# Initialize Pinecone client
pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY"),
    environment=os.getenv("PINECONE_ENV")
)

# Name of your index
index_name = os.getenv("PINECONE_INDEX")

# Check if index exists
if index_name not in pc.list_indexes().names():
    # Create index using a ServerlessSpec
    pc.create_index(
        name=index_name,
        dimension=1024,  # MUST match your embedding model
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )

# Create an index object to use later
index = pc.Index(index_name)


def classify_input(text: str):
    """Classify user input into categories"""
    text = text.strip().lower()

    if text == "" or text in [".", "..", "-", "/"]:
        return "INVALID"

    if text in ["hi", "hello", "hey", "help", "good morning", "good evening", "hola", "namaste"]:
        return "GREETING"
    
    # Comprehensive analysis keywords
    analysis_keywords = [
        "analyze my report", "analyze report", "comprehensive analysis",
        "detailed analysis", "full report analysis", "check my report",
        "what does my report say", "explain my report", "report summary",
        "analyze thoroughly", "glucose report analysis", "blood sugar analysis",
        "diabetes analysis", "what type of diabetes", "diabetes type",
        "patient condition", "glucose levels", "blood sugar report"
    ]
    
    if any(keyword in text for keyword in analysis_keywords):
        return "COMPREHENSIVE_ANALYSIS"

    # Medical keywords
    medical_keywords = [
        "glucose", "sugar", "diabetes", "blood", "report", "test",
        "hba1c", "a1c", "fasting", "meal", "insulin", "medicine",
        "diet", "exercise", "pressure", "cholesterol", "weight",
        "analyze", "check", "results", "levels", "high", "low",
        "normal", "doctor", "clinic", "hospital", "type 1", "type 2",
        "pre-diabetic", "prediabetes", "diabetic", "hyperglycemia",
        "hypoglycemia", "random glucose", "postprandial", "post-meal"
    ]

    if any(keyword in text for keyword in medical_keywords):
        return "MEDICAL_QUERY"

    return "NORMAL"


def has_uploaded_report(pc_index, namespace_id: str) -> bool:
    """Check if user has uploaded reports to Pinecone with retry mechanism"""
    try:
        # Add a small delay to ensure Pinecone is updated
        time.sleep(0.5)
        
        stats = pc_index.describe_index_stats()
        namespaces = stats.get("namespaces", {})
        
        if namespace_id in namespaces:
            vector_count = namespaces[namespace_id].get("vector_count", 0)
            print(f"Debug: Namespace {namespace_id} has {vector_count} vectors")
            return vector_count > 0
        
        print(f"Debug: Namespace {namespace_id} not found in index")
        return False
        
    except Exception as e:
        print(f"Error checking namespace stats: {e}")
        return False


class PineconeService:
    """Service for handling Pinecone vector operations and diabetes report analysis"""

    @handleExceptions
    async def vectorize_documents_main(self, namespace_id: str):
        """
        Process and vectorize documents for a specific namespace
        
        Args:
            namespace_id: Unique identifier for user/session
        
        Returns:
            dict: Status message
        """
        # Namespace-specific directory
        in_process_dir = os.path.join(constants.UPLOAD_DIR, namespace_id)

        all_documents = []

        # Check if directory exists
        if not os.path.exists(in_process_dir):
            print(f"DEBUG: Namespace directory not found: {in_process_dir}")
            return {"message": "No documents found to process for this patient"}
        
        print(f"DEBUG: Processing files in namespace directory: {in_process_dir}")
        for file in os.listdir(in_process_dir):
            print(f"DEBUG: Found file: {file}")
            file_path = os.path.join(in_process_dir, file)

            if os.path.isdir(file_path):
                continue

            file_ext = file.split(".")[-1].lower()
            print(f"DEBUG: Processing file extension: {file_ext}")

            try:
                if file_ext == "txt":
                    docs = parse_text(file_path)
                    doc_type = "txt"
                elif file_ext == "pdf":
                    docs = parse_pdf(file_path)
                    doc_type = "pdf"
                else:
                    print(f"Unsupported file type: {file_ext}")
                    continue

                print(f"DEBUG: Parsed {len(docs)} documents from {file}")
                # Add metadata to each document
                for doc in docs:
                    doc.metadata = doc.metadata or {}
                    doc.metadata["name"] = file
                    doc.metadata["namespace_id"] = namespace_id
                    doc.metadata["type"] = doc_type
                    doc.metadata["uploaded_at"] = str(os.path.getctime(file_path))
                all_documents.extend(docs)
                print(f"Processed {len(docs)} documents from {file}")

            except Exception as e:
                print(f"Error processing file {file}: {str(e)}")
                continue

        if not all_documents:
            return {"message": "No valid documents to vectorize"}

        try:
            # First, clear any existing vectors in this namespace to avoid mixed data
            try:
                pc_index = pc.Index(os.getenv("PINECONE_INDEX"))
                pc_index.delete(delete_all=True, namespace=namespace_id)
                print(f"DEBUG: Cleared existing vectors for namespace {namespace_id}")
            except Exception as clear_error:
                print(f"DEBUG: No existing vectors to clear or error: {clear_error}")
            
            # Store documents in Pinecone
            print(f"DEBUG: Starting Pinecone vectorization for {len(all_documents)} documents")
            print(f"DEBUG: Index name: {os.getenv('PINECONE_INDEX')}")
            print(f"DEBUG: Namespace: {namespace_id}")
            
            # Check if index exists first
            if os.getenv("PINECONE_INDEX") not in pc.list_indexes().names():
                print(f"DEBUG: Index {os.getenv('PINECONE_INDEX')} does not exist!")
                return {"error": "Pinecone index not found"}
            
            vector_store = PineconeVectorStore.from_documents(
                documents=all_documents,
                index_name=os.getenv("PINECONE_INDEX"),
                embedding=embed_model,
                namespace=namespace_id
            )

            print(f"DEBUG: Vectorization completed for {len(all_documents)} documents")
            
            # Wait for Pinecone to update and verify
            time.sleep(2)
            
            # Verify documents were stored
            pc_index = pc.Index(os.getenv("PINECONE_INDEX"))
            print(f"DEBUG: Checking index stats for namespace {namespace_id}")
            
            try:
                stats = pc_index.describe_index_stats()
                namespaces = stats.get("namespaces", {})
                print(f"DEBUG: All namespaces: {list(namespaces.keys())}")
                
                if namespace_id in namespaces:
                    stored_count = namespaces[namespace_id].get("vector_count", 0)
                    print(f"DEBUG: Verified {stored_count} vectors stored in namespace {namespace_id}")
                    
                    if stored_count > 0:
                        return {"message": "Files vectorized successfully", "count": len(all_documents)}
                    else:
                        return {"error": "Vectorization completed but no vectors found"}
                else:
                    print(f"DEBUG: Namespace {namespace_id} not found in index stats")
                    return {"error": f"Namespace {namespace_id} not created in Pinecone"}
            except Exception as stats_error:
                print(f"DEBUG: Error getting index stats: {stats_error}")
                return {"error": "Failed to verify vectorization"}

        except Exception as e:
            print(f"DEBUG: Vectorization error: {str(e)}")
            import traceback
            print(f"DEBUG: Traceback: {traceback.format_exc()}")
            return {"error": f"Failed to vectorize documents: {str(e)}"}

    @handleExceptions
    async def delete_vectorized_docs(self, namespace_id: str):
        """
        Delete all vectorized documents for a specific namespace
        
        Args:
            namespace_id: Unique identifier for user/session
        
        Returns:
            dict: Status message
        """
        index = pc.Index(os.getenv("PINECONE_INDEX"))

        # Delete everything in this namespace
        index.delete(delete_all=True, namespace=namespace_id)

        print(f"Deleted all documents for namespace {namespace_id}")
        return {"message": "All reports deleted successfully"}

    async def chain_resp(self, namespace_id: str, question: str, chatHistory: str):
        """
        Generate response based on vectorized documents and user query
        
        Args:
            namespace_id: Unique identifier for user/session
            question: User's question
            chatHistory: Previous chat history
        
        Yields:
            str: Chunks of response text
        """
        try:
            print(f"DEBUG chain_resp START - namespace_id: {namespace_id}, question: {question[:50]}")
            # Simple template for diabetes analysis
            template = """
You are NurseBot, a compassionate and professional diabetes care assistant.

Based on uploaded glucose report: {fileContent}
And patient's question: {question}
Chat history: {chatHistory}

Please provide a clear, point-wise analysis:

1. GLUCOSE VALUES FOUND:
   - List exact glucose values found in report

2. DIABETES ASSESSMENT:
   - Based on values, determine if Normal, Pre-diabetes, or Diabetes
   - Specify Type 1 or Type 2 if applicable

3. RECOMMENDATIONS:
   - Provide specific dietary, exercise, and lifestyle recommendations
   - Include medical follow-up advice if needed

Important: Use only actual values from report. Do not invent or guess values.
Respond in same language as patient's question.
"""

            # Get Pinecone index
            try:
                pc_index = pc.Index(os.getenv('PINECONE_INDEX'))
                print(f"Debug - Pinecone index initialized: {os.getenv('PINECONE_INDEX')}")
            except Exception as e:
                print(f"Error initializing Pinecone index: {e}")
                yield f"Error connecting to database: {str(e)}"
                return
            
            # Check if user has uploaded any reports
            try:
                has_report = has_uploaded_report(pc_index, namespace_id)
                print(f"Debug - Has report check completed: {has_report}")
            except Exception as e:
                print(f"Error checking reports: {e}")
                has_report = False
            
            # Classify user input
            input_category = classify_input(question)
            
            # Debug logging
            print(f"Debug - Namespace: {namespace_id}, Has Report: {has_report}, Input Category: {input_category}")
            
            # Handle different scenarios
            if input_category == "GREETING" and not has_report:
                yield "Hello! I'm NurseBot, your diabetes care assistant. Please upload your glucose blood report so I can provide personalized analysis and recommendations."
                return
            
            if input_category == "INVALID":
                yield "Please enter a valid question about your diabetes or glucose report."
                return

            # If medical query but no report found
            if input_category == "MEDICAL_QUERY" and not has_report:
                yield "I'd love to help with your diabetes management! To provide personalized advice about your glucose levels, diabetes type, or causes, please upload your recent glucose report with fasting, post-meal, or HbA1c values."
                return
            
            # Initialize vector store
            try:
                print(f"Debug - Initializing vector store for namespace: {namespace_id}")
                print(f"Debug - Using index: {os.getenv('PINECONE_INDEX')}, embed_model: {embed_model}")
                vectorstore = PineconeVectorStore(
                    index_name=os.getenv('PINECONE_INDEX'),
                    embedding=embed_model,
                    text_key=os.getenv('PINECONE_TEXT_FIELD', 'text'),
                    namespace=namespace_id
                )
                print(f"Debug - Vector store initialized successfully")
            except Exception as e:
                print(f"Error initializing vector store: {e}")
                import traceback
                print(f"Debug - Vector store error traceback: {traceback.format_exc()}")
                if has_report:
                    yield "I'm having trouble accessing your uploaded reports. Please try asking your question again."
                else:
                    yield "I don't see any uploaded glucose reports. Please upload your report for personalized diabetes analysis."
                return

            # Search for relevant documents
            try:
                retrieved_data = vectorstore.similarity_search(question, k=10)
                print(f"Debug - Retrieved {len(retrieved_data)} documents")
            except Exception as e:
                print(f"Error in similarity search: {e}")
                retrieved_data = []

            # If no reports found
            if not retrieved_data:
                yield "I'm here to help with diabetes management! Please upload your glucose report for personalized analysis."
                return

            # Process retrieved documents
            fileContent = ""
            references = []

            for doc in retrieved_data:
                if not doc.page_content.strip():
                    continue

                content = doc.page_content.strip()
                file_name = doc.metadata.get("name", "Unknown")
                page_num = doc.metadata.get("page", "N/A")
                doc_type = doc.metadata.get("type", "unknown")

                # Format content based on document type
                if doc_type == "pdf":
                    fileContent += f"{content}\nPage: {page_num}\nFile: {file_name}\n\n"
                    references.append(f"Page {page_num} in {file_name}")
                else:
                    fileContent += f"{content}\nFile: {file_name}\n\n"
                    references.append(f"File: {file_name}")

            # Prepare prompt
            prompt_template = ChatPromptTemplate.from_template(template)
            prompt = prompt_template.format(
                fileContent=fileContent[:4000],  # Limit context length
                question=question,
                chatHistory=chatHistory
            )

            # Create and execute chain
            chain = llm | StrOutputParser()

            # Stream response
            for chunk in chain.stream(prompt):
                yield chunk
            
            # Optional: Log the interaction
            print(f"Interaction: Namespace={namespace_id}, Question={question[:100]}")
            
        except Exception as e:
            import traceback
            print(f"CRITICAL ERROR in chain_resp: {e}")
            print(f"ERROR TRACEBACK: {traceback.format_exc()}")
            yield f"Error in chain_resp: {str(e)}"

    def _log_interaction(self, namespace_id: str, question: str, response: str):
        """
        Log interactions for debugging and improvement
        
        Args:
            namespace_id: User/session identifier
            question: User question
            response: Bot response
        """
        log_entry = f"""
        [{os.getenv('PINECONE_INDEX')}] Namespace: {namespace_id}
        Question: {question[:200]}
        Response: {response[:500]}
        """
        print(f"Interaction logged: {log_entry}")

    @handleExceptions
    async def get_report_summary(self, namespace_id: str):
        """
        Get summary of all uploaded reports for a user
        
        Args:
            namespace_id: User/session identifier
        
        Returns:
            dict: Report summary
        """
        pc_index = pc.Index(os.getenv("PINECONE_INDEX"))
        
        if not has_uploaded_report(pc_index, namespace_id):
            return {"message": "No reports uploaded", "count": 0}
        
        stats = pc_index.describe_index_stats()
        namespace_stats = stats.get("namespaces", {}).get(namespace_id, {})
        
        return {
            "message": "Reports available",
            "vector_count": namespace_stats.get("vector_count", 0),
            "namespace": namespace_id,
            "has_reports": True
        }

    @handleExceptions
    async def clear_chat_history(self, namespace_id: str):
        """
        Clear vectorized documents but keep namespace structure
        
        Args:
            namespace_id: User/session identifier
        
        Returns:
            dict: Status message
        """
        return await self.delete_vectorized_docs(namespace_id)
