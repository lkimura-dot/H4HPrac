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

  const submitLabel = mode === 'signin' ? 'Sign In' : 'Create Account'
  const toggleLabel =
    mode === 'signin'
      ? "Don't have an account? Create one"
      : 'Already have an account? Sign in'

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-center text-2xl font-semibold text-slate-900">BloomFocus</h1>
      <p className="mt-2 text-center text-sm text-slate-600">
        Study, earn points, and grow your garden.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700" htmlFor="email">
          Email
          <input
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700" htmlFor="password">
          Password
          <input
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
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
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {errorMessage}
          </p>
        ) : null}

        <button
          className="w-full rounded-xl bg-sky-600 px-4 py-2.5 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Please wait...' : submitLabel}
        </button>
      </form>

      <button
        className="mt-4 w-full text-sm font-medium text-sky-700 transition hover:text-sky-800"
        type="button"
        onClick={() => setMode((previous) => (previous === 'signin' ? 'signup' : 'signin'))}
      >
        {toggleLabel}
      </button>
    </div>
  )
}

export default AuthForm
