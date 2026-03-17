import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Briefcase, Code2 } from "lucide-react";
import { buildApiUrl } from "@/lib/api";

const SelectRole = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelect = async (role: "client" | "freelancer") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl("/api/user/set-role"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to set role");

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...user, role: data.user.role }));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success(`You joined as a ${role}!`);
      navigate("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to set role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="glow-blob w-[400px] h-[400px] top-1/4 -left-40 animate-glow-float" />
      <div className="glow-blob w-[300px] h-[300px] bottom-1/4 -right-32 animate-glow-float-delayed" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="font-heading text-2xl font-bold gradient-text">Collance</span>
          <h1 className="font-heading text-3xl font-bold mt-6 mb-2">Choose your role</h1>
          <p className="text-muted-foreground">How will you be using Collance?</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSelect("client")}
            disabled={loading}
            className="glass-card p-8 flex flex-col items-center gap-4 hover:border-primary/60 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Briefcase size={40} className="text-primary" />
            <div className="text-center">
              <p className="font-heading font-bold text-lg">Client</p>
              <p className="text-sm text-muted-foreground mt-1">Manage freelancers and projects.</p>
            </div>
          </button>

          <button
            onClick={() => handleSelect("freelancer")}
            disabled={loading}
            className="glass-card p-8 flex flex-col items-center gap-4 hover:border-primary/60 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Code2 size={40} className="text-primary" />
            <div className="text-center">
              <p className="font-heading font-bold text-lg">Freelancer</p>
              <p className="text-sm text-muted-foreground mt-1">Work on projects and complete assigned tasks.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
