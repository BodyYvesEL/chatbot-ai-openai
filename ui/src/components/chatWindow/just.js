import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

function MessageList({ messages, loading, messageListRef }) {
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  function scrollToBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  }

  return (
    <div className="flex-grow flex-shrink-0 overflow-y-auto">
      <div ref={messageListRef} className="flex flex-col gap-4 p-4">
        {messages.map((message, index) => {
          let className
          if (message.type === 'apiMessage') {
            className =
              'bg-blue-900 text-white self-start rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
          } else {
            className =
              loading && index === messages.length - 1
                ? 'bg-gray-300 text-gray-800 self-end rounded-bl-3xl rounded-tl-3xl rounded-tr-xl pb-30'
                : 'bg-gray-200 text-gray-800 self-end rounded-bl-3xl rounded-tl-3xl rounded-tr-xl'
          }
          return (
            <div
              key={`chatMessage-${index}`}
              className={`py-2 px-4 shadow-md max-w-2xl ${className}`}
            >
              <ReactMarkdown linkTarget="_blank">
                {message.message}
              </ReactMarkdown>
            </div>
          )
        })}
      </div>
      <style jsx>
        {`
          .overflow-y-auto {
            scrollbar-width: thin;
            scrollbar-color: rgba(107, 114, 128, 0.45) rgba(229, 231, 235, 0.1);
          }
          .overflow-y-auto::-webkit-scrollbar {
            width: 5px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(229, 231, 235, 0.1);
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background-color: rgba(107, 114, 128, 0.45);
            border-radius: 9999px;
          }

          /* Adjust colors for light mode */
          @media (prefers-color-scheme: light) {
            .bg-blue-900 {
              background-color: #004d40;
            }
            .bg-gray-300 {
              background-color: #e2e8f0;
            }
            .bg-gray-200 {
              background-color: #edf2f7;
            }
          }
        `}
      </style>
    </div>
  )
}

export default MessageList