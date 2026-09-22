import { request } from "../api.js";

export default function Home({ onLogout }) {
  const email = decodeURIComponent(document.cookie.match(/(?:^|; )email=([^;]*)/)?.[1] || "account");

  const logout = async () => {
    await request("/logout", { method: "POST" });
    onLogout();
  };

  return <main className="home"><p className="eyebrow">ACCOUNT HOME</p><h1>Good to see you,<br /><em>{email}</em></h1><p className="tagline">You are signed in and ready to go.</p><button className="primary compact" onClick={logout}>Sign out</button></main>;
}