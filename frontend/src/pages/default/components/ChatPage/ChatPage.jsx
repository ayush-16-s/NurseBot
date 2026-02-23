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
import { PulseLoader } from "react-spinners";

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Check if analyze parameter is present
  const isAnalyzeMode = searchParams.get("analyze") === "true";

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
    if (isAnalyzeMode) {
      // Trigger automatic diabetes analysis
      performDiabetesAnalysis();
    }
  }, [isAnalyzeMode]);

  const performDiabetesAnalysis = async () => {
    const analysisMessage = {
      question: "",
      Ai_response: "I'm analyzing your glucose report. Please wait while I process the information..."
    };
    
    setMessages([analysisMessage]);
    setLoading(true);
    let analysisSucceeded = false;

    try {
      // First check if files exist for this namespace
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

            // Replace the loading message with actual analysis
            if (last.question === "" && last.Ai_response.includes("I'm analyzing your glucose report")) {
              last.Ai_response = text;
              // Mark as successful if we get actual analysis content
              if (text && !text.includes("couldn't analyze") && !text.includes("trouble accessing")) {
                analysisSucceeded = true;
              }
            } else {
              // Check for duplicate messages before adding
              const isDuplicate = updated.some(msg => 
                msg.question === "" && msg.Ai_response === text
              );
              if (!isDuplicate) {
                updated.push({ question: "", Ai_response: text });
                // Check if this is successful analysis
                if (text && !text.includes("couldn't analyze") && !text.includes("trouble accessing")) {
                  analysisSucceeded = true;
                }
              }
            }

            return updated;
          });
        }
      );
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { 
          question: "", 
          Ai_response: "I apologize, but I couldn't analyze your report at the moment. Please ensure you have uploaded a valid glucose report and try again." 
        },
      ]);
    } finally {
      setLoading(false);
      // Add follow-up message after analysis is complete (only if analysis succeeded)
      if (isAnalyzeMode && !followUpAdded && analysisSucceeded) {
        setTimeout(() => {
          setMessages((prev) => {
            // Check if follow-up message already exists
            const hasFollowUp = prev.some(msg => 
              msg.Ai_response.includes("Based on your glucose report analysis")
            );
            if (!hasFollowUp) {
              const updated = [
                ...prev,
                {
                  question: "",
                  Ai_response: "Based on your glucose report analysis, how can I help you today? You can ask me about:\n• Your current diabetes status\n• Diet and lifestyle recommendations\n• Medication guidance\n• Blood sugar management tips\n• When to consult your doctor"
                }
              ];
              setFollowUpAdded(true);
              return updated;
            }
            return prev;
          });
        }, 2000);
      }
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
