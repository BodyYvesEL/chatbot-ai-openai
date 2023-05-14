import React from 'react'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
export default function useNamespaces() {
  const [namespaces, setNamespaces] = useState([])
  const [namespaceSource, setNamespaceSource] = useState([])
  const [selectedNamespace, setSelectedNamespace] = useState('')
  React.useEffect(() => {
    fetchNamespaces()
  }, [])

  const fetchNamespaces = async () => {
    try {
      const authToken = await Cookies.get('token')
      const response = await fetch('http://localhost:5000/api/getNamespaces', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      const data = await response.json()

      if (response.ok) {
        console.log(data)
        setNamespaces(data.namespaceNames)
        setNamespaceSource(data.namespaceSources)
      } else {
        console.error(data.error)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  return { namespaces, selectedNamespace, setSelectedNamespace, namespaceSource }
}
