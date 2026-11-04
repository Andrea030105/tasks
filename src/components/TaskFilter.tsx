import { CalendarClock, Funnel, RotateCcw, Search } from "lucide-react";

export type FilterDone = "all" | "done" | "notDone";

export type FilterPriority = "all" | "low" | "medium" | "high";

interface TaskFilterProps {
  inputFilter: string;
  onChangeInput: (inputFilter: string) => void;
  filterDone: FilterDone;
  onChangeFilterDone: (filter: FilterDone) => void;
  filterPriority: FilterPriority;
  onChangeFilterPriority: (filter: FilterPriority) => void;
  filterDueDate: string;
  onChangeFilterDueDate: (filter: string) => void;
  onReset: () => void;
}

const fieldClass =
  "h-10 border-2 border-amber-400 rounded-2xl px-3 bg-transparent focus-visible:outline-2 focus-visible:outline-amber-800";

export default function TaskFilter({
  inputFilter,
  onChangeInput,
  filterDone,
  onChangeFilterDone,
  filterPriority,
  onChangeFilterPriority,
  filterDueDate,
  onChangeFilterDueDate,
  onReset,
}: TaskFilterProps) {
  return (
    <div className="flex flex-wrap justify-between items-end gap-3 mb-3">
      {/* FILTRO CERCA */}
      <div className="flex flex-col flex-1 min-w-48 max-w-sm">
        <label
          htmlFor="inputFilter"
          className="font-bold flex items-center gap-1"
        >
          <Search className="size-5" />
          Cerca
        </label>
        <input
          className={fieldClass}
          placeholder="Cerca una task..."
          type="text"
          name="inputFilter"
          id="inputFilter"
          value={inputFilter}
          onChange={(e) => onChangeInput(e.target.value)}
        />
      </div>

      {/* FILTRO COMPLETATE */}
      <div className="flex flex-col">
        <label
          htmlFor="filterDone"
          className="font-bold flex items-center gap-1"
        >
          <Funnel className="size-5" />
          Completate
        </label>
        <select
          className={fieldClass}
          name="filterDone"
          id="filterDone"
          value={filterDone}
          onChange={(e) => onChangeFilterDone(e.target.value as FilterDone)}
        >
          <option value="all">Tutte</option>
          <option value="done">Completate</option>
          <option value="notDone">Non completate</option>
        </select>
      </div>

      {/* FILTRO PRIORITÀ */}
      <div className="flex flex-col">
        <label
          htmlFor="filterPriority"
          className="font-bold flex items-center gap-1"
        >
          <Funnel className="size-5" />
          Priorità
        </label>
        <select
          className={fieldClass}
          name="filterPriority"
          id="filterPriority"
          value={filterPriority}
          onChange={(e) =>
            onChangeFilterPriority(e.target.value as FilterPriority)
          }
        >
          <option value="all">Tutte</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* FILTRO SCADENZA */}
      <div className="flex flex-col">
        <label
          htmlFor="filterDueDate"
          className="font-bold flex items-center gap-1"
        >
          <CalendarClock className="size-5" />
          Scadenza
        </label>
        <input
          type="date"
          className={fieldClass}
          name="filterDueDate"
          id="filterDueDate"
          value={filterDueDate}
          onChange={(e) => onChangeFilterDueDate(e.target.value)}
        />
      </div>

      <button
        className="h-10 flex items-center gap-2 rounded-2xl border-2 border-amber-400 bg-amber-500 px-4 font-bold transition hover:bg-amber-600 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-800"
        onClick={onReset}
      >
        Reset Filtri <RotateCcw className="size-5" />
      </button>
    </div>
  );
}
