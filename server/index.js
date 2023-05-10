const express = require('express')
const connectDb = require('./utils/connectDb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Cookies = require('cookies')
const User = require('./Models/Users')
require('dotenv').config()
const cors = require('cors')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')

const app = express()

// Parse JSON request bodies
app.use(express.json())
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Connect to MongoDB
connectDb()

// Define your API routes
app.post('/api/signup', async (req, res) => {
  const { fName, lName, email, password, companyName } = req.body
  try {
    if (
      !fName ||
      !lName ||
      !email.includes('@') ||
      !email.includes('.') ||
      !password
    ) {
      return res.status(422).json({ error: 'Invalid Input' })
    }
    const user = await User.findOne({ email })
    if (user && user.verifiedStatus) {
      return res.status(422).json({ error: 'User Exists' })
    } else if (user && !user.verifiedStatus) {
      const hashedPassword = await bcrypt.hash(password, 12)
      const otp = Math.floor(100000 + Math.random() * 900000)
      await User.updateOne(
        { email },
        { fName, lName, password: hashedPassword, companyName, otp },
      )
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      })

      try {
        const emailRes = await transporter.sendMail({
          from: 'puneetkathar11@gmail.com',
          to: email,
          subject: 'OTP HERE',
          text: `Welcome to QIQO, Here is your OTP : ${otp}`,
        })
        console.log(emailRes)
        console.log('Message Sent')
        res.status(201).json({ message: 'OTP Sent' })
      } catch (err) {
        res.status(201).json({ error })
        console.log(err)
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 12)
      const otp = Math.floor(100000 + Math.random() * 900000)
      const newUser = await new User({
        fName,
        lName,
        email,
        password: hashedPassword,
        companyName,
        otp,
      })
      newUser.save()
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      })

      try {
        const emailRes = await transporter.sendMail({
          from: 'puneetkathar11@gmail.com',
          to: email,
          subject: 'OTP HERE',
          text: `Welcome to QIQO, Here is your OTP : ${otp}`,
        })
        console.log(emailRes)
        console.log('Message Sent')
        res.status(201).json({ message: 'OTP Sent' })
      } catch (err) {
        res.status(201).json({ error })
        console.log(err)
      }
    }
  } catch (err) {
    console.log(err)
  }
})

app.post('/api/verify', async (req, res) => {
  const { email, otp } = req.body
  try {
    if (!email || !otp) {
      return res.status(422).json({ error: 'Invalid Input' })
    }
    const user = await User.findOne({ email })
    if (!user || user.otp == '' || user.otp == null) {
      return res.status(404).json({ error: 'No Student Found' })
    }
    if (user.otp == otp) {
      await User.updateOne({ email }, { verifiedStatus: true, otp: '' })
      res.status(201).json({ message: 'Verified' })
    } else {
      return res.status(401).json({ error: 'Invalid Input' })
    }
  } catch (err) {
    console.log(err)
  }
})

app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.status(422).json({ error: 'Invalid Input' })
    }
    const user = await User.findOne({ email })
    if (!user || !user.verifiedStatus) {
      return res.status(404).json({ error: 'No User Found' })
    }
    const doMatch = await bcrypt.compare(password, user.password)
    if (doMatch) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })
      const cookies = new Cookies(req, res)

      cookies.set('token', token, {
        httpOnly: false,
        secure: false,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict',
        path: '/',
      })

      cookies.set('email', user.email, {
        httpOnly: false,
        secure: false,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict',
        path: '/',
      })
      res.status(201).json({ email: user.email, token: token })
    } else {
      return res.status(401).json({ error: 'Invalid Input' })
    }
  } catch (err) {
    console.log(err)
  }
})

app.get('/api/verifytoken', async (req, res) => {
  try {
    console.log(req.headers.authorization)
    const token = req.headers.authorization.split(' ')[1]
    console.log(token)
    if (!token) {
      return res.status(401).json({ error: 'No token found' })
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decodedToken.userId
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    return res
      .status(200)
      .json({ message: 'Token verified', email: user.email })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/createCheckoutSession', async (req, res) => {
  const { priceId } = req.body
  // Get the authorization header from the request
  const authHeader = req.headers['authorization']

  // Extract the token from the authorization header
  const token = authHeader && authHeader.split(' ')[1]

  // Verify the token to get the payload (which contains the email)
  const payload = jwt.verify(token, process.env.JWT_SECRET)

  const email = payload.email
  try {
    // Retrieve the customer from Stripe or create a new one
    let customer = await stripe.customers.list({ email: email, limit: 1 })
    if (customer.data.length > 0) {
      customer = customer.data[0]
    } else {
      customer = await stripe.customers.create({ email: email })
    }

    // Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:3000/success`,
      cancel_url: `http://localhost:3000/cancel`,
    })

    // Return the session ID to the client
    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/getSubscription', async (req, res) => {
  try {
    // Get the authorization header from the request
    const authHeader = req.headers['authorization']

    // Extract the token from the authorization header
    const token = authHeader && authHeader.split(' ')[1]

    // Verify the token to get the payload (which contains the email)
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // Use the email to retrieve the customer's subscription
    const customer = await stripe.customers.list({
      email: payload.email,
      limit: 1,
    })
    if (customer.data.length === 0) {
      res.status(404).send(`No customer found with email ${payload.email}`)
      return
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.data[0].id,
      limit: 1,
    })
    if (subscriptions.data.length === 0) {
      res
        .status(404)
        .send(
          `No active subscriptions found for customer with email ${payload.email}`,
        )
      return
    }

    const subscription = subscriptions.data[0]
    const response = {
      status: subscription.status,
      planId: subscription.plan.id,
    }
    res.send(response)
  } catch (error) {
    console.error('Error while getting subscription:', error.message)
    res.status(500).send('Internal server error')
  }
})

app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature']

    let event

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      )
    } catch (err) {
      console.error('Error while verifying webhook', err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('Payment succeeded:', session.payment_intent)

        try {
          // Retrieve the user from the database
          const user = await User.findOne({ email: session.customer_email })

          // Update the user's subscription details
          user.subscriptionStatus = 'active'
          user.subscriptionId = session.subscription
          user.subscriptionPlanName = session.display_items[0].custom.name
          user.subscriptionPlanId = session.display_items[0].plan.id

          // Save the changes to the user document
          await user.save()
          console.log(`Subscription details updated for user ${user.email}`)
        } catch (err) {
          console.error(
            'Error while updating subscription details',
            err.message,
          )
          return res.status(500).send(`Server Error: ${err.message}`)
        }

        break

      // Handle other events here, if necessary

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.sendStatus(200)
  },
)

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
