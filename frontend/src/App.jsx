import { useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  const [page, setPage] = useState(document.cookie.includes("email=") ? "home" : "login");
  const [verificationEmail, setVerificationEmail] = useState("");

  if (page === "home") {
    return <Home onLogout={() => setPage("login")} />;
  }

  if (page === "verify") {
    return <VerifyOTP email={verificationEmail} onSuccess={() => setPage("home")} onBack={() => setPage("register")} />;
  }

  return page === "login" ? (
    <Login onSuccess={() => setPage("home")} onRegister={() => setPage("register")} />
  ) : (
    <Register onSuccess={(email) => { setVerificationEmail(email); setPage("verify"); }} onLogin={() => setPage("login")} />
  );
}