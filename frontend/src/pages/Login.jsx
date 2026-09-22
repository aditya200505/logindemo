import { useState } from "react";
import { request } from "../api.js";

export default function Login({ onSuccess, onRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await request("/login", { method: "POST", body: JSON.stringify(form) });
      onSuccess();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm title="Welcome back" submitLabel={loading ? "Signing in..." : "Sign in"} form={form} setForm={setForm} onSubmit={submit} error={error} footer={<>New here? <button type="button" className="link" onClick={onRegister}>Create an account</button></>} />;
}

function AuthForm({ title, submitLabel, form, setForm, onSubmit, error, footer }) {
  return <main className="shell"><section className="intro"><p className="eyebrow">SECURE ACCESS</p><h1>Your space,<br /><em>waiting.</em></h1><p className="tagline">A simple, private place to pick up where you left off.</p></section><section className="panel"><p className="eyebrow">ACCOUNT</p><h2>{title}</h2><form onSubmit={onSubmit}><label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Password<input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>{error && <p className="error">{error}</p>}<button className="primary" type="submit">{submitLabel}</button></form><p className="form-footer">{footer}</p></section></main>;
}