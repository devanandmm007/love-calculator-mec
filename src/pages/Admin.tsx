import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowLeft, Search, Heart, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import FloatingHearts from "@/components/FloatingHearts";
import couplePastel from "@/assets/couple-pastel.jpg";

interface LoveEntry {
  id: string;
  name1: string;
  name2: string;
  love_score: number;
  image_url: string | null;
  created_at: string;
}

const Admin = () => {
  const [entries, setEntries] = useState<LoveEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        // Check admin role
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin");
        const hasAdmin = (data && data.length > 0);
        setIsAdmin(hasAdmin);
        if (hasAdmin) fetchEntries();
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setAuthChecking(false);
    });

    supabase.auth.getSession();

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setEntries([]);
  };

  const fetchEntries = async (search?: string) => {
    setLoading(true);
    let query = supabase
      .from("love_calculations")
      .select("*")
      .order("created_at", { ascending: false });

    if (search?.trim()) {
      query = query.or(`name1.ilike.%${search.trim()}%,name2.ilike.%${search.trim()}%`);
    }

    const { data } = await query;
    setEntries((data as LoveEntry[]) || []);
    setCurrentIndex(0);
    setLoading(false);
  };

  const handleSearch = () => fetchEntries(searchQuery);

  const entry = entries[currentIndex];

  // Loading auth state
  if (authChecking) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center">
        <FloatingHearts count={8} />
        <Heart className="animate-pulse text-primary" size={40} />
      </div>
    );
  }

  // Login form
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        <FloatingHearts count={8} />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="card-romantic w-full max-w-sm p-8 space-y-6">
            <div className="text-center">
              <Heart className="text-primary mx-auto mb-3" size={32} />
              <h1 className="font-script text-4xl text-primary glow-text mb-1">Admin</h1>
              <p className="text-muted-foreground font-display text-sm">Sign in to view love history</p>
            </div>

            {isAuthenticated && !isAdmin && (
              <div className="text-center text-sm text-destructive bg-destructive/10 rounded-xl p-3">
                You don't have admin access.
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border/50 text-foreground placeholder:text-muted-foreground/60 font-display text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border/50 text-foreground placeholder:text-muted-foreground/60 font-display text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              {authError && (
                <p className="text-sm text-destructive text-center">{authError}</p>
              )}
              <button
                type="submit"
                disabled={authLoading}
                className="btn-romantic w-full text-sm font-display disabled:opacity-50"
              >
                {authLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <button
              onClick={() => navigate("/")}
              className="w-full text-center text-sm text-muted-foreground/60 hover:text-primary transition-colors font-display"
            >
              ← Back to Calculator
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <FloatingHearts count={8} />

      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-full hover:bg-muted transition-all text-primary"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="font-script text-4xl text-primary glow-text">
                Love History
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-muted transition-all text-muted-foreground hover:text-primary"
              title="Sign out"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="flex gap-2 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background/60 border border-border/50 text-foreground placeholder:text-muted-foreground/60 font-display text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <button
              onClick={handleSearch}
              className="btn-romantic px-5 py-2.5 text-sm"
            >
              Search
            </button>
          </div>

          {/* Entry display */}
          {loading ? (
            <div className="text-center py-20">
              <Heart className="animate-pulse text-primary mx-auto mb-4" size={32} />
              <p className="text-muted-foreground font-display">Loading entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="card-romantic text-center py-16 px-8">
              <Heart className="text-primary/30 mx-auto mb-4" size={48} />
              <p className="text-muted-foreground font-display text-lg">
                No love calculations yet
              </p>
            </div>
          ) : entry ? (
            <div className="card-romantic p-8 space-y-6 animate-fade-in" key={entry.id}>
              <div className="romantic-frame w-48 h-48 mx-auto">
                <img
                  src={entry.image_url || couplePastel}
                  alt="Couple"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center space-y-2">
                <h2 className="font-display text-xl text-foreground">
                  {entry.name1} <span className="font-script text-2xl text-primary mx-2">&</span> {entry.name2}
                </h2>
                <p className="font-script text-5xl text-primary glow-text">
                  {entry.love_score}%
                </p>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {new Date(entry.created_at).toLocaleString()}
              </p>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1 px-4 py-2 rounded-full border border-primary/30 text-primary font-display text-sm hover:bg-primary/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-sm text-muted-foreground font-display">
                  {currentIndex + 1} / {entries.length}
                </span>
                <button
                  onClick={() => setCurrentIndex((i) => Math.min(entries.length - 1, i + 1))}
                  disabled={currentIndex === entries.length - 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-full border border-primary/30 text-primary font-display text-sm hover:bg-primary/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Admin;
