import React, { useState, useEffect } from 'react'
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'
import Header2 from '../components/Header2'
import Cookies from 'js-cookie'
const Settings = () => {
  const [selectedFiles, setSelectedFiles] = useState(null)
  const [namespaceName, setNamespaceName] = useState('')
  const [deleteMessage, setDeleteMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [namespaces, setNamespaces] = useState([])
  const router = useNavigate()
  React.useEffect(() => {
    fetchNamespaces()
  }, [])

  const fetchNamespaces = async () => {
    try {
      const authToken = await Cookies.get('token')
      if (authToken && authToken.length > 0) {
        const response = await fetch(
          'http://localhost:5000/api/getNamespaces',
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        )
        const data = await response.json()

        if (response.ok) {
          setNamespaces(data.namespaceNames)
        } else {
          setError(data.error)
        }
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDelete = async (namespace) => {
    try {
      const authToken = await Cookies.get('token')
      const response = await fetch(
        `http://localhost:5000/api/deleteNamespace?namespace=${namespace}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      if (response.ok) {
        const updatedNamespaces = namespaces.filter(
          (item) => item !== namespace,
        )
        setNamespaces(updatedNamespaces)
        setDeleteMessage(`${namespace} has been successfully deleted.`)
      } else {
        const data = await response.json()
        console.log(data.error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(event.target.files)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFiles = event.dataTransfer.files
    setSelectedFiles(droppedFiles)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return

    const formData = new FormData()
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append(`myfile${i}`, selectedFiles[i])
    }

    try {
      const authToken = await Cookies.get('token')
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        setMessage('Files uploaded successfully!')
      } else {
        const errorData = await response.json()
        setError(errorData.error)
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const handleIngest = async () => {
    try {
      setLoading(true)
      const authToken = await Cookies.get('token')
      const response = await fetch(
        `http://localhost:5000/api/consume?namespaceName=${namespaceName}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        setMessage(data.message)
        router('/dashboard')
      } else {
        const errorData = await response.json()
        setError(errorData.error)
      }
    } catch (error) {
      setError(error.message)
    }

    setLoading(false)
  }
  return (
    <>
      <div className="mx-auto h-[25rem] overflow-y-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center mt-6 text-xl border border-solid border-gray-500 rounded-lg p-4">
          Select or drag a file in for upload
        </p>
        <div
          className="mt-8 flex justify-center "
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <label className="w-full h-[10rem] flex flex-col items-center px-4 py-12 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-dashed border-blue hover:bg-blue hover:text-blue-900 cursor-pointer">
            <svg
              className="w-8 h-8"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 6h-5v-5a1 1 0 00-2 0v5h-5a1 1 0 000 2h5v5a1 1 0 002 0v-5h5a1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="mt-2 text-base leading-normal text-center text-gray-500">
              {selectedFiles
                ? Array.from(selectedFiles)
                    .map((file) => file.name)
                    .join(', ')
                : 'Select a file'}
            </span>
            <input
              type="file"
              name="myfile"
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
          </label>
        </div>

        <div className="flex justify-center mt-6">
          {selectedFiles && selectedFiles.length > 0 && (
            <button
              onClick={handleUpload}
              className="bg-blue-500 w-1/3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirm upload
            </button>
          )}
        </div>

        {message && (
          <div className="mt-4">
            <label className="text-center text-xl mt-10 block  font-semibold mb-2">
              Document name
            </label>
            <div className="flex flex-col w-[200px] mx-auto justify-center gap-4">
              <input
                type="text"
                value={namespaceName}
                onChange={(e) => setNamespaceName(e.target.value)}
                className="appearance-none block bg-gray-800 text-gray-200 mt-2 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-gray-700 focus:border-gray-700"
              />
              {namespaceName && (
                <button
                  onClick={handleIngest}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  rounded"
                >
                  Ingest
                </button>
              )}
            </div>
          </div>
        )}

        {loading && <p className="mt-8 text-center ">Loading...</p>}
        {error && (
          <p className="mt-8 text-center text-red-500">
            {error.includes('Upgrade') ? (
              <span dangerouslySetInnerHTML={{ __html: error }} />
            ) : (
              error
            )}
          </p>
        )}

        {message && (
          <p className="mt-8 text-center text-xl text-bold text-green-500">
            {message}
          </p>
        )}

        <div className="mt-8 max-w-xl mx-auto">
          {namespaces.length > 0 && (
            <h2 className="mb-2 mt-12 text-center text-2xl font-semibold">
              Your Uploaded Documents
            </h2>
          )}

          <ul role="list" className="divide-y divide-gray-700">
            {namespaces.map((namespace) => (
              <li
                key={namespace}
                className="flex items-center justify-between gap-x-6 py-5"
              >
                <div className="min-w-0">
                  <div className="flex items-start gap-x-3">
                    <p className="text-md font-semibold leading-6 ">
                      {namespace}
                    </p>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-x-4">
                  <button
                    className=" rounded-lg bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-inset ring-gray-300 hover:bg-red-700 sm:block"
                    onClick={() => handleDelete(namespace)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {deleteMessage && (
            <p className="text-green-600 text-bold mt-8 text-center ">
              {deleteMessage}
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default Settings