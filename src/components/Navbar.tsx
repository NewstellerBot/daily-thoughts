import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(!open)
  // if (session)
  //   return (
  //     <nav className="h-20 bg-cyan-50 border-b border-cyan-200 text-cyan-900">
  //       <div className="grid grid-cols-2 md:grid-cols-3 items-center max-w-4xl mr-auto ml-auto h-full px-5">
  //         <Link href="/">
  //           <a className="flex w-fit">
  //             <div className="col-start-1 flex items-center justify-start mr-5">
  //               <Image src="/logo/teal.svg" width={40} height={40} alt="" />
  //               <span className="font-bold ml-2">DailyThought</span>
  //             </div>
  //           </a>
  //         </Link>

  //         <div className="mr-auto ml-auto text-semibold">
  //           <Link href="/">
  //             <a className="px-6 py-3 rounded hover:bg-cyan-100 transition">
  //               Home
  //             </a>
  //           </Link>
  //           <Link href="/days">
  //             <a className="px-6 py-3 rounded hover:bg-cyan-100 transition">
  //               Days
  //             </a>
  //           </Link>
  //           <Link href="/random">
  //             <a className="px-6 py-3 rounded hover:bg-cyan-100 transition">
  //               Random
  //             </a>
  //           </Link>
  //           <Link href="/api/auth/signout">
  //             <a className="px-6 py-3 rounded hover:bg-cyan-100 transition">
  //               Logout
  //             </a>
  //           </Link>
  //         </div>
  //       </div>
  //     </nav>
  //   )
  return (
    <header className="md:h-20 bg-cyan-50 border-b border-cyan-200 text-cyan-900 md:grid md:place-items-center">
      <div className="flex items-center flex-col md:flex-row w-full md:px-5 justify-center">
        <div className="items-center h-full px-5 py-3 w-full flex justify-between md:max-w-xl">
          <Link href="/">
            <a>
              <div className="col-start-1 flex items-center justify-start mr-5">
                <Image src="/logo/teal.svg" width={40} height={40} alt="" />
                <span className="font-bold ml-2">DailyThought</span>
              </div>
            </a>
          </Link>
          <button onClick={toggle} className="w-5 h-5 md:hidden">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <nav
          className={`${
            open ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row text-semibold md:col-start-2 py-2 text-center`}
        >
          <Link href="/">
            <a className="px-6 py-3 rounded hover:bg-cyan-100 transition">
              Home
            </a>
          </Link>
          {!session && (
            <Link href="/api/auth/signin">
              <a className="px-6 py-3 rounded hover:bg-cyan-100 transition">
                Login
              </a>
            </Link>
          )}
          {session && (
            <>
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
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
