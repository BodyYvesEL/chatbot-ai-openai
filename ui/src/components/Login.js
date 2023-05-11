import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import Cookies from 'js-cookie'
import { useAlert } from 'react-alert'
import Footer from './footer'

export default function Login() {
  const router = useNavigate()
  const alert = useAlert()

  const [data, setData] = React.useState({
    email: '',
    password: '',
  })
  const [disabled, setDisabled] = React.useState(false)

  const authToken = Cookies.get('token')
  if (authToken) {
    router('/dashboard')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      data.email.includes('.') &&
      data.email.includes('@') &&
      data.password.length > 2
    ) {
      setDisabled(true)
      const res = await fetch(
        `http://localhost:5000/api/signin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        },
      )

      const resData = await res.json()

      if (resData.error) {
        alert.error(resData.error)
      } else if (resData.token) {
        // set token cookie with expiration of 7 days
        Cookies.set('token', resData.token, { expires: 7 })
        Cookies.set('email', resData.email, { expires: 7 })
        alert.success('Login Success!')
        setTimeout(() => {
          router('/dashboard')
        }, 2000)
      } else {
        alert.show('Something went wrong!')
      }
      setDisabled(false)
    } else {
      console.log('Error')
      alert.show('Something went wrong!')
    }
  }

  const handleChange = (e) => {
    const newdata = { ...data }
    newdata[e.target.id] = e.target.value
    setData(newdata)
  }

  return (
    <div>
      <div>
        <div className="min-h-screen">
          <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 absolute left-4 top-4 md:left-8 md:top-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </a>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email to sign in to your account
                </p>
              </div>
              <div className="grid gap-6">
                <form>
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="email"
                        placeholder="Email Address"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        type="email"
                        name="email"
                        required
                        onChange={handleChange}
                      />
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only"
                        htmlFor="email"
                      >
                        Password
                      </label>
                      <input
                        className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="password"
                        placeholder="Password"
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect="off"
                        type="password"
                        name="password"
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={disabled}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                    >
                      {disabled ? 'Loading...' :  'Sign In'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
              <a
                className="hover:text-brand underline underline-offset-4 mt-4"
                href="/register"
              >
                Don&#39;t have an account? Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
