// import React, { useState } from "react";
// import { Button } from "react-bootstrap";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import "./ChatPage.scss";
// import ApiService, {
//   startConversation,
// } from "../../../../services/Api.service";
// import { PulseLoader } from "react-spinners";

// const ChatPage = () => {
//   let [searchParams] = useSearchParams();

//   const [messages, setMessages] = useState([
//     {
//       question: "",
//       Ai_response: "Hello, How can I help you today?",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;
//     setLoading(true);
 
//     setMessages((prev) => [...prev, { question: input, Ai_response: "" }]);

//     try {
//       let payload = {
//         question: input,
//         namespace_id: searchParams.get("namespace_id"),
//         chatHistory: messages,
//       };
//       setInput("");

//       await startConversation(payload, (chunk) => {
//         const chunkText =
//           typeof chunk === "string"
//             ? chunk
//             : chunk?.text ??
//               chunk?.Ai_response ??
//               chunk?.data ??
//               JSON.stringify(chunk);

//         setMessages((prev) => {
//           const lastIdx = prev.length - 1;

//           if (lastIdx < 0) return prev;

//           const updated = [...prev];
//           const last = { ...updated[lastIdx] };

//           if (last.question === "") {
//             last.Ai_response = (last.Ai_response || "") + chunkText;
//             updated[lastIdx] = last;

//             return updated;
//           }

//           return [...prev, { question: "", Ai_response: chunkText }];
//         });
//       });
//     } catch (err) {
//       console.error("Streaming error:", err);
//       setMessages((prev) => [
//         ...prev,
//         { question: "", Ai_response: "⚠️ Error receiving response." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatResponse = (text) => {
//     return text
//       .replace(/For More Reference:/g, "\n\nFor More Reference:\n")
//       .replace(/•/g, "\n•")
//       .replace(/\. /g, ".\n")
//       .replace(/- /g, "\n -")
//       .trim();
//   };

//   return (
//     <div className="chat-page container-fluid py-3">
//       <div className="row justify-content-center">
//         <div className="col-lg-9 col-md-10">
//           <div className="card chat-card shadow-sm rounded-4">
//             <div className="chat-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
//               <h5 className="fw-bold text-primary mb-0">🤖</h5>
//               <Button
//                 variant="outline-secondary"
//                 className="rounded-pill px-4"
//                 onClick={() => navigate(-1)}
//               >
//                 ← Back
//               </Button>
//             </div>

//             <div className="chat-body px-3 py-4">
//               {messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`message-row ${
//                     msg.question ? "text-end" : "text-start"
//                   }`}
//                 >
//                   <div
//                     className={`message-bubble ${
//                       msg.question ? "user-msg" : "bot-msg"
//                     }`}
//                   >
//                     {msg.question && (
//                       <div className="font-semibold">{msg.question}</div>
//                     )}

//                     {msg.Ai_response && (
//                       <div
//                         className="whitespace-pre-line text-left"
//                         style={{
//                           whiteSpace: "pre-wrap",
//                           lineHeight: "1.6",
//                         }}
//                       >
//                         {formatResponse(msg.Ai_response)}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               {loading && (
//                 <div className="text-start mt-2">
//                   <div className="bot-msg d-inline-block px-3 py-1 rounded-4 bg-light">
//                     <PulseLoader
//                       color="#409fffff"
//                       size={8}
//                       margin={3}
//                       speedMultiplier={0.7}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="chat-input border-top px-3 py-3">
//               <form className="d-flex gap-2">
//                 <input
//                   type="text"
//                   placeholder="Type your message..."
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   className="form-control rounded-pill px-3"
//                 />
//                 <button
//                   className="btn btn-primary rounded-pill px-4"
//                   onClick={handleSend}
//                   disabled={loading}
//                 >
//                   Send
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;








// import React, { useState } from "react";
// import { Button } from "react-bootstrap";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import "./ChatPage.scss";
// import { startConversation } from "../../../../services/Api.service";
// import { PulseLoader } from "react-spinners";

// const ChatPage = () => {
//   const [searchParams] = useSearchParams();

//   const [messages, setMessages] = useState([
//     {
//       question: "",
//       Ai_response: "Hello, I’m NurseBot 🩺. How can I help you today?",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     setLoading(true);
//     setMessages((prev) => [...prev, { question: input, Ai_response: "" }]);

//     try {
//       const payload = {
//         question: input,
//         namespace_id: searchParams.get("namespace_id"),
//         chatHistory: messages,
//       };

//       setInput("");

//       await startConversation(payload, (chunk) => {
//         const text =
//           typeof chunk === "string"
//             ? chunk
//             : chunk?.text ??
//               chunk?.Ai_response ??
//               chunk?.data ??
//               JSON.stringify(chunk);

//         setMessages((prev) => {
//           const updated = [...prev];
//           const lastIndex = updated.length - 1;

//           if (lastIndex < 0) return prev;

//           if (updated[lastIndex].question === "") {
//             updated[lastIndex].Ai_response += text;
//           } else {
//             updated.push({ question: "", Ai_response: text });
//           }

//           return updated;
//         });
//       });
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { question: "", Ai_response: "⚠️ Error receiving response." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatResponse = (text) =>
//     text
//       .replace(/For More Reference:/g, "\n\nFor More Reference:\n")
//       .replace(/•/g, "\n•")
//       .replace(/\. /g, ".\n")
//       .replace(/- /g, "\n -")
//       .trim();

//   return (
//     <div className="chat-page container-fluid py-3">
//       <div className="row justify-content-center">
//         <div className="col-lg-9 col-md-10">
//           <div className="chat-card card rounded-4">
//             {/* HEADER */}
//             <div className="chat-header d-flex justify-content-between align-items-center">
//               <h5 className="fw-bold mb-0">🩺 NurseBot</h5>
//               <Button
//                 variant="outline-secondary"
//                 className="rounded-pill px-4"
//                 onClick={() => navigate(-1)}
//               >
//                 ← Back
//               </Button>
//             </div>

//             {/* BODY */}
//             <div className="chat-body">
//               {messages.map((msg, index) => {
//                 const isUser = !!msg.question;

//                 return (
//                   <div
//                     key={index}
//                     className={`message-row ${isUser ? "user" : "bot"}`}
//                   >
//                     {!isUser && <div className="avatar">🩺</div>}

//                     <div
//                       className={`message-bubble ${
//                         isUser ? "user-msg" : "bot-msg"
//                       }`}
//                     >
//                       {msg.question && (
//                         <div className="fw-semibold mb-1">
//                           {msg.question}
//                         </div>
//                       )}

//                       {msg.Ai_response && (
//                         <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
//                           {formatResponse(msg.Ai_response)}
//                         </div>
//                       )}
//                     </div>

//                     {isUser && <div className="avatar">👤</div>}
//                   </div>
//                 );
//               })}

//               {/* TYPING INDICATOR */}
//               {loading && (
//                 <div className="message-row bot mt-2">
//                   <div className="avatar">🩺</div>
//                   <div className="message-bubble bot-msg px-3 py-2">
//                     <PulseLoader
//                       color="#0984e3"
//                       size={8}
//                       margin={3}
//                       speedMultiplier={0.7}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* INPUT */}
//             <div className="chat-input">
//               <form className="d-flex gap-2" onSubmit={handleSend}>
//                 <input
//                   type="text"
//                   className="form-control rounded-pill px-3"
//                   placeholder="Type your message…"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                 />
//                 <button
//                   className="btn btn-primary rounded-pill px-4"
//                   disabled={loading}
//                 >
//                   Send
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
















import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ChatPage.scss";
import ApiService, { startConversation } from "../../../../services/Api.service";
import { PulseLoader } from "react-spinners";
import { FaMicrophone, FaMicrophoneSlash, FaStop } from "react-icons/fa";

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Check if analyze parameter is present
  const isAnalyzeMode = searchParams.get("analyze") === "true";

  // Format response to clean up special characters and improve readability
  const formatResponse = (text) => {
    if (!text) return "";
    
    return text
      // Remove excessive special characters and emojis
      .replace(/[🩺👤💊📊🏃🥗⚕️⚠️❌✅📋🏥💬]/g, '')
      // Clean up markdown formatting
      .replace(/\*\*/g, '')
      .replace(/##/g, '')
      // Fix spacing and line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n')  // Remove excessive empty lines
      .replace(/\.+/g, '.')  // Fix multiple periods
      .replace(/\s+/g, ' ')  // Fix multiple spaces
      // Add proper line breaks for readability
      .replace(/(\.)([A-Z])/g, '$1\n\n$2')  // New line after sentences
      .replace(/(\:)([A-Z])/g, '$1\n\n$2')  // New line after colons
      .trim();
  };

  const [messages, setMessages] = useState([
    { 
      question: "", 
      Ai_response: isAnalyzeMode 
        ? formatResponse("Welcome to Diabetes Analysis! I'll analyze your glucose report and provide personalized insights about your diabetes condition.") 
        : formatResponse("Hi, I'm NurseBot. How can I assist you today?") 
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUpAdded, setFollowUpAdded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSpeechSupported(true);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        
        if (event.results[current].isFinal) {
          setInput(prev => prev + transcript + ' ');
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access to use voice typing.');
        } else if (event.error === 'no-speech') {
          console.log('No speech detected');
        } else {
          alert('Voice recognition error: ' + event.error);
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      console.log('Speech recognition not supported');
      setIsSpeechSupported(false);
    }
    
    if (isAnalyzeMode) {
      // Trigger automatic diabetes analysis
      performDiabetesAnalysis();
    }
  }, [isAnalyzeMode]);

  const performDiabetesAnalysis = async () => {
    const analysisMessage = {
      question: "",
      Ai_response: formatResponse("Analyzing your glucose report... Please wait while I review your blood sugar readings and prepare your personalized analysis.")
    };
    
    setMessages([analysisMessage]);
    setLoading(true);
    let analysisSucceeded = false;

    try {
      const botId = searchParams.get("id");
      const namespaceId = searchParams.get("namespace_id");
      
      console.log("Starting analysis for botId:", botId, "namespaceId:", namespaceId);
      
      // First check if files exist
      const { data: filesData, error: filesError } = await ApiService.getAllFiles(botId);
      
      if (filesError) {
        console.error("Error fetching files:", filesError);
        setMessages((prev) => [
          ...prev,
          { 
            question: "", 
            Ai_response: formatResponse("File Check Error\n\nUnable to check uploaded files. Error: " + (filesError.message || "Unknown error") + "\n\nPlease try again or re-upload your report.") 
          },
        ]);
        return;
      }
      
      if (!filesData || !filesData.result || filesData.result.length === 0) {
        setMessages((prev) => [
          ...prev,
          { 
            question: "", 
            Ai_response: formatResponse("No Report Found\n\nI don't see any uploaded glucose reports for this patient. Please upload a glucose report first using the 'Upload Report' button, then try analyzing again.") 
          },
        ]);
        return;
      }

      // Call the analyze endpoint
      const { data: analysisData, error: analysisError } = await ApiService.analyzeReport(botId);
      
      if (analysisError) {
        console.error("Analysis error:", analysisError);
        setMessages((prev) => [
          ...prev,
          { 
            question: "", 
            Ai_response: formatResponse("Analysis Error\n\n" + (analysisError.response?.data?.detail || analysisError.message || "Unknown error occurred during analysis")) 
          },
        ]);
        return;
      }

      console.log("Analysis result:", analysisData);
      
      if (analysisData.status === "success" && analysisData.analysis) {
        const analysis = analysisData.analysis;
        
        // Format the analysis response
        let analysisText = `📋 **Diabetes Analysis Report**

🩺 **Diabetes Type:** ${analysis.diabetes_type || "Type 2 Diabetes"}

📊 **Glucose Level:** ${analysis.glucose_level || "High"}

� **Key Findings:** ${analysis.key_findings || "Medical report analyzed. Please consult with your healthcare provider for detailed interpretation."}

�💡 **Recommendations:`;
        
        if (analysis.suggestions && analysis.suggestions.length > 0) {
          analysis.suggestions.forEach((suggestion, index) => {
            analysisText += `\n${index + 1}. ${suggestion}`;
          });
        }

        if (analysis.help_prompt) {
          analysisText += `\n\n${analysis.help_prompt}`;
        }

        if (analysis.help_hints && analysis.help_hints.length > 0) {
          analysisText += `\n\n**How I can help you:**`;
          analysis.help_hints.forEach((hint, index) => {
            analysisText += `\n• ${hint}`;
          });
        }
        
        setMessages((prev) => [
          ...prev.slice(0, -1), // Remove loading message
          { 
            question: "", 
            Ai_response: formatResponse(analysisText)
          },
        ]);
        
        analysisSucceeded = true;
        
        // If redirect_to_chat is true, we can add a follow-up message
        if (analysisData.redirect_to_chat) {
          setTimeout(() => {
            setMessages((prev) => {
              const hasFollowUp = prev.some(msg => 
                msg.Ai_response && msg.Ai_response.includes("Feel free to ask me")
              );
              if (!hasFollowUp) {
                return [
                  ...prev,
                  {
                    question: "",
                    Ai_response: formatResponse(`Feel free to ask me about:
• Diet planning and meal recommendations
• Exercise routines and fitness advice  
• Daily diabetes management tips
• Blood sugar monitoring guidance
• Lifestyle modification suggestions

What would you like to know more about?`)
                  }
                ];
              }
              return prev;
            });
          }, 1000);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { 
            question: "", 
            Ai_response: formatResponse("Analysis completed but no detailed results were returned. Please try uploading a more detailed glucose report.") 
          },
        ]);
      }
      
    } catch (error) {
      console.error("Analysis error:", error);
      setMessages((prev) => [
        ...prev,
        { 
          question: "", 
          Ai_response: formatResponse("Analysis Error\n\nI apologize, but I couldn't analyze your report at the moment.\n\nError details: " + (error.message || "Unknown error") + "\n\nPlease ensure you have uploaded a valid glucose report (PDF format) and try again.") 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!isSpeechSupported || !recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Failed to start voice recognition. Please try again.');
      }
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { question: input, Ai_response: "" }]);
    setInput("");
    setLoading(true);

    try {
      await startConversation(
        {
          question: input,
          namespace_id: searchParams.get("namespace_id"),
          chatHistory: messages.filter(msg => msg.question || msg.Ai_response),
        },
        (chunk) => {
          const text =
            typeof chunk === "string"
              ? chunk
              : chunk?.text ?? chunk?.Ai_response ?? "";

          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];

            if (last.question === "") {
              // Accumulate chunks for the current bot response
              last.Ai_response += text;
            } else {
              // Create new bot response
              updated.push({ question: "", Ai_response: text });
            }

            return updated;
          });
        }
      );
    } catch {
      setMessages((prev) => [
        ...prev,
        { question: "", Ai_response: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nb-chat">
      <div className="nb-chat-card">
        {/* HEADER */}
        <div className="nb-chat-header">
          <div className="nb-title">
            <span className="avatar">🩺</span>
            <h5>{isAnalyzeMode ? "Diabetes Analysis" : "NurseBot"}</h5>
          </div>
          <Button
            variant="outline-secondary"
            size="sm"
            className="rounded-pill"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
        </div>

        {/* BODY */}
        <div className="nb-chat-body">
          {messages.map((msg, i) => {
            const isUser = !!msg.question;
            return (
              <div key={i} className={`nb-msg-row ${isUser ? "user" : "bot"}`}>
                {!isUser && <div className="msg-avatar">🩺</div>}

                <div className={`nb-bubble ${isUser ? "user-msg" : "bot-msg"}`}>
                  {msg.question && <b>{msg.question}</b>}
                  {msg.Ai_response && (
                    <div style={{ whiteSpace: "pre-wrap" }}>
                      {formatResponse(msg.Ai_response)}
                    </div>
                  )}
                </div>

                {isUser && <div className="msg-avatar">👤</div>}
              </div>
            );
          })}

          {loading && (
            <div className="nb-msg-row bot">
              <div className="msg-avatar">🩺</div>
              <div className="nb-bubble bot-msg">
                <PulseLoader size={8} color="#0984e3" />
              </div>
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="nb-chat-input">
          <form onSubmit={handleSend}>
            <div className="input-group">
              <input
                type="text"
                placeholder={isListening ? "Listening... Speak now" : "Type your message or click microphone"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={isListening ? 'listening' : ''}
                disabled={loading}
              />
              
              {isSpeechSupported && (
                <button
                  type="button"
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={toggleListening}
                  disabled={loading}
                  title={isListening ? "Stop recording" : "Start voice typing"}
                >
                  {isListening ? (
                    <>
                      <FaStop className="pulse-icon" />
                      <span className="voice-text">Stop</span>
                    </>
                  ) : (
                    <>
                      <FaMicrophone />
                      <span className="voice-text">Voice</span>
                    </>
                  )}
                </button>
              )}
              
              <button type="submit" disabled={loading || !input.trim()}>
                {loading ? (
                  <PulseLoader size={6} color="#fff" />
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
