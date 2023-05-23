import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Footer from './footer'

const Dashboard2 = () => {
  const authToken = Cookies.get('token')
  const [subscriptionDetails, setSubscriptionDetails] = useState(null)

  const router = useNavigate()
  // Fetch subscription details from server
  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      const response = await fetch(
        'http://localhost:5000/api/getSubscription',
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
  }, [authToken])
  if (!authToken) {
    router('/login')
  }

  const handleLogout = () => {
    Cookies.remove('token')
    router('/login')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>This is the dashboard page</p>
      {subscriptionDetails ? (
        <div>
          <p>Subscription Plan: {subscriptionDetails.planId}</p>
          <p>Status: {subscriptionDetails.status}</p>
        </div>
      ) : (
        <>
          <p>No Active Subscription</p>
          <button onClick={() => router('/pricing')}>Subscribe NOW!</button>
        </>
      )}
      <button onClick={handleLogout}>Logout</button>
      <Footer />
    </div>
  )
}

export default Dashboard2
