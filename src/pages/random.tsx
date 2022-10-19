import { useSession } from 'next-auth/react'
import { trpc } from '../utils/trpc'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Random = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const days = trpc.useQuery(['day.getAll', { userId: session?.user.id || '' }])
  useEffect(() => {
    if (days.data) {
      const i: number = Math.floor(Math.random() * days.data.length)
      const randomId = days?.data[i]?.id
      if (randomId) router.push(`day/${randomId}`)
    }
  }, [days.data, router])
  return <></>
}

export default Random
