import React, { useState, useEffect } from 'react'
import Header2 from './Header2'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'

function Settings() {
  const [subscriptionDetails, setSubscriptionDetails] = useState(null)
  const authToken = Cookies.get('token')

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      const response = await fetch(
        'http://localhost:5001/api/getSubscription',
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
      const data = await response.json()
      console.log(data)
      setSubscriptionDetails(data)
    }
    fetchSubscriptionDetails()
  }, [])

  return (
    <div>
      <div id="app" data-v-app>
        <div className="flex flex-col h-screen">
          <Header2 />
          <div className="flex-1">
            <div className="flex w-full h-full">
              <div className="flex flex-col w-full">
                <div className="w-full max-w-screen-xl mx-auto p-6">
                  <h2 className="text-lg font-medium leading-loose flex items-center">
                    {' '}
                    Subscription Details{' '}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 w-4 h-4 animate-spin"
                      style={{ display: 'none' }}
                    >
                      <path
                        d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"
                        fill="currentColor"
                      />
                    </svg>
                  </h2>
                  <p className="leading-snug max-w-prose">
                    {subscriptionDetails ? (
                      <p>
                        You have an active subscription which is billed monthly.
                        View more subscriptions
                        <Link style={{ color: 'blue' }} to="/pricing">
                          {' '}
                          here
                        </Link>
                        .
                      </p>
                    ) : (
                      <p>
                        You do not have any active subscription. Subscribe now!
                        View our pricings
                        <Link style={{ color: 'blue' }} to="/pricing">
                          {' '}
                          here
                        </Link>
                        .
                      </p>
                    )}
                  </p>
                  <div className="mt-10 pb-10">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-medium leading-loose flex items-center">
                        {' '}
                        Billing{' '}
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-2 w-4 h-4 animate-spin"
                          style={{ display: 'none' }}
                        >
                          <path
                            d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"
                            fill="currentColor"
                          />
                        </svg>
                      </h2>
                    </div>
                    <div className="invisible md:visible my-2 md:grid grid-cols-3 border-y py-1">
                      <div> User </div>
                      <div> Plan </div>
                      <div> Status </div>
                    </div>
                    <div className="grid md:grid-cols-3 border-b py-4 md:py-2 items-center">
                      <div className="flex items-center gap-2">
                        <span className="flex flex-col leading-snug">
                          <span className="">
                            {subscriptionDetails
                              ? subscriptionDetails.email
                              : null}
                          </span>
                        </span>
                      </div>

                      <div className="mt-6 md:mt-0">
                        <span className="block md:hidden text-xs font-medium uppercase">
                          Plan
                        </span>
                        <span>
                          {subscriptionDetails
                            ? subscriptionDetails.planId
                            : null}
                        </span>
                      </div>
                      <div className="mt-3 md:mt-0">
                        <span className="block md:hidden text-xs font-medium uppercase">
                          Status
                        </span>{' '}
                        {subscriptionDetails && subscriptionDetails.status
                          ? subscriptionDetails.status.toUpperCase()
                          : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings