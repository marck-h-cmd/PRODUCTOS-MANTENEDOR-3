export default function Toast({ message, type = 'success' }) {
  const icons = { success: '✓', error: '✕' }
  return (
    <div className={`toast toast-${type}`}>
      <span style={{ fontWeight: 700 }}>{icons[type]}</span>
      {message}
    </div>
  )
}
