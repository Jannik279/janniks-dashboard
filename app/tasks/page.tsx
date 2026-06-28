"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("jannik-tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "jannik-tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };

    setTasks([task, ...tasks]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(
      tasks.filter((task) => task.id !== id)
    );
  };

  const openTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <div className="p-6 md:p-8 pb-28 md:pb-8">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold">
          ✅ Aufgaben
        </h1>

        <p className="text-zinc-300 mt-2">
          Verwalte deine täglichen Aufgaben.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
          <p className="text-blue-400 text-sm mb-2">
            Gesamt
          </p>

          <p className="text-4xl font-bold">
            {tasks.length}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
          <p className="text-orange-400 text-sm mb-2">
            Offen
          </p>

          <p className="text-4xl font-bold">
            {openTasks}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
          <p className="text-green-400 text-sm mb-2">
            Erledigt
          </p>

          <p className="text-4xl font-bold">
            {completedTasks}
          </p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          Neue Aufgabe
        </h2>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={newTask}
            onChange={(e) =>
              setNewTask(e.target.value)
            }
            placeholder="Neue Aufgabe eingeben..."
            className="
              flex-1
              bg-black/20
              border
              border-white/10
              rounded-2xl
              p-4
              outline-none
            "
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
          />

          <button
            onClick={addTask}
            className="
              px-6
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              font-semibold
              hover:scale-105
              transition
            "
          >
            Hinzufügen
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center">
            <p className="text-zinc-400">
              Noch keine Aufgaben vorhanden.
            </p>
          </div>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className="
              bg-white/5
              backdrop-blur-lg
              border
              border-white/10
              rounded-3xl
              p-5
              flex
              items-center
              justify-between
            "
          >
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  toggleTask(task.id)
                }
                className="w-5 h-5"
              />

              <span
                className={
                  task.completed
                    ? "line-through text-zinc-500"
                    : "text-white"
                }
              >
                {task.text}
              </span>
            </div>

            <button
              onClick={() =>
                deleteTask(task.id)
              }
              className="
                px-3
                py-2
                rounded-xl
                bg-red-500/20
                hover:bg-red-500/30
                transition
              "
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}