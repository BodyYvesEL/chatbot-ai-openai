import React from 'react'
import LoadingDots from '../other/LoadingDots'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import { useColorModeValue } from '@chakra-ui/react'

const ChatForm = ({
  loading,
  error,
  query,
  textAreaRef,
  handleEnter,
  handleSubmit,
  setQuery,
  messages,
  source,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const generatePdf = (data) => {
    const doc = new jsPDF()
    let y = 20

    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Chat', 10, y)

    y += 20

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')

    /*
    data.forEach(({ type, message }) => {
      const text = `${type}: ${message}`
      doc.text(text, 10, y)
      y += 10
    })
    */

    data.forEach(({ type, message }) => {
      const lines = doc.splitTextToSize(`${type}: ${message}`, 180)
      doc.text(lines, 10, y)
      y += lines.length * 10
    })

    doc.save('chat.pdf')
  }
  const generateSourcePdf = (data) => {
    const doc = new jsPDF()
    const text = data.toString()

    let lines = doc.splitTextToSize(text, doc.internal.pageSize.width - 20)
    let y = 20
    for (let i = 0; i < lines.length; i++) {
      if (y > doc.internal.pageSize.height - 20) {
        doc.addPage()
        y = 20
      }
      doc.text(10, y, lines[i])
      y += 7
    }

    doc.save('source.pdf')
  }
  const generateTxt = (data) => {
    const formattedData = data
      .map(({ type, message }) => `${type}: ${message}`)
      .join('\n')
    const blob = new Blob([formattedData], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, 'chat.txt')
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <div className="flex flex-col space-y-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <textarea
            disabled={loading}
            onKeyDown={handleEnter}
            ref={textAreaRef}
            autoFocus={false}
            rows={1}
            maxLength={512}
            id="userInput"
            name="userInput"
            placeholder={
              loading ? 'Waiting for response...' : 'Give me a summary'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`flex-1 border  ${useColorModeValue(
              'bg-gray-200',
              'bg-gray-800',
            )} shadow-xl rounded-2xl border-gray-500 p-4 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none h-[80px]`}
          />

          <button
            className="bg-teal-900 shadow-xl border hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-900 focus:border-transparent"
            onClick={(e) => {
              e.preventDefault()
              toggleDropdown()
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>
          {isOpen && (
            <div
              onMouseLeave={(e) => {
                e.preventDefault()
                setIsOpen(false)
              }}
              className="absolute right-0 -mt-10 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            >
              <div className="py-1 border border-solid border-orange-500 rounded-lg">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log(source[0])
                    generateSourcePdf(source[0])
                  }}
                >
                  Download Source
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={(e) => {
                    e.preventDefault()
                    generatePdf(messages)
                  }}
                >
                  Download PDF
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={(e) => {
                    e.preventDefault()
                    generateTxt(messages)
                  }}
                >
                  Download TXT
                </button>
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-900 shadow-xl border hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-900 focus:border-transparent"
          >
            {loading ? (
              <div>
                <LoadingDots color="#ff7900" />
              </div>
            ) : (
              <PaperAirplaneIcon className="h-6 w-6" />
            )}
          </button>
        </form>
        {error && (
          <div className="border border-red-400 rounded-md p-4">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatForm