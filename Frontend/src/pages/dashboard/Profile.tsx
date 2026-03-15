import { useEffect, useState } from "react";
import { User, Mail, Briefcase, Globe2, FileText, DollarSign } from "lucide-react";

const API = "http://localhost:5000";

type Role = "client" | "freelancer";

interface BaseProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface FreelancerProfile extends BaseProfile {
  bio?: string;
  skills?: string;
  portfolio?: string;
  experience?: string;
  hourly_rate?: number | null;
}

interface ClientProfile extends BaseProfile {
  company_name?: string;
  industry?: string;
  bio?: string;
}

type ProfileData = FreelancerProfile | ClientProfile | null;

const Profile = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const [profile, setProfile] = useState<ProfileData>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const isFreelancer = user?.role === "freelancer";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } as ProfileData : prev));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !profile) return;
    setSaving(true);
    try {
      const body: any = {};
      if (isFreelancer) {
        const p = profile as FreelancerProfile;
        body.bio = p.bio ?? "";
        body.skills = p.skills ?? "";
        body.portfolio = p.portfolio ?? "";
        body.experience = p.experience ?? "";
        body.hourly_rate = p.hourly_rate ?? null;
      } else {
        const p = profile as ClientProfile;
        body.company_name = p.company_name ?? "";
        body.industry = p.industry ?? "";
        body.bio = p.bio ?? "";
      }

      const res = await fetch(`${API}/api/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message ?? "Failed to update profile");
        return;
      }

      setEditing(false);
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-sm text-muted-foreground">No profile data available.</p>;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold mb-1">Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your personal and professional details</p>
        </div>
        <button
          onClick={() => setEditing((prev) => !prev)}
          className="gradient-btn px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-lg font-semibold">
            {profile.name?.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
              <User size={18} className="text-primary" /> {profile.name}
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail size={14} /> {profile.email}
            </p>
            <p className="text-xs mt-1">
              Role: <span className="font-medium capitalize">{profile.role}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {isFreelancer ? (
            <>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Bio</label>
                <textarea
                  disabled={!editing}
                  value={(profile as FreelancerProfile).bio ?? ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none disabled:opacity-75"
                  placeholder="Tell clients about yourself..."
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Skills</label>
                <input
                  disabled={!editing}
                  value={(profile as FreelancerProfile).skills ?? ""}
                  onChange={(e) => handleChange("skills", e.target.value)}
                  placeholder="e.g. React, Node.js, UI/UX"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-75"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Portfolio URL</label>
                <input
                  disabled={!editing}
                  value={(profile as FreelancerProfile).portfolio ?? ""}
                  onChange={(e) => handleChange("portfolio", e.target.value)}
                  placeholder="Link to your portfolio or website"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-75"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Experience</label>
                <textarea
                  disabled={!editing}
                  value={(profile as FreelancerProfile).experience ?? ""}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  rows={3}
                  placeholder="Summarize your professional experience..."
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none disabled:opacity-75"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block flex items-center gap-1">
                  <DollarSign size={14} /> Hourly Rate (USD)
                </label>
                <input
                  type="number"
                  disabled={!editing}
                  value={(profile as FreelancerProfile).hourly_rate ?? ""}
                  onChange={(e) => handleChange("hourly_rate", e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-75"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block flex items-center gap-1">
                  <Briefcase size={14} /> Company Name
                </label>
                <input
                  disabled={!editing}
                  value={(profile as ClientProfile).company_name ?? ""}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  placeholder="Your company or organization"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-75"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block flex items-center gap-1">
                  <Globe2 size={14} /> Industry
                </label>
                <input
                  disabled={!editing}
                  value={(profile as ClientProfile).industry ?? ""}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  placeholder="e.g. SaaS, E-commerce, Fintech"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-75"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block flex items-center gap-1">
                  <FileText size={14} /> Bio
                </label>
                <textarea
                  disabled={!editing}
                  value={(profile as ClientProfile).bio ?? ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  rows={3}
                  placeholder="Describe your company and the kind of work you do..."
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none disabled:opacity-75"
                />
              </div>
            </>
          )}

          {editing && (
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="gradient-btn px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;

