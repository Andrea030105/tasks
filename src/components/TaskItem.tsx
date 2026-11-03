import {
  CalendarClock,
  CalendarPlus,
  Check,
  Pencil,
  Trash,
} from "lucide-react";
import type { Task } from "../api/tasks";

interface TaskItemProps {
  task: Task;
  onToggleDone: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({
  task,
  onToggleDone,
  onEdit,
  onDelete,
}: TaskItemProps) {
  return (
    <div className="border-b-4 py-2 border-amber-300 flex justify-between items-center">
      {/* Titolo: barrato se la task è completata */}
      <div className="flex flex-col justify-center min-w-0">
        <p
          className={`font-bold text-lg first-letter:capitalize wrap-break-word ${task.done ? "line-through text-red-500" : ""}`}
        >
          {task.title}
        </p>
        <div className="flex gap-2 items-center">
          {task.priority === null ? (
            <div
              dir="rtl"
              className=" bg-amber-400 text-amber-800 rounded-s-lg py-1 px-2  text-[12px] font-bold w-fit flex items-center justify-center capitalize"
            >
              Nessuna Priorità
            </div>
          ) : (
            <div
              dir="rtl"
              className={`rounded-s-lg py-1 px-2  text-[12px] font-bold text-white w-fit flex items-center justify-center capitalize ${task.priority === "low" && "bg-green-700"} ${task.priority === "medium" && "bg-blue-700"} ${task.priority === "high" && "bg-red-700"}`}
            >
              {task.priority}
            </div>
          )}
          <span className="bg-transparent border-2 border-amber-400 text-amber-800 rounded-2xl py-1 px-2  text-[12px] font-bold w-fit flex items-center justify-center capitalize">
            <CalendarPlus className="size-4 me-1" />
            {new Date(task.createdAt).toLocaleString("it-IT", {
              timeStyle: "short",
              dateStyle: "short",
            })}
          </span>
          {task.dueDate ? (
            <span className="border-2 border-violet-800 bg-violet-700 text-white rounded-2xl py-1 px-2  text-[12px] font-bold w-fit flex items-center justify-center capitalize">
              <CalendarClock className="size-4 me-1" />
              {new Date(task.dueDate + "T00:00:00").toLocaleDateString("it-IT")}
            </span>
          ) : (
            <span className="border-2 border-violet-800  text-violet-700 rounded-2xl py-1 px-2  text-[12px] font-bold w-fit flex items-center justify-center capitalize">
              Nessuna Scadenza
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2 ms-3 shrink-0">
        {/* Pulsante per completare o riaprire la task */}
        <button
          className="p-1 border-2 border-green-900 bg-green-500 hover:bg-green-800 cursor-pointer"
          onClick={() => onToggleDone(task)}
        >
          <Check />
        </button>
        {/* Pulsante per aprire la modale di modifica */}
        <button
          className="p-1 border-2 border-blue-900 bg-blue-500 hover:bg-blue-800 cursor-pointer"
          onClick={() => onEdit(task)}
        >
          <Pencil />
        </button>
        {/* Pulsante per eliminare la task */}
        <button
          className="p-1 border-2 border-red-900 bg-red-500 hover:bg-red-800 cursor-pointer"
          onClick={() => onDelete(task.id)}
        >
          <Trash />
        </button>
      </div>
    </div>
  );
}
