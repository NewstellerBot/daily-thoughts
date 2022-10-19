const timeout = new Map<string, NodeJS.Timeout>()

const throttle = (
  fn: (...args: unknown[]) => void,
  time: number,
  id: string
) => {
  const existing = timeout.get(id)
  if (existing) return
  const t = setTimeout(fn, time)
  timeout.set(id, t)
}

export default throttle
