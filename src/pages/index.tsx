import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

import Layout from '../components/Layout'
import EditablePage from '../components/EditablePage'

const Home: NextPage = () => {
  const { data: session, status } = useSession()

  if (status === 'authenticated')
    return (
      <>
        <Head>
          <title>DailyThought</title>
          <meta name="description" content="Write your daily thoughts" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <div className="min-h-screen max-w-4xl ml-auto mr-auto">
            <h1 className="text-5xl font-bold mb-5">
              Welcome {session?.user?.name}!
            </h1>
            <h2 className="text-3xl mb-2">{new Date().toLocaleDateString()}</h2>
            <h3 className="text-xl text-gray-600">
              What&apos;s on your mind today?
            </h3>
            <EditablePage />
          </div>
        </Layout>
      </>
    )

  return (
    <>
      <Head>
        <title>DailyThought</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className="min-h-screen mb-5 md:mb-10 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center gap-8">
            <div>
              <div className="flex flex-col items-center mb-5 gap-5">
                <div className="h-52 w-52 relative lg:h-64 lg:w-64">
                  <Image src="/logo/black.svg" alt="" layout="fill" />
                </div>
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-extrabold">
                  Daily Thought
                </h1>
              </div>

              <h2 className="font-semibold text-5xl">
                A place to archive your daily
              </h2>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-7xl md:text-8xl font-extrabold">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-pink-500 to-purple-500">
                  Thoughts
                </span>
              </h2>
              <h2 className="text-7xl md:text-8xl font-extrabold">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-purple-500 to-teal-500">
                  Funny Texts
                </span>
              </h2>
              <h2 className="text-7xl md:text-8xl font-extrabold">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-teal-500 to-purple-500">
                  Pictures
                </span>
              </h2>
              <h2 className="text-7xl md:text-8xl font-extrabold">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-purple-500 to-pink-500">
                  Memes
                </span>
              </h2>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Home