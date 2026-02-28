import { useMemo, useState } from 'react'

function TaskSidebar({ tasks, isLoading, onAddTask, onToggleTask, onDeleteTask, onRenameTask }) {
  const [newTitle, setNewTitle] = useState('')
  const [editingTaskId, setEditingTaskId] = useState('')
  const [editingTitle, setEditingTitle] = useState('')

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((taskA, taskB) => {
        if (taskA.completed === taskB.completed) return 0
        return taskA.completed ? 1 : -1
      }),
    [tasks],
  )

  const handleCreateTask = async (event) => {
    event.preventDefault()
    if (!newTitle.trim()) return
    await onAddTask(newTitle)
    setNewTitle('')
  }

  const beginEditing = (task) => {
    setEditingTaskId(task.id)
    setEditingTitle(task.title)
  }

  const cancelEditing = () => {
    setEditingTaskId('')
    setEditingTitle('')
  }

  const saveTaskTitle = async () => {
    if (!editingTaskId || !editingTitle.trim()) return
    await onRenameTask(editingTaskId, editingTitle)
    cancelEditing()
  }

  return (
    <aside className="h-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">To-Do List</h2>

      <form className="mt-4 flex gap-2" onSubmit={handleCreateTask}>
        <input
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          placeholder="Add a task..."
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
        <button
          className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
          type="submit"
        >
          Add
        </button>
      </form>

      {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading tasks...</p> : null}
      {!isLoading && sortedTasks.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No tasks yet. Add your first one.</p>
      ) : null}

      <ul className="mt-4 space-y-2">
        {sortedTasks.map((task) => (
          <li
            className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm"
            key={task.id}
          >
            <div className="flex items-start gap-2">
              <input
                checked={Boolean(task.completed)}
                className="mt-1 h-4 w-4"
                onChange={() => onToggleTask(task.id, task.completed)}
                type="checkbox"
              />

              <div className="min-w-0 flex-1">
                {editingTaskId === task.id ? (
                  <div className="space-y-2">
                    <input
                      className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      value={editingTitle}
                      onChange={(event) => setEditingTitle(event.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                        onClick={saveTaskTitle}
                        type="button"
                      >
                        Save
                      </button>
                      <button
                        className="rounded-lg bg-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-400"
                        onClick={cancelEditing}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className={`w-full text-left ${
                      task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                    }`}
                    onClick={() => beginEditing(task)}
                    type="button"
                  >
                    {task.title}
                  </button>
                )}
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                className="text-xs font-medium text-rose-600 hover:text-rose-700"
                onClick={() => onDeleteTask(task.id)}
                type="button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default TaskSidebar
