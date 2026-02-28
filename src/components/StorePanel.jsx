import { FLOWERS } from '../data/flowers'

function StorePanel({ points, onPurchase, purchasingFlowerId }) {
  return (
    <aside className="h-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Flower Store</h2>
      <p className="mt-1 text-sm text-slate-500">Spend points to decorate your garden.</p>

      <ul className="mt-4 space-y-3">
        {FLOWERS.map((flower) => {
          const canAfford = points >= flower.cost
          const isPurchasing = purchasingFlowerId === flower.id

          return (
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-3" key={flower.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg">{flower.emoji}</p>
                  <p className="text-sm font-semibold text-slate-900">{flower.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{flower.description}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-amber-700">{flower.cost} pts</p>
                  <button
                    className="mt-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    type="button"
                    disabled={!canAfford || isPurchasing}
                    onClick={() => onPurchase(flower)}
                  >
                    {isPurchasing ? 'Buying...' : 'Buy'}
                  </button>
                </div>
              </div>
              {!canAfford ? (
                <p className="mt-2 text-xs text-rose-600">Need {flower.cost - points} more points.</p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default StorePanel
