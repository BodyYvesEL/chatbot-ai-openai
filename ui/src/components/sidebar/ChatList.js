import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid'
import Swal from 'sweetalert2'

const ChatList = (props) => {
  const {
    chatList,
    chatNames,
    selectedChatId,
    setChatId,
    setSelectedChatId,
    createChat,
    updateChatName,
    deleteChat,
  } = props

  return (
    <li>
      <div className="border border-white p-2 rounded-lg flex gap-2 items-center mb-10 bg-gray-800 hover:bg-orange-500">
        <PlusIcon className="h-6 w-6 text-gray-200" aria-hidden="true" />
        <button
          className="w-full text-left transition-colors text-gray-200 "
          onClick={async () => {
            const newChatId = await createChat()
            setChatId(newChatId)
            setSelectedChatId(newChatId)
          }}
        >
          Create new chat
        </button>
      </div>

      <ul role="list" className="space-y-1">
        <p className="text-md text-gray-200 leading-6 font-semibold">
          Chat History
        </p>
        {chatList.map((chatId, index) => (
          <li
            key={chatId}
            className={`my-2 p-2 rounded-lg cursor-pointer pl-4 flex flex-grow text-left transition-colors ${
              chatId === selectedChatId
                ? 'bg-gray-700 text-white'
                : 'bg-none text-gray-200 hover:bg-orange-500'
            }`}
            onClick={() => {
              setChatId(chatId)
              setSelectedChatId(chatId)
            }}
          >
            <p>{chatNames[chatId] || `Chat ${index}`}</p>

            {chatId === selectedChatId && (
              <div className="ml-auto">
                <button
                  className="text-gray-300 hover:text-gray-400 ml-2"
                  onClick={(e) => {
                    e.stopPropagation()

                    Swal.fire({
                      title: 'Enter a new name for this chat:',
                      input: 'text',
                      showCancelButton: true,
                      confirmButtonText: 'Update',
                      cancelButtonText: 'Cancel',
                    }).then((result) => {
                      if (result.isConfirmed && result.value) {
                        updateChatName(chatId, result.value)
                      }
                    })
                  }}
                >
                  <PencilIcon className="h-4 w-4" style={{ color: 'green' }} />
                </button>

                <button
                  className="text-red-500 hover:text-red-600 ml-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteChat(chatId)
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </li>
  )
}

export default ChatList