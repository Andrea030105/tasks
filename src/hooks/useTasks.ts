import { useEffect, useState } from "react";
// Funzioni per chiamare l'API e tipo Task
import {
  getTasks,
  deleteTask,
  postTask,
  patchTask,
  deleteAllTask,
  type Task,
  type Priority,
} from "../api/tasks";

export function useTasks() {
  // Loading
  const [loading, setLoading] = useState(true);

  // Error
  const [error, setError] = useState<string | null>(null);

  // Error per le action
  const [actionError, setActionError] = useState<string | null>(null);

  // Elenco delle task mostrate in pagina
  const [tasks, setTasks] = useState<Task[]>([]);

  // Al primo render carica le task dal backend
  useEffect(() => {
    // Funzione per la chiamata delle tasks
    const loadTasks = async () => {
      // Puliamo l'errore da eventuali precedenti
      setError(null);
      try {
        // Facciamo la chiamata
        const data = await getTasks();

        // Assegniamo allo state la response della chiamata
        setTasks(data);
      } catch (error) {
        // Salviamo l'errore del caricamento
        setError(
          error instanceof Error ? error.message : "Errore nel caricamento",
        );
      } finally {
        // Assegniamo false allo state del loading
        setLoading(false);
      }
    };

    // Chiamiamo la funzione
    loadTasks();
  }, []);

  // Crea una nuova task quando si invia il form
  const handlerPostTask = async (
    title: string,
    priority: Priority,
    dueDate: string | undefined,
  ) => {
    // Puliamo l'errore da eventuali precedenti
    setActionError(null);

    // Dati da inviare: titolo, priorità, scadenza  e task non completata
    const data = {
      title,
      priority,
      dueDate,
      done: false,
    };
    try {
      // Salva sul backend e riceve la task creata
      const newTask = await postTask(data);
      // Aggiunge la nuova task in cima all'elenco
      setTasks((prev) => [newTask, ...prev]);
    } catch (error) {
      // Salviamo l'errore dell'azione
      setActionError(
        error instanceof Error
          ? error.message
          : "Errore nella aggiunta della Task",
      );
    }
  };

  // Segna la task come completata o la riporta a non completata
  const handlerPatchTaskDone = async (task: Task) => {
    // Puliamo l'errore da eventuali precedenti
    setActionError(null);

    // Inverte il valore attuale di done
    const newDone = !task.done;
    try {
      // Aggiorna solo il campo done sul backend
      const updated = await patchTask(task.id, { done: newDone });
      // Sostituisce nello stato la task modificata, lasciando le altre invariate
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (error) {
      // Salviamo l'errore dell'azione
      setActionError(
        error instanceof Error ? error.message : "Errore nel caricamento",
      );
    }
  };

  // Salva le modifiche fatte dalla modale (titolo e done)
  const handlerPatchTask = async (
    id: number,
    changes: {
      title: string;
      priority: Priority;
      dueDate: string | null;
      done: boolean;
    },
  ) => {
    // Puliamo l'errore da eventuali precedenti
    setActionError(null);

    try {
      // Aggiorna la task sul backend
      const updated = await patchTask(id, changes);
      // Aggiorna la task corrispondente nello stato
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

      // Chiude la modale
      return true;
    } catch (error) {
      // Salviamo l'errore dell'azione
      setActionError(
        error instanceof Error ? error.message : "Errore nel caricamento",
      );
      return false;
    }
  };

  // Elimina tutte le tasks
  const handlerDeleteAllTask = async () => {
    setError(null);

    const previous = tasks;

    setTasks([]);

    try {
      await deleteAllTask();
      return true;
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Errorre nella cancellazione di tutte le tasks",
      );

      setTasks(previous);

      return false;
    }
  };

  // Elimina una task
  const handlerDeleteTask = async (id: number) => {
    // Puliamo l'errore da eventuali precedenti
    setActionError(null);
    // Copia dell'elenco da ripristinare in caso di errore
    const previous = tasks;
    // Aggiornamento ottimistico: rimuove subito la task dalla UI
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      // Elimina la task sul backend
      await deleteTask(id);
      return true;
    } catch (error) {
      // Salviamo l'errore dell'azione
      setActionError(
        error instanceof Error ? error.message : "Errore nel caricamento",
      );
      // Se la richiesta fallisce, rimette l'elenco com'era
      setTasks(previous);
      return false;
    }
  };

  return {
    handlerPostTask,
    handlerPatchTaskDone,
    handlerPatchTask,
    handlerDeleteAllTask,
    handlerDeleteTask,
    tasks,
    loading,
    error,
    actionError,
  };
}
