import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import Footer from './footer'
import Header2 from './Header2'

const Dashboard = () => {
  const router = useNavigate()
  const authToken = Cookies.get('token')
  const [stripe, setStripe] = useState(null)
  useEffect(() => {
    const fetchStripe = async () => {
      const stripe = await loadStripe(
        'pk_test_51MlBRCFJwKeowJ2dBZEQ6CsIxuOV8BNmUpppAL6sVBKSh9bZdoBl7sJBn0yAzJplJYLVbV5pd4MrzOH1agbTa5Dj00NO0xFdJy',
      )
      setStripe(stripe)
    }
    fetchStripe()
  }, [])
  if (!authToken) {
    router('/login')
    return null
  }

  const createSubscription = async (priceId) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/createCheckoutSession',
        {
          priceId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      stripe.redirectToCheckout({ sessionId: response.data.sessionId })
    } catch (error) {
      console.error(error)
      return { error: error.message }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header2 />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
            <div className="grid gap-6">
              <h3 className="text-xl font-bold sm:text-2xl">
                What's included in the STANDARD plan
              </h3>
              <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <li className="flex items-center">
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  Limited Access to Chat
                </li>
                <li className="flex items-center">
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  One Document Upload
                </li>
                <li className="flex items-center">
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  No User Preference
                </li>
                <li className="flex items-center">
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  Unlimited Access to Chat
                </li>
                <li className="flex items-center">
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  User Preference (Eg. Business referencing IT, Sales,
                  Marketing, Finance, etc.)
                </li>
                <li className="flex items-center">
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  Expert Preference Conversation (Chats)
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4 text-center">
              <div>
                <h4 className="text-7xl font-bold">$10</h4>
                <p className="text-sm font-medium text-muted-foreground">
                  Billed Monthly
                </p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() =>
                createSubscription('price_1N7xttFJwKeowJ2dc56vG3fC')
              }
            >
              Continue to SUBSCRIBE
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
