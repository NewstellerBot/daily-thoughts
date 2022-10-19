import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  if (session)
    return (
      <nav className="h-20 bg-cyan-50 border-b border-cyan-200 text-cyan-900">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center max-w-4xl mr-auto ml-auto h-full px-5">
          <Link href="/">
            <a className="flex flex-grow-0">
              <div className="col-start-1 flex items-center justify-start mr-5">
                <Image src="/logo/teal.svg" width={40} height={40} alt="" />
                <span className="font-bold ml-2">DailyThought</span>
              </div>
            </a>
          </Link>

          <div className="mr-auto ml-auto text-semibold">
            <Link href="/">
              <a className="px-6 py-3 rounded hover:bg-cyan-100 transition">
                Home
              </a>
            </Link>
            <Link href="/days">
              <a className="px-6 py-3 rounded hover:bg-cyan-100 transition">
                Days
              </a>
            </Link>
            <Link href="/random">
              <a className="px-6 py-3 rounded hover:bg-cyan-100 transition">
                Random
              </a>
            </Link>
            <Link href="/api/auth/signout">
              <a className="px-6 py-3 rounded hover:bg-cyan-100 transition">
                Logout
              </a>
            </Link>
          </div>
        </div>
      </nav>
    )
  return (
    <nav className="h-20 bg-cyan-50 border-b border-cyan-200 text-cyan-900">
      <div className="grid grid-cols-2 md:grid-cols-3 items-center max-w-4xl mr-auto ml-auto h-full px-5">
        <Link href="/">
          <a>
            <div className="col-start-1 flex items-center justify-start mr-5">
              <Image src="/logo/teal.svg" width={40} height={40} alt="" />
              <span className="font-bold ml-2">DailyThought</span>
            </div>
          </a>
        </Link>

        <div className="mr-auto ml-auto text-semibold">
          <Link href="/">
            <a className="px-6 py-3 rounded hover:bg-cyan-100 transition">
              Home
            </a>
          </Link>
          <Link href="/api/auth/signin">
            <a className="px-6 py-3 rounded hover:bg-cyan-100 transition">
              Login
            </a>
          </Link>
        </div>
      </div>
    </nav>
  )
}
