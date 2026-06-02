"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"details" | "otp">("details");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier) {
      setStep("otp");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "1234") { // Mock OTP validation
      alert("Login successful!");
      router.push("/");
    } else {
      alert("Invalid OTP (Hint: use 1234)");
    }
  };

  return (
    <>
      <div className="bg-image"></div>
      <div className="bg-overlay"></div>

      <header className="top-nav">
        <div className="top-nav-left">
          <Link href="/" className="nav-logo" style={{ textDecoration: 'none' }}>RideHatke</Link>
        </div>
        <div className="top-nav-right">
          <Link href="/help" className="nav-link hide-mobile">Help</Link>
          <button className="theme-toggle nav-theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <div className="container">
        <div className="glass-panel animate-slide-up">
          <h1 className="panel-title">Welcome Back</h1>
          
          {step === "details" ? (
            <form onSubmit={handleSendOtp}>
              <div className="input-group">
                <label className="input-label">Email or Phone Number</label>
                <span className="input-icon">📱</span>
                <input 
                  type="text" 
                  className="text-input" 
                  placeholder="Enter email or phone" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Send OTP</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="animate-fade-in">
              <div className="input-group">
                <label className="input-label">Enter OTP sent to {identifier}</label>
                <span className="input-icon">🔐</span>
                <input 
                  type="text" 
                  className="text-input" 
                  placeholder="Enter 4-digit OTP" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Verify & Login</button>
              <button 
                type="button" 
                onClick={() => setStep("details")} 
                style={{ 
                  marginTop: '1rem', 
                  width: '100%', 
                  padding: '1rem', 
                  background: 'transparent', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--text-primary)', 
                  borderRadius: '20px', 
                  cursor: 'pointer',
                  fontSize: '1.125rem',
                  fontWeight: 600
                }}
              >
                Back
              </button>
            </form>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link href="/signup" style={{ color: '#EC4899', fontWeight: 'bold', textDecoration: 'none' }}>Sign up</Link>
          </div>
        </div>
      </div>
    </>
  );
}
