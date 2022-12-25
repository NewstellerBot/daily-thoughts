import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Footer() {
  const { data: session } = useSession()
  return (
    <footer className="w-full bg-pink-200 text-pink-900 p-10 border-t border-pink-300">
      <div className="max-w-3xl mr-auto ml-auto">
        <div className="col-start-1 flex items-center justify-start mr-5 mb-10">
          <Link href="/">
            <a className="flex">
              <Image src="/logo/pink.svg" width={40} height={40} alt="" />
              <h1 className="font-bold text-xl ml-2 leading-tight">
                DailyThought <br />
                <span className="text-sm font-normal text-pink-800 max-w-xs">
                  A place for you daily thoughts, reflections, speculations, and
                  deliberations.
                </span>
              </h1>
            </a>
          </Link>
        </div>
        <button className="px-3 py-1 rounded hover:bg-pink-100 w-full transition mb-2">
          <Link href="/">
            <p className="text-left">Home</p>
          </Link>
        </button>
        {session ? (
          <>
            <button className="px-3 py-1 rounded hover:bg-pink-100 w-full transition mb-2">
              <Link href="/days">
                <p className="text-left">Days</p>
              </Link>
            </button>
            <button className="px-3 py-1 rounded hover:bg-pink-100 w-full transition mb-2">
              <Link href="/random">
                <p className="text-left">Random</p>
              </Link>
            </button>
            <button className="px-3 py-1 rounded hover:bg-pink-100 w-full transition mb-2">
              <Link href="/api/auth/signout">
                <p className="text-left">Logout</p>
              </Link>
            </button>
          </>
        ) : (
          <button className="px-3 py-1 rounded hover:bg-pink-100 w-full transition mb-2">
            <Link href="/api/auth/signin">
              <p className="text-left">Login</p>
            </Link>
          </button>
        )}
      </div>
    </footer>
  )
}
