import React, { useState, useEffect, useRef } from "react";
import { invitationData } from "./data/content";

// 🎨 Hardcode your desired theme index here
// 0 = Champagne, 1 = Emerald, 2 = Sapphire
const ACTIVE_THEME_INDEX = 0;

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealedEvents, setRevealedEvents] = useState({});
  const [isBreaking, setIsBreaking] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const audioRef = useRef(null);
  const pressTimer = useRef(null);

  const activeTheme = invitationData.themes[ACTIVE_THEME_INDEX];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const startPress = () => {
    if (isUnlocked || isBreaking) return;
    pressTimer.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(pressTimer.current);
          handleUnlock();
          return 100;
        }
        return prev + 2;
      });
    }, 20);
  };

  const stopPress = () => {
    if (pressTimer.current) clearInterval(pressTimer.current);
    if (holdProgress < 100 && !isBreaking) setHoldProgress(0);
  };

  const handleUnlock = () => {
    setIsBreaking(true);
    setTimeout(() => {
      setIsUnlocked(true);
      if (audioRef.current) {
        audioRef.current
          .play()
          .catch(() => console.log("Audio autoplay blocked"));
        setIsPlaying(true);
      }
    }, 800);
  };

  const toggleAudio = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const toggleEventReveal = (id) =>
    setRevealedEvents((prev) => ({ ...prev, [id]: true }));

  // Fallback venue data in case it's not present in invitationData
  const venue = invitationData.venue || {
    name: "The Grand Palace Hall",
    address: "123 Heritage Lane, City Center",
    mapsUrl: "https://maps.google.com/?q=The+Grand+Palace+Hall",
  };

  return (
    <div
      className="min-h-screen font-sans transition-colors duration-700 selection:bg-[var(--accent)] selection:text-white"
      style={{
        "--bg-color": isDarkMode ? activeTheme.darkBg : activeTheme.lightBg,
        "--text-color": isDarkMode
          ? activeTheme.darkText
          : activeTheme.lightText,
        "--accent": activeTheme.accent,
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      <audio ref={audioRef} loop src={invitationData.couple.backgroundMusic} />

      {/* Dynamic Top Navigation */}
      <nav
        className={`fixed top-0 w-full px-6 py-4 flex justify-between items-center z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-[var(--bg-color)] shadow-md"
            : "text-white bg-[var(--bg-color)]/0"
        }`}
      >
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`w-10 h-10 rounded-full border flex items-center justify-center hover:scale-110 transition-colors duration-700 ${
            isScrolled ? "border-[var(--text-color)]" : "border-gray-400"
          }`}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        <div className="font-serif tracking-widest text-lg opacity-80">
          {invitationData.couple.initials}
        </div>

        <button
          onClick={toggleAudio}
          className={`w-10 h-10 rounded-full border flex items-center justify-center hover:scale-110 transition-colors duration-700 ${
            isScrolled ? "border-[var(--text-color)]" : "border-gray-400"
          }`}
        >
          {isPlaying ? "🔊" : "🔇"}
        </button>
      </nav>

      {!isUnlocked ? (
        /* --- LOCK SCREEN --- */
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={invitationData.couple.mainImage}
              alt="Couple"
              className="w-full h-full object-cover opacity-40 grayscale-[20%]"
            />
            <div
              className="absolute inset-0 transition-colors duration-700"
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(0,0,0,0.75)"
                  : "rgba(255,255,255,0.75)",
              }}
            ></div>
          </div>

          <div className="z-10 flex flex-col items-center">
            <p className="text-[var(--accent)] text-sm tracking-[0.3em] uppercase mb-12 font-medium transition-colors duration-700">
              The Invitation Awaits
            </p>

            <div
              onMouseDown={startPress}
              onMouseUp={stopPress}
              onMouseLeave={stopPress}
              onTouchStart={startPress}
              onTouchEnd={stopPress}
              className="relative w-32 h-32 flex items-center justify-center cursor-pointer group"
            >
              <svg
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke={isDarkMode ? "#333" : "#e5e5e5"}
                  strokeWidth="1"
                  className="transition-colors duration-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeDasharray="301.59"
                  strokeDashoffset={((100 - holdProgress) * 301.59) / 100}
                  className="transition-all duration-75 ease-linear"
                />
              </svg>

              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDarkMode ? "bg-white text-black" : "bg-[#1a1a1a] text-white"
                } ${holdProgress > 0 ? "scale-90" : "scale-100"}`}
              >
                {isBreaking ? (
                  <svg
                    className="w-8 h-8 animate-ping"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                )}
              </div>
            </div>

            <p className="mt-8 text-xs tracking-widest uppercase opacity-60">
              Hold to break the seal
            </p>
          </div>
        </div>
      ) : (
        /* --- MAIN INVITATION CONTENT --- */
        <div className="animate-fadeIn relative">
          {/* Header Section */}
          <header className="relative min-h-[100svh] flex flex-col items-center text-center px-6 pt-24 pb-6">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={invitationData.couple.mainImage}
                alt="Couple"
                className="w-full h-full object-cover opacity-80 md:opacity-90 animate-fadeIn"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-color)]/60 to-[var(--bg-color)]"></div>
            </div>

            <div className="z-10 flex-1 flex flex-col items-center justify-center w-full mt-10">
              <p className="text-[var(--accent)] text-sm tracking-[0.3em] uppercase mb-6 transition-colors duration-700 drop-shadow-md">
                Together with their families
              </p>
              <h1 className="font-serif text-5xl md:text-7xl font-light mb-4 text-balance drop-shadow-lg">
                {invitationData.couple.partner1} <br />
                <span className="text-3xl md:text-5xl italic text-[var(--accent)] transition-colors duration-700">
                  &
                </span>
                <br /> {invitationData.couple.partner2}
              </h1>
              <p className="font-serif italic text-lg opacity-80 mb-12 mt-6 drop-shadow-md">
                {invitationData.couple.tagline}
              </p>
              <div className="tracking-widest uppercase text-xs border-t border-b border-[var(--text-color)] py-3 px-8 inline-block opacity-80 transition-colors duration-700 bg-[var(--bg-color)]/30 backdrop-blur-sm">
                {invitationData.couple.dateLocation}
              </div>
            </div>

            <div className="z-10 mt-auto pt-8 text-[10px] tracking-widest uppercase opacity-60 animate-bounce">
              Scroll
              <div className="w-[1px] h-8 bg-current mx-auto mt-2"></div>
            </div>
          </header>

          {/* Faded Edge Transition Image */}
          <section className="w-full mt-10 md:mt-16 relative z-10 flex justify-center">
            <div className="max-w-6xl mx-auto px-4 md:px-6 w-full flex justify-center">
              <div
                className="relative transition-opacity duration-1000 flex justify-center w-full"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0px, black 15px, black calc(100% - 15px), transparent 100%), linear-gradient(to bottom, transparent 0px, black 15px, black calc(100% - 50px), transparent 100%)",
                  WebkitMaskComposite: "source-in",
                  maskImage:
                    "linear-gradient(to right, transparent 0px, black 15px, black calc(100% - 15px), transparent 100%), linear-gradient(to bottom, transparent 0px, black 15px, black calc(100% - 50px), transparent 100%)",
                  maskComposite: "intersect",
                }}
              >
                <img
                  src={invitationData.couple.landscapeImage}
                  alt="Beautiful moments"
                  className="w-full h-auto object-cover opacity-90"
                />
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="max-w-4xl mx-auto px-6 py-24 text-center relative z-10 -mt-8">
            <p className="text-[var(--accent)] text-xs tracking-[0.3em] uppercase mb-12 transition-colors duration-700">
              {invitationData.story?.title}
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight font-light mb-12 text-balance">
              {invitationData.story?.heading}
            </h2>
            <p className="text-lg opacity-80 leading-relaxed max-w-2xl mx-auto mb-6 font-light">
              {invitationData.story?.paragraph1}
            </p>
            <p className="text-sm opacity-60 leading-relaxed max-w-2xl mx-auto font-light">
              {invitationData.story?.paragraph2}
            </p>
          </section>

          {/* Events Section with Integrated Countdown */}
          <section
            className="max-w-6xl mx-auto px-6 py-20 border-t"
            style={{ borderColor: "rgba(150,150,150,0.2)" }}
          >
            <div className="text-center mb-16">
              <p className="text-[var(--accent)] text-xs tracking-[0.3em] uppercase mb-4 transition-colors duration-700">
                The Days Ahead
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-light mb-8">
                Counting Down
              </h2>

              <CountdownTimer targetDate="2026-12-06T00:00:00" />
            </div>

            <div className="space-y-12 md:space-y-24">
              {invitationData.events?.map((ev, idx) => {
                const isRevealed = revealedEvents[ev.id];
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={ev.id}
                    className={`flex flex-col ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    } items-center gap-8 md:gap-16`}
                  >
                    <div
                      className={`flex-1 text-center ${
                        isEven ? "md:text-left" : "md:text-right"
                      }`}
                    >
                      <p className="text-[var(--accent)] text-xs tracking-[0.2em] uppercase mb-3 transition-colors duration-700">
                        {ev.tag}
                      </p>
                      <h3 className="font-serif text-3xl mb-4 font-light">
                        {ev.title}
                      </h3>
                      <p className="text-xs tracking-widest uppercase opacity-60 mb-6">
                        {ev.datetime}
                      </p>
                      <p className="text-sm opacity-70 leading-relaxed mb-8 font-light max-w-md mx-auto md:mx-0 inline-block">
                        {ev.description}
                      </p>
                      <br />
                      <button
                        onClick={() => toggleEventReveal(ev.id)}
                        disabled={isRevealed}
                        className={`px-8 py-3 border rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-500 ${
                          isRevealed
                            ? "border-transparent text-[var(--accent)] opacity-50 cursor-default"
                            : "border-[var(--text-color)] opacity-70 hover:opacity-100 cursor-pointer"
                        }`}
                      >
                        {isRevealed ? "Revealed" : "Unveil The Moment"}
                      </button>
                    </div>

                    <div
                      className="flex-1 w-full relative h-[400px] overflow-hidden flex items-center justify-center transition-colors duration-700"
                      style={{
                        backgroundColor: isDarkMode ? "#1a1a1a" : "#eaeaea",
                      }}
                    >
                      <img
                        src={ev.image}
                        alt={ev.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                          isRevealed ? "blur-0 scale-100" : "blur-xl scale-110"
                        }`}
                      />
                      {!isRevealed && (
                        <div
                          className="relative z-10 px-6 py-2 text-[var(--accent)] text-xs tracking-[0.3em] uppercase transition-colors duration-700"
                          style={{
                            backgroundColor: "var(--bg-color)",
                            opacity: 0.9,
                          }}
                        >
                          Not Yet Revealed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Location / Venue Section */}
          <section
            className="max-w-4xl mx-auto px-6 py-20 text-center border-t"
            style={{ borderColor: "rgba(150,150,150,0.2)" }}
          >
            <p className="text-[var(--accent)] text-xs tracking-[0.3em] uppercase mb-4 transition-colors duration-700">
              The Venue
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
              Location & Directions
            </h2>
            <p className="text-lg opacity-90 font-serif mb-2">{venue.name}</p>
            <p className="text-sm opacity-70 max-w-md mx-auto mb-8 font-light">
              {venue.address}
            </p>

            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border border-[var(--text-color)] rounded-full text-xs tracking-[0.2em] uppercase hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-all duration-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Open in Google Maps
            </a>
          </section>

          {/* Footer */}
          <footer
            className="py-12 text-center text-xs tracking-[0.2em] uppercase opacity-40 border-t"
            style={{ borderColor: "rgba(150,150,150,0.2)" }}
          >
            {invitationData.couple.partner1} & {invitationData.couple.partner2}{" "}
            • 2026
          </footer>
        </div>
      )}
    </div>
  );
}

// ⏱️ Countdown Timer Component
function CountdownTimer({ targetDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center items-center gap-4 md:gap-8 text-[var(--accent)]">
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-serif font-light">
          {String(timeLeft.days || 0).padStart(2, "0")}
        </span>
        <span className="text-[10px] md:text-xs uppercase tracking-widest mt-1 opacity-80">
          Days
        </span>
      </div>
      <span className="text-3xl md:text-4xl font-light opacity-50 pb-4">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-serif font-light">
          {String(timeLeft.hours || 0).padStart(2, "0")}
        </span>
        <span className="text-[10px] md:text-xs uppercase tracking-widest mt-1 opacity-80">
          Hours
        </span>
      </div>
      <span className="text-3xl md:text-4xl font-light opacity-50 pb-4">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-serif font-light">
          {String(timeLeft.minutes || 0).padStart(2, "0")}
        </span>
        <span className="text-[10px] md:text-xs uppercase tracking-widest mt-1 opacity-80">
          Minutes
        </span>
      </div>
      <span className="text-3xl md:text-4xl font-light opacity-50 pb-4">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-serif font-light">
          {String(timeLeft.seconds || 0).padStart(2, "0")}
        </span>
        <span className="text-[10px] md:text-xs uppercase tracking-widest mt-1 opacity-80">
          Seconds
        </span>
      </div>
    </div>
  );
}
