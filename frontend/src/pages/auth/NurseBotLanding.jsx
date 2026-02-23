// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./NurseBotLanding.scss";

// const NurseBotLanding = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="nursebot-landing">
//       {/* HERO SECTION */}
//       <section className="hero">
//         <div className="overlay"></div>

//         <div className="content">
//           <h1>NurseBot – Approachable AI Nurse-Like Care</h1>
//           <p>Intelligent guidance. Personalized care. Anytime, anywhere.</p>

//           <div className="hero-buttons">
//             <button
//               className="primary-btn"
//               onClick={() => navigate("/login")}
//             >
//               Login
//             </button>
//             <button
//               className="secondary-btn"
//               onClick={() => navigate("/register")}
//             >
//               Register
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* FEATURES SECTION */}
//       <section className="features">
//         <h2>Why NurseBot?</h2>
//         <div className="feature-grid">
//           <div className="card">
//             <p>🩺 Report Analysis</p>
//             <p>AI-based glucose & medical report interpretation.</p>
//           </div>
//           <div className="card">
//             <p>🍎 Health Guidance</p>
//             <p>Smart diet & lifestyle recommendations.</p>
//           </div>
//           <div className="card">
//             <p>💬 AI Chatbot</p>
//             <p>Conversational nurse-like experience.</p>
//           </div>
//           <div className="card">
//             <p>🔒 Secure & Fast</p>
//             <p>Real-time response with data privacy.</p>
//           </div>
//         </div>
//       </section>

//       <footer>
//         <p>© 2026 NurseBot — AI Healthcare Assistant</p>
//       </footer>
//     </div>
//   );
// };

// export default NurseBotLanding;






// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./NurseBotLanding.scss";

// const NurseBotLanding = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="nursebot-landing">
//       {/* TOP LEFT NAV BUTTONS */}
//       <div className="top-nav">
//         <button className="nav-btn" onClick={() => navigate("/login")}>
//           Login
//         </button>
//         <button className="nav-btn" onClick={() => navigate("/register")}>
//           Register
//         </button>
//       </div>

//       {/* HERO SECTION */}
//       <section className="hero">
//         <div className="hero-content">
//           <h1 className="title">NurseBot</h1>
//           <p className="subtitle">Approachable AI Nurse-Like Care</p>
//         </div>
//       </section>

//       {/* FEATURES SECTION */}
//       <section className="features">
//         <h2>Why NurseBot?</h2>
//         <div className="feature-grid">
//           <div className="card">
//             <p>🩺 Report Analysis</p>
//             <p>AI-based glucose & medical report interpretation.</p>
//           </div>
//           <div className="card">
//             <p>🍎 Health Guidance</p>
//             <p>Smart diet & lifestyle recommendations.</p>
//           </div>
//           <div className="card">
//             <p>💬 AI Chatbot</p>
//             <p>Conversational nurse-like experience.</p>
//           </div>
//           <div className="card">
//             <p>🔒 Secure & Fast</p>
//             <p>Real-time response with data privacy.</p>
//           </div>
//         </div>
//       </section>

//       <footer>
//         <p>© 2026 NurseBot — AI Healthcare Assistant</p>
//       </footer>
//     </div>
//   );
// };

// export default NurseBotLanding;




















// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./NurseBotLanding.scss";

// const NurseBotLanding = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="nursebot-landing">
//       {/* TOP LEFT NAV BUTTONS */}
//       <div className="top-nav">
//         <button className="nav-btn" onClick={() => navigate("/login")}>
//          Login
//         </button>
//         <button className="nav-btn register-btn" onClick={() => navigate("/register")}>
//           Register
//         </button>
//       </div>

//       {/* HERO SECTION */}
//       <section className="hero">
//         <div className="hero-content">
//           <h1 className="title">
//             NurseBot💉<span className="glow"></span>
//           </h1>
//           <p className="subtitle">
//             Your Friendly AI Nurse — Smart Care, Anytime
//           </p>
//           <button className="cta-btn" onClick={() => navigate("/register")}>
//             Get Started
//           </button>
//         </div>
//       </section>

//       {/* FEATURES SECTION */}
//       <section className="features">
//         <h2>Why Choose NurseBot?</h2>
//         <div className="feature-grid">
//           <div className="card">
//             <p className="icon">🩺</p>
//             <h3>Report Analysis</h3>
//             <p>AI-powered interpretation of glucose & medical reports.</p>
//           </div>
//           <div className="card">
//             <p className="icon">🍎</p>
//             <h3>Health Guidance</h3>
//             <p>Personalized diet & lifestyle recommendations.</p>
//           </div>
//           <div className="card">
//             <p className="icon">💬</p>
//             <h3>AI Chatbot</h3>
//             <p>Interactive nurse-like conversations anytime.</p>
//           </div>
//           <div className="card">
//             <p className="icon">🔒</p>
//             <h3>Secure & Fast</h3>
//             <p>Real-time responses with complete data privacy.</p>
//           </div>
//         </div>
//       </section>

//       <footer>
//         <p>© 2026 NurseBot — AI Healthcare Assistant</p>
//       </footer>
//     </div>
//   );
// };

// export default NurseBotLanding;








import React from "react";
import { useNavigate } from "react-router-dom";
import "./NurseBotLanding.scss";

const NurseBotLanding = () => {
  const navigate = useNavigate();

  const teamMembers = [
    "Gauri Netankar",
    "Ayush Sonkusare",
    "Gargi Naik",
    "Achal Ughade",
  ];

  return (
    <div className="nursebot-landing">
      {/* TOP LEFT NAV BUTTONS */}
      <div className="top-nav">
        <button className="nav-btn" onClick={() => navigate("/login")}>
         Login
        </button>
        <button className="nav-btn register-btn" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="title">
            NurseBot💉<span className="glow"></span>
          </h1>
          <p className="subtitle">
            Your Friendly AI Nurse — Smart Care, Anytime
          </p>
          <button className="cta-btn" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2>Why Choose NurseBot?</h2>
        <div className="feature-grid">
          <div className="card">
            <p className="icon">🩺</p>
            <h3>Report Analysis</h3>
            <p>AI-powered interpretation of glucose & medical reports.</p>
          </div>
          <div className="card">
            <p className="icon">🍎</p>
            <h3>Health Guidance</h3>
            <p>Personalized diet & lifestyle recommendations.</p>
          </div>
          <div className="card">
            <p className="icon">💬</p>
            <h3>AI Chatbot</h3>
            <p>Interactive nurse-like conversations anytime.</p>
          </div>
          <div className="card">
            <p className="icon">🔒</p>
            <h3>Secure & Fast</h3>
            <p>Real-time responses with complete data privacy.</p>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL DEVELOPED BY SECTION */}
      <section className="team">
        <p>Developed by:</p>
        <div className="team-names">
          {teamMembers.map((name, idx) => (
            <span key={idx}>{name}</span>
          ))}
        </div>
      </section>

      <footer>
        <p>© 2026 NurseBot — AI Healthcare Assistant</p>
      </footer>
    </div>
  );
};

export default NurseBotLanding;
