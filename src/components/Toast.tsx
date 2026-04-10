import { useToastStore } from '../store/toastStore'

export default function Toast() {
  const message = useToastStore(state => state.message)

  return (
    <div className={`
      fixed bottom-6 left-1/2 -translate-x-1/2
      bg-gray-900 text-white text-sm px-5 py-3 rounded-full
      shadow-lg transition-all duration-300 pointer-events-none z-50
      ${message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      {message}
    </div>
  )
}
