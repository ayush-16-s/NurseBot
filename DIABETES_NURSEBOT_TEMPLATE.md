# 🩺 Diabetes NurseBot - Complete Template

## 📋 Project Overview
A comprehensive diabetes management and analysis system that helps patients monitor their glucose levels, receive personalized recommendations, and get medical guidance.

## 🏗️ Architecture

### Frontend (React.js)
```
frontend/
├── src/
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── NurseBotLanding.jsx
│   └── default/
│       ├── components/
│       │   ├── BotList/
│       │   │   └── BotList.jsx
│       │   ├── ChatPage/
│       │   │   └── ChatPage.jsx
│       │   ├── FileUpload/
│       │   │   └── FileUpload.jsx
│       │   └── Dashboard/
│       │       └── DiabetesDashboard.jsx
│       └── Default.jsx
├── services/
│   ├── Api.service.js
│   └── Axios.service.js
└── utils/
    ├── localStorage.js
    └── helper.js
```

### Backend (Python Flask)
```
backend/
├── app.py
├── services/
│   ├── pinecone_service.py
│   ├── openai_service.py
│   └── pdf_service.py
├── models/
│   ├── User.py
│   ├── ChatBot.py
│   └── GlucoseReport.py
├── routes/
│   ├── auth.py
│   ├── chat.py
│   └── files.py
└── utils/
    ├── database.py
    └── helpers.py
```

## 🔧 Key Features

### 1. Patient Management
- ✅ Add new patients
- ✅ List all patients
- ✅ Upload glucose reports
- ✅ View uploaded reports

### 2. Diabetes Analysis
- ✅ Automatic glucose report analysis
- ✅ Blood sugar trend identification
- ✅ Personalized recommendations
- ✅ Risk assessment

### 3. Interactive Chat
- ✅ Real-time chat streaming
- ✅ Context-aware responses
- ✅ Medical guidance
- ✅ Follow-up suggestions

## 📊 Database Schema

### Users Collection
```python
{
    "_id": ObjectId,
    "username": String,
    "email": String,
    "password": String (hashed),
    "created_at": Date,
    "token": String
}
```

### ChatBots Collection
```python
{
    "_id": ObjectId,
    "user_id": ObjectId,
    "bot_name": String (patient name),
    "description": String,
    "namespace_id": String,
    "created_at": Date
}
```

### Files Collection
```python
{
    "_id": ObjectId,
    "chatbot_id": ObjectId,
    "namespace_id": String,
    "name": String,
    "size": Number,
    "type": String (pdf/txt),
    "uploaded_at": Date
}
```

## 🤖 AI Prompts for Diabetes Analysis

### System Prompt
```python
DIABETES_SYSTEM_PROMPT = """
You are NurseBot, a specialized AI assistant for diabetes care and management. You have access to the patient's uploaded glucose reports and medical data.

Your role is to:
1. Analyze glucose levels and identify patterns
2. Provide personalized diabetes management advice
3. Suggest dietary and lifestyle recommendations
4. Alert about concerning trends or values
5. Recommend when to consult healthcare providers

Always be:
- Compassionate and supportive
- Medically accurate and cautious
- Clear and specific in recommendations
- Emphatic about consulting doctors for serious concerns

If you don't have access to uploaded reports, politely ask the patient to upload their glucose data first.
"""
```

### Analysis Prompts
```python
GLUCOSE_ANALYSIS_PROMPT = """
Please analyze this glucose report and provide:
1. Current glucose level assessment (normal/pre-diabetes/diabetes)
2. Trend analysis (improving/stable/worsening)
3. Critical values or concerning patterns
4. Specific recommendations for:
   - Diet modifications
   - Exercise adjustments
   - Medication timing
   - Blood sugar monitoring frequency
5. When to consult healthcare provider

Base your analysis on the actual uploaded glucose readings and medical data.
"""
```

## 📁 File Structure Implementation

### Enhanced Pinecone Service
```python
import os
import pinecone
from PyPDF2 import PdfReader
from typing import List, Dict, Any
import openai

class PineconeService:
    def __init__(self):
        self.index = pinecone.Index("diabetes-reports")
        self.namespace = "diabetes-analysis"
    
    def parse_pdf(self, file_path: str) -> List[Dict[str, Any]]:
        """Parse PDF and extract glucose data"""
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            
            # Extract glucose values using regex
            glucose_pattern = r'(\d+\.\d+)\s*mmol/L|(\d+)\s*mg/dL'
            glucose_values = []
            
            for match in re.finditer(glucose_pattern, text):
                glucose_values.append(float(match.group(1)))
            
            return [{
                "text": text,
                "glucose_values": glucose_values,
                "metadata": {
                    "source": file_path,
                    "type": "glucose_report",
                    "extracted_values": len(glucose_values)
                }
            }]
        except Exception as e:
            print(f"Error parsing PDF {file_path}: {str(e)}")
            return []
    
    def vectorize_glucose_report(self, documents: List[Dict]) -> Dict[str, Any]:
        """Vectorize glucose report for semantic search"""
        try:
            # Create embeddings for diabetes-specific analysis
            embeddings = []
            for doc in documents:
                # Enhanced text for better diabetes analysis
                enhanced_text = f"""
                Glucose Report Analysis:
                Data: {doc['text']}
                Glucose Values: {doc.get('glucose_values', [])}
                Type: {doc['metadata']['type']}
                
                Analysis Requirements:
                - Blood sugar level assessment
                - Trend identification
                - Risk evaluation
                - Personalized recommendations
                """
                
                response = openai.Embedding.create(
                    input=enhanced_text,
                    model="text-embedding-ada-002"
                )
                embeddings.append(response['data'][0]['embedding'])
            
            # Store in Pinecone with metadata
            vectors = []
            for i, (doc, embedding) in enumerate(zip(documents, embeddings)):
                vectors.append({
                    "id": f"glucose_doc_{i}",
                    "values": embedding,
                    "metadata": {
                        **doc['metadata'],
                        "text": doc['text'][:1000],  # Truncate for metadata
                        "glucose_values": doc.get('glucose_values', [])
                    }
                })
            
            # Upsert to Pinecone
            self.index.upsert(
                vectors=vectors,
                namespace=self.namespace
            )
            
            return {
                "message": f"Successfully vectorized {len(documents)} documents",
                "count": len(documents),
                "glucose_values_found": sum(len(doc.get('glucose_values', [])) for doc in documents)
            }
            
        except Exception as e:
            return {"error": f"Vectorization failed: {str(e)}"}
    
    def query_diabetes_info(self, query: str, namespace_id: str) -> Dict[str, Any]:
        """Query for diabetes-specific information"""
        try:
            # Enhanced query for diabetes analysis
            enhanced_query = f"""
            Diabetes Analysis Query: {query}
            
            Context: Patient's glucose reports, blood sugar levels, 
            trends, patterns, and medical recommendations needed.
            """
            
            response = openai.Embedding.create(
                input=enhanced_query,
                model="text-embedding-ada-002"
            )
            
            query_vector = response['data'][0]['embedding']
            
            # Search in Pinecone
            results = self.index.query(
                vector=query_vector,
                namespace=namespace_id,
                top_k=5,
                include_metadata=True
            )
            
            return {
                "results": results['matches'],
                "query": query,
                "context_retrieved": len(results['matches']) > 0
            }
            
        except Exception as e:
            return {"error": f"Query failed: {str(e)}"}
```

### Enhanced Chat Route
```python
@chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        question = data.get('question', '')
        namespace_id = data.get('namespace_id', '')
        chat_history = data.get('chatHistory', [])
        
        if not namespace_id:
            return jsonify({"error": "Namespace ID required"}), 400
        
        # Check if this is an analysis request
        is_analysis = "analyze" in question.lower() or "glucose report" in question.lower()
        
        if is_analysis:
            # Use enhanced diabetes analysis prompt
            system_prompt = DIABETES_SYSTEM_PROMPT
            user_prompt = GLUCOSE_ANALYSIS_PROMPT
        else:
            system_prompt = DIABETES_SYSTEM_PROMPT
            user_prompt = question
        
        # Retrieve relevant context
        pinecone_service = PineconeService()
        context_results = pinecone_service.query_diabetes_info(
            user_prompt, namespace_id
        )
        
        if context_results.get("error"):
            return jsonify({"error": context_results["error"]}), 500
        
        # Build context for GPT
        context_text = ""
        if context_results.get("context_retrieved"):
            for match in context_results["results"]:
                context_text += f"\nGlucose Report Data: {match['metadata']['text']}\n"
        
        # Call OpenAI with streaming
        response = Response(
            stream_with_openai(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                context=context_text,
                chat_history=chat_history
            ),
            mimetype='text/event-stream'
        )
        
        return response
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def stream_with_openai(system_prompt, user_prompt, context, chat_history):
    """Stream response from OpenAI with diabetes context"""
    
    def generate():
        messages = [
            {"role": "system", "content": system_prompt},
        ]
        
        # Add context if available
        if context:
            messages.append({
                "role": "system", 
                "content": f"Context from patient reports:\n{context}"
            })
        
        # Add chat history
        for msg in chat_history:
            if msg.get('question'):
                messages.append({"role": "user", "content": msg['question']})
            if msg.get('Ai_response'):
                messages.append({"role": "assistant", "content": msg['Ai_response']})
        
        # Add current question
        messages.append({"role": "user", "content": user_prompt})
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=messages,
                stream=True,
                temperature=0.7
            )
            
            for chunk in response:
                if chunk.choices[0].delta.get('content'):
                    content = chunk.choices[0].delta.content
                    if content:
                        yield f"data: {json.dumps({'text': content})}\n\n"
            
            yield f"data: {json.dumps({'text': '', 'done': True})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return Response(generate(), mimetype='text/event-stream')
```

## 🎯 Frontend Components

### Enhanced Diabetes Dashboard
```jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Progress } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DiabetesDashboard = () => {
  const [glucoseData, setGlucoseData] = useState([]);
  const [lastReading, setLastReading] = useState(null);
  const [trend, setTrend] = useState('stable');

  useEffect(() => {
    fetchGlucoseData();
  }, []);

  const fetchGlucoseData = async () => {
    try {
      const response = await ApiService.getGlucoseData(patientId);
      if (response.data) {
        setGlucoseData(response.data.readings);
        analyzeTrend(response.data.readings);
      }
    } catch (error) {
      console.error('Error fetching glucose data:', error);
    }
  };

  const analyzeTrend = (readings) => {
    if (readings.length < 2) return;
    
    const recent = readings.slice(-7); // Last 7 readings
    const average = recent.reduce((sum, r) => sum + r.value, 0) / recent.length;
    const previous = recent[0].value;
    
    if (average > previous + 0.5) {
      setTrend('increasing');
    } else if (average < previous - 0.5) {
      setTrend('decreasing');
    } else {
      setTrend('stable');
    }
  };

  return (
    <div className="diabetes-dashboard">
      <h2>🩺 Diabetes Dashboard</h2>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Latest Glucose Reading</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <h2 className={lastReading?.status}>
                  {lastReading?.value || '--'} mmol/L
                </h2>
                <Badge variant={trend === 'increasing' ? 'danger' : trend === 'decreasing' ? 'success' : 'info'}>
                  Trend: {trend}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>7-Day Average</h5>
            </Card.Header>
            <Card.Body>
              <Progress 
                now={glucoseData.length > 0 ? (glucoseData.slice(-7).reduce((sum, r) => sum + r.value, 0) / Math.min(7, glucoseData.length) / 10 * 100 : 0}
                label={`${glucoseData.length > 0 ? Math.round(glucoseData.slice(-7).reduce((sum, r) => sum + r.value, 0) / Math.min(7, glucoseData.length)) : 0} mmol/L`}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>Glucose Trends</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={glucoseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DiabetesDashboard;
```

## 🔐 Security & Best Practices

### Authentication
```python
# JWT Authentication
def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except:
        return None
```

### Data Validation
```python
from pydantic import BaseModel

class GlucoseReport(BaseModel):
    patient_name: str
    glucose_values: List[float]
    upload_date: datetime
    report_type: str = "pdf"
    
    class Config:
        schema_extra = "forbid"
```

## 🚀 Deployment Instructions

### Environment Setup
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
npm start
```

### Docker Configuration
```dockerfile
# Backend Dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]

# Frontend Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📱 Mobile Responsiveness
```css
/* Diabetes-specific responsive design */
.diabetes-dashboard {
  padding: 20px;
}

@media (max-width: 768px) {
  .diabetes-dashboard h2 {
    font-size: 1.5rem;
  }
  
  .glucose-chart {
    height: 250px !important;
  }
  
  .metric-card {
    margin-bottom: 1rem;
  }
}
```

## 🎨 UI/UX Best Practices

### Color Scheme for Diabetes
```css
:root {
  --primary-diabetes: #e74c3c;
  --success-glucose: #28a745;
  --warning-trend: #ffc107;
  --danger-high: #dc3545;
  --info-normal: #17a2b8;
}

.glucose-normal { color: var(--info-normal); }
.glucose-high { color: var(--danger-high); }
.glucose-trending-up { color: var(--warning-trend); }
.glucose-trending-down { color: var(--success-glucose); }
```

### Loading States
```jsx
const DiabetesLoader = () => (
  <div className="diabetes-loader">
    <div className="spinner"></div>
    <p>Analyzing your glucose report...</p>
  </div>
);
```

## 📊 Analytics & Monitoring

### Key Metrics
- Patient registration rate
- Report upload frequency  
- Analysis completion rate
- Chat engagement metrics
- Glucose level trends

### Logging
```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('diabetes_bot.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
```

## 🔧 Testing

### Unit Tests
```python
import unittest
from services.pinecone_service import PineconeService

class TestDiabetesAnalysis(unittest.TestCase):
    def setUp(self):
        self.service = PineconeService()
    
    def test_glucose_parsing(self):
        """Test glucose value extraction from PDF"""
        # Test PDF parsing logic
        pass
    
    def test_vectorization(self):
        """Test report vectorization"""
        # Test embedding creation
        pass

if __name__ == '__main__':
    unittest.main()
```

### Integration Tests
```javascript
describe('Diabetes Analysis', () => {
  test('should analyze glucose report', async () => {
    const mockResponse = {
      data: { result: [{ glucose_values: [5.5, 6.2, 4.8] }]
    };
    
    ApiService.getAllFiles.mockResolvedValue(mockResponse);
    
    // Test analysis functionality
    const { getByText } = render(<ChatPage />);
    expect(getByText('Analyzing your glucose report')).toBeInTheDocument();
  });
});
```

## 📚 API Documentation

### Endpoints
```yaml
/api/auth/login:
  post:
    summary: Authenticate user
    parameters:
      - name: username
      - name: password
    responses:
      200:
        description: Login successful
        schema:
          type: object
          properties:
            token:
              type: string
            user_id:
              type: string

/api/files/upload:
  post:
    summary: Upload glucose report
    consumes: multipart/form-data
    parameters:
      - name: file
        type: file
        required: true
      - name: chatbot_id
        type: string
        required: true

/api/chat/chat:
  post:
    summary: Chat with NurseBot
    parameters:
      - name: question
        type: string
        required: true
      - name: namespace_id
        type: string
        required: true
      - name: chatHistory
        type: array
        items:
          type: object
```

## 🎯 Success Metrics

### KPIs
- Report analysis accuracy: >95%
- Response time: <3 seconds
- User satisfaction: >4.5/5
- Daily active users: Track growth
- Error rate: <2%

---

This template provides a complete foundation for your diabetes nurse bot project. Customize and expand based on your specific requirements! 🩺
