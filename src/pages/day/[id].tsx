import { useRouter } from 'next/router'
import Head from 'next/head'

import { trpc } from '../../utils/trpc'
import Layout from '../../components/Layout'
import { useSession } from 'next-auth/react'
import EditableBlock, {
  BlockType,
} from '../../components/EditablePage/EditableBlock'

const Day = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { id } = router.query
  const day = trpc.useQuery([
    'day.get',
    { userId: session?.user.id || '', id: id as string },
  ])

  if (day.data && day.isSuccess)
    return (
      <>
        <Head>
          <title>DailyThought</title>
          <meta name="description" content="Write your daily thoughts" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <div className="min-h-screen max-w-4xl ml-auto mr-auto">
            <h2 className="text-3xl mb-2">{day.data.date}</h2>
            <h3 className="text-xl text-gray-600">What was on your mind?</h3>
            {day.data.blocks.map((b, i) => {
              return (
                <EditableBlock
                  position={i}
                  html={b.html || ''}
                  key={b.id}
                  id={b.id}
                  type={b.type as BlockType}
                  editable={false}
                />
              )
            })}
          </div>
        </Layout>
      </>
    )
}

export default Day
