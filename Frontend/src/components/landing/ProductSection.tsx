import { Activity, Briefcase, CheckSquare, Users } from "lucide-react";

const productFeatures = [
  {
    icon: Briefcase,
    title: "Project Workspace",
    desc: "Create dedicated workspaces for every project. Manage freelancers, tasks, and collaboration in one organized place.",
  },
  {
    icon: CheckSquare,
    title: "Task Assignment",
    desc: "Assign tasks to freelancers, set priorities, and track completion progress easily.",
  },
  {
    icon: Users,
    title: "Freelancer Requests",
    desc: "Freelancers can request to join projects and clients can accept or decline requests directly from the dashboard.",
  },
  {
    icon: Activity,
    title: "Analytics Dashboard",
    desc: "Track project performance, active freelancers, completed tasks, and overall productivity.",
  },
];

const ProductSection = () => (
  <section id="product" className="relative py-32 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Product</p>
        <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
          Built for modern <span className="gradient-text">collaboration</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Collance brings project workspaces, task tracking, and client-freelancer workflows together in one place.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productFeatures.map((f, i) => (
          <div key={f.title} className="glass-card-hover p-6 group" style={{ animationDelay: `${i * 0.1}s` }}>
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

export default ProductSection;

