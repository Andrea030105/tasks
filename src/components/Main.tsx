// Hook di React
import { useState } from "react";

// Finestra modale per modificare una task
import Modal from "./Modal";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { useTasks } from "../hooks/useTasks";
import type { Priority, Task } from "../api/tasks";
import TaskFilter, {
  type FilterDone,
  type FilterDueDateMode,
  type FilterPriority,
} from "./TaskFilter";
import { CircleCheckBig, LoaderCircle } from "lucide-react";

// Funzione che prende in input i task e li filtra per la select Done
function applyFilterDone(tasks: Task[], filter: FilterDone): Task[] {
  switch (filter) {
    case "done":
      return tasks.filter((t) => t.done);
    case "notDone":
      return tasks.filter((t) => !t.done);

    default:
      return tasks;
  }
}

// Funzione che prende in input i task e li filtra per la select Priority
function applyFilterPriority(tasks: Task[], filter: FilterPriority): Task[] {
  switch (filter) {
    case "low":
      return tasks.filter((t) => t.priority === "low");
    case "medium":
      return tasks.filter((t) => t.priority === "medium");
    case "high":
      return tasks.filter((t) => t.priority === "high");

    default:
      return tasks;
  }
}

// Funzione che prende in input i task e li filtra per l'input DueDate
function applyFilterDueDate(
  tasks: Task[],
  mode: FilterDueDateMode,
  filter: string,
): Task[] {
  switch (mode) {
    case "none":
      return tasks.filter((t) => !t.dueDate);
    case "custom":
      if (filter === "") return tasks;
      return tasks.filter((t) => t.dueDate === filter);
    default:
      return tasks;
  }
}

// Funzione che prende in input i task e li filtra per l'input CreatedAt
function applyFilterCreatedAt(tasks: Task[], filter: string): Task[] {
  if (filter !== "") {
    const tasksFilteredCreatedAt = tasks.filter(
      (t) => t.createdAt.slice(0, 10) === filter,
    );
    return tasksFilteredCreatedAt;
  }
  return tasks;
}

// Funzione che prende in input i task e li filtra per l'input Search
function applyFilterInput(tasks: Task[], filter: string): Task[] {
  return tasks.filter((t) =>
    t.title.toLowerCase().includes(filter.toLowerCase().trim()),
  );
}

export default function Main() {
  // Task che si sta modificando: se è null la modale è chiusa
  const [taskModify, setTaskModify] = useState<Task | null>(null);

  // State che contiene il valore del filtro Done della select
  const [filterDone, setFilterDone] = useState<FilterDone>("all");

  // State che contiene il valore del filtro Priority della select
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");

  // State che contiene il valore del filtro dell'input
  const [filterInput, setFilterInput] = useState("");

  // State che contine il valore del filtro della scadenza
  const [filterDueDate, setFilterDueDate] = useState("");

  // State che contine il valore della select  della scadenza
  const [filterDueDateMode, setFilterDueDateMode] =
    useState<FilterDueDateMode>("all");

  // State che contine il valore del filtro della data di creazione
  const [filterCreatedAt, setFilterCreatedAt] = useState("");

  const {
    handlerPostTask,
    handlerPatchTaskDone,
    handlerPatchTask,
    handlerDeleteTask,
    tasks,
    loading,
    error,
    actionError,
  } = useTasks();

  // Salva le modifiche e chiude la modale solo se il salvataggio è riuscito
  const handleSave = async (
    id: number,
    changes: {
      title: string;
      priority: Priority;
      dueDate: string | null;
      done: boolean;
    },
  ) => {
    const closeModal = await handlerPatchTask(id, changes);
    if (closeModal) setTaskModify(null);
  };

  /*  Filtra per ogni stato 
      Il testo cercato è normalizzato: senza spazi ai bordi e in minuscolo,
      così la ricerca ignora le maiuscole */
  const byDone = applyFilterDone(tasks, filterDone);
  const byPriority = applyFilterPriority(byDone, filterPriority);
  const byDueDate = applyFilterDueDate(
    byPriority,
    filterDueDateMode,
    filterDueDate,
  );
  const byCreatedAt = applyFilterCreatedAt(byDueDate, filterCreatedAt);
  const filteredTask = applyFilterInput(byCreatedAt, filterInput);

  const resetFilter = () => {
    setFilterInput("");
    setFilterDone("all");
    setFilterPriority("all");
    setFilterDueDate("");
    setFilterCreatedAt("");
    setFilterDueDateMode("all");
  };

  const counterTasksDone = filteredTask.filter((t) => t.done).length;
  const counterAllTask = filteredTask.length;
  const percent =
    counterAllTask === 0
      ? 0
      : Math.round((counterTasksDone / counterAllTask) * 100);

  return (
    <>
      {loading && (
        <div className="bg-amber-200 min-h-[calc(100vh-80px)] p-10 flex justify-center items-center">
          <LoaderCircle className="animate-spin text-amber-400" size={64} />
        </div>
      )}
      {!loading && (
        <>
          {/* Mostra la modale solo se c'è una task da modificare */}
          {taskModify && (
            <Modal
              // Chiude la modale senza salvare
              onClose={() => setTaskModify(null)}
              // Salva le modifiche
              onSave={handleSave}
              // Task da modificare
              task={taskModify}
            />
          )}
          <main className="bg-amber-200 min-h-[calc(100vh-80px)] px-10 py-5">
            <TaskFilter
              filterInput={filterInput}
              onChangeFilterInput={setFilterInput}
              filterDone={filterDone}
              onChangeFilterDone={setFilterDone}
              filterPriority={filterPriority}
              onChangeFilterPriority={setFilterPriority}
              filterDueDateMode={filterDueDateMode}
              onChangeFilterDueDateMode={setFilterDueDateMode}
              filterDueDate={filterDueDate}
              onChangeFilterDueDate={setFilterDueDate}
              filterCreatedAt={filterCreatedAt}
              onChangeFilterCreatedAt={setFilterCreatedAt}
              onReset={resetFilter}
            />
            {/* Contatore tasks completate */}
            <label className="font-bold flex items-center gap-1">
              <CircleCheckBig className="size-5" />
              Completate
            </label>
            <div className="mb-4 border-2 border-amber-400 rounded-2xl p-3">
              <div className="mb-1 flex justify-between text-sm text-gray-600">
                <span>
                  {counterTasksDone} di {counterAllTask} completate
                </span>
                <span>{percent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-amber-500 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
            <div className="border-2 border-amber-400 rounded-2xl  w-full py-5 px-3 max-h-125 overflow-auto">
              {
                //Errore di caricamento: sostituisce la lista
                error ? (
                  <p className="text-2xl text-center text-red-700">{error}</p>
                ) : tasks.length === 0 ? (
                  // Messaggio mostrato quando non ci sono task
                  <div className="border-b-4 pb-2 border-amber-300 flex justify-center items-center">
                    <p className="text-2xl first-letter:capitalize">
                      Nessuna task
                    </p>
                  </div>
                ) : filteredTask.length > 0 ? (
                  filteredTask.map((t) => (
                    // key unica per ogni riga, necessaria a React nelle liste
                    <TaskItem
                      key={t.id}
                      task={t}
                      onToggleDone={handlerPatchTaskDone}
                      onEdit={setTaskModify}
                      onDelete={handlerDeleteTask}
                    />
                  ))
                ) : (
                  // Messaggio mostrato quando non ci sono task filtrati
                  <div className="border-b-4 pb-2 border-amber-300 flex justify-center items-center">
                    <p className="text-2xl first-letter:capitalize">
                      Nessuna task filtrata
                    </p>
                  </div>
                )
              }
            </div>
            {
              // Errore dell'ultima azione: la lista resta visibile
              actionError && <p className="text-red-700 mb-2">{actionError}</p>
            }
            {/* INPUT PER INSERIRE LA TASK */}
            {!error && <TaskForm onAdd={handlerPostTask} />}
          </main>
        </>
      )}
    </>
  );
}
