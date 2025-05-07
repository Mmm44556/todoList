import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TodoList from "./TodoList";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { ModeToggle } from "./components/ModeToggle.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <main className="min-h-screen p-4 md:p-8 bg-background">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Todo List</h1>
            <ModeToggle />
          </div>
          <TodoList />
        </div>
      </main>
    </ThemeProvider>
  </StrictMode>
);
