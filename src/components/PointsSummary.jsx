import { formatStudyDuration } from '../utils/time'

function PointsSummary({ email, points, totalStudyTimeSeconds }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{email}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-amber-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Points</p>
          <p className="mt-1 text-2xl font-bold text-amber-900">{points}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Study Time</p>
          <p className="mt-1 text-2xl font-bold text-emerald-900">
            {formatStudyDuration(totalStudyTimeSeconds)}
          </p>
        </div>
      </div>
    </section>
  )
}

export default PointsSummary
