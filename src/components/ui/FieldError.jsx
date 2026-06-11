export default function FieldError({ msg }) {
  if (!msg) return null
  return <p className="text-xs text-red-500 mt-1">{msg}</p>
}
