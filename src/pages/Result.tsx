import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Heart, ArrowLeft, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import FloatingHearts from "@/components/FloatingHearts";
import SparkleEffect from "@/components/SparkleEffect";
import { getLoveMessage, loveQuotes } from "@/lib/loveCalculator";
import couplePastel from "@/assets/couple-pastel.jpg";
import coupleGolden from "@/assets/couple-golden.jpg";

const defaultImages = [couplePastel, coupleGolden];

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    name1: string;
    name2: string;
    score: number;
    imageUrl: string | null;
  } | null;

  const [showScore, setShowScore] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [quote] = useState(() => loveQuotes[Math.floor(Math.random() * loveQuotes.length)]);

  useEffect(() => {
    if (!state) return;
    const timer = setTimeout(() => setShowScore(true), 300);
    return () => clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    if (!showScore || !state) return;
    let current = 0;
    const target = state.score;
    const interval = setInterval(() => {
      current += 1;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(interval);
      } else {
        setAnimatedScore(current);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [showScore, state]);

  if (!state) return <Navigate to="/" replace />;

  const displayImage = state.imageUrl || defaultImages[state.score % defaultImages.length];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <FloatingHearts count={25} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Names */}
        <div className="text-center mb-6 animate-fade-in">
          <h2 className="font-display text-2xl md:text-3xl text-foreground">
            {state.name1}
          </h2>
          <span className="font-script text-4xl text-primary mx-4">&</span>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">
            {state.name2}
          </h2>
        </div>

        {/* Score */}
        <div className="relative mb-8 animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <SparkleEffect active={showScore} />
          <div className="text-center">
            <span className="font-script text-8xl md:text-9xl text-primary animate-pulse-glow">
              {animatedScore}%
            </span>
          </div>
        </div>

        {/* Love message */}
        <p
          className="text-center text-lg md:text-xl font-display italic text-foreground/80 max-w-lg mb-8 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          {getLoveMessage(state.score)}
        </p>

        {/* Photo frame */}
        <div
          className="romantic-frame w-64 h-64 md:w-80 md:h-80 mb-8 animate-scale-in"
          style={{ animationDelay: "0.5s" }}
        >
          <img
            src={displayImage}
            alt="Couple"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Love quote */}
        <p
          className="text-center text-sm text-muted-foreground max-w-md italic mb-10 animate-fade-in"
          style={{ animationDelay: "0.8s" }}
        >
          {quote}
        </p>

        {/* Actions */}
        <div
          className="flex gap-4 animate-fade-in"
          style={{ animationDelay: "1s" }}
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-primary/30 text-primary font-display hover:bg-primary/10 transition-all"
          >
            <RotateCcw size={16} /> Try Again
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-border text-muted-foreground font-display hover:bg-muted transition-all"
          >
            <ArrowLeft size={16} /> All Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
