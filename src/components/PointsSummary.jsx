import { formatStudyDuration } from '../utils/time'

function PointsSummary({ email, points, totalStudyTimeSeconds }) {
  return (
    <section className="garden-card p-4">
      <p className="text-sm font-semibold text-[var(--garden-muted)]">{email}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#d8c6ac] bg-[#f8eedf] p-3">
          <p className="garden-title-font text-sm font-semibold uppercase tracking-wide text-[#967444]">
            Points
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#79562f]">{points}</p>
        </div>
        <div className="rounded-2xl border border-[#b7d19b] bg-[#ebf7d8] p-3">
          <p className="garden-title-font text-sm font-semibold uppercase tracking-wide text-[#648340]">
            Study Time
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#4c6630]">
            {formatStudyDuration(totalStudyTimeSeconds)}
          </p>
        </div>
      </div>
    </section>
  )
}

export default PointsSummary
