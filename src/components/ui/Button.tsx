type ButtonProps = {
  children: React.ReactNode
  onClick?: (e: MouseEvent) => void
}

const Button = ({ children }: ButtonProps) => {
  return (
    <button
      type="button"
      className="bg-gradient-to-b from-yellow-500 to-yellow-600 text-white font-bold px-4 py-2 rounded text-lg md:text-xl"
    >
      {children}
    </button>
  )
}

export default Button
