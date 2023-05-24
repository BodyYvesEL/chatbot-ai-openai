require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { OpenAIEmbeddings } = require('langchain/embeddings/openai')
const { PineconeStore } = require('langchain/vectorstores/pinecone')
const Message = require('./models/Message')
const { OpenAI } = require('langchain/llms/openai')
const { ConversationalRetrievalQAChain } = require('langchain/chains')
const { PineconeClient } = require('@pinecone-database/pinecone')
const connectDB = require('./utils/mongoConnection')
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory')
const fs = require('fs')
const util = require('util')
const stat = util.promisify(fs.stat)
const { Document } = require('langchain/document')
const { readFile } = require('fs/promises')
const { BaseDocumentLoader } = require('langchain/document_loaders')
const ChatModel = require('./models/ChatModel')
const multiparty = require('multiparty')
const path = require('path')
const bcrypt = require('bcryptjs')

const User = require('./models/Users')
const Namespace = require('./models/Namespace')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const nodemailer = require('nodemailer')

const app = express()

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/api/chat', async (req, res) => {
  const { question, history, chatId, selectedNamespace } = req.body
  // Get the authorization header from the request
  const authHeader = req.headers['authorization']

  // Extract the token from the authorization header
  const token = authHeader && authHeader.split(' ')[1]

  // Verify the token to get the payload (which contains the email)
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  const userEmail = payload.email

  const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? ''

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' })
  }

  try {
    const pinecone = new PineconeClient({
      environment: process.env.PINECONE_ENVIRONMENT ?? '',
      apiKey: process.env.PINECONE_API_KEY ?? '',
    })

    await connectDB()

    const sanitizedQuestion = question.trim().replaceAll('\n', ' ')

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? '',
      apiKey: process.env.PINECONE_API_KEY ?? '',
    })

    const index = pinecone.Index(PINECONE_INDEX_NAME)

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: selectedNamespace,
      },
    )

    const userMessage = new Message({
      sender: 'user',
      content: sanitizedQuestion,
      chatId: chatId,
      namespace: selectedNamespace,
      userEmail: userEmail,
    })

    await userMessage.save()

    const CONDENSE_PROMPT = `Given the following conversation and a follow-up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`

    const QA_PROMPT = `Use the following context to answer the question at the end.
If you don't know the answer, say that you don't know. Do not make up answers.

{context}

Question: {question}
Answer in markdown:`

    const model = new OpenAI({
      temperature: 0,
      modelName: 'gpt-3.5-turbo',
    })

    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        qaTemplate: QA_PROMPT,
        questionGeneratorTemplate: CONDENSE_PROMPT,
        returnSourceDocuments: false,
      },
    )

    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    })

    console.log('response', response)

    const botMessage = new Message({
      sender: 'bot',
      content: response.text.toString(),
      chatId: chatId,
      namespace: selectedNamespace,
      userEmail: userEmail,
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

app.get('/api/getChats', async (req, res) => {
  const namespace = req.query.namespace
  // Get the authorization header from the request
  const authHeader = req.headers['authorization']

  // Extract the token from the authorization header
  const token = authHeader && authHeader.split(' ')[1]
  // Verify the token to get the payload (which contains the email)
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  const userEmail = payload.email

  try {
    await connectDB()
    const userChats = await ChatModel.find({ userEmail, namespace })
    const chatIds = userChats.map((chat) => chat.chatId)

    // Fetch chat names for the user's chats
    const chatNames = {}
    for (const chatId of chatIds) {
      const chat = await ChatModel.findOne({ chatId, namespace })
      if (chat) {
        chatNames[chatId] = chat.chatName // Assuming 'chatName' is the field storing the chat name
      }
    }

    res.status(200).json({ chatIds, chatNames })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ message: 'Failed to get chat data' })
  }
})

app.post('/api/consume', async (req, res) => {
  const { namespaceName } = req.query
  // Get the authorization header from the request
  const authHeader = req.headers['authorization']

  // Extract the token from the authorization header
  const token = authHeader && authHeader.split(' ')[1]

  // Verify the token to get the payload (which contains the email)
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  const userEmail = payload.email

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

    await connectDB()

    // Create a new namespace with the given name and user email
    const newNamespace = new Namespace({
      userEmail: userEmail,
      name: namespaceName,
      source: rawDocs[0].pageContent,
    })
    await newNamespace.save()

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

    res.status(200).json({ message: 'Your data ingestion is complete' })
  } catch (error) {
    console.error('Error ingesting documents', error)
    res.status(500).send('Internal Server Error')
  }
})

app.post('/api/create-chat', async (req, res) => {
  try {
    await connectDB()

    const { chatId, chatName, namespace } = req.body
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const userEmail = payload.email

    const newChat = new ChatModel({
      chatId,
      chatName,
      namespace,
      userEmail,
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
  // Get the authorization header from the request
  const authHeader = req.headers['authorization']

  // Extract the token from the authorization header
  const token = authHeader && authHeader.split(' ')[1]

  // Verify the token to get the payload (which contains the email)
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  const userEmail = payload.email

  if (!chatId || !namespace) {
    res.status(400).send('Bad request: chatId and namespace are required')
    return
  }

  try {
    await connectDB()

    await Message.deleteMany({ chatId, namespace, userEmail })
    await ChatModel.deleteOne({ chatId, namespace, userEmail })

    res.status(200).send('Chat and its messages deleted successfully')
  } catch (error) {
    console.error('Error deleting chat:', error)
    res.status(500).send('Internal server error')
  }
})

app.put('/api/update-chat/:chatId', async (req, res) => {
  const { chatId } = req.params
  const { chatName } = req.body

  try {
    await connectDB()
    const updatedChat = await ChatModel.findOneAndUpdate(
      { chatId },
      { chatName },
      { new: true },
    )
    res.status(200).json(updatedChat)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ message: 'Failed to update chat name' })
  }
})

app.delete('/api/deleteNamespace', async (req, res) => {
  const { namespace } = req.query
  const targetIndex = process.env.PINECONE_INDEX_NAME ?? ''
  // Get the authorization header from the request
  const authHeader = req.headers['authorization']

  // Extract the token from the authorization header
  const token = authHeader && authHeader.split(' ')[1]

  // Verify the token to get the payload (which contains the email)
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  const userEmail = payload.email
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

    await connectDB()
    await Namespace.deleteOne({ name: namespace, userEmail })
    res.status(200).json({ message: 'Namespace deleted successfully.' })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error: 'Failed to delete the namespace.' })
  }
})

app.get('/api/getNamespaces', async (req, res) => {
  // Get the authorization header from the request
  const authHeader = req.headers['authorization']

  // Extract the token from the authorization header
  const token = authHeader && authHeader.split(' ')[1]
  // Verify the token to get the payload (which contains the email)
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  const userEmail = payload.email

  try {
    await connectDB()
    const userNamespaces = await Namespace.find({ userEmail })
    const namespaceNames = userNamespaces.map((namespace) => namespace.name)
    const namespaceSources = userNamespaces.map((namespace) => namespace.source)

    res.status(200).json({ namespaceNames, namespaceSources })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ message: 'Failed to get namespaces' })
  }
})

app.get('/api/history', async (req, res) => {
  // Get the authorization header from the request
  const authHeader = req.headers['authorization']

  // Extract the token from the authorization header
  const token = authHeader && authHeader.split(' ')[1]
  // Verify the token to get the payload (which contains the email)
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  const userEmail = payload.email
  console.log(userEmail)

  try {
    // Connect to the database
    await connectDB()

    const chatId = req.query.chatId
    console.log(chatId)

    // Retrieve messages from the database
    const messages = await Message.find({ chatId, userEmail }).sort({
      createdAt: 1,
    })

    // Send the messages as a response
    res.status(200).json({ messages, email: userEmail })
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

      const customerData = customer.data
      var planId
      if (customerData && customerData.length > 0) {
        const customerId = customerData[0].id

        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          limit: 1,
        })

        const subscription = subscriptions.data[0]
        planId = subscription?.plan?.id
      }
      let limit = 5
      let file_size = 10 //MB
      if (planId === process.env.STANDARD_PLAN) {
        limit = 10
        file_size = 100
      } else if (planId === process.env.PRO_PLAN) {
        limit = 20
        file_size = 200
      }

      const uploadedFile = file[0]
      const oldPath = uploadedFile.path
      const newPath = path.join(
        process.cwd(),
        'docs',
        uploadedFile.originalFilename,
      )

      const fileSizeMB = getFileSizeMB(oldPath)
      if (fileSizeMB > file_size) {
        console.log(fileSizeMB)
        fs.unlinkSync(oldPath)
        return res.status(400).json({
          error:
            'File size exceeds the limit.  <a style="color: lightblue; text-decoration: underline;" href="http://localhost:3000/pricing">Upgrade</a> for more!',
        })
      }

      const count = await Namespace.countDocuments({ userEmail: payload.email })
      if (count >= limit) {
        console.error('Limit Reached! Upgrade for more.')
        return res.status(400).json({
          error:
            'Limit Reached! <a style="color: blue; text-decoration: underline;" href="http://localhost:3000/pricing">Upgrade</a> for more.',
        })
      }

      // Use fs.copyFileSync to copy the file to the destination directory
      fs.copyFileSync(oldPath, newPath)

      // Delete the original file
      fs.unlinkSync(oldPath)

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

function getFileSizeMB(filePath) {
  const fileStats = fs.statSync(filePath)
  return fileStats.size / (1024 * 1024) // Convert to MB
}
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
          from: 'bodymoliki@gmail.com',
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
          from: 'bodymoliki@gmail.com',
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
      success_url: `https://localhost:3000/dashboard`,
      cancel_url: `https://localhost:3000/cancel`,
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
      const response = {
        status: 'Unpaid',
        planId: 'Free Plan',
        email: payload.email,
      }
      console.log(response)
      res.send(response)
      return
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.data[0].id,
      limit: 1,
    })
    if (subscriptions.data.length === 0) {
      console.log(payload.email)
      const response = {
        status: 'Unpaid',
        planId: 'Free Plan',
        email: payload.email,
      }
      console.log(response)
      res.send(response)
      return
    }

    const subscription = subscriptions.data[0]
    const response = {
      status: subscription.status,
      planId:
        subscription.plan.id == process.env.STANDARD_PLAN
          ? 'Standard Plan'
          : 'Pro Plan',
      email: payload.email,
    }
    console.log(response)
    res.send(response)
  } catch (error) {
    console.error('Error while getting subscription:', error.message)
    res.status(500).send('Internal server error')
  }
})

app.listen(5000, () => {
  console.log('Server is running on port 5000')
})
