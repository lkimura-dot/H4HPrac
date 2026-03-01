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
    <aside className="garden-card h-full p-4">
      <h2 className="garden-panel-title text-3xl font-bold">to-do list</h2>

      <form className="mt-4 flex gap-2" onSubmit={handleCreateTask}>
        <input
          className="garden-input px-3 py-2 text-sm"
          placeholder="Add a task..."
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
        <button
          className="garden-btn-secondary px-3 py-2 text-sm"
          type="submit"
        >
          Add
        </button>
      </form>

      {isLoading ? <p className="mt-4 text-sm text-[var(--garden-muted)]">Loading tasks...</p> : null}
      {!isLoading && sortedTasks.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--garden-muted)]">No tasks yet. Add your first one.</p>
      ) : null}

      <ul className="mt-4 space-y-2">
        {sortedTasks.map((task) => (
          <li
            className="rounded-2xl border border-[#d7cab8] bg-[#f8f3ec] p-3 text-sm"
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
                      className="garden-input px-2 py-1 text-sm"
                      value={editingTitle}
                      onChange={(event) => setEditingTitle(event.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        className="garden-btn-secondary px-2 py-1 text-xs"
                        onClick={saveTaskTitle}
                        type="button"
                      >
                        Save
                      </button>
                      <button
                        className="rounded-lg bg-[#c4bbaf] px-2 py-1 text-xs font-bold text-[#5f5547] hover:bg-[#b5ab9e]"
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
                      task.completed ? 'text-[#a69a8d] line-through' : 'text-[#5f5547]'
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
                className="text-xs font-bold text-rose-600 hover:text-rose-700"
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
