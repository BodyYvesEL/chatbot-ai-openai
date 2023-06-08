import { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import Cookies from 'js-cookie'

export function useChats(namespace) {
  const [chatList, setChatList] = useState([])
  const [chatNames, setChatNames] = useState({})
  const [selectedChatId, setSelectedChatId] = useState('')

  useEffect(() => {
    // Fetch chat list and chat names from MongoDB
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5001/api/getChats', // Update the API endpoint to fetch chat data
          {
            headers: {
              Authorization: `Bearer ${await Cookies.get('token')}`,
            },
            params: {
              namespace: namespace,
            },
          },
        )

        const { chatIds, chatNames } = response.data
        setChatList(chatIds)
        setChatNames(chatNames)
      } catch (error) {
        console.error('Failed to fetch chat data:', error)
      }
    }

    fetchData()
  }, [namespace])

  function updateChatName(chatId, newChatName) {
    const updatedChatNames = { ...chatNames, [chatId]: newChatName }
    setChatNames(updatedChatNames)

    axios
      .put(
        `http://localhost:5001/api/update-chat/${chatId}`,
        { chatName: newChatName }, // Include 'chatName' field in the request body
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        },
      )
      .catch((error) => {
        console.error('Failed to update chat name:', error)
      })
  }

  async function createChat() {
    const newChatId = uuidv4()

    // Add new chat to the chat list
    const updatedChatList = [...chatList, newChatId]
    setChatList(updatedChatList)

    try {
      // Create chat in MongoDB
      await axios.post(
        'http://localhost:5001/api/create-chat', // Update the API endpoint to create chat data
        {
          chatId: newChatId,
          chatName: 'Untitled', // Add an empty chatName field
          namespace,
        },
        {
          headers: {
            Authorization: `Bearer ${await Cookies.get('token')}`,
          },
        },
      )
    } catch (error) {
      console.error('Failed to create new chat:', error)
    }

    return newChatId
  }

  async function deleteChat(chatIdToDelete) {
    // Remove chat from the chat list
    const updatedChatList = chatList.filter(
      (chatId) => chatId !== chatIdToDelete,
    )
    setChatList(updatedChatList)

    try {
      // Delete chat from MongoDB
      await axios.delete(
        'http://localhost:5001/api/delete-chat', // Update the API endpoint to delete chat data
        {
          headers: {
            Authorization: `Bearer ${await Cookies.get('token')}`,
          },
          data: {
            chatId: chatIdToDelete,
            namespace: namespace,
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
