import React from 'react'
import { useColorMode } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useColorModeValue } from '@chakra-ui/react'

function Header2({ current }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const authToken = Cookies.get('token')

  const router = useNavigate()
  if (!authToken) {
    router('/login')
  }
  const handleLogout = () => {
    Cookies.remove('token')
    router('/login')
  }

  const chatTextColor = useColorModeValue('text-slate-300', 'text-slate-300')
  const settingsTextColor = useColorModeValue(
    'text-slate-300',
    'text-slate-300',
  )

  const bg = useColorModeValue('bg-slate-800', 'bg-slate-800')

  return (
    <nav
      className={`z-999 w-full h-14 px-6 shrink-0 text-white flex items-center sticky top-0 ${bg}`}
    >
      {' '}
      <div className="flex-1 flex relative">
        <div className="visible md:invisible flex items-center -ml-4">
          <div
            data-headlessui-state
            className="relative inline-block text-left"
          >
            <button
              id="headlessui-menu-button-1"
              type="button"
              aria-haspopup="menu"
              aria-expanded="false"
              data-headlessui-state
              className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-slate-50 select-none"
            >
              <span className="flex items-center gap-2">Chat </span>
            </button>
            {/**/}
          </div>
        </div>
        <div className="invisible md:visible md:flex gap-4 py-2">
          <a
            className={
              current === 0
                ? `px-4 py-2 font-medium rounded-lg flex gap-2 ${chatTextColor} bg-slate-900`
                : `px-4 py-2 font-medium rounded-lg flex gap-2 ${chatTextColor} hover:text-slate-50 hover:bg-orange-500`
            }
            href="/dashboard"
          >
            Chat
          </a>
          <a
            className={
              current === 2
                ? `px-4 py-2 font-medium rounded-lg flex gap-2 ${settingsTextColor} bg-slate-900`
                : `px-4 py-2 font-medium rounded-lg flex gap-2 ${settingsTextColor} hover:text-slate-50 hover:bg-orange-500`
            }
            href="/settings"
          >
            Settings
          </a>
        </div>

        <div className="ml-auto inline-flex items-center justify-center">
          <button
            onClick={toggleColorMode}
            className="inline-flex items-center justify-center text-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-4"
          >
            {colorMode === 'light' ? '🌙' : '🔆'}
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center text-md font-medium transition-colors focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-4"
            style={{
              marginLeft: '1rem',
              backgroundColor: colorMode === 'light' ? 'black' : null,
              color: colorMode === 'light' ? 'white' : null,
              borderRadius: colorMode === 'light' ? '0.5rem' : null,
              display: authToken ? 'block' : 'none',
              lineHeight: '2.1rem', // Adjust this value to match the height of the button
            }}
          >
            Logout
          </button>
        </div>
        {/**/}
      </div>
    </nav>
  )
}

export default Header2