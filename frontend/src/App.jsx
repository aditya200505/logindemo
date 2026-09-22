import { useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  const [page, setPage] = useState(document.cookie.includes("email=" ) ? "home" : "login");

  if (page === "home") {
    return <Home onLogout={() => setPage("login")} />;
  }

  return page === "login" ? (
    <Login onSuccess={() => setPage("home")} onRegister={() => setPage("register")} />
  ) : (
    <Register onSuccess={() => setPage("home")} onLogin={() => setPage("login")} />
  );
}