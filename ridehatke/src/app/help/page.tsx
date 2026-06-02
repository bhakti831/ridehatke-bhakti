"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Help() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const faqs = [
    { q: "How does RideHatke compare prices?", a: "We aggregate real-time pricing data from major providers like Uber, Ola, and Rapido to find you the best deal based on your exact route." },
    { q: "How do I book a ride?", a: "Simply enter your pickup and drop-off locations, click Compare Fares, and click Book on your preferred option." },
    { q: "Is there a cancellation fee?", a: "Cancellation policies depend entirely on the specific provider (Uber, Ola, etc.) you choose to book with." },
    { q: "Are my personal details secure?", a: "Yes, we use industry-standard encryption and do not share your raw location data with advertisers." }
  ];

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSubmitted(true);
      setQuery("");
      setTimeout(() => setSubmitted(false), 3000); // Reset success state after 3s
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
          <Link href="/login" className="nav-link hide-mobile">Log in</Link>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button className="nav-btn-signup">Sign up</button>
          </Link>
          <button className="theme-toggle nav-theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <div className="container" style={{ maxWidth: '650px' }}>
        <div className="glass-panel animate-slide-up" style={{ padding: '40px' }}>
          <h1 className="panel-title" style={{ marginBottom: '1rem' }}>Help & Support</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            We're here to help you get the most out of RideHatke.
          </p>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '16px', 
                  padding: '1.25rem', 
                  border: '1px solid var(--border-color)', 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }} 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {faq.q}
                  <span style={{ color: '#EC4899', fontSize: '1.2rem', lineHeight: 1 }}>{openFaq === idx ? "−" : "+"}</span>
                </div>
                {openFaq === idx && (
                  <div style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }} className="animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Ask a Query</h2>
          <form onSubmit={handleQuerySubmit}>
             <textarea 
               className="text-input" 
               style={{ 
                 minHeight: '150px', 
                 padding: '1.25rem', 
                 resize: 'vertical',
                 fontFamily: 'inherit'
               }} 
               placeholder="Describe your issue or ask a question..." 
               value={query} 
               onChange={(e) => setQuery(e.target.value)} 
               required
             />
             <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
               {submitted ? "Query Sent! We'll email you soon ✅" : "Submit Query"}
             </button>
          </form>
        </div>
      </div>
    </>
  );
}
