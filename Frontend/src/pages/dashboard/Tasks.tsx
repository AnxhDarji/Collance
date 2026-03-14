import { useState } from "react";
import { MessageSquare, Calendar, User } from "lucide-react";

interface Task {
  id: string;
  title: string;
  assignee: string;
  deadline: string;
  status: "todo" | "in-progress" | "completed";
}

const initialTasks: Task[] = [
  { id: "1", title: "Design landing page", assignee: "Alice", deadline: "Mar 20", status: "todo" },
  { id: "2", title: "Set up database schema", assignee: "Bob", deadline: "Mar 18", status: "todo" },
  { id: "3", title: "Build API endpoints", assignee: "Charlie", deadline: "Mar 22", status: "in-progress" },
  { id: "4", title: "Integrate payments", assignee: "Alice", deadline: "Mar 25", status: "in-progress" },
  { id: "5", title: "Write unit tests", assignee: "Bob", deadline: "Mar 15", status: "completed" },
  { id: "6", title: "Deploy staging env", assignee: "Charlie", deadline: "Mar 14", status: "completed" },
];

const columns = [
  { key: "todo" as const, label: "Todo", color: "bg-muted-foreground" },
  { key: "in-progress" as const, label: "In Progress", color: "bg-primary" },
  { key: "completed" as const, label: "Completed", color: "bg-success" },
];

const statusOptions = ["Not Started", "In Progress", "Partially Completed", "Completed"];

const Tasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [comment, setComment] = useState("");

  const moveTask = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold mb-1">Task Board</h1>
        <p className="text-muted-foreground text-sm">Manage and track project tasks</p>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.key} className="kanban-column">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
              <h3 className="font-heading text-sm font-semibold">{col.label}</h3>
              <span className="text-xs text-muted-foreground ml-auto">
                {tasks.filter((t) => t.status === col.key).length}
              </span>
            </div>

            <div className="space-y-3">
              {tasks
                .filter((t) => t.status === col.key)
                .map((task) => (
                  <div
                    key={task.id}
                    className="glass-card-hover p-4 cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <h4 className="text-sm font-medium mb-3">{task.title}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User size={12} /> {task.assignee}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {task.deadline}
                      </span>
                    </div>
                    <div className="mt-3">
                      {task.status === "todo" && <span className="status-todo">Todo</span>}
                      {task.status === "in-progress" && <span className="status-progress">In Progress</span>}
                      {task.status === "completed" && <span className="status-completed">Completed</span>}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task detail modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setSelectedTask(null)}>
          <div className="glass-card w-full max-w-lg p-8 mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-heading text-xl font-bold mb-2">{selectedTask.title}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><User size={14} /> {selectedTask.assignee}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {selectedTask.deadline}</span>
            </div>

            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-2 block">Update Status</label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      const map: Record<string, Task["status"]> = {
                        "Not Started": "todo",
                        "In Progress": "in-progress",
                        "Partially Completed": "in-progress",
                        Completed: "completed",
                      };
                      moveTask(selectedTask.id, map[status]);
                      setSelectedTask({ ...selectedTask, status: map[status] });
                    }}
                    className="py-2 px-3 rounded-lg border border-border text-xs font-medium hover:border-primary/30 hover:bg-primary/10 transition-all"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-1.5 block flex items-center gap-1">
                <MessageSquare size={14} /> Add Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelectedTask(null)} className="flex-1 py-3 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                Close
              </button>
              <button className="flex-1 gradient-btn py-3 rounded-lg text-sm font-semibold">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
