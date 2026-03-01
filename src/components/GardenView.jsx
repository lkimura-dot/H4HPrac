import { useMemo } from 'react'
import { FLOWERS } from '../data/flowers'

function GardenView({ gardenItems, isLoading }) {
  const flowerLookup = useMemo(
    () => new Map(FLOWERS.map((flower) => [flower.id, flower])),
    [],
  )

  return (
    <section className="garden-card p-6">
      <h2 className="garden-panel-title text-3xl font-bold">your garden</h2>
      <p className="mt-1 text-sm font-semibold text-[var(--garden-muted)]">
        Flowers you buy with points appear here.
      </p>

      <div className="mt-4 rounded-2xl border border-[#bad78f] bg-gradient-to-b from-[#d5f3fa] to-[#d3ecac] p-4">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-[#94b166] text-sm font-semibold text-[#5f7b3e]">
            Loading garden...
          </div>
        ) : gardenItems.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-[#94b166] px-2 text-center text-sm font-semibold text-[#5f7b3e]">
            Start your first focus session and buy a flower!
          </div>
        ) : (
          <div className="grid min-h-48 grid-cols-4 gap-3 sm:grid-cols-6">
            {gardenItems.map((item) => {
              const flower = flowerLookup.get(item.flowerId)

              return (
                <div
                  className="flex flex-col items-center rounded-xl border border-[#e8dbc9] bg-[#f9f4ed]/95 p-2 shadow-sm"
                  key={item.id}
                  title={flower ? `${flower.name} (${flower.cost} points)` : 'Unknown flower'}
                >
                  <span className="text-3xl">{flower?.emoji ?? '🌱'}</span>
                  <span className="mt-1 text-center text-xs font-bold text-[#6d604f]">
                    {flower?.name ?? item.flowerId}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default GardenView
