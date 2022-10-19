const timeout = new Map<string, NodeJS.Timeout>()

const debounce = (
  fn: (...args: unknown[]) => void,
  time: number,
  id: string
) => {
  const existing = timeout.get(id)
  if (existing) clearTimeout(existing)
  const t = setTimeout(fn, time)
  timeout.set(id, t)
}

export default debounce
