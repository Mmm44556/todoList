import React, { memo, useState } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useUpdateLocalStorage } from "@/hooks/useUpdateLocalStorage";
import useHandleTodos from "@/hooks/useHandleTodos";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Map<string, Todo>>(() => {
    const storedTodos = localStorage.getItem("todos");
    const arr: Todo[] = storedTodos ? JSON.parse(storedTodos) : [];
    return new Map(arr.map((todo) => [todo.id, todo]));
  });
  const [newTodo, setNewTodo] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">(
    localStorage.getItem("sortOrder") === "desc" ? "desc" : "asc"
  );

  const { addTodo, deleteTodo, toggleTodo } = useHandleTodos({
    setTodos,
    setNewTodo,
    newTodo,
    todos,
  });

  useUpdateLocalStorage(todos, sortOrder);

  // Filter todos based on completion status
  // 依照 createdAt 排序，根據 sortOrder
  const sortedTodos = Array.from(todos.values()).sort((a, b) => {
    if (sortOrder === "desc") {
      return b.createdAt.localeCompare(a.createdAt);
    } else {
      return a.createdAt.localeCompare(b.createdAt);
    }
  });
  const completedTodos = sortedTodos.filter((todo) => todo.completed);
  const incompleteTodos = sortedTodos.filter((todo) => !todo.completed);

  return (
    <div className="space-y-4">
      {/* 排序下拉選單 */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[120px]">
              {sortOrder === "desc" ? "新到舊" : "舊到新"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSortOrder("desc");
                localStorage.setItem("sortOrder", "desc");
              }}
            >
              新到舊
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSortOrder("asc");
                localStorage.setItem("sortOrder", "asc");
              }}
            >
              舊到新
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 新增待辦事項 */}
      <TodoForm addTodo={addTodo} newTodo={newTodo} setNewTodo={setNewTodo} />

      {/* 待辦事項列表 */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="active">未完成</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {sortedTodos.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              沒有待辦事項
            </p>
          ) : (
            <TodoItems
              todos={sortedTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          {incompleteTodos.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              沒有未完成的待辦事項
            </p>
          ) : (
            <TodoItems
              todos={incompleteTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          {completedTodos.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              沒有已完成的待辦事項
            </p>
          ) : (
            <TodoItems
              todos={completedTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// 新增待辦事項 表單
interface TodoFormProps {
  addTodo: (e: React.FormEvent) => void;
  newTodo: string;
  setNewTodo: (value: string) => void;
}
const TodoForm = memo(({ addTodo, newTodo, setNewTodo }: TodoFormProps) => {
  return (
    <form onSubmit={addTodo} className="flex gap-2">
      <Input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="新增待辦事項..."
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Plus className="h-4 w-4" />
        <span className="sr-only">新增</span>
      </Button>
    </form>
  );
});

// 待辦事項列表
interface TodoItemsProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}
const TodoItems = memo(({ todos, onToggle, onDelete }: TodoItemsProps) => {
  return (
    <ul className="space-y-2 [&>li]:cursor-pointer">
      {todos.map((todo) => {
        const createdAt = new Date(todo.createdAt);
        const formattedDate = createdAt.toLocaleString();

        return (
          <li
            key={todo.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-md border",
              todo.completed ? "bg-muted/50" : "bg-background"
            )}
            onClick={(e: React.MouseEvent<HTMLLIElement>) => {
              const target = e.target as HTMLElement;
              if (["BUTTON", "SVG", "PATH"].includes(target.tagName)) return;
              onToggle(todo.id);
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => onToggle(todo.id)}
              >
                {todo.completed ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3 opacity-0" />
                )}
                <span className="sr-only">
                  {todo.completed ? "標記為未完成" : "標記為已完成"}
                </span>
              </Button>
              <span
                className={cn(
                  "flex-1",
                  todo.completed && "line-through text-muted-foreground"
                )}
              >
                {todo.text}
              </span>
              <span className="text-xs text-muted-foreground">
                {formattedDate === "Invalid Date" ? "" : formattedDate}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(todo.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
});
