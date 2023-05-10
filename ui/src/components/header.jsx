import './App.css'
import { useColorMode } from '@chakra-ui/react'
import { useState } from 'react'
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  useMediaQuery,
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import Cookies from 'js-cookie'

function Header() {
  const authToken = Cookies.get('token')

  const { colorMode, toggleColorMode } = useColorMode()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isMobileView] = useMediaQuery('(max-width: 768px)')

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
  }

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true)
  }

  return (
    <>
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <div className="flex gap-6 md:gap-10">
            <a href="/" className="items-center space-x-2 md:flex mt-2 md:mt-0">
              <span className="font-bold text-2xl sm:inline-block">QIQO</span>
            </a>
            <nav className="invisible md:visible md:inline-flex gap-6 ml-6">
              <a
                className="flex items-center text-md font-medium transition-colors hover:text-foreground/80 sm:text-md text-foreground/60"
                href="/#features"
              >
                Features
              </a>
              <a
                className="flex items-center text-md font-medium transition-colors hover:text-foreground/80 sm:text-md text-foreground/60"
                href="/pricing"
              >
                Pricing
              </a>
            </nav>
          </div>
          <nav className="invisible md:visible md:inline-flex gap-6">
            <a
              className="inline-flex items-center justify-center text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-4"
              href="/login"
              style={{
                marginLeft: '1rem',
                backgroundColor: colorMode === 'light' ? 'black' : null,
                color: colorMode === 'light' ? 'white' : null,
                borderRadius: colorMode === 'light' ? '0.5rem' : null,
                display: !authToken ? 'block' : 'none',
                lineHeight: '2.1rem', // Adjust this value to match the height of the button
              }}
            >
              Login
            </a>
            <a
              className="inline-flex items-center justify-center text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-4"
              href="/register"
              style={{
                marginLeft: '1rem',
                backgroundColor: colorMode === 'light' ? 'black' : null,
                color: colorMode === 'light' ? 'white' : null,
                borderRadius: colorMode === 'light' ? '0.5rem' : null,
                display: !authToken ? 'block' : 'none',
                lineHeight: '2.1rem', // Adjust this value to match the height of the button
              }}
            >
              Sign up
            </a>
            <a
              className="inline-flex items-center justify-center text-md font-medium transition-colors focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-4"
              href="/dashboard"
              style={{
                marginLeft: '1rem',
                backgroundColor: colorMode === 'light' ? 'black' : null,
                color: colorMode === 'light' ? 'white' : null,
                borderRadius: colorMode === 'light' ? '0.5rem' : null,
                display: authToken ? 'block' : 'none',
                lineHeight: '2.1rem', // Adjust this value to match the height of the button
              }}
            >
              Dashboard
            </a>
            <button
              onClick={toggleColorMode}
              className="inline-flex items-center justify-center text-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-4"
            >
              {colorMode === 'light' ? '🌙' : '🔆'}
            </button>
          </nav>
          {isMobileView && (
            <>
              <button onClick={toggleColorMode}>
                {colorMode === 'light' ? '🌙' : '🔆'}
              </button>
              <button
                onClick={handleDrawerOpen}
                className="inline-flex items-center justify-center md:hidden text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <HamburgerIcon boxSize={6} />
              </button>
            </>
          )}
        </div>
      </header>
      {isMobileView && (
        <Drawer
          placement="right"
          onClose={handleDrawerClose}
          isOpen={isDrawerOpen}
        >
          <DrawerOverlay />
          <DrawerContent className="bg-background">
            <DrawerHeader className="text-xl font-medium">QIQO</DrawerHeader>
            <DrawerBody className="flex flex-col gap-4">
              <a href="/#features" onClick={handleDrawerClose}>
                Features
              </a>
              <a href="/pricing" onClick={handleDrawerClose}>
                Pricing
              </a>
              <a
                style={{ display: !authToken ? 'block' : 'none' }}
                href="/login"
                onClick={handleDrawerClose}
              >
                Login
              </a>
              <a
                style={{ display: !authToken ? 'block' : 'none' }}
                href="/register"
                onClick={handleDrawerClose}
              >
                Sign up
              </a>
              <a
                style={{ display: authToken ? 'block' : 'none' }}
                href="/dashboard"
                onClick={handleDrawerClose}
              >
                Dashboard
              </a>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

export default Header
