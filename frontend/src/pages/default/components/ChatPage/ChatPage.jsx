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
















import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ChatPage.scss";
import { startConversation } from "../../../../services/Api.service";
import ApiService from "../../../../services/Api.service";
import { PulseLoader } from "react-spinners";

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Debug all URL parameters
  console.log('🔍 All URL params:', Object.fromEntries(searchParams.entries()));
  
  // Check if analyze parameter is present
  const analyzeParam = searchParams.get("analyze");
  console.log('📋 Raw analyze param:', analyzeParam);
  console.log('📋 Analyze param type:', typeof analyzeParam);
  
  const isAnalyzeMode = analyzeParam === "true";
  console.log('🎯 isAnalyzeMode:', isAnalyzeMode);

  const [messages, setMessages] = useState([
    { 
      question: "", 
      Ai_response: isAnalyzeMode 
        ? "Welcome to Diabetes Analysis! I'll analyze your glucose report and provide personalized insights about your diabetes condition." 
        : "Hi, I'm NurseBot 🩺. How can I assist you today?" 
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUpAdded, setFollowUpAdded] = useState(false);

  useEffect(() => {
    console.log('🔄 useEffect triggered, isAnalyzeMode:', isAnalyzeMode);
    
    if (isAnalyzeMode) {
      console.log('✅ Analyze mode detected, starting analysis...');
      // Add a small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        console.log('⏰ Timer triggered, calling performDiabetesAnalysis...');
        performDiabetesAnalysis();
      }, 100);
      
      return () => {
        console.log('🧹 Cleanup: clearing timer');
        clearTimeout(timer);
      };
    } else {
      console.log('ℹ️ Regular chat mode, no auto-analysis');
    }
  }, [isAnalyzeMode]);

  const performDiabetesAnalysis = async () => {
    console.log('🔍 Starting diabetes analysis...');
    
    try {
      const analysisMessage = {
        question: "",
        Ai_response: "I'm analyzing your glucose report. Please wait while I process the information..."
      };
      
      setMessages([analysisMessage]);
      setLoading(true);
      let analysisSucceeded = false;

      const namespaceId = searchParams.get("namespace_id");
      console.log('📋 Namespace ID:', namespaceId);
      
      if (!namespaceId) {
        console.error('❌ Missing namespace ID');
        setMessages((prev) => [
          ...prev,
          { 
            question: "", 
            Ai_response: "Missing namespace ID. Please go back and select your patient profile again." 
          },
        ]);
        setLoading(false);
        return;
      }

      console.log('🔄 Calling comprehensive analysis API...');
      // First try comprehensive diabetes analysis
      const { data: analysisData, error: analysisError } = await ApiService.analyzeDiabetesReport(namespaceId);
      
      console.log('📊 Full API response:', { analysisData, analysisError });
      
      if (analysisError) {
        console.error("❌ Comprehensive analysis error:", analysisError);
        console.error("❌ Error details:", analysisError.response?.data?.detail || analysisError.message);
        console.error("❌ Full error object:", analysisError);
        
        // Handle specific error cases
        const errorDetail = analysisError.response?.data?.detail || analysisError.message;
        if (errorDetail.includes('No readable content found') || 
            errorDetail.includes('No glucose values found')) {
          // Show user-friendly message for missing files/data
          const errorMessage = {
            question: "",
            Ai_response: "📋 **Analysis Notice**\n\nI couldn't find any glucose reports or blood glucose values in the uploaded files for this patient.\n\n**To fix this:**\n• Upload PDF reports containing blood glucose or HbA1c values\n• Ensure the reports include medical test results\n• Try analyzing again after uploading the correct reports\n\nWould you like help with uploading the correct medical reports?"
          };
          setMessages(prev => [...prev.slice(0, -1), errorMessage]);
          return;
        }
        
        // Fallback to regular chat analysis for other errors
        await fallbackChatAnalysis();
        return;
      }
      
      if (!analysisData) {
        console.error("❌ No analysis data received");
        await fallbackChatAnalysis();
        return;
      }
      
      console.log('📋 Analysis data status:', analysisData.status);
      console.log('📋 Analysis data keys:', Object.keys(analysisData));
      
      if (analysisData.status === 'success') {
        // Display comprehensive analysis results
        const comprehensiveReport = analysisData.comprehensive_report || "Analysis completed successfully.";
        const extractedValues = analysisData.extracted_values || {};
        const analysis = analysisData.analysis || {};
        
        console.log('✅ Analysis successful, formatting results...');
        
        // Format and display results
        let formattedResponse = "🩺 **COMPREHENSIVE DIABETES ANALYSIS**\n\n";
        
        // Add glucose values found
        if (Object.keys(extractedValues).length > 0) {
          formattedResponse += "📊 **GLUCOSE VALUES FOUND:**\n";
          Object.entries(extractedValues).forEach(([key, values]) => {
            if (values && values.length > 0) {
              const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              formattedResponse += `• ${label}: ${values.join(', ')} mg/dL\n`;
            }
          });
          formattedResponse += "\n";
        }
        
        // Add diabetes assessment
        if (analysis.diabetes_status && analysis.diabetes_status !== 'Unknown') {
          formattedResponse += "🔍 **DIABETES ASSESSMENT:**\n";
          formattedResponse += `• Status: ${analysis.diabetes_status}\n`;
          if (analysis.diabetes_type && analysis.diabetes_type !== 'Unknown') {
            formattedResponse += `• Type: ${analysis.diabetes_type}\n`;
          }
          if (analysis.risk_level && analysis.risk_level !== 'Unknown') {
            formattedResponse += `• Risk Level: ${analysis.risk_level}\n`;
          }
          formattedResponse += "\n";
        }
        
        // Add key findings
        if (analysis.key_findings && analysis.key_findings.length > 0) {
          formattedResponse += "📋 **KEY FINDINGS:**\n";
          analysis.key_findings.forEach(finding => {
            formattedResponse += `• ${finding}\n`;
          });
          formattedResponse += "\n";
        }
        
        // Add comprehensive AI report
        formattedResponse += "📝 **DETAILED ANALYSIS & RECOMMENDATIONS:**\n\n";
        formattedResponse += comprehensiveReport;
        
        // Add follow-up suggestions
        formattedResponse += "\n\n💡 **HOW CAN I HELP YOU FURTHER?**\n";
        formattedResponse += "You can ask me about:\n";
        formattedResponse += "• Exercise recommendations tailored to your condition\n";
        formattedResponse += "• Diet planning and nutritional guidance\n";
        formattedResponse += "• Lifestyle modification strategies\n";
        formattedResponse += "• Blood sugar monitoring tips\n";
        formattedResponse += "• When to consult your healthcare provider\n";
        formattedResponse += "• Medication information and guidance\n";
        formattedResponse += "• Complication prevention strategies\n";
        
        setMessages((prev) => [
          ...prev,
          { question: "", Ai_response: formattedResponse }
        ]);
        
        analysisSucceeded = true;
        
      } else {
        console.error("❌ Analysis failed with status:", analysisData.status);
        console.error("❌ Full response:", analysisData);
        // Fallback to regular analysis if comprehensive analysis fails
        await fallbackChatAnalysis();
      }
      
    } catch (error) {
      console.error("Analysis error:", error);
      setMessages((prev) => [
        ...prev,
        { 
          question: "", 
          Ai_response: "I apologize, but I encountered an error while analyzing your report. Please try again." 
        },
      ]);
      await fallbackChatAnalysis();
    } finally {
      setLoading(false);
      setFollowUpAdded(true);
    }
  };

  const fallbackChatAnalysis = async () => {
    // Fallback to the original chat-based analysis
    const { data: filesData } = await ApiService.getAllFiles(searchParams.get("id"));
    
    if (!filesData || filesData.result.length === 0) {
      setMessages((prev) => [
        ...prev,
        { 
          question: "", 
          Ai_response: "I don't see any uploaded glucose reports. Please upload your glucose report first, then try analyzing again." 
        },
      ]);
      return;
    }

    await startConversation(
      {
        question: "I have uploaded my glucose report. Please analyze it thoroughly and provide specific details about my blood sugar levels, trends, and diabetes condition. Look at the actual uploaded PDF report and give me personalized insights about my glucose readings, any concerning patterns, and specific recommendations based on my data.",
        namespace_id: searchParams.get("namespace_id"),
        chatHistory: [],
      },
      (chunk) => {
        const text =
          typeof chunk === "string"
            ? chunk
            : chunk?.text ?? chunk?.Ai_response ?? "";

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];

          if (last.question === "" && last.Ai_response.includes("I'm analyzing your glucose report")) {
            last.Ai_response = text;
          } else {
            const isDuplicate = updated.some(msg => 
              msg.question === "" && msg.Ai_response === text
            );
            if (!isDuplicate) {
              updated.push({ question: "", Ai_response: text });
            }
          }

          return updated;
        });
      }
    );
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
          chatHistory: messages,
        },
        (chunk) => {
          const text =
            typeof chunk === "string"
              ? chunk
              : chunk?.text ?? chunk?.Ai_response ?? "";

          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];

            if (last.question === "") last.Ai_response += text;
            else updated.push({ question: "", Ai_response: text });

            return updated;
          });
        }
      );
    } catch {
      setMessages((prev) => [
        ...prev,
        { question: "", Ai_response: "⚠️ Something went wrong." },
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
                      {msg.Ai_response}
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
            <input
              type="text"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button disabled={loading}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
