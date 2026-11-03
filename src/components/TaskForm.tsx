import { CalendarClock, Plus } from "lucide-react";
import type { Priority } from "../api/tasks";
import { useState, type SubmitEvent } from "react";

interface TaskFormProps {
  onAdd: (
    title: string,
    priority: Priority,
    dueDate: string | undefined,
  ) => void;
}

const fieldClass =
  "h-10 border-2 border-amber-400 rounded-2xl px-3 bg-transparent focus-visible:outline-2 focus-visible:outline-amber-800";

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("low");
  const [dueDate, setDueDate] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = title.trim();
    if (trimmed === "") return;

    const today = new Date().toISOString().slice(0, 10);
    if (dueDate !== "" && dueDate < today)
      return setError(
        "La data deve essere oggi oppure un periodo di scadenza futuro!!",
      );
    const dueDateValue = dueDate === "" ? undefined : dueDate;

    onAdd(trimmed, priority, dueDateValue);

    setTitle("");
    setPriority("low");
    setDueDate("");
    setError("");
  };

  return (
    <div className="border-2 border-amber-400 rounded-2xl p-3  my-5">
      {error && <p className="font-bold text-red-600 text-sm my-1">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap justify-around items-end gap-3 w-full "
      >
        <div className="flex flex-col flex-1 min-w-48">
          <label htmlFor="title" className="font-bold">
            Task
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={fieldClass}
            placeholder="Inserisci la Task..."
          />
        </div>

        <div className="flex flex-col items-center">
          <label htmlFor="priority" className="font-bold">
            Priorità
          </label>
          <select
            name="priority"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className={fieldClass}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex flex-col items-center">
          <label
            htmlFor="dueDate"
            className="font-bold flex items-center gap-1"
          >
            <CalendarClock className="size-4" />
            Scadenza
          </label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={fieldClass}
          />
        </div>

        <button
          type="submit"
          className="h-10 flex items-center gap-2 rounded-2xl border-2 border-amber-400 bg-amber-500 px-4 font-bold transition hover:bg-amber-600 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-800"
        >
          <Plus className="size-5" />
          Aggiungi
        </button>
      </form>
    </div>
  );
}
