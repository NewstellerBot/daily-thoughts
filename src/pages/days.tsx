import { useSession } from 'next-auth/react'

import { trpc } from '../utils/trpc'
import Layout from '../components/Layout'
import { Day } from '@prisma/client'

import Link from 'next/link'

const Days = () => {
  const { data: session } = useSession()
  const days = trpc.useQuery(['day.getAll', { userId: session?.user.id || '' }])
  return (
    <Layout>
      <div className="flex flex-wrap gap-5 max-w-2xl ml-auto mr-auto min-h-screen content-start">
        {days.data &&
          days.data.map((day: Day) => {
            return (
              <Link key={day.id} href={`/day/${day.id}`}>
                <button className="border-2 px-4 py-2 bg-blue-100 border-blue-200 rounded-lg flex-shrink-0 flex-grow text-blue-900 hover:scale-105 transition text-center self-start">
                  {day.date}
                </button>
              </Link>
            )
          })}
      </div>
    </Layout>
  )
}

export default Days
