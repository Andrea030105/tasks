// Hook per lo stato e tipo per l'evento di invio del form
import { useState, type SubmitEvent } from "react";
// Tipo Task importato solo come tipo (non finisce nel codice finale)
import type { Priority, Task } from "../api/tasks";

// Descrive le props che il componente riceve dal genitore
interface ModalProps {
  // Task da modificare
  task: Task;
  // Funzione per chiudere la modale
  onClose: () => void;
  // Funzione per salvare: riceve l'id e i campi modificati
  onSave: (
    id: number,
    changes: {
      title: string;
      priority: Priority;
      dueDate: string | null;
      done: boolean;
    },
  ) => void;
}

// Le props sono destrutturate direttamente nella firma
export default function Modal({ task, onClose, onSave }: ModalProps) {
  // Stato locale del titolo, inizializzato con quello della task
  const [title, setTitle] = useState(task.title);
  // Stato locale di priority, inizializzato con quello della task
  const [priority, setPriority] = useState<Priority>(task.priority ?? "low");
  // Stato locale di dueDate, inizializzato con quello della task
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");
  // Stato locale di done, inizializzato con quello della task
  const [done, setDone] = useState(task.done);

  // Gestisce l'invio del form
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    // Evita il ricaricamento della pagina
    e.preventDefault();
    // Rimuove gli spazi all'inizio e alla fine del titolo
    const trimmed = title.trim();
    // Se il titolo è vuoto non salva
    if (!trimmed) return;

    const dueDateValue = dueDate ? dueDate : null;

    // Passa al genitore l'id e i nuovi valori
    onSave(task.id, { title: trimmed, priority, dueDate: dueDateValue, done });
  };

  return (
    // Sfondo scuro a tutto schermo; il click sullo sfondo chiude la modale
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50"
      onClick={onClose}
    >
      {/* Il form: stopPropagation evita che un click al suo interno chiuda la modale */}
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-amber-100 border-2 border-amber-400 rounded-2xl p-5 
        w-100"
      >
        {/* Campo di testo per il titolo, controllato dallo state */}
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={3}
          className="border-2 border-amber-300 p-1 w-full resize-none"
        />
        <div className="flex flex-col  p-2 gap-2">
          <label htmlFor="priority" className="font-bold">
            Priorità
          </label>
          <select
            name="priority"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="border-2 border-amber-400 rounded-2xl  my-1 py-2 px-2 focus-visible:outline-0"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label htmlFor="dueDate" className="font-bold">
            Scadenza
          </label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border-2 border-amber-400 rounded-2xl  my-1 py-1 px-2 focus-visible:outline-0"
          />
          {/* Checkbox per lo stato completato */}
          <label className="flex items-center gap-2 font-bold">
            Done
            <input
              type="checkbox"
              checked={done}
              onChange={(e) => setDone(e.target.checked)}
            />
          </label>
        </div>
        {/* Pulsanti di azione */}
        <div className="flex justify-end gap-2">
          {/* type="button" evita che questo pulsante invii il form */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 border-2 border-gray-700 cursor-pointer"
          >
            Annulla
          </button>
          {/* Invia il form e salva le modifiche */}
          <button
            type="submit"
            className="p-1 border-2 border-amber-900 bg-amber-500 cursor-pointer"
          >
            Salva
          </button>
        </div>
      </form>
    </div>
  );
}
