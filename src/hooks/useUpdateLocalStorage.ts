import { useEffect } from "react";
import type { Todo } from "@/TodoList";

export const useUpdateLocalStorage = (
  todos: Map<string, Todo>,
  sortOrder: "desc" | "asc"
) => {
  useEffect(() => {
    // 依照目前排序方式存入 localStorage
    const sorted = Array.from(todos.values()).sort((a, b) => {
      if (sortOrder === "desc") {
        return b.createdAt.localeCompare(a.createdAt);
      } else {
        return a.createdAt.localeCompare(b.createdAt);
      }
    });
    localStorage.setItem("todos", JSON.stringify(sorted));
  }, [todos, sortOrder]);
};
