// import React, { useState } from "react";
// import "./Login.scss";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import ApiService from "../../services/Api.service";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);

//   let navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { email, password } = formData;

//     if (!email || !password) {
//       toast.error("Please fill in all fields.");
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     setLoading(true);

//     let { data, error } = await ApiService.login(formData);

//     setLoading(false);

//     if (error) {
//       toast.error(error.response.data.message);
//       return;
//     }

//     if (data) {
//       toast.success(data.message);
//       navigate("/default");
//     }
//   };

//   return (
//     <div className="login-container d-flex align-items-center justify-content-center vh-100">
//       <div className="login-card shadow-lg p-4 rounded-4">
//         <h3 className="text-center mb-4 fw-bold">Welcome Back 👋</h3>
//         <form>
//           <div className="mb-3">
//             <label className="form-label fw-semibold">Email</label>
//             <input
//               type="email"
//               name="email"
//               className="form-control form-control-lg"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label fw-semibold">Password</label>
//             <input
//               type="password"
//               name="password"
//               className="form-control form-control-lg"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary w-100 py-2 mt-2"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <span
//                   className="spinner-border spinner-border-sm me-2"
//                   role="status"
//                   aria-hidden="true"
//                 ></span>
//                 Login...
//               </>
//             ) : (
//               "Login"
//             )}
//           </button>

//           <div className="text-center mt-3">
           
//             <p className="text-decoration-none small text-muted mb-0">
//               Don't have an account?{" "}
//               <Link
//                 to="/register"
//                 className="text-decoration-none fw-bold text-primary"
//               >
//                 Sign Up
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;



// import React, { useState } from "react";
// import "./Login.scss";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import ApiService from "../../services/Api.service";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { email, password } = formData;

//     if (!email || !password) {
//       toast.error("Please fill in all fields.");
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     setLoading(true);
//     let { data, error } = await ApiService.login(formData);
//     setLoading(false);

//     if (error) {
//       toast.error(error.response?.data?.message || "Login failed");
//       return;
//     }

//     if (data) {
//       toast.success(data.message);
//       navigate("/default");
//     }
//   };

//   return (
//     <div className="login-container">
//       {/* Animated Background */}
//       <div className="animated-bg"></div>

//       <div className="login-wrapper">
//         <div className="login-card">

//           <div className="ai-logo">
//             🩺🤖
//             <span className="pulse"></span>
//           </div>

//           <h3>NurseBot Login</h3>
//           <p className="subtitle">Approachable AI nurse care</p>

//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label>Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="you@nursebot.ai"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="mb-3">
//               <label>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>

//             <button disabled={loading}>
//               {loading ? "NurseBot is connecting..." : "Login"}
//             </button>

//             {loading && (
//               <div className="ai-thinking">
//                 <span></span><span></span><span></span>
//                 <p>NurseBot is thinking...</p>
//               </div>
//             )}

//             <p className="register">
//               New here? <Link to="/register">Create account</Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };














// import React, { useState } from "react";
// import "./Login.scss";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import ApiService from "../../services/Api.service";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { email, password } = formData;

//     if (!email || !password) {
//       toast.error("Please fill in all fields.");
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     setLoading(true);
//     let { data, error } = await ApiService.login(formData);
//     setLoading(false);

//     if (error) {
//       toast.error(error.response?.data?.message || "Login failed");
//       return;
//     }

//     if (data) {
//       toast.success(data.message);
//       navigate("/default");
//     }
//   };

//   return (
  
//     <div className="login-container">
//       <div className="login-card">

//         {/* LEFT PANEL */}
//         <div className="login-left">
//           <div className="brand">
//             <div className="ai-logo">
//               🩺🤖
//               <span className="pulse"></span>
//             </div>
//             <h1>NurseBot</h1>
//             <p className="tagline">Approachable Nurse-Like Care</p>
//           </div>

//           <ul className="features">
//             <li>✔ Smart Patient Assistance</li>
//             <li>✔ 24/7 Health Support</li>
//             <li>✔ Appointment Guidance</li>
//             <li>✔ Medical Report Help</li>
//             <li>✔ AI-Powered Care</li>

//           </ul>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="login-right">
//           <h2>Login</h2>

//           <form onSubmit={handleSubmit}>
//             <label>Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="you@nursebot.ai"
//               value={formData.email}
//               onChange={handleChange}
//             />

//             <label>Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="••••••••"
//               value={formData.password}
//               onChange={handleChange}
//             />

//             <button type="submit" disabled={loading}>
//               {loading ? "Connecting NurseBot..." : "LOGIN"}
//             </button>

//             {loading && (
//               <div className="ai-thinking">
//                 <span></span><span></span><span></span>
//                 <p>NurseBot is thinking…</p>
//               </div>
//             )}

//             <p className="register">
//               <Link to="/register"> New here? Create account</Link>
//             </p>
//           </form>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Login;














// import React, { useState } from "react";
// import "./Login.scss";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import ApiService from "../../services/Api.service";


// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     setLoading(true);
//     const { data, error } = await ApiService.login(formData);
//     setLoading(false);

//     if (error) {
//       toast.error("Invalid email or password");
//       return;
//     }

//     toast.success("Welcome back!");
//     navigate("/default");
//   };

//   return (
//     <div className="nb-login">
//       {/* LEFT IMAGE */}
//       <div className="nb-left">
//         <img src="/nurse.png" alt="NurseBot Illustration" />


//       </div>

//       {/* RIGHT CARD */}
//       <div className="nb-right">
//         <div className="nb-card">
//           <div className="nb-logo">
           

//             <span>N+</span>
//             <h3>NurseBot</h3>
//           </div>

//           <h2>Welcome Back</h2>

//           <form onSubmit={handleSubmit}>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//             />

//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//             />
// {/* 
//             <div className="nb-options">
//               <label>
//                 <input type="checkbox" /> Remember Me
//               </label>
//               <span className="forgot">Forgot Password?</span>
//             </div> */}

//             <button type="submit" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </button>

//             <div className="divider">
//               <span>Alternative Login Options</span>
//             </div>

//             {/* div className="social-login">
//               <button className="google">Google</button>
//               <button className="twitter">Twitter</button>
//             </div>< */}

//             <p className="register-link">
//               New here? <Link to="/register">Create account</Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;





// import React, { useState } from "react";
// import "./Login.scss";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import ApiService from "../../services/Api.service";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     setLoading(true);
//     const { data, error } = await ApiService.login(formData);
//     setLoading(false);

//     if (error) {
//       toast.error("Invalid email or password");
//       return;
//     }

//     toast.success("Welcome back!");
//     navigate("/default");
//   };

//   return (
//     <div className="nb-login">
//       {/* LEFT IMAGE
//       <div className="nb-left">
//         <img src="/nurse.png" alt="NurseBot Illustration" />
//       </div> */}

//       {/* RIGHT CARD */}
//       <div className="nb-right">
//         <div className="nb-card">
//           <div className="nb-logo">
//             <span>🤖</span>
//             <h3>NurseBot</h3>
//           </div>

//           <h2>Welcome Back</h2>

//           <form onSubmit={handleSubmit}>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//             />

//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//             />

//             <button type="submit" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </button>

//             <div className="divider">
//               <span>Alternative Login Options</span>
//             </div>

//             <p className="register-link">
//               New here? <Link to="/register">Create account</Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;











// import React, { useState } from "react";
// import "./Login.scss";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import ApiService from "../../services/Api.service";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState(false);

//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       toast.error("Please fill all fields");
//       setError(true);
//       setTimeout(() => setError(false), 500);
//       return;
//     }

//     setLoading(true);
//     const { error } = await ApiService.login(formData);
//     setLoading(false);

//     if (error) {
//       toast.error("Invalid email or password");
//       setError(true);
//       setTimeout(() => setError(false), 500);
//       return;
//     }

//     toast.success("Welcome back 👋");

//     document.querySelector(".nb-card").classList.add("success");
//     document.querySelector(".nurse-avatar").classList.add("avatar-success");

//     setTimeout(() => {
//       navigate("/default");
//     }, 600);
//   };

//   return (
//     <div className="nb-login">
//       <div className="nb-right">
//         <div className={`nb-card ${error ? "shake" : ""}`}>
//           {/* LOGO + AVATAR */}
//           <div className="nb-logo">
//             <div className={`nurse-avatar ${error ? "avatar-error" : ""}`}>
//               <div className="face">
//                 <span className="eye left"></span>
//                 <span className="eye right"></span>
//                 <span className="mouth"></span>
//               </div>
//             </div>
//             <h3>NurseBot</h3>
//           </div>

//           {/* AI GREETING */}
//           <p className="ai-greeting">
//             Hello 👋 I’m NurseBot. Let me help you sign in.
//           </p>

//           <h2>Welcome Back</h2>

//           <form onSubmit={handleSubmit}>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//             />

//             {/* PASSWORD WITH EYE */}
//             <div className="password-wrapper">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//               <span onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? "🙈" : "👁️"}
//               </span>
//             </div>

//             {loading && (
//               <p className="login-step">Verifying your credentials…</p>
//             )}

//             <button type="submit" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </button>

//             <p className="trust-text">🔒 Your data is encrypted & secure</p>

//             <div className="divider">
//               <span>Alternative Login Options</span>
//             </div>

//             <p className="register-link">
//               New here? <Link to="/register">Create account</Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



// import React, { useState, useEffect, useRef } from "react";
// import "./Login.scss";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import ApiService from "../../services/Api.service";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState(false);
//   const [displayText, setDisplayText] = useState("");
//   const avatarRef = useRef(null);
//   const navigate = useNavigate();

//   // Smooth, emoji-friendly letter-by-letter greeting
//   const greeting = "Hii 👋 I'm NurseBot!";

//   useEffect(() => {
//     setDisplayText(""); 
//     let i = 0;
//     const interval = setInterval(() => {
//       if (i < greeting.length) {
//         setDisplayText((prev) => prev + greeting[i]);
//         i++;
//       } else clearInterval(interval);
//     }, 120); // slower for emoji + readability
//     return () => clearInterval(interval);
//   }, []);

//   // Cursor tracking for eyes
//   const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (!avatarRef.current) return;
//       const rect = avatarRef.current.getBoundingClientRect();
//       setCursorPos({
//         x: e.clientX - rect.left - rect.width / 2,
//         y: e.clientY - rect.top - rect.height / 2,
//       });
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       toast.error("Please fill all fields");
//       setError(true);
//       setTimeout(() => setError(false), 500);
//       return;
//     }

//     setLoading(true);
//     const { error: loginError } = await ApiService.login(formData);
//     setLoading(false);

//     if (loginError) {
//       toast.error("Invalid email or password");
//       setError(true);
//       setTimeout(() => setError(false), 500);
//       return;
//     }

//     toast.success("Welcome back!");
//     document.querySelector(".nurse-avatar").classList.add("avatar-success");
//     setTimeout(() => navigate("/default"), 600);
//   };

//   return (
//     <div className="nb-login">
//       <div className="nb-right">
//         <div className={`nb-card ${error ? "shake" : ""}`}>
//           {/* LOGO + HUMAN AI AVATAR */}
//           <div className="nb-logo">
//             <div className={`nurse-avatar ${loading ? "talking" : ""}`} ref={avatarRef}>
//               <div className="face">
//                 <span
//                   className="eye left"
//                   style={{
//                     transform: `translate(${cursorPos.x / 20}px, ${cursorPos.y / 20}px)`,
//                   }}
//                 ></span>
//                 <span
//                   className="eye right"
//                   style={{
//                     transform: `translate(${cursorPos.x / 20}px, ${cursorPos.y / 20}px)`,
//                   }}
//                 ></span>
//                 <span className="mouth"></span>
//               </div>
//               <div className="ekg-heart"></div>
//             </div>
//             <h3>NurseBot</h3>
//           </div>

//           {/* AI GREETING */}
//           <p className="ai-greeting">{displayText}</p>

//           <h2>Welcome Back</h2>

//           <form onSubmit={handleSubmit}>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//             />

//             {/* PASSWORD TOGGLE */}
//             <div className="password-wrapper">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//               <span onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? "🙈" : "👁️"}
//               </span>
//             </div>

//             {loading && <p className="login-step">Verifying your credentials…</p>}

//             <button type="submit" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </button>

//             <p className="trust-text">🔒 Your data is encrypted & secure</p>

//             <div className="divider">
//               <span>Alternative Login Options</span>
//             </div>

//             <p className="register-link">
//               New here? <Link to="/register">Create account</Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;






// import React, { useState, useEffect, useRef } from "react";
// import "./Login.scss";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import ApiService from "../../services/Api.service";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState(false);
//   const avatarRef = useRef(null);
//   const navigate = useNavigate();

//   // Cursor tracking for eyes
//   const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (!avatarRef.current) return;
//       const rect = avatarRef.current.getBoundingClientRect();
//       setCursorPos({
//         x: e.clientX - rect.left - rect.width / 2,
//         y: e.clientY - rect.top - rect.height / 2,
//       });
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       toast.error("Please fill all fields");
//       setError(true);
//       setTimeout(() => setError(false), 500);
//       return;
//     }

//     setLoading(true);
//     const { error: loginError } = await ApiService.login(formData);
//     setLoading(false);

//     if (loginError) {
//       toast.error("Invalid email or password");
//       setError(true);
//       setTimeout(() => setError(false), 500);
//       return;
//     }

//     toast.success("Welcome back!");
//     document.querySelector(".nurse-avatar").classList.add("avatar-success");
//     setTimeout(() => navigate("/default"), 600);
//   };

//   return (
//     <div className="nb-login">
//       <div className="nb-right">
//         <div className={`nb-card ${error ? "shake" : ""}`}>
//           {/* LOGO + HUMAN AI AVATAR */}
//           <div className="nb-logo">
//             <div className={`nurse-avatar ${loading ? "talking" : ""}`} ref={avatarRef}>
//               <div className="face">
//                 <span
//                   className="eye left"
//                   style={{
//                     transform: `translate(${cursorPos.x / 20}px, ${cursorPos.y / 20}px)`,
//                   }}
//                 ></span>
//                 <span
//                   className="eye right"
//                   style={{
//                     transform: `translate(${cursorPos.x / 20}px, ${cursorPos.y / 20}px)`,
//                   }}
//                 ></span>
//                 <span className="mouth"></span>
//               </div>
//               <div className="ekg-heart"></div>
//             </div>
//             <h3>🤖NurseBot</h3>
//           </div>

//           {/* Friendly approachable nurse message */}
//           <p className="ai-greeting">Hi! I’m NurseBot 👩‍⚕️ Here to help you.</p>

//           <h2>Welcome Back</h2>

//           <form onSubmit={handleSubmit}>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//             />

//             {/* PASSWORD TOGGLE */}
//             <div className="password-wrapper">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//               <span onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? "🙈" : "👁️"}
//               </span>
//             </div>

//             {loading && <p className="login-step">Verifying your credentials…</p>}

//             <button type="submit" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </button>

//             <p className="trust-text">🔒 Your data is encrypted & secure</p>

//             <div className="divider">
//               <span>Alternative Login Options</span>
//             </div>

//             <p className="register-link">
//               New here? <Link to="/register">Create account</Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;













import React, { useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiService from "../../services/Api.service";
 
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
 
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      setError(true);
      setTimeout(() => setError(false), 500);
      return;
    }

    setLoading(true);
    const { error: loginError } = await ApiService.login(formData);
    setLoading(false);

    if (loginError) {
      toast.error("Invalid email or password");
      setError(true);
      setTimeout(() => setError(false), 500);
      return;
    }

    toast.success("Welcome back!");
    setTimeout(() => navigate("/default"), 600);
  };

  return (
    <div className="login-professional">
      <div className="login-container">
        <div className={`login-card ${error ? "shake" : ""}`}>
          {/* NurseBot Logo */}
          <div className="logo-section">
            <div className="logo-icon">🏥</div>
            <h1 className="logo-text">🤖NurseBot</h1>
            <p className="logo-subtitle">Professional Healthcare Management</p>
          </div>

          {/* Welcome Message */}
          <div className="welcome-section">
            <h2>Welcome Back</h2>
            <p>Sign in to access your medical dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🔒" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`submit-btn ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <span className="loading-text">
                  <span className="spinner"></span>
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className="login-options">
            <p className="register-link">
              New to NurseBot? <Link to="/register">Create Account</Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="security-badge">
            <span className="security-icon">🔐</span>
            <span>Secured with 256-bit SSL Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
