import { formatSecondsToClock } from '../utils/time'

function StudyTimer({ elapsedSeconds, isRunning, isSyncing, onStart, onPause, onReset }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-center text-lg font-semibold text-slate-900">Study Timer</h2>
      <p className="mt-4 text-center text-5xl font-bold tracking-wider text-slate-900">
        {formatSecondsToClock(elapsedSeconds)}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {isRunning ? (
          <button
            className="rounded-xl bg-amber-500 px-4 py-2 font-medium text-white transition hover:bg-amber-600"
            onClick={onPause}
            type="button"
            disabled={isSyncing}
          >
            Pause
          </button>
        ) : (
          <button
            className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
            onClick={onStart}
            type="button"
            disabled={isSyncing}
          >
            Start
          </button>
        )}
        <button
          className="rounded-xl bg-slate-700 px-4 py-2 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          onClick={onReset}
          type="button"
          disabled={isSyncing}
        >
          Reset
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        1 minute studied = 1 point {isSyncing ? '(syncing...)' : ''}
      </p>
    </section>
  )
}

export default StudyTimer
