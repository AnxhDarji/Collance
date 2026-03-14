import { Briefcase, Users, CheckSquare, Activity } from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Project Workspace",
    desc: "Manage all your projects in one dashboard.",
  },
  {
    icon: Users,
    title: "Freelancer Collaboration",
    desc: "Invite freelancers using a unique project ID.",
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    desc: "Assign tasks, set deadlines, and track progress.",
  },
  {
    icon: Activity,
    title: "Real-time Updates",
    desc: "Monitor task completion and project activity.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="relative py-32 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Features</p>
        <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
          Everything you need to <span className="gradient-text">collaborate</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Powerful tools designed for seamless freelance project management.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="glass-card-hover p-6 group"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <f.icon size={24} className="text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
