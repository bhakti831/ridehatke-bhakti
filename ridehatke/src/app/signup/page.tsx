"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"details" | "otp">("details");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && identifier) {
      setStep("otp");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "1234") { 
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, identifier })
        });
        
        const data = await res.json();
        
        if (res.ok) {
          alert(`Sign up successful! Welcome to RideHatke, ${firstName}.`);
          router.push("/");
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        alert("Failed to connect to the server.");
      }
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
          <h1 className="panel-title">Create Account</h1>
          
          {step === "details" ? (
            <form onSubmit={handleSendOtp}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">First Name</label>
                  <span className="input-icon">👤</span>
                  <input 
                    type="text" 
                    className="text-input" 
                    placeholder="First" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Last Name</label>
                  <input 
                    type="text" 
                    className="text-input" 
                    style={{ paddingLeft: '1.25rem' }}
                    placeholder="Last" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
              <button type="submit" className="btn-primary">Verify & Create Account</button>
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
            Already have an account? <Link href="/login" style={{ color: '#EC4899', fontWeight: 'bold', textDecoration: 'none' }}>Log in</Link>
          </div>
        </div>
      </div>
    </>
  );
}
