import type { Todo } from "@/TodoList";

type UseHandleTodosProps = {
  setTodos: React.Dispatch<React.SetStateAction<Map<string, Todo>>>;
  setNewTodo: React.Dispatch<React.SetStateAction<string>>;
  newTodo: string;
  todos: Map<string, Todo>;
};

export default function useHandleTodos({
  setTodos,
  setNewTodo,
  newTodo,
  todos,
}: UseHandleTodosProps) {
  // Add a new todo
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const newMap = new Map(todos);
    newMap.set(todo.id, todo);
    setTodos(newMap);
    setNewTodo("");
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodos((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  // Toggle todo completion status
  const toggleTodo = (id: string) => {
    setTodos((prev) => {
      const newMap = new Map(prev);
      const todo = newMap.get(id);
      if (todo) {
        newMap.set(id, { ...todo, completed: !todo.completed });
      }
      return newMap;
    });
  };

  return { addTodo, deleteTodo, toggleTodo };
}
