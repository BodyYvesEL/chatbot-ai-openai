import React, { useState, useEffect } from 'react'
import Header2 from './Header2'
import Cookies from 'js-cookie'

function Dashboard() {
  const [showDrawer, setShowDrawer] = useState(false)



  return (
    <div>
      <div id="app" data-v-app>
        <div className="flex flex-col h-screen">
          <Header2 current={0} />
          <button
            className="md:hidden top-4 left-4 z-50 p-2 cursor-pointer"
            onClick={() => setShowDrawer(!showDrawer)}
          >
            {showDrawer ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg className="h-6 w-6 transform rotate-90" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <div className="flex-1">
            <div className="flex w-full h-full">
              <div
                id="responsive"
                className={`bg-blue-100/10 border-r border-slate-200 w-screen max-w-xs shrink-0 ${
                  showDrawer ? 'hidden' : 'block'
                }`}
              >
                <div className="flex flex-col flex-1">
                  <div className="px-4 my-6 flex justify-between gap-4">
                    <div className="h-10 shadow-sm border border-gray-300 ring-1 ring-gray-700/5 bg-white rounded-md flex items-center relative group focus-within:border-blue-600 flex-1">
                      <span className="shrink-0 px-3">
                        {' '}
                        <svg
                          className="w-4 h-4 text-gray-400"
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M368 208A160 160 0 1 0 48 208a160 160 0 1 0 320 0zM337.1 371.1C301.7 399.2 256.8 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 48.8-16.8 93.7-44.9 129.1L505 471c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L337.1 371.1z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <input
                        placeholder="Search conversations..."
                        className="w-full pr-2 border-0 p-0 focus:ring-0 caret-blue-700 placeholder:text-gray-400 rounded-md"
                        type="search"
                      />
                    </div>
                    <button className="min-h-[32px] shrink-0 h-10 aspect-square flex items-center justify-center rounded-lg transition-colors duration-75 bg-blue-600 hover:bg-blue-700 group">
                      <span className="sr-only">add conversation</span>
                      <svg
                        className="-mb-1 w-5 h-5 drop-shadow"
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          className="transition-colors duration-75 delay-75 text-blue-200 group-hover:text-blue-300"
                          d="M448 0H64C28.75 0 0 28.75 0 63.1v287.1c0 35.25 28.75 63.1 64 63.1h96v83.1c0 9.75 11.25 15.45 19.12 9.7L304 415.1H448c35.25 0 64-28.75 64-63.1V63.1C512 28.75 483.3 0 448 0zM336 231.1h-56V288C279.1 301.3 269.3 312 256 312c-13.27 0-23.1-10.74-23.1-23.1V231.1H175.1C162.7 231.1 152 221.3 152 208c0-13.26 10.74-23.1 23.1-23.1h56V127.1C232 114.7 242.7 104 256 104s23.1 10.74 23.1 23.1V184h56C349.3 184 360 194.7 360 208S349.3 231.1 336 231.1z"
                          fill="currentColor"
                        />
                        <path
                          className="transition-colors duration-75 delay-100 text-blue-500 group-hover:text-blue-700"
                          d="M360 208c0 13.26-10.74 23.1-23.1 23.1h-56V288C279.1 301.3 269.3 312 256 312c-13.27 0-23.1-10.74-23.1-23.1V231.1H175.1C162.7 231.1 152 221.3 152 208c0-13.26 10.74-23.1 23.1-23.1h56V127.1C232 114.7 242.7 104 256 104s23.1 10.74 23.1 23.1V184h56C349.3 184 360 194.7 360 208z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="px-4 my-2">
                    <ul>
                      <li>
                        <div className="flex items-center justify-between my-1 rounded-md px-3 text-slate-600 hover:text-blue-800">
                          <a
                            className="py-2.5 flex-1 flex items-center gap-3"
                            href="/conversations/91901"
                          >
                            <span className="-mb-1">
                              {' '}
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 512 512"
                                xmlns="http://www.w3.org/2000/svg"
                                className="shrink-0 w-4 h-4 opacity-75"
                              >
                                <path
                                  fill="currentColor"
                                  d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z"
                                />
                              </svg>
                            </span>
                            <span className="font-medium line-clamp-2 leading-tight">
                              Conversation #91901
                            </span>
                          </a>
                          <div data-headlessui-state className="relative">
                            <button
                              id="headlessui-menu-button-5"
                              type="button"
                              aria-haspopup="menu"
                              aria-expanded="false"
                              data-headlessui-state
                              className="flex items-center py-1 px-2 rounded-md hover:bg-blue-200"
                            >
                              {' '}
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 128 512"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                              >
                                <path
                                  fill="currentColor"
                                  d="M48 464a48 48 0 1 1 0-96 48 48 0 1 1 0 96zm0-160a48 48 0 1 1 0-96 48 48 0 1 1 0 96zM0 96a48 48 0 1 1 96 0A48 48 0 1 1 0 96z"
                                />
                              </svg>
                            </button>
                            {/**/}
                            {/**/}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  {/**/}
                </div>
              </div>
              {/**/}
              <div className="hidden md:flex w-full items-center justify-center">
                <div className="text-2xl font-medium flex items-center gap-4 text-violet-800">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 448 512"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 animate-bounce-left"
                  >
                    <path
                      d="M7.4 273.4C2.7 268.8 0 262.6 0 256s2.7-12.8 7.4-17.4l176-168c9.6-9.2 24.8-8.8 33.9 .8s8.8 24.8-.8 33.9L83.9 232 424 232c13.3 0 24 10.7 24 24s-10.7 24-24 24L83.9 280 216.6 406.6c9.6 9.2 9.9 24.3 .8 33.9s-24.3 9.9-33.9 .8l-176-168z"
                      fill="currentColor"
                    />
                  </svg>{' '}
                  Select a conversation{' '}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard
