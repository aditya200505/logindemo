import { useState } from "react";
import { request } from "../api.js";

export default function VerifyOTP({ email, onSuccess, onBack }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await request("/verify-otp", { method: "POST", body: JSON.stringify({ email, otp }) });
      onSuccess();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return <main className="shell"><section className="intro"><p className="eyebrow">EMAIL VERIFICATION</p><h1>One last<br /><em>step.</em></h1><p className="tagline">We sent a six-digit code to {email}.</p></section><section className="panel"><p className="eyebrow">VERIFY EMAIL</p><h2>Enter your code</h2><form onSubmit={submit}><label>Verification code<input inputMode="numeric" pattern="[0-9]{6}" maxLength="6" required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} /></label>{error && <p className="error">{error}</p>}<button className="primary" type="submit">{loading ? "Verifying..." : "Verify email"}</button></form><p className="form-footer"><button type="button" className="link" onClick={onBack}>Use a different email</button></p></section></main>;
}