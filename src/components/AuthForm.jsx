import { useState } from 'react'

const INITIAL_FORM = {
  email: '',
  password: '',
}

function AuthForm({ onSignIn, onSignUp, isSubmitting, errorMessage }) {
  const [mode, setMode] = useState('signin')
  const [formState, setFormState] = useState(INITIAL_FORM)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (mode === 'signin') {
      await onSignIn(formState.email, formState.password)
    } else {
      await onSignUp(formState.email, formState.password)
    }
  }

  const submitLabel = mode === 'signin' ? 'log in' : 'sign up'
  const toggleLabel =
    mode === 'signin'
      ? 'create account'
      : 'back to login'

  return (
    <div className="garden-card mx-auto w-full max-w-md p-8 sm:max-w-lg sm:p-9">
      <h1 className="garden-title-font text-center text-5xl font-bold text-[var(--garden-heading)]">
        mind garden
      </h1>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <label className="block text-3xl" htmlFor="email">
          <span className="garden-title-font text-3xl font-semibold text-[var(--garden-heading)]">
            email
          </span>
          <input
            className="garden-input mt-1.5 px-4 py-2.5 text-lg"
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </label>

        <label className="block text-3xl" htmlFor="password">
          <span className="garden-title-font text-3xl font-semibold text-[var(--garden-heading)]">
            password
          </span>
          <input
            className="garden-input mt-1.5 px-4 py-2.5 text-lg"
            id="password"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </label>

        {errorMessage ? (
          <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            className="garden-text-link garden-title-font text-2xl leading-none"
            type="button"
            onClick={() => setMode((previous) => (previous === 'signin' ? 'signup' : 'signin'))}
          >
            {toggleLabel}
          </button>

          <button
            className="garden-btn-primary garden-title-font min-w-[130px] px-6 py-2.5 text-3xl leading-none disabled:cursor-not-allowed disabled:bg-[#c6b39a]"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'wait...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AuthForm
