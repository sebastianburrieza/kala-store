import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'

type Mode = 'login' | 'signup' | 'forgot'

export default function Login() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      setLoading(false)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Te enviamos un email para resetear tu contraseña.')
      }
      return
    }

    const result = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, name)

    setLoading(false)

    if (result) {
      setError(result)
    } else {
      navigate('/')
    }
  }

  function switchMode(newMode: Mode) {
    setMode(newMode)
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          {mode === 'login' ? 'Ingresar' : mode === 'signup' ? 'Crear cuenta' : 'Recuperar contraseña'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400"
          />

          {mode !== 'forgot' && (
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400"
            />
          )}

          {mode === 'login' && (
            <button
              type="button"
              onClick={() => switchMode('forgot')}
              className="text-xs text-gray-400 hover:text-gray-600 text-right -mt-2"
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading
              ? 'Cargando...'
              : mode === 'login'
              ? 'Ingresar'
              : mode === 'signup'
              ? 'Crear cuenta'
              : 'Enviar email de recuperación'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === 'forgot' ? (
            <>
              <button onClick={() => switchMode('login')} className="text-gray-900 font-medium underline">
                Volver a ingresar
              </button>
            </>
          ) : (
            <>
              {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
              <button
                onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                className="text-gray-900 font-medium underline"
              >
                {mode === 'login' ? 'Crear cuenta' : 'Ingresar'}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
