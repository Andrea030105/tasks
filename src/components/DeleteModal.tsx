import type { Task } from "../api/tasks";

interface DeleteModalProps {
  task: Task;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export default function DeleteModal({
  task,
  onClose,
  onDelete,
}: DeleteModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50"
      onClick={onClose}
    >
      <div
        className="bg-amber-100 border-2 border-amber-400 rounded-2xl p-5 
        w-150 text-center"
      >
        <p className="text-2xl">
          Sei sicuro di voler eliminare definitivamente il task?
        </p>
        {/* Pulsanti di azione */}
        <div className="my-4 flex justify-center gap-8">
          {/* type="button" evita che questo pulsante invii il form */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 border-2 border-amber-400 cursor-pointer w-30"
          >
            Annulla
          </button>
          {/* Invia il form e salva le modifiche */}
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 border-2 border-red-900 bg-red-500 cursor-pointer w-30"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
}
