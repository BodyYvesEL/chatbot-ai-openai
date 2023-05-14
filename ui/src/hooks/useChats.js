import { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import Cookies from 'js-cookie'

export function useChats(namespace) {
  const [chatList, setChatList] = useState([])
  const [chatNames, setChatNames] = useState({})
  const [selectedChatId, setSelectedChatId] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const chatListJSON = localStorage.getItem(`chatList-${namespace}`)
      if (chatListJSON) {
        console.log(JSON.parse(chatListJSON))
        setChatList(JSON.parse(chatListJSON))
      } else {
        setChatList([])
      }
    }
  }, [namespace])

  // const fetchChats = async () => {
  //   try {
  //     console.log("HERE")
  //     const authToken = await Cookies.get('token')
  //     const response = await fetch('http://localhost:5000/api/getChats', {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //       },
  //       body: JSON.stringify({ namespace }), // Pass the namespace object as the request body
  //       method: 'GET', // Specify the HTTP method as POST
  //     })
  //     const data = await response.json()

  //     if (response.ok) {
  //       console.log(data)
  //       setChatList(data)
  //     } else {
  //       console.error(data.error)
  //     }
  //   } catch (error) {
  //     console.error(error.message)
  //   }
  // }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const chatNamesJSON = localStorage.getItem(`chatNames-${namespace}`)
      if (chatNamesJSON) {
        setChatNames(JSON.parse(chatNamesJSON))
      } else {
        setChatNames({})
      }
    }
  }, [namespace])

  function updateChatName(chatId, newChatName) {
    const updatedChatNames = { ...chatNames, [chatId]: newChatName }
    setChatNames(updatedChatNames)
    localStorage.setItem(
      `chatNames-${namespace}`,
      JSON.stringify(updatedChatNames),
    )
  }

  async function createChat() {
    const newChatId = uuidv4()
    const updatedChatList = [...chatList, newChatId]
    setChatList(updatedChatList)

    localStorage.setItem(
      `chatList-${namespace}`,
      JSON.stringify(updatedChatList),
    )

    try {
      const authToken = await Cookies.get('token')
      await axios.post(
        'http://localhost:5000/api/create-chat',
        {
          chatId: newChatId,
          namespace,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
    } catch (error) {
      console.error('Failed to create new chat:', error)
    }
    return newChatId
  }

  async function deleteChat(chatIdToDelete) {
    const updatedChatList = chatList.filter(
      (chatId) => chatId !== chatIdToDelete,
    )
    setChatList(updatedChatList)
    localStorage.setItem(
      `chatList-${namespace}`,
      JSON.stringify(updatedChatList),
    )

    try {
      const authToken = await Cookies.get('token')
      await axios.delete(
        `http://localhost:5000/api/delete-chat`,
        {
          data: {
            chatId: chatIdToDelete,
            namespace,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }

    if (chatIdToDelete === selectedChatId) {
      const newSelectedChatId =
        updatedChatList.length > 0 ? updatedChatList[0] : ''
      setSelectedChatId(newSelectedChatId)
    }
  }

  return {
    chatList,
    selectedChatId,
    setSelectedChatId,
    createChat,
    deleteChat,
    chatNames,
    updateChatName,
  }
}
