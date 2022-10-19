import GoogleButton from 'react-google-button'
import { signIn } from 'next-auth/react'

export default function Login() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <GoogleButton
        onClick={() => {
          signIn('google')
        }}
      />
    </div>
  )
}
