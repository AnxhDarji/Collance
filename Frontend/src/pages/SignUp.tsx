import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const SignUp = () => {
  const [role, setRole] = useState<"client" | "freelancer">("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="glow-blob w-[400px] h-[400px] top-1/4 -left-40 animate-glow-float" />
      <div className="glow-blob w-[300px] h-[300px] bottom-1/4 -right-32 animate-glow-float-delayed" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-heading text-2xl font-bold gradient-text">Collance</Link>
          <h1 className="font-heading text-3xl font-bold mt-6 mb-2">Create your account</h1>
          <p className="text-muted-foreground">Get started with Collance for free</p>
        </div>

        <div className="glass-card p-8">
          {/* Role selector */}
          <div className="flex gap-3 mb-6">
            {(["client", "freelancer"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all border ${
                  role === r
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted text-muted-foreground hover:border-primary/30"
                }`}
              >
                {r === "client" ? "Client" : "Freelancer"}
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <button type="submit" className="w-full gradient-btn py-3 rounded-lg flex items-center justify-center gap-2 font-semibold">
              Create Account <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
