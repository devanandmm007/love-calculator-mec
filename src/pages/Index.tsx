import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Upload, Music, VolumeX } from "lucide-react";
import FloatingHearts from "@/components/FloatingHearts";
import coupleSunset from "@/assets/couple-sunset.jpg";
import { supabase } from "@/integrations/supabase/client";
import { calculateLove } from "@/lib/loveCalculator";

const Index = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("https://www.bensound.com/bensound-music/bensound-love.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setMusicPlaying(!musicPlaying);
  };

  const handleCalculate = async () => {
    if (!name1.trim() || !name2.trim()) return;
    setLoading(true);

    try {
      let imageUrl: string | null = null;

      if (photo) {
        const ext = photo.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("couple-photos")
          .upload(fileName, photo);

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from("couple-photos")
            .getPublicUrl(uploadData.path);
          imageUrl = urlData.publicUrl;
        }
      }

      const score = calculateLove(name1, name2);

      await supabase.from("love_calculations").insert({
        name1: name1.trim(),
        name2: name2.trim(),
        love_score: score,
        image_url: imageUrl,
      });

      navigate("/result", {
        state: { name1, name2, score, imageUrl },
      });
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${coupleSunset})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <FloatingHearts />

      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-card/80 backdrop-blur border border-border/50 text-primary transition-all hover:scale-110"
        aria-label="Toggle music"
      >
        {musicPlaying ? <Music size={20} /> : <VolumeX size={20} />}
      </button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="animate-fade-in text-center mb-8">
          <h1 className="font-script text-6xl md:text-8xl text-primary glow-text mb-2">
            Love Calculator
          </h1>
          <p className="text-muted-foreground font-display text-lg italic">
            Discover the magic between two hearts
          </p>
        </div>

        <div
          className="card-romantic w-full max-w-md p-8 space-y-6 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="space-y-4">
            <div className="relative">
              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
              <input
                type="text"
                placeholder="Your name..."
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/60 border border-border/50 text-foreground placeholder:text-muted-foreground/60 font-display focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            <div className="flex justify-center">
              <span className="font-script text-3xl text-primary">&</span>
            </div>

            <div className="relative">
              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
              <input
                type="text"
                placeholder="Their name..."
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/60 border border-border/50 text-foreground placeholder:text-muted-foreground/60 font-display focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Photo upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 py-4 rounded-xl border-2 border-dashed border-primary/30 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Couple preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-gold/50"
              />
            ) : (
              <Upload className="text-primary/40" size={28} />
            )}
            <span className="text-sm text-muted-foreground">
              {photo ? photo.name : "Upload your couple photo (optional)"}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          <button
            onClick={handleCalculate}
            disabled={!name1.trim() || !name2.trim() || loading}
            className="btn-romantic w-full text-lg font-display disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Heart className="animate-pulse" size={18} /> Calculating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Heart size={18} /> Calculate Love
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Index;
