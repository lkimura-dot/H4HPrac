import { FLOWERS } from '../data/flowers'

function StorePanel({ points, onPurchase, purchasingFlowerId }) {
  return (
    <aside className="garden-card h-full p-4">
      <h2 className="garden-panel-title text-3xl font-bold">flower store</h2>
      <p className="mt-1 text-sm font-semibold text-[var(--garden-muted)]">
        Spend points to decorate your garden.
      </p>

      <ul className="mt-4 space-y-3">
        {FLOWERS.map((flower) => {
          const canAfford = points >= flower.cost
          const isPurchasing = purchasingFlowerId === flower.id

          return (
            <li className="rounded-2xl border border-[#d7cab8] bg-[#f8f3ec] p-3" key={flower.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg">{flower.emoji}</p>
                  <p className="text-sm font-bold text-[#5f5547]">{flower.name}</p>
                  <p className="mt-0.5 text-xs text-[var(--garden-muted)]">{flower.description}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-extrabold text-[#8e6d3e]">{flower.cost} pts</p>
                  <button
                    className="garden-btn-secondary mt-2 px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:bg-slate-400"
                    type="button"
                    disabled={!canAfford || isPurchasing}
                    onClick={() => onPurchase(flower)}
                  >
                    {isPurchasing ? 'Buying...' : 'Buy'}
                  </button>
                </div>
              </div>
              {!canAfford ? (
                <p className="mt-2 text-xs font-bold text-rose-600">
                  Need {flower.cost - points} more points.
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default StorePanel
