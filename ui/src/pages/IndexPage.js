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
    namespaceSource
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

  // console.log(chatList);

  const messageListRef = useRef(null)
  const textAreaRef = useRef(null)

  const fetchChatHistory = useCallback(async () => {
    try {
      const authToken = await Cookies.get('token')
      const response = await fetch(
        `http://localhost:5000/api/history?chatId=${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
      const data = await response.json()
      setMessageState((state) => ({
        ...state,
        messages: data.map((message) => ({
          type: message.sender === 'user' ? 'userMessage' : 'apiMessage',
          message: message.content,
        })),
      }))
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
      const response = await fetch('http://localhost:5000/api/chat', {
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
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }))
      }
      console.log('messageState', messageState)

      setLoading(false)

      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight)
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



  return (
    <>
      <Header2 current={1} />
      <div
        className={`flex bg-gray-900 pb-40 ${
          !nameSpaceHasChats ? 'h-screen' : ''
        }`}
      >
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
          className={`z-1 fixed top-12 left-0 w-1/2 md:w-1/6 h-screen flex flex-col gap-y-5 overflow-y-auto bg-gray-800 px-6 ${
            !showDrawer ? 'invisible md:visible' : ''
          }`}
          id="responsive"
        >
          <div className="flex h-16 shrink-0 items-center"></div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-12">
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
              <NamespaceList
                namespaces={namespaces}
                selectedNamespace={selectedNamespace}
                setSelectedNamespace={setSelectedNamespace}
              />
            </ul>
          </nav>
          <button
            type="button"
            className="rounded-md bg-indigo-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 mb-12"
            onClick={() => router('/directories/settings')}
          >
            Settings
          </button>
        </div>
        <main className="py-10 w-full h-full md:pl-72">
          <div className="px-4 sm:px-6 lg:px-8 h-full flex flex-col">
            {nameSpaceHasChats ? (
              <>
                {messages.length === 0 ? (
                  <h2 className="text-2xl mb-3 text-center text-gray-200 font-bold tracking-wide">
                    Nothing to show here yet
                  </h2>
                ) : (
                  <h2 className="text-2xl mb-3 text-center text-gray-200 font-bold tracking-wide">
                    Chat topic{'  '}
                    <ArrowLongRightIcon className="inline-block h-6 w-6 mx-2 text-gray-200" />
                    {'  '}
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
                    <div className="fixed bottom-0 md:left-1/2 transform md:-translate-x-1/3 w-[90%] md:w-3/6 pb-6 md:pr-6">
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
              <div className="flex flex-col items-center justify-center h-screen ">
                <h1 className="text-5xl font-bold text-gray-100">Welcome</h1>
                <p className="text-2xl text-gray-100 mt-4">
                  Get started by creating a chat for this topic in the sidebar.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
