import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="md:px-10 px-5 py-10">{children}</main>
      <Footer />
    </>
  )
}
