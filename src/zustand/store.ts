// store.ts
import { create } from "zustand";

type Todo = {
  id: number;
  name: string;
  completed: boolean;
};

type StoreState = {
  todos: Todo[];
};

type StoreActions = {
  addTodo: (todoOrArray: Todo | Todo[]) => void;
  toggleTodo: (id: number, name: string, completed: boolean) => void;
  deleteTodo: (id: number) => void;
};

const useStore = create<StoreState & StoreActions>((set) => ({
  todos: [],
  addTodo: (todoOrArray) =>
    set((state) => {
      const todosToAdd = Array.isArray(todoOrArray)
        ? todoOrArray
        : [todoOrArray];
      return {
        todos: [...state.todos, ...todosToAdd.map((todo) => todo)],
      };
    }),

  toggleTodo: (id, name, completed) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, name, completed } : todo
      ),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
}));

export default useStore;
