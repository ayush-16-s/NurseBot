// import React, { lazy } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";

// const Login = lazy(() => import("../pages/auth/Login"));
// const Register = lazy(() => import("../pages/auth/Register"));
// const Default = lazy(() => import("../pages/default/Default"));
// const BotList = lazy(() =>
//   import("../pages/default/components/BotList/BotList")
// );
// const FileUpload = lazy(() =>
//   import("../pages/default/components/FileUpload/FileUpload")
// );
// const ChatPage = lazy(() =>
//   import("../pages/default/components//ChatPage/ChatPage")
// );

// const MainRoute = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" replace />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         <Route
//           path="/default"
//           element={
//             // <ProtectedRoute>
//               <Default />
//             // </ProtectedRoute>
//           }
//         >
//           <Route index element={<Navigate to="bot-list" />} />

//           <Route path="bot-list" element={<BotList />} />
//           <Route path="doc-upload" element={<FileUpload />} />
//           <Route path="chat" element={<ChatPage />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default MainRoute;














import React, { lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Lazy load pages
const Landing = lazy(() => import("../pages/auth/NurseBotLanding")); // Landing page
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const Default = lazy(() => import("../pages/default/Default"));
const BotList = lazy(() =>
  import("../pages/default/components/BotList/BotList")
);
const FileUpload = lazy(() =>
  import("../pages/default/components/FileUpload/FileUpload")
);
const ChatPage = lazy(() =>
  import("../pages/default/components/ChatPage/ChatPage")
);

const MainRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page as first page */}
        <Route path="/" element={<Landing />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected / Default Routes */}
        <Route
          path="/default"
          element={
            // <ProtectedRoute>
            <Default />
            // </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="bot-list" />} />
          <Route path="bot-list" element={<BotList />} />
          <Route path="doc-upload" element={<FileUpload />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>

        {/* Fallback for unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoute;
