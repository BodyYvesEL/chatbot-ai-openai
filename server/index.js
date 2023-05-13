/*

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

*/

const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('./models/Users');
const Cookies = require('cookies');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const multiparty = require('multiparty');
const ChatModel = require('./models/ChatModel');
const { BaseDocumentLoader } = require('langchain/document_loaders');
const { readFile } = require('fs/promises');
const { Document } = require('langchain/document');
const fs = require('fs');
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const connectDB = require('./utils/mongoConnection');
const { PineconeClient } = require('@pinecone-database/pinecone');
const { ConversationalRetrievalQAChain } = require('langchain/chains');
const { OpenAI } = require('langchain/llms/openai');
const Message = require('./models/Message');
const { PineconeStore } = require('langchain/vectorstores/pinecone');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
require('dotenv').config();

const app = express()

// Set up CORS to allow cross-origin request and allow credentials
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
)

// Set up body parser to parse incoming request bodies
app.use(bodyParser.json())

// Handle POST requests to the /api/chat endpoint
app.post('/api/chat', async (req, res) => {
  // Extract relevant data from the request body
  const { question, history, chatId, selectedNamespace } = req.body
  // Get the Pinecone index name from the environment variables
  const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? ''

  // If no question is provided, return an error
  if (!question) {
    return res.status(400).json({ message: 'No question in the request' })
  }

  try {
    // Create a new Pinecone client using the environment varables
    const pinecone = new PineconeClient({
      environment: process.env.PINECONE_ENVIRONMENT ?? '',
      apiKey: process.env.PINECONE_API_KEY ?? '',
    })

    // Connect to the MongoDB database
    await connectDB()

    // Sanitize the question by removing whitespace and newlines
    const sanitizedQuestion = question.trim().replaceAll('\n', ' ')

    // Initialize the Pinecone client with the environment variables
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? '',
      apiKey: process.env.PINECONE_API_KEY ?? '',
    })

    // Get the Pinecone index with the specified name
    const index = pinecone.Index(PINECONE_INDEX_NAME)

    // Create the Pinecone store from the OpenAI embeddings
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: selectedNamespace,
      },
    )

    // Create a new user message object
    const userMessage = new Message({
      sender: 'user',
      content: sanitizedQuestion,
      chatId: chatId,
      namespace: selectedNamespace,
    })


    // Save the user message to the database
    await userMessage.save()

    // Set up the prompt for the conversational retrieval QA chain
    const CONDENSE_PROMPT = `Given the following conversation and a follow-up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`

    // Set up the prompt for the QA model
    const QA_PROMPT = `Use the following context to answer the question at the end.
If you don't know the answer, say that you don't know. Do not make up answers.

{context}

Question: {question}
Answer in markdown:`


    // Create a new OpenAI model with the specified settings
    const model = new OpenAI({
      temperature: 0,
      modelName: 'gpt-3.5-turbo',
    })

    // Create a new conversational retrieval QA chain from the model and Pinecone store

    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        qaTemplate: QA_PROMPT,
        questionGeneratorTemplate: CONDENSE_PROMPT,
        returnSourceDocuments: false,
      },
    )

    // Call the QA chain with the user´s question and chat history

    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    })

    // Create a new bot message object with the response text

    console.log('response', response)

    const botMessage = new Message({
      sender: 'bot',
      content: response.text.toString(),
      chatId: chatId,
      namespace: selectedNamespace,
    })

    await botMessage.save()

    res
      .status(200)
      .json({ text: response.text, sourceDocuments: response.sourceDocuments })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error: error.message || 'Something went wrong' })
  }
})

app.post('/api/consume', async (req, res) => {
  const { namespaceName } = req.query
  const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? ''

  const filePath = 'docs'

  if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
    throw new Error('Pinecone environment or api key vars missing')
  }

  const initPinecone = async () => {
    try {
      const pinecone = new PineconeClient()

      await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT ?? '',
        apiKey: process.env.PINECONE_API_KEY ?? '',
      })

      return pinecone
    } catch (error) {
      console.log('error', error)
      throw new Error('Failed to initialize Pinecone Client')
    }
  }

  const pinecone = await initPinecone()

  class BufferLoader extends BaseDocumentLoader {
    constructor(filePathOrBlob) {
      super()
      this.filePathOrBlob = filePathOrBlob
    }

    async parse(raw, metadata) {
      throw new Error('Method not implemented.')
    }

    async load() {
      let buffer
      let metadata
      if (typeof this.filePathOrBlob === 'string') {
        buffer = await readFile(this.filePathOrBlob)
        metadata = { source: this.filePathOrBlob }
      } else {
        buffer = await this.filePathOrBlob
          .arrayBuffer()
          .then((ab) => Buffer.from(ab))
        metadata = { source: 'blob', blobType: this.filePathOrBlob.type }
      }
      return this.parse(buffer, metadata)
    }
  }

  class CustomPDFLoader extends BufferLoader {
    async parse(raw, metadata) {
      const { pdf } = await PDFLoaderImports()
      const parsed = await pdf(raw)
      return [
        new Document({
          pageContent: parsed.text,
          metadata: {
            ...metadata,
            pdf_numpages: parsed.numpages,
          },
        }),
      ]
    }
  }

  async function PDFLoaderImports() {
    try {
      const { default: pdf } = await import('pdf-parse/lib/pdf-parse.js')
      return { pdf }
    } catch (e) {
      console.error(e)
      throw new Error(
        'Failed to load pdf-parse. Please install it with eg. `npm install pdf-parse`.',
      )
    }
  }

  try {
    /* Load raw docs from all files in the directory */
    const directoryLoader = new DirectoryLoader('docs', {
      '.pdf': (path) => new CustomPDFLoader(path),
    })

    const rawDocs = await directoryLoader.load()

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })

    const docs = await textSplitter.splitDocuments(rawDocs)

    /* Convert each chunk to embeddings */
    const embeddings = new OpenAIEmbeddings()
    const index = pinecone.Index(PINECONE_INDEX_NAME) //change to your own index name

    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: namespaceName,
      textKey: 'text',
    })

    /* Remove all PDF files in the directory */
    const pdfFiles = fs
      .readdirSync(filePath)
      .filter((file) => file.endsWith('.pdf'))
    pdfFiles.forEach((file) => {
      fs.unlinkSync(`${filePath}/${file}`)
    })

    res.status(200).json({ message: 'Data ingestion complete' })
  } catch (error) {
    console.error('Error ingesting documents', error)
    res.status(500).send('Internal Server Error')
  }
})

app.post('/api/create-chat', async (req, res) => {
  try {
    await connectDB()

    const { chatId, namespace } = req.body

    const newChat = new ChatModel({
      chatId,
      namespace,
    })

    await newChat.save()

    res.status(201).json(newChat)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create new chat' })
  }
})

app.delete('/api/delete-chat', async (req, res) => {
  const chatId = req.body.chatId
  const namespace = req.body.namespace

  if (!chatId || !namespace) {
    res.status(400).send('Bad request: chatId and namespace are required')
    return
  }

  try {
    await connectDB()

    await Message.deleteMany({ chatId, namespace })
    await ChatModel.deleteOne({ chatId, namespace })

    res.status(200).send('Chat and its messages deleted successfully')
  } catch (error) {
    console.error('Error deleting chat:', error)
    res.status(500).send('Internal server error')
  }
})

app.delete('/api/deleteNamespace', async (req, res) => {
  const { namespace } = req.query
  const targetIndex = process.env.PINECONE_INDEX_NAME ?? ''

  if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
    res
      .status(500)
      .json({ error: 'Pinecone environment or api key vars missing' })
    return
  }

  const initPinecone = async () => {
    try {
      const pinecone = new PineconeClient()

      await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT ?? '',
        apiKey: process.env.PINECONE_API_KEY ?? '',
      })

      return pinecone
    } catch (error) {
      console.log('error', error)
      throw new Error('Failed to initialize Pinecone Client')
    }
  }

  const pinecone = await initPinecone()

  try {
    const index = pinecone.Index(targetIndex)
    await index._delete({
      deleteRequest: {
        namespace,
        deleteAll: true,
      },
    })
    res.status(200).json({ message: 'Namespace deleted successfully.' })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error: 'Failed to delete the namespace.' })
  }
})

app.get('/api/getNamespaces', async (req, res) => {
  try {
    if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
      throw new Error('Pinecone environment or api key vars missing')
    }

    const pinecone = new PineconeClient()

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? '',
      apiKey: process.env.PINECONE_API_KEY ?? '',
    })

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME ?? '')
    const indexStats = await index.describeIndexStats({
      describeIndexStatsRequest: {
        filter: {},
      },
    })
    const namespaces = indexStats.namespaces
      ? Object.keys(indexStats.namespaces)
      : []

    res.status(200).json(namespaces)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ message: 'Failed to get namespaces' })
  }
})

app.get('/api/history', async (req, res) => {
  try {
    // Connect to the database
    await connectDB()

    const chatId = req.query.chatId

    // Retrieve messages from the database
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 })

    // Send the messages as a response
    res.status(200).json(messages)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error: error.message || 'Something went wrong' })
  }
})

app.post('/api/upload', (req, res) => {
  const form = new multiparty.Form()

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: 'Error parsing form data' })
    }

    if (!files) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const uploadedFiles = []
    for (const file of Object.values(files)) {
      if (!file || file.length === 0) {
        continue
      }

      const uploadedFile = file[0]
      const oldPath = uploadedFile.path
      const newPath = path.join(
        process.cwd(),
        'docs',
        uploadedFile.originalFilename,
      )

      fs.renameSync(oldPath, newPath)
      uploadedFiles.push(uploadedFile.originalFilename)
    }

    if (uploadedFiles.length > 0) {
      return res.status(200).json({
        message: `Files ${uploadedFiles.join(', ')} uploaded and moved!`,
      })
    } else {
      return res.status(400).json({ message: 'No files uploaded' })
    }
  })
})

// Define your API routes
app.post('/api/signup', async (req, res) => {
  const { fName, lName, email, password, companyName } = req.body
  try {
    await connectDB()
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
    await connectDB()
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
    await connectDB()
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
    await connectDB()
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
  await connectDB()
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
      success_url: `https://chatbot-ui-two-omega-67.vercel.app/success`,
      cancel_url: `https://chatbot-ui-two-omega-67.vercel.app/cancel`,
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
    await connectDB()
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

app.listen(5000, () => {
  console.log('Server is running on port 5000')
})

