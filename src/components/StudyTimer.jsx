import { formatSecondsToClock } from '../utils/time'

function StudyTimer({ elapsedSeconds, isRunning, isSyncing, onStart, onPause, onReset }) {
  return (
    <section className="garden-card p-6">
      <h2 className="garden-panel-title text-center text-3xl font-bold">study timer</h2>
      <p className="mt-4 text-center text-5xl font-bold tracking-wider text-[#645443]">
        {formatSecondsToClock(elapsedSeconds)}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {isRunning ? (
          <button
            className="garden-btn-primary px-4 py-2 text-sm"
            onClick={onPause}
            type="button"
            disabled={isSyncing}
          >
            pause
          </button>
        ) : (
          <button
            className="garden-btn-secondary px-4 py-2 text-sm"
            onClick={onStart}
            type="button"
            disabled={isSyncing}
          >
            start
          </button>
        )}
        <button
          className="rounded-xl bg-[#a69b8e] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#918478] disabled:cursor-not-allowed disabled:bg-slate-400"
          onClick={onReset}
          type="button"
          disabled={isSyncing}
        >
          reset
        </button>
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-[var(--garden-muted)]">
        1 minute studied = 1 point {isSyncing ? '(syncing...)' : ''}
      </p>
    </section>
  )
}

export default StudyTimer
