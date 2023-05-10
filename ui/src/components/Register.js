import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Register.css'
import Cookies from 'js-cookie'
import Footer from './footer'
import { useAlert } from 'react-alert'
import Swal from 'sweetalert2'

export default function Register() {
  const router = useNavigate()
  const alert = useAlert()

  const [disabled, setDisabled] = React.useState(false)
  const [data, setData] = React.useState({
    fName: '',
    lName: '',
    email: '',
    password: '',
    companyName: '',
  })

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
      data.fName.length > 2 &&
      data.lName.length > 1 &&
      data.password.length > 2
    ) {
      setDisabled(true)
      const res = await fetch(
        `http://localhost:5000/api/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fName: data.fName,
            lName: data.lName,
            email: data.email,
            password: data.password,
            companyName: data.companyName,
          }),
        },
      )

      const res2 = await res.json()
      console.log(res2)
      if (res2.error) {
        alert.error(res2.error)
      } else if (res2.message) {
        alert.success('OTP Sent!')
        Swal.fire({
          title: 'Submit your OTP',
          input: 'number',
          showCancelButton: true,
          confirmButtonText: 'Submit',
          showLoaderOnConfirm: true,
          preConfirm: (otp) => {
            return fetch(
              `http://localhost:5000/api/verify`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  otp,
                  email: data.email,
                }),
              },
            )
              .then((response) => response.json())
              .then((res) => {
                console.log(res)
                if (res.message) {
                  alert.success(res.message)
                  setTimeout(() => {
                    router('/login')
                  }, 2000)
                } else if (res.error) {
                  alert.error(res.error)
                }
              })
              .catch((error) => {
                Swal.showValidationMessage(`Request failed: ${error}`)
              })
          },
          allowOutsideClick: () => !Swal.isLoading(),
        })
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
          <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 absolute right-4 top-4 md:right-8 md:top-8"
            >
              Login
            </a>
            <div className="hidden h-full bg-muted lg:block" />
            <div className="lg:p-8">
              <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Create an account
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your email below to create your account
                  </p>
                </div>
                <div className="grid gap-6">
                  <form>
                    <div className="grid gap-2">
                      <div className="grid gap-1">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only"
                          htmlFor="fName"
                        >
                          First Name
                        </label>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          id="fName"
                          placeholder="First Name"
                          autoCapitalize="true"
                          autoComplete="first name"
                          autoCorrect="off"
                          type="text"
                          name="First Name"
                          required
                          onChange={handleChange}
                        />
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only"
                          htmlFor="fName"
                        >
                          Last Name
                        </label>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          id="lName"
                          placeholder="Last Name"
                          autoCapitalize="true"
                          autoComplete="last name"
                          autoCorrect="off"
                          type="text"
                          name="Last Name"
                          required
                          onChange={handleChange}
                        />
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only"
                          htmlFor="fName"
                        >
                          Company Name
                        </label>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          id="companyName"
                          placeholder="Company Name"
                          autoCapitalize="true"
                          autoComplete="company name"
                          autoCorrect="off"
                          type="text"
                          name="Company Name"
                          onChange={handleChange}
                        />
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                        type="submit"
                        onClick={handleSubmit}
                        disabled={disabled}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                      >
                        {disabled ? 'Loading...' :  'Get OTP'}
                      </button>
                    </div>
                  </form>
                </div>
                <p className="px-8 text-center text-sm text-muted-foreground">
                  By clicking continue, you agree to our{' '}
                  <a
                    className="hover:text-brand underline underline-offset-4"
                    href="/terms"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    className="hover:text-brand underline underline-offset-4"
                    href="/privacy"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
