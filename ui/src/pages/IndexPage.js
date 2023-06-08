import React from 'react'
import { useRef, useState, useEffect } from 'react'
import useNamespaces from '../hooks/useNamespaces'
import { useChats } from '../hooks/useChats'
import { NamespaceList } from '../components/sidebar/NamespaceList'
import MessageList from '../components/chatWindow/MessageList'
import ChatList from '../components/sidebar/ChatList'
import ChatForm from '../components/chatWindow/ChatForm'
import { useCallback } from 'react'
import { ArrowLongRightIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'
import Header2 from '../components/Header2'
import { useColorModeValue } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import DashboardSettings from './Settings'
import Cookies from 'js-cookie'
export default function Home({ initialNamespace }) {
  const router = useNavigate()
  const [query, setQuery] = useState('')
  const [chatId, setChatId] = useState('1')
  const [showDrawer, setShowDrawer] = useState(false)

  const {
    namespaces,
    selectedNamespace,
    setSelectedNamespace,
    namespaceSource,
  } = useNamespaces()

  const {
    chatList,
    selectedChatId,
    setSelectedChatId,
    createChat,
    deleteChat,
    chatNames,
    updateChatName,
  } = useChats(selectedNamespace)

  const nameSpaceHasChats = chatList.length > 0

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [messageState, setMessageState] = useState({
    messages: [
      {
        message: 'Hi, what would you like to know about these documents?',
        type: 'apiMessage',
      },
    ],
    history: [],
  })

  const { messages, history } = messageState
  const [isModalOpen, setModalOpen] = useState(false)

  const [email, setEmail] = useState(null)
  const openModal = () => {
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }
  // console.log(chatList);

  const messageListRef = useRef(null)
  const textAreaRef = useRef(null)

  const fetchChatHistory = useCallback(async () => {
    try {
      const authToken = await Cookies.get('token')
      const response = await fetch(
        `http://localhost:5001/api/history?chatId=${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
      const { messages: data, email: userEmail } = await response.json()
      setMessageState((state) => ({
        ...state,
        messages: data.map((message) => ({
          type: message.sender === 'user' ? 'userMessage' : 'apiMessage',
          message: message.content,
        })),
      }))
      setEmail(userEmail)
    } catch (error) {
      console.error('Failed to fetch chat history:', error)
    }
  }, [chatId])

  useEffect(() => {
    if (!selectedNamespace && namespaces.length > 0) {
      setSelectedNamespace(namespaces[0])
    }
  }, [namespaces, selectedNamespace, setSelectedNamespace])

  useEffect(() => {
    if (selectedChatId) {
      fetchChatHistory()
    }
  }, [selectedChatId, fetchChatHistory])

  useEffect(() => {
    if (initialNamespace) {
      setSelectedNamespace(initialNamespace)
    }
  }, [initialNamespace, setSelectedNamespace])

  useEffect(() => {
    textAreaRef.current?.focus()
  }, [])

  useEffect(() => {
    fetchChatHistory()
  }, [chatId, fetchChatHistory])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!query) {
      alert('Please input a question')
      return
    }

    const question = query.trim()
    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }))
    setLoading(true)
    setQuery('')

    try {
      const authToken = await Cookies.get('token')

      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          question,
          history,
          chatId,
          selectedNamespace,
        }),
      })

      const data = await response.json()
      console.log('data', data)

      if (data.error) {
        setError(data.error)
      } else {
        const messageWords = data.text.split(' ')
        let currentIndex = 0
        let currentMessage = ''

        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: '', // Empty message as a placeholder for the typing effect
              sourceDocs: data.sourceDocuments,
            },
          ],
        }))
        console.log(data)

        const interval = setInterval(() => {
          currentMessage += messageWords[currentIndex] + ' '

          setMessageState((state) => {
            const updatedMessages = [...state.messages]
            const lastMessageIndex = updatedMessages.length - 1
            updatedMessages[lastMessageIndex] = {
              ...updatedMessages[lastMessageIndex],
              message: currentMessage,
            }
            return {
              ...state,
              messages: updatedMessages,
            }
          })

          currentIndex++

          if (currentIndex >= messageWords.length) {
            clearInterval(interval)
          }
        }, 200) // Adjust the typing speed by changing the interval duration
      }

      console.log('messageState', messageState)

      setLoading(false)

      messageListRef.current?.scrollTo(0, messageListRef.current?.scrollHeight)
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      if (error) {
        console.error('Server responded with:', error)
      }
      setError('An error occurred while fetching the data. Please try again.')
    }
  }

  const handleEnter = (e) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e)
    } else if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  console.log(messages.length)
  const textColor = useColorModeValue('gray.200', 'white')
  return (
    <>
      <Header2 />
      <div className={`flex pb-40 ${!nameSpaceHasChats ? 'h-screen' : ''}`}>
        <button
          type="button"
          className="fixed z-50 top-14 left-2 lg:hidden"
          onClick={() => setShowDrawer(!showDrawer)}
        >
          <span className="sr-only">Open menu</span>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div
          className={`z-1 fixed top-14 left-0 w-1/2 md:w-1/6 h-screen flex flex-col gap-y-5 overflow-y-auto px-6 ${
            !showDrawer ? 'invisible md:visible' : ''
          } bg-gray-800 `}
          id="responsive"
        >
          <div className="flex h-4 shrink-0 items-center"></div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-6">
              <NamespaceList
                namespaces={namespaces}
                selectedNamespace={selectedNamespace}
                setSelectedNamespace={setSelectedNamespace}
              />
              <ChatList
                chatList={chatList}
                chatNames={chatNames}
                selectedChatId={selectedChatId}
                setChatId={setChatId}
                setSelectedChatId={setSelectedChatId}
                createChat={createChat}
                updateChatName={updateChatName}
                deleteChat={deleteChat}
              />
            </ul>
          </nav>
          <button
            type="button"
            className="rounded-lg bg-indigo-900 text-md text-gray-200 leading-6 font-semibold  px-3.5 py-2.5 text-white border border-solid border-gray-500 shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 mb-40"
            onClick={openModal}
          >
            Manage Documents
          </button>
          <div className="-mt-20 mb-20 text-gray-400 text-sm text-center p-2 outline-dashed outline-2 outline-offset-2">
            {email}
          </div>
        </div>
        <main className="py-10 w-full h-full md:pl-72">
          <div className={`px-4 sm:px-6 lg:px-8 h-full flex flex-col`}>
            {nameSpaceHasChats ? (
              <>
                {messages.length === 0 ? (
                  <h2
                    className={`text-2xl mb-3 text-center font-semibold tracking-wide ${textColor}`}
                  >
                    Give your bot a name and start prompting...
                  </h2>
                ) : (
                  <h2
                    className={`text-2xl mb-3 text-center font-semibold tracking-wide ${textColor}`}
                  >
                    Chat Topic{' '}
                    <ArrowLongRightIcon className="inline-block h-6 w-6 mx-2" />
                    {chatNames[selectedChatId] || 'Untitled Chat'}
                  </h2>
                )}

                <div
                  className={`flex flex-col items-stretch ${
                    messages.length > 0 ? 'flex-grow' : ''
                  }`}
                >
                  <MessageList
                    messages={messages}
                    loading={loading}
                    messageListRef={messageListRef}
                  />
                  <div className="flex items-center justify-center mx-auto">
                    <div className="fixed bottom-0 transform  w-[95%] md:w-[75%] pb-6 md:pr-6">
                      <ChatForm
                        loading={loading}
                        error={error}
                        query={query}
                        textAreaRef={textAreaRef}
                        handleEnter={handleEnter}
                        handleSubmit={handleSubmit}
                        setQuery={setQuery}
                        messages={messages}
                        source={namespaceSource}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-screen">
                <h1 className={`text-2xl font-semibold ${textColor}`}>Welcome</h1>
                <p className={`text-sm mt-4 ${textColor} border border-solid border-gray-500 rounded-lg p-4`}>
                  Go to the sidebar...start by managing your documents and create a chat.
                </p>
              </div>
            )}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Upload a document</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <DashboardSettings />
                </ModalBody>
                <ModalFooter>
                  <button onClick={closeModal}>Close</button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </main>
      </div>
    </>
  )
}
