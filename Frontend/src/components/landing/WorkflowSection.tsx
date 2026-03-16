import { ArrowRightCircle, CheckCircle2, ClipboardList, Users } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Step 1 — Create a Project",
    desc: "Clients create a project workspace to manage freelancers and project tasks.",
  },
  {
    icon: Users,
    title: "Step 2 — Accept Freelancer Requests",
    desc: "Freelancers can request to join projects and clients can approve or decline those requests.",
  },
  {
    icon: ArrowRightCircle,
    title: "Step 3 — Assign Tasks",
    desc: "Clients assign tasks to freelancers and monitor their progress.",
  },
  {
    icon: CheckCircle2,
    title: "Step 4 — Track Progress",
    desc: "Use the analytics dashboard to track project progress and team productivity.",
  },
];

const WorkflowSection = () => (
  <section id="workflow" className="relative py-32 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Workflow</p>
        <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
          How Collance <span className="gradient-text">works</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A simple flow that keeps clients and freelancers aligned from kickoff to delivery.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <div key={s.title} className="glass-card-hover p-6 group" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <s.icon size={24} className="text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WorkflowSection;

