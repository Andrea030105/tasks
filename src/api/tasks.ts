import { api } from "./client";

export type Priority = "high" | "medium" | "low";

export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority?: Priority | null;
  dueDate?: string | null;
  createdAt: string;
}

export const getTasks = async () => {
  const { data } = await api.get<Task[]>("/tasks");
  return data;
};

export const postTask = async (task: {
  title: string;
  done: boolean;
  priority?: Priority;
  dueDate?: string;
}) => {
  const { data } = await api.post<Task>("/tasks", task);
  return data;
};

export const patchTask = async (
  id: number,
  changes: Partial<Pick<Task, "title" | "done" | "priority" | "dueDate">>,
) => {
  const { data } = await api.patch<Task>(`/tasks/${id}`, changes);
  return data;
};

export const deleteTask = async (id: number) => {
  await api.delete(`/tasks/${id}`);
};
