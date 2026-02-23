// import React, { useState } from "react";
// import "./Register.scss";
// import { Link, useNavigate } from "react-router-dom";
// import ApiService from "../../services/Api.service";
// import { toast } from "react-toastify";
// const Register = () => {
//   let navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone_number: "",
//     company_name: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { name, email, phone_number, company_name, password } = formData;

//     if (!name || !email || !phone_number || !company_name || !password) {
//       toast.error("Please fill in all fields.");
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     if (!/^[0-9]{10}$/.test(phone_number)) {
//       toast.error("Please enter a valid 10-digit phone number.");
//       return;
//     }

//     setLoading(true);

//     let { data, error } = await ApiService.register(formData);

//     setLoading(false);

//     if (error) {
//       toast.error(error.response.data.error);
//       return;
//     }

//     if (data) {
//       toast.success(data.message);
//       navigate("/login");
//     }
//   };

//   return (
//     <div className="register-container d-flex align-items-center justify-content-center vh-100">
//       <div className="register-card shadow-lg p-4 rounded-4">
//         <h3 className="text-center fw-bold mb-2">Create Your Account 🚀</h3>
//         <p className="text-center text-muted mb-4">
//           Join us and start your journey today!
//         </p>

//         <form>
//           <div className="mb-3">
//             <label className="form-label fw-semibold">Full Name</label>
//             <input
//               type="text"
//               name="name"
//               className="form-control form-control-lg"
//               placeholder="Enter your full name"
//               value={formData.name}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label fw-semibold">Email</label>
//             <input
//               type="email"
//               name="email"
//               className="form-control form-control-lg"
//               placeholder="Enter your email address"
//               value={formData.email}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label fw-semibold">Phone</label>
//             <input
//               type="number"
//               name="phone_number"
//               className="form-control form-control-lg"
//               placeholder="Enter your phone number"
//               value={formData.phone_number}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label fw-semibold">Company</label>
//             <input
//               type="text"
//               name="company_name"
//               className="form-control form-control-lg"
//               placeholder="Enter your company name"
//               value={formData.company_name}
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
//             onClick={handleSubmit}
//             type="submit"
//             className="btn btn-primary w-100 py-2 mt-2 d-flex align-items-center justify-content-center"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <span
//                   className="spinner-border spinner-border-sm me-2"
//                   role="status"
//                   aria-hidden="true"
//                 ></span>
//                 Registering...
//               </>
//             ) : (
//               "Register"
//             )}
//           </button>

//           <div className="text-center mt-3">
//             <p className="small text-muted">
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="text-decoration-none fw-bold text-primary"
//               >
//                 Login here
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;





// import React, { useState } from "react";
// import "./Register.scss";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import ApiService from "../../services/Api.service";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone_number: "",
//     company_name: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, email, phone_number, company_name, password } = formData;

//     if (!name || !email || !phone_number || !company_name || !password) {
//       toast.error("Please fill in all fields.");
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     if (!/^[0-9]{10}$/.test(phone_number)) {
//       toast.error("Enter valid 10-digit phone number.");
//       return;
//     }

//     setLoading(true);
//     let { data, error } = await ApiService.register(formData);
//     setLoading(false);

//     if (error) {
//       toast.error(error.response?.data?.message || "Registration failed");
//       return;
//     }

//     if (data) {
//       toast.success(data.message);
//       navigate("/login");
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
//             <li>✔ Personalized Care Support</li>
//             <li>✔ Secure Patient Data</li>
//             <li>✔ Smart AI Assistance</li>
//             <li>✔ Easy Onboarding</li>
//             <li>✔ Trusted Healthcare AI</li>
//           </ul>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="login-right">
//           <h2>Create Account</h2>

//           <form onSubmit={handleSubmit}>
//             <label>Full Name</label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Your full name"
//               value={formData.name}
//               onChange={handleChange}
//             />

//             <label>Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="you@nursebot.ai"
//               value={formData.email}
//               onChange={handleChange}
//             />

//             <label>Phone</label>
//             <input
//               type="text"
//               name="phone_number"
//               placeholder="10-digit phone number"
//               value={formData.phone_number}
//               onChange={handleChange}
//             />

//             <label>Company</label>
//             <input
//               type="text"
//               name="company_name"
//               placeholder="Hospital / Organization"
//               value={formData.company_name}
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
//               {loading ? "Creating NurseBot Account..." : "REGISTER"}
//             </button>

//             {loading && (
//               <div className="ai-thinking">
//                 <span></span><span></span><span></span>
//                 <p>NurseBot is setting things up…</p>
//               </div>
//             )}

//             <p className="register">
//               Already have an account? <Link to="/login">Login</Link>
//             </p>
//           </form>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Register;

















// import React, { useState, useEffect } from "react";
// import "./Register.scss";
// import { Link, useNavigate } from "react-router-dom";
// import ApiService from "../../services/Api.service";
// import { toast } from "react-toastify";
// import bgImage from "/mnt/data/image (1).jpg"; // uploaded image path

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone_number: "",
//     company_name: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);

//   // Mouse parallax for fun
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePos({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { name, email, phone_number, company_name, password } = formData;

//     if (!name || !email || !phone_number || !company_name || !password) {
//       toast.error("Please fill in all fields.");
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     if (!/^[0-9]{10}$/.test(phone_number)) {
//       toast.error("Please enter a valid 10-digit phone number.");
//       return;
//     }

//     setLoading(true);
//     const { data, error } = await ApiService.register(formData);
//     setLoading(false);

//     if (error) {
//       toast.error(error.response.data.error);
//       return;
//     }

//     if (data) {
//       toast.success(data.message);
//       navigate("/login");
//     }
//   };

//   return (
//     <div className="register-container d-flex vh-100">
//       {/* LEFT IMAGE */}
//       <div className="register-left">
//         <img
//           src={bgImage}
//           alt="Doctor Illustration"
//           className="bg-image"
//           style={{
//             transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.01}px, ${
//               (mousePos.y - window.innerHeight / 2) * 0.01
//             }px)`,
//           }}
//         />
//       </div>

//       {/* RIGHT FORM */}
//       <div className="register-right">
//         <div className="register-card shadow-lg p-4 rounded-4">
//           <h3 className="text-center fw-bold mb-2">Create Your Account 🚀</h3>
//           <p className="text-center text-muted mb-4">
//             Join us and start your journey today!
//           </p>

//           <form>
//             <div className="mb-3">
//               <label className="form-label fw-semibold">Full Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 className="form-control form-control-lg"
//                 placeholder="Enter your full name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-semibold">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 className="form-control form-control-lg"
//                 placeholder="Enter your email address"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-semibold">Phone</label>
//               <input
//                 type="number"
//                 name="phone_number"
//                 className="form-control form-control-lg"
//                 placeholder="Enter your phone number"
//                 value={formData.phone_number}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-semibold">Company</label>
//               <input
//                 type="text"
//                 name="company_name"
//                 className="form-control form-control-lg"
//                 placeholder="Enter your company name"
//                 value={formData.company_name}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-semibold">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 className="form-control form-control-lg"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>

//             <button
//               onClick={handleSubmit}
//               type="submit"
//               className="btn btn-primary w-100 py-2 mt-2 d-flex align-items-center justify-content-center"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span
//                     className="spinner-border spinner-border-sm me-2"
//                     role="status"
//                     aria-hidden="true"
//                   ></span>
//                   Registering...
//                 </>
//               ) : (
//                 "Register"
//               )}
//             </button>

//             <div className="text-center mt-3">
//               <p className="small text-muted">
//                 Already have an account?{" "}
//                 <Link
//                   to="/login"
//                   className="text-decoration-none fw-bold text-primary"
//                 >
//                   Login here
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

















// import React, { useState } from "react";
// import "./Register.scss";
// import { Link, useNavigate } from "react-router-dom";
// import ApiService from "../../services/Api.service";
// import { toast } from "react-toastify";

// const Register = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone_number: "",
//     company_name: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, email, phone_number, company_name, password } = formData;

//     if (!name || !email || !phone_number || !company_name || !password) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       toast.error("Invalid email address");
//       return;
//     }

//     if (!/^[0-9]{10}$/.test(phone_number)) {
//       toast.error("Phone number must be 10 digits");
//       return;
//     }

//     setLoading(true);

//     const { data, error } = await ApiService.register(formData);

//     setLoading(false);

//     if (error) {
//       toast.error(error.response?.data?.error || "Registration failed");
//       return;
//     }

//     toast.success(data.message || "Registered successfully");
//     navigate("/login");
//   };

//   return (
//     <div className="nb-register">
//       {/* LEFT IMAGE */}
//       <div className="nb-left">
//         <img
//           src="/images/nurse-register.png"
//           alt="Nurse Register Illustration"
//         />
//       </div>

//       {/* RIGHT REGISTER CARD */}
//       <div className="nb-right">
//         <div className="nb-card">
//           <h2>Create Account</h2>
//           <p className="nb-subtitle">
//             Join NurseBot & manage healthcare smarter
//           </p>

//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//             />

//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//             />

//             <input
//               type="text"
//               name="phone_number"
//               placeholder="Phone Number"
//               value={formData.phone_number}
//               onChange={handleChange}
//             />

//             <input
//               type="text"
//               name="company_name"
//               placeholder="Hospital / Company Name"
//               value={formData.company_name}
//               onChange={handleChange}
//             />

//             <input
//               type="password"
//               name="password"
//               placeholder="Create Password"
//               value={formData.password}
//               onChange={handleChange}
//             />

//             <button type="submit" disabled={loading}>
//               {loading ? "Registering..." : "Create Account"}
//             </button>
//           </form>

//           <div className="register-link">
//             Already have an account?{" "}
//             <Link to="/login">Login here</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;






// import React from "react";
// import "./Register.scss";

// const Register = () => {
//   return (
//     <div className="register-page">

//       {/* LEFT VIDEO SECTION */}
//       <div className="video-section">
//         <video
//           src="/videos/register-bg.mp4"
//           autoPlay
//           loop
//           muted
//           playsInline
//         />
//         <div className="video-dark-overlay"></div>
//       </div>

//       {/* RIGHT REGISTER SECTION */}
//       <div className="form-section">
//         <div className="register-card">
//           <h2>Create Account</h2>
//           <p className="subtitle">
//             Join NurseBot – Your AI Care Partner
//           </p>

//           <form>
//             <input type="text" placeholder="Full Name" />
//             <input type="email" placeholder="Email Address" />
//             <input type="password" placeholder="Password" />
//             <input type="password" placeholder="Confirm Password" />

//             <button type="submit">Register</button>
//           </form>

//           <p className="secure-text">
//             🔒 Your data is safe & encrypted
//           </p>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Register;















// import React, { useState } from "react";
// import "./Register.scss";
// import { Link, useNavigate } from "react-router-dom";
// import ApiService from "../../services/Api.service";
// import { toast } from "react-toastify";

// const Register = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone_number: "",
//     company_name: "",
//     password: "",
//     confirm_password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const {
//       name,
//       email,
//       phone_number,
//       company_name,
//       password,
//       confirm_password,
//     } = formData;

//     if (
//       !name ||
//       !email ||
//       !phone_number ||
//       !company_name ||
//       !password ||
//       !confirm_password
//     ) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       toast.error("Invalid email address");
//       return;
//     }

//     if (!/^[0-9]{10}$/.test(phone_number)) {
//       toast.error("Phone number must be 10 digits");
//       return;
//     }

//     if (password !== confirm_password) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     setLoading(true);

//     const { data, error } = await ApiService.register({
//       name,
//       email,
//       phone_number,
//       company_name,
//       password,
//     });

//     setLoading(false);

//     if (error) {
//       toast.error(error.response?.data?.error || "Registration failed");
//       return;
//     }

//     toast.success("Registered successfully");
//     navigate("/login");
//   };

//   return (
//     <div className="register-page">

//       {/* LEFT VIDEO SECTION */}
//       <div className="video-section">
//         <video
//           src="/videos/register-bg.mp4"
//           autoPlay
//           loop
//           muted
//           playsInline
//         />
//         <div className="video-dark-overlay"></div>
//       </div>

//       {/* RIGHT FORM SECTION */}
//       <div className="form-section">
//         <div className="register-card">
//           <h2>Create Account</h2>
//           <p className="subtitle">
//             Join NurseBot – Your AI Care Partner
//           </p>

//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//             />

//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//             />

//             <input
//               type="text"
//               name="phone_number"
//               placeholder="Phone Number"
//               value={formData.phone_number}
//               onChange={handleChange}
//             />

//             <input
//               type="text"
//               name="company_name"
//               placeholder="Hospital / Company Name"
//               value={formData.company_name}
//               onChange={handleChange}
//             />

//             <input
//               type="password"
//               name="password"
//               placeholder="Create Password"
//               value={formData.password}
//               onChange={handleChange}
//             />

//             <input
//               type="password"
//               name="confirm_password"
//               placeholder="Confirm Password"
//               value={formData.confirm_password}
//               onChange={handleChange}
//             />

//             <button type="submit" disabled={loading}>
//               {loading ? "Registering..." : "Create Account"}
//             </button>
//           </form>

//           <p className="secure-text">
//             🔒 Your data is safe & encrypted
//           </p>

//           <p className="login-link">
//             Already have an account?{" "}
//             <Link to="/login">Login</Link>
//           </p>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Register;





















import React, { useState } from "react";
import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../services/Api.service";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    company_name: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ PHONE NUMBER: only digits & max 10
    if (name === "phone_number") {
      if (!/^\d*$/.test(value)) {
        toast.error("Only digits are allowed");
        return;
      }

      if (value.length > 10) {
        toast.error("Phone number must be exactly 10 digits");
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      phone_number,
      company_name,
      password,
      confirm_password,
    } = formData;

    if (
      !name ||
      !email ||
      !phone_number ||
      !company_name ||
      !password ||
      !confirm_password
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (phone_number.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (password !== confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await ApiService.register({
      name,
      email,
      phone_number,
      company_name,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.response?.data?.error || "Registration failed");
      return;
    }

    toast.success("Registered successfully");
    navigate("/login");
  };

  return (
    <div className="register-page">

      {/* LEFT VIDEO SECTION */}
      <div className="video-section">
        <video
          src="/videos/register-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="video-dark-overlay"></div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="form-section">
        <div className="register-card">
          <h2>Create Account</h2>
          <p className="subtitle">
            Join NurseBot – Your AI Care Partner
          </p>

          <form onSubmit={handleSubmit}>

            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Phone Number</label>
            <input
              type="text"
              name="phone_number"
              placeholder="Enter 10 digit phone number"
              value={formData.phone_number}
              onChange={handleChange}
            />

            <label>Hospital / Company Name</label>
            <input
              type="text"
              name="company_name"
              placeholder="Enter hospital or company name"
              value={formData.company_name}
              onChange={handleChange}
            />

            <label>Create Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Re-enter your password"
              value={formData.confirm_password}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <p className="secure-text">
            🔒 Your data is safe & encrypted
          </p>

          <p className="login-link">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;
