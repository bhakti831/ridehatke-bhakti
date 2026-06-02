"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Ride = {
  id: string;
  provider: string;
  type: string;
  price: number;
  eta: string;
  link: string;
};

// Translation Dictionary
const translations: Record<string, Record<string, string>> = {
  EN: {
    navRide: "Ride",
    navDrive: "Drive",
    navHelp: "Help",
    navLogin: "Log in",
    navSignup: "Sign up",
    title: "Get a ride",
    pickupLabel: "Pickup",
    pickupPlaceholder: "Current Location (e.g. Connaught Place)",
    dropoffLabel: "Drop-off",
    dropoffPlaceholder: "Destination (e.g. India Gate)",
    compareBtn: "Compare Fares",
    searchingBtn: "Searching & Routing...",
    loadingText: "Finding the best options...",
    bestValue: "Best Value",
    away: "away",
    bookBtn: "Book",
  },
  HI: {
    navRide: "सवारी",
    navDrive: "ड्राइव",
    navHelp: "मदद",
    navLogin: "लॉग इन",
    navSignup: "साइन अप",
    title: "सवारी बुक करें",
    pickupLabel: "पिकअप",
    pickupPlaceholder: "वर्तमान स्थान (जैसे: Connaught Place)",
    dropoffLabel: "ड्रॉप-ऑफ़",
    dropoffPlaceholder: "मंजिल (जैसे: India Gate)",
    compareBtn: "किराये की तुलना करें",
    searchingBtn: "खोजा जा रहा है...",
    loadingText: "सर्वश्रेष्ठ विकल्प खोजे जा रहे हैं...",
    bestValue: "सर्वश्रेष्ठ मूल्य",
    away: "दूर",
    bookBtn: "बुक करें",
  }
};

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState("EN");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const t = translations[language] || translations.EN;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !dropoff) return;

    setLoading(true);
    setHasSearched(true);
    setRides([]);

    try {
      const res = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup, dropoff }),
      });
      const data = await res.json();
      if (data.results) {
        setRides(data.results);
      }
    } catch (error) {
      console.error("Failed to fetch rides", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (ride: Ride) => {
    try {
      // 1. Save the booking in our aggregator database
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: ride.provider,
          type: ride.type,
          price: ride.price,
          pickup,
          dropoff
        })
      });

      // 2. Deep Linking / App Redirect Logic
      let redirectUrl = "";
      
      if (ride.provider === "Uber") {
        // Universal Link for Uber: opens app if installed, or web if not
        redirectUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(dropoff)}`;
      } else if (ride.provider === "Ola") {
        // Web booking link for Ola
        redirectUrl = `https://book.olacabs.com/?drop_name=${encodeURIComponent(dropoff)}`;
      } else if (ride.provider === "Rapido") {
        // Rapido App Link (Fallbacks to their website)
        redirectUrl = "https://rapido.app/";
      } else if (ride.provider === "BluSmart") {
        redirectUrl = "https://blu-smart.com/";
      } else {
        redirectUrl = "https://google.com";
      }

      alert(`Redirecting you to ${ride.provider} to complete your booking!`);
      
      // Open the provider's app or website in a new tab
      window.open(redirectUrl, '_blank');

    } catch (e) {
      alert("Failed to save booking");
    }
  };

  const getProviderClass = (provider: string) => {
    const p = provider.toLowerCase();
    if (p.includes("uber")) return "provider-uber";
    if (p.includes("ola")) return "provider-ola";
    if (p.includes("rapido")) return "provider-rapido";
    if (p.includes("blusmart")) return "provider-blusmart";
    return "";
  };

  return (
    <>
      {/* Background Images */}
      <div className="bg-image"></div>
      <div className="bg-overlay"></div>

      {/* Unique Floating Top Navigation */}
      <header className="top-nav">
        <div className="top-nav-left">
          <div className="nav-logo">RideHatke</div>
          <div className="nav-links hide-mobile">
            <a href="#" className="nav-link active"><span style={{fontSize: '1.2em'}}>🚕</span> {t.navRide}</a>
            <a href="#" className="nav-link"><span style={{fontSize: '1.2em'}}>🏎️</span> {t.navDrive}</a>
          </div>
        </div>
        <div className="top-nav-right">
          <div className="nav-dropdown hide-mobile">
            <button className="nav-link dropdown-toggle" aria-haspopup="true">
              🌐 {language} <span style={{fontSize: '0.6em', marginLeft: '4px'}}>▼</span>
            </button>
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => setLanguage('EN')}>English (EN)</button>
              <button className="dropdown-item" onClick={() => setLanguage('HI')}>हिंदी (Hindi)</button>
            </div>
          </div>
          <Link href="/help" className="nav-link hide-mobile">{t.navHelp}</Link>
          <Link href="/login" className="nav-link hide-mobile">{t.navLogin}</Link>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button className="nav-btn-signup">{t.navSignup}</button>
          </Link>
          <button 
            className="theme-toggle nav-theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <div className="container">
        <div className="glass-panel animate-slide-up">
          <h1 className="panel-title">{t.title}</h1>
          
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <label className="input-label">{t.pickupLabel}</label>
              <span className="input-icon">📍</span>
              <input 
                type="text" 
                className="text-input" 
                placeholder={t.pickupPlaceholder} 
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">{t.dropoffLabel}</label>
              <span className="input-icon">🏁</span>
              <input 
                type="text" 
                className="text-input" 
                placeholder={t.dropoffPlaceholder} 
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t.searchingBtn : t.compareBtn}
            </button>
          </form>

          {/* Results Section */}
          {loading && (
            <div className="loader-container">
              <div className="loader"></div>
              <span className="loader-text">{t.loadingText}</span>
            </div>
          )}

          {!loading && hasSearched && rides.length > 0 && (
            <div className="results-container">
              {rides.map((ride, index) => {
                const isCheapest = index === 0;
                return (
                  <div 
                    key={ride.id} 
                    className={`result-card ${isCheapest ? 'highlight-cheapest' : ''}`} 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`provider-info ${getProviderClass(ride.provider)}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="provider-name">{ride.provider}</span>
                        {isCheapest && <span className="badge-cheapest">🏆 {t.bestValue}</span>}
                      </div>
                      <span className="ride-type">{ride.type}</span>
                    </div>
                    
                    <div className="price-info">
                      <span className="price">₹{ride.price}</span>
                      <span className="eta">{ride.eta} {t.away}</span>
                    </div>

                    <button onClick={() => handleBook(ride)} className="btn-book">
                      {t.bookBtn}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
