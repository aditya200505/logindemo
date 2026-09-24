import { useState } from "react";
import { request } from "../api.js";

export default function Register({ onSuccess, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await request("/register", { method: "POST", body: JSON.stringify(form) });
      onSuccess(form.email.trim().toLowerCase());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return <main className="shell"><section className="intro"><p className="eyebrow">SECURE ACCESS</p><h1>Start something<br /><em>good.</em></h1><p className="tagline">Create your account and keep your work close.</p></section><section className="panel"><p className="eyebrow">NEW ACCOUNT</p><h2>Create account</h2><form onSubmit={submit}><label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Password<input type="password" minLength="6" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>{error && <p className="error">{error}</p>}<button className="primary" type="submit">{loading ? "Creating..." : "Create account"}</button></form><p className="form-footer">Already registered? <button type="button" className="link" onClick={onLogin}>Sign in</button></p></section></main>;
}