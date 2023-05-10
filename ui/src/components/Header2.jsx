import React from 'react'
import { useColorMode } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

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

  return (
    <nav className="w-full h-14 px-6 shrink-0 bg-slate-800 text-white flex items-center">
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
              <span className="flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 95.82 76.19"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                >
                  <path
                    d="M78.27,2.13h0a129.38,129.38,0,0,0-46.76,0c-1.32.24-19.44,6.65-19.44,6.65h0A18,18,0,0,0,0,25.77v12A18,18,0,0,0,10.82,54.2l44.07,22V59.77a130.25,130.25,0,0,0,23.38-2.12h0A21.42,21.42,0,0,0,95.82,36.58V23.19A21.42,21.42,0,0,0,78.27,2.13Z"
                    fill="#2a48df"
                  />
                  <path
                    d="M54.89,50.76a121.11,121.11,0,0,1-21.75-2A12.4,12.4,0,0,1,23,36.58V23.19A12.39,12.39,0,0,1,33.14,11a120.45,120.45,0,0,1,43.5,0A12.39,12.39,0,0,1,86.8,23.19V36.58a12.4,12.4,0,0,1-10.16,12.2A121.11,121.11,0,0,1,54.89,50.76Z"
                    fill="#fff"
                  />
                  <path
                    d="M41.31,38.86a3.75,3.75,0,0,1-3.75-3.75V24.67a3.76,3.76,0,1,1,7.51,0V35.11A3.75,3.75,0,0,1,41.31,38.86Z"
                    fill="#6d93f6"
                  />
                  <path
                    d="M68.41,38.86a3.75,3.75,0,0,1-3.76-3.75V24.67a3.76,3.76,0,1,1,7.51,0V35.11A3.75,3.75,0,0,1,68.41,38.86Z"
                    fill="#6d93f6"
                  />
                </svg>{' '}
                Chat{' '}
                <svg
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                >
                  <path
                    clipRule="evenodd"
                    d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                    fillRule="evenodd"
                  />
                </svg>
              </span>
            </button>
            {/**/}
          </div>
        </div>
        <div className="invisible md:visible md:flex gap-4 py-2">
          <a
            className={
              current == 0
                ? 'px-4 py-2 font-medium rounded-md flex gap-2 text-slate-50 bg-slate-900'
                : 'px-4 py-2 font-medium rounded-md flex gap-2 text-slate-300 hover:text-slate-50 hover:bg-slate-700'
            }
            href="/dashboard"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 95.82 76.19"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
            >
              <path
                d="M78.27,2.13h0a129.38,129.38,0,0,0-46.76,0c-1.32.24-19.44,6.65-19.44,6.65h0A18,18,0,0,0,0,25.77v12A18,18,0,0,0,10.82,54.2l44.07,22V59.77a130.25,130.25,0,0,0,23.38-2.12h0A21.42,21.42,0,0,0,95.82,36.58V23.19A21.42,21.42,0,0,0,78.27,2.13Z"
                fill="#2a48df"
              />
              <path
                d="M54.89,50.76a121.11,121.11,0,0,1-21.75-2A12.4,12.4,0,0,1,23,36.58V23.19A12.39,12.39,0,0,1,33.14,11a120.45,120.45,0,0,1,43.5,0A12.39,12.39,0,0,1,86.8,23.19V36.58a12.4,12.4,0,0,1-10.16,12.2A121.11,121.11,0,0,1,54.89,50.76Z"
                fill="#fff"
              />
              <path
                d="M41.31,38.86a3.75,3.75,0,0,1-3.75-3.75V24.67a3.76,3.76,0,1,1,7.51,0V35.11A3.75,3.75,0,0,1,41.31,38.86Z"
                fill="#6d93f6"
              />
              <path
                d="M68.41,38.86a3.75,3.75,0,0,1-3.76-3.75V24.67a3.76,3.76,0,1,1,7.51,0V35.11A3.75,3.75,0,0,1,68.41,38.86Z"
                fill="#6d93f6"
              />
            </svg>{' '}
            Chat
          </a>
          <a
            className={
              current == 1
                ? 'px-4 py-2 font-medium rounded-md flex gap-2 text-slate-50 bg-slate-900'
                : 'px-4 py-2 font-medium rounded-md flex gap-2 text-slate-300 hover:text-slate-50 hover:bg-slate-700'
            }
            href="/directories"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
            >
              <path
                d="M502.6 70.63l-61.25-61.25C435.4 3.371 427.2 0 418.7 0H255.1c-35.35 0-64 28.66-64 64l.0195 256C192 355.4 220.7 384 256 384h192c35.2 0 64-28.8 64-64V93.25C512 84.77 508.6 76.63 502.6 70.63zM464 320c0 8.836-7.164 16-16 16H255.1c-8.838 0-16-7.164-16-16L239.1 64.13c0-8.836 7.164-16 16-16h128L384 96c0 17.67 14.33 32 32 32h47.1V320zM272 448c0 8.836-7.164 16-16 16H63.1c-8.838 0-16-7.164-16-16L47.98 192.1c0-8.836 7.164-16 16-16H160V128H63.99c-35.35 0-64 28.65-64 64l.0098 256C.002 483.3 28.66 512 64 512h192c35.2 0 64-28.8 64-64v-32h-47.1L272 448z"
                fill="currentColor"
              />
            </svg>{' '}
            Content
          </a>
          <a
            className={
              current == 2
                ? 'px-4 py-2 font-medium rounded-md flex gap-2 text-slate-50 bg-slate-900'
                : 'px-4 py-2 font-medium rounded-md flex gap-2 text-slate-300 hover:text-slate-50 hover:bg-slate-700'
            }
            href="/settings"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
            >
              <path
                d="M160 256C160 202.1 202.1 160 256 160C309 160 352 202.1 352 256C352 309 309 352 256 352C202.1 352 160 309 160 256zM256 208C229.5 208 208 229.5 208 256C208 282.5 229.5 304 256 304C282.5 304 304 282.5 304 256C304 229.5 282.5 208 256 208zM293.1 .0003C315.3 .0003 334.6 15.19 339.8 36.74L347.6 69.21C356.1 73.36 364.2 78.07 371.9 83.28L404 73.83C425.3 67.56 448.1 76.67 459.2 95.87L496.3 160.1C507.3 179.3 503.8 203.6 487.8 218.9L463.5 241.1C463.8 246.6 464 251.3 464 256C464 260.7 463.8 265.4 463.5 270L487.8 293.1C503.8 308.4 507.3 332.7 496.3 351.9L459.2 416.1C448.1 435.3 425.3 444.4 404 438.2L371.9 428.7C364.2 433.9 356.1 438.6 347.6 442.8L339.8 475.3C334.6 496.8 315.3 512 293.1 512H218.9C196.7 512 177.4 496.8 172.2 475.3L164.4 442.8C155.9 438.6 147.8 433.9 140.1 428.7L107.1 438.2C86.73 444.4 63.94 435.3 52.85 416.1L15.75 351.9C4.66 332.7 8.168 308.4 24.23 293.1L48.47 270C48.16 265.4 48 260.7 48 255.1C48 251.3 48.16 246.6 48.47 241.1L24.23 218.9C8.167 203.6 4.66 179.3 15.75 160.1L52.85 95.87C63.94 76.67 86.73 67.56 107.1 73.83L140.1 83.28C147.8 78.07 155.9 73.36 164.4 69.21L172.2 36.74C177.4 15.18 196.7 0 218.9 0L293.1 .0003zM205.5 103.6L194.3 108.3C181.6 113.6 169.8 120.5 159.1 128.7L149.4 136.1L94.42 119.9L57.31 184.1L98.81 223.6L97.28 235.6C96.44 242.3 96 249.1 96 256C96 262.9 96.44 269.7 97.28 276.4L98.81 288.4L57.32 327.9L94.42 392.1L149.4 375.9L159.1 383.3C169.8 391.5 181.6 398.4 194.3 403.7L205.5 408.4L218.9 464H293.1L306.5 408.4L317.7 403.7C330.4 398.4 342.2 391.5 352.9 383.3L362.6 375.9L417.6 392.1L454.7 327.9L413.2 288.4L414.7 276.4C415.6 269.7 416 262.9 416 256C416 249.1 415.6 242.3 414.7 235.6L413.2 223.6L454.7 184.1L417.6 119.9L362.6 136.1L352.9 128.7C342.2 120.5 330.4 113.6 317.7 108.3L306.5 103.6L293.1 48H218.9L205.5 103.6z"
                fill="currentColor"
              ></path>
            </svg>{' '}
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
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
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
