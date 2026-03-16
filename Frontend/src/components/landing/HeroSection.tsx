import { useState, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const words = ["Projects", "Freelancers", "Team", "Workflow"];

const HeroSection = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const currentWord = words[wordIndex];

  const tick = useCallback(() => {
    if (!deleting) {
      if (displayed.length < currentWord.length) {
        setDisplayed(currentWord.slice(0, displayed.length + 1));
      } else {
        setTimeout(() => setDeleting(true), 1500);
      }
    } else {
      if (displayed.length > 0) {
        setDisplayed(currentWord.slice(0, displayed.length - 1));
      } else {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }
    }
  }, [displayed, deleting, currentWord, wordIndex]);

  useEffect(() => {
    const speed = deleting ? 50 : 100;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, deleting]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Glow blobs */}
      <div className="glow-blob w-[500px] h-[500px] top-1/4 -left-40 animate-glow-float" />
      <div className="glow-blob w-[400px] h-[400px] bottom-1/4 -right-32 animate-glow-float-delayed" />
      <div className="glow-blob w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 opacity-10" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="animate-fade-in-up">
          <p className="text-sm font-medium text-primary mb-6 tracking-widest uppercase">
            Freelance collaboration, simplified
          </p>
        </div>

        <h1
          className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 whitespace-nowrap tracking-tight"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="animate-fade-in-up">Manage your{" "}</span>
          <span className="gradient-text">
            {displayed}
            <span
              className="inline-block w-[3px] h-[0.9em] ml-1 align-middle border-r-2"
              style={{ animation: "typing-cursor 1s step-end infinite", borderColor: "hsl(var(--primary))" }}
            />
          </span>
        </h1>

        <p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          Collance is the modern workspace where clients and freelancers collaborate,
          assign tasks, and track project progress in one place.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center gap-3 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <form
            className="flex flex-col sm:flex-row items-center gap-3 justify-center w-full"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/signup?email=${encodeURIComponent(email)}`);
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full sm:w-80 px-5 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
            <button type="submit" className="gradient-btn px-6 py-3 rounded-xl flex items-center gap-2 font-semibold whitespace-nowrap">
              Start Free <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
