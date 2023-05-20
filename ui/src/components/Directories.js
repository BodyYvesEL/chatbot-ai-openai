import React, { useState } from 'react'
import Header2 from './Header2'

function Directories() {
  const [showDrawer, setShowDrawer] = useState(false)

  return (
    <div>
      <div id="app" data-v-app>
        <div className="flex flex-col h-screen">
          <Header2 current={1} />
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
                className={`bg-blue-100/10 border-r border-slate-200 w-screen max-w-xs shrink-0 ${
                  showDrawer ? 'hidden' : 'block'
                }`}
              >
                <div className="flex flex-col flex-1">
                  <div className="px-4 my-6 flex justify-between gap-4">
                    <div className="h-10 shadow-sm border border-gray-300 ring-1 ring-gray-700/5 bg-white rounded-md flex items-center relative group focus-within:border-blue-600 flex-1">
                      <span className="shrink-0 px-3">
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
                        placeholder="Search folders..."
                        className="w-full pr-2 border-0 p-0 focus:ring-0 caret-blue-700 placeholder:text-gray-400"
                        type="search"
                      />
                    </div>
                    <button className="shrink-0 h-10 aspect-square flex items-center justify-center rounded-lg transition-colors duration-75 bg-blue-600 hover:bg-blue-700 group">
                      <span className="sr-only">add document folder</span>
                      <svg
                        className="w-5 h-5 drop-shadow"
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          className="transition-colors duration-75 delay-75 text-blue-200 group-hover:text-blue-300"
                          d="M464 96h-192l-64-64h-160C21.5 32 0 53.5 0 80v352C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM336 311.1h-56v56C279.1 381.3 269.3 392 256 392c-13.27 0-23.1-10.74-23.1-23.1V311.1H175.1C162.7 311.1 152 301.3 152 288c0-13.26 10.74-23.1 23.1-23.1h56V207.1C232 194.7 242.7 184 256 184s23.1 10.74 23.1 23.1V264h56C349.3 264 360 274.7 360 288S349.3 311.1 336 311.1z"
                          fill="currentColor"
                        />
                        <path
                          className="transition-colors duration-75 delay-100 text-blue-500 group-hover:text-blue-700"
                          d="M360 288c0 13.26-10.74 23.1-23.1 23.1h-56v56C279.1 381.3 269.3 392 256 392c-13.27 0-23.1-10.74-23.1-23.1V311.1H175.1C162.7 311.1 152 301.3 152 288c0-13.26 10.74-23.1 23.1-23.1h56V207.1C232 194.7 242.7 184 256 184s23.1 10.74 23.1 23.1V264h56C349.3 264 360 274.7 360 288z"
                          fill="currentColor"
                        />
                      </svg>
                      {/**/}
                    </button>
                  </div>
                  <div className="px-4 md:my-6">
                    <ul>
                      <li className="group">
                        <a
                          className="flex items-center justify-between py-2.5 px-3 my-1 rounded-md bg-blue-100 text-blue-900 hover:text-blue-900"
                          href="/directories/31480"
                        >
                          <div className="flex-1 flex items-center gap-3">
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 576 512"
                              xmlns="http://www.w3.org/2000/svg"
                              className="shrink-0 w-4 h-4 opacity-90"
                            >
                              <path
                                fill="currentColor"
                                d="M384 480h48c11.4 0 21.9-6 27.6-15.9l112-192c5.8-9.9 5.8-22.1 .1-32.1S555.5 224 544 224H144c-11.4 0-21.9 6-27.6 15.9L48 357.1V96c0-8.8 7.2-16 16-16H181.5c4.2 0 8.3 1.7 11.3 4.7l26.5 26.5c21 21 49.5 32.8 79.2 32.8H416c8.8 0 16 7.2 16 16v32h48V160c0-35.3-28.7-64-64-64H298.5c-17 0-33.3-6.7-45.3-18.7L226.7 50.7c-12-12-28.3-18.7-45.3-18.7H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H87.7 384z"
                              />
                            </svg>
                            <span className="font-medium line-clamp-2 leading-tight">
                              Test
                            </span>
                          </div>
                          <div className="shrink-0 rounded flex bg-blue-200/50 text-blue-900">
                            <span className="font-mono text-xs font-medium leading-none p-1">
                              1
                            </span>
                            <span className="sr-only">documents</span>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/**/}
                </div>
              </div>
              <div className="w-full">
                <div className="w-full h-16 px-6 py-3 border-b flex flex-col items-start gap-4 md:flex-row md:gap-0 md:items-center justify-between">
                  <div className="w-full flex flex-wrap justify-between items-center">
                    <div className="flex items-center">
                      <a className="lg:hidden py-2 pr-2" href="#">
                        <span className="sr-only">
                          go back to directory list
                        </span>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 320 512"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                        >
                          <path
                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                      <div data-headlessui-state className="relative">
                        <button
                          id="headlessui-menu-button-5"
                          type="button"
                          aria-haspopup="menu"
                          aria-expanded="false"
                          data-headlessui-state
                          className="flex items-center py-1 px-2 rounded-md hover:bg-slate-100"
                        >
                          <span className="text-xl font-medium">Test</span>
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 128 512"
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-1 mt-0.5 w-5 h-5"
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
                  </div>
                </div>
                <div className="p-6 pb-20 w-full max-w-5xl mx-auto">
                  {/**/}
                  <section>
                    <h3 className="font-medium">Create Documents</h3>
                    <p className="text-slate-500 text-sm">
                      {' '}
                      You can create a new document in this folder by writing,
                      uploading an existing document or importing a webpage.{' '}
                    </p>
                    <div className="mt-4">
                      <div className="mt-4 grid sm:grid-cols-3 gap-4">
                        <button className="px-4 py-3 rounded-lg text-left border-2 border-blue-400 bg-blue-50 transition-colors hover:border-blue-500 hover:bg-blue-100 focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 512 512"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-blue-800"
                          >
                            <path
                              d="M279.7 97.68L354.7 22.63C379.7-2.366 420.3-2.366 445.3 22.63L489.4 66.75C514.4 91.74 514.4 132.3 489.4 157.3L414.3 232.3L376.8 369.1C369.5 396.6 349 417.6 322.6 425.5L47.43 508.1C35.12 511.8 21.78 508.4 12.69 499.3C3.597 490.2 .232 476.9 3.925 464.6L86.47 189.4C94.4 162.1 115.4 142.5 142 135.2L279.7 97.68zM310.6 112L400 201.4L466.7 134.6C479.2 122.1 479.2 101.9 466.7 89.37L422.6 45.26C410.1 32.76 389.9 32.76 377.4 45.26L310.6 112zM283.3 129.9L150.5 166.1C134.5 170.5 121.9 182.7 117.1 198.6L42.7 446.7L152.9 336.5C147.2 326.1 144 315.9 144 304C144 268.7 172.7 240 208 240C243.3 240 272 268.7 272 304C272 339.3 243.3 368 208 368C196.1 368 185 364.8 175.5 359.1L65.33 469.3L313.4 394.9C329.3 390.1 341.5 377.5 345.9 361.5L382.1 228.7L283.3 129.9zM208 272C190.3 272 176 286.3 176 304C176 321.7 190.3 336 208 336C225.7 336 240 321.7 240 304C240 286.3 225.7 272 208 272z"
                              fill="currentColor"
                            />
                          </svg>
                          <div className="mt-2 font-medium text-lg text-black">Write</div>
                          <div className="leading-snug text-slate-800">
                            {' '}
                            Write or copy paste your document{' '}
                          </div>
                        </button>
                        <button className="px-4 py-3 rounded-lg text-left border-2 border-purple-400 bg-purple-50 transition-colors hover:border-purple-500 hover:bg-purple-100 focus:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 512 512"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-purple-800"
                          >
                            <path
                              d="M122.6 155.1L240 51.63V368c0 8.844 7.156 16 16 16s16-7.156 16-16V51.63l117.4 104.3C392.4 158.7 396.2 160 400 160c4.406 0 8.812-1.812 11.97-5.375c5.875-6.594 5.25-16.72-1.344-22.58l-144-128c-6.062-5.406-15.19-5.406-21.25 0l-144 128C94.78 137.9 94.16 148 100 154.6S116.1 161.8 122.6 155.1zM448 320h-112c-8.836 0-16 7.162-16 16c0 8.836 7.164 16 16 16H448c17.67 0 32 14.33 32 32v64c0 17.67-14.33 32-32 32H64c-17.67 0-32-14.33-32-32v-64c0-17.67 14.33-32 32-32h112C184.8 352 192 344.8 192 336C192 327.2 184.8 320 176 320H64c-35.35 0-64 28.65-64 64v64c0 35.35 28.65 64 64 64h384c35.35 0 64-28.65 64-64v-64C512 348.7 483.3 320 448 320zM440 416c0-13.25-10.75-24-24-24s-24 10.75-24 24s10.75 24 24 24S440 429.3 440 416z"
                              fill="currentColor"
                            />
                          </svg>
                          <div className="mt-2 font-medium text-lg text-black">Upload</div>
                          <div className="leading-snug text-slate-800">
                            {' '}
                            PDF, Word or Powerpoint files{' '}
                          </div>
                        </button>
                        <button className="px-4 py-3 rounded-lg text-left border-2 border-emerald-400 bg-emerald-50 transition-colors focus:outline-none hover:border-emerald-500 hover:bg-emerald-100 focus:bg-emerald-100  focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2">
                          <div className="flex items-center justify-between">
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 640 512"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6 text-emerald-800"
                            >
                              <path
                                d="M563.3 267.2c56.2-56.2 56.2-147.3 0-203.5C509.8 10.2 423.9 7.3 366.9 57.2l-6.1 5.4c-10 8.7-11 23.9-2.3 33.9s23.9 11 33.9 2.3l6.1-5.4c38-33.2 95.2-31.3 130.9 4.4c37.4 37.4 37.4 98.1 0 135.6L416.1 346.6c-37.4 37.4-98.2 37.4-135.6 0c-35.7-35.7-37.6-92.9-4.4-130.9l4.7-5.4c8.7-10 7.7-25.1-2.3-33.9s-25.1-7.7-33.9 2.3l-4.7 5.4c-49.8 57-46.9 142.9 6.6 196.4c56.2 56.2 147.3 56.2 203.5 0L563.3 267.2zM42.7 244.8c-56.2 56.2-56.2 147.3 0 203.5c53.6 53.6 139.5 56.4 196.5 6.5l6.1-5.4c10-8.7 11-23.9 2.3-33.9s-23.9-11-33.9-2.3l-6.1 5.4c-38 33.2-95.2 31.3-130.9-4.4c-37.4-37.4-37.4-98.1 0-135.6L190 165.4c37.4-37.4 98.1-37.4 135.6 0c35.7 35.7 37.6 92.9 4.4 130.9l-5.4 6.1c-8.7 10-7.7 25.1 2.3 33.9s25.1 7.7 33.9-2.3l5.4-6.1c49.9-57 47-142.9-6.5-196.5c-56.2-56.2-147.3-56.2-203.5 0L42.7 244.8z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                          <div className="mt-2 font-medium text-lg text-black">
                            Import Website
                          </div>
                          <div className="leading-snug text-slate-800">
                            {' '}
                            Webpage with text content{' '}
                          </div>
                        </button>
                      </div>
                    </div>
                  </section>
                  {/**/}
                  <section className="mt-8">
                    <div className="flex flex-wrap justify-between items-start md:items-center">
                      <div>
                        <h3 className="font-medium">Stored Documents</h3>
                        <p className="text-slate-500 text-sm">
                          {' '}
                          These are all uploaded documents that cody can learn
                          from.{' '}
                        </p>
                      </div>
                      <div className="my-3 md:my-0 w-full md:w-auto">
                        <label className="sr-only" htmlFor="searchDocuments">
                          Search documents
                        </label>
                        <input
                          id="searchDocuments"
                          className="border-slate-400 rounded-md w-full h-8 focus:outline-none focus:ring-primary-600"
                          placeholder="Search documents"
                          type="search"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="pr-16 border-b">
                        <div className="grid grid-cols-5 gap-2 px-2 py-1 font-medium text-sm uppercase text-slate-600">
                          <div className="col-span-4 md:col-span-2">Name</div>
                          <div>Status</div>
                          <div className="hidden md:block">Edited On</div>
                          <div className="hidden md:block">Created On</div>
                        </div>
                      </div>
                      {/**/}
                      <div className="flex items-center px-2 border-b">
                        <a
                          href="/directories/31480/documents/1748745"
                          className="flex-1 grid grid-cols-5 gap-2 py-2 items-center group"
                        >
                          <div className="col-span-4 md:col-span-2 line-clamp-2 leading-snug group-hover:text-blue-800">
                            body_Elvis_Resume.pdf
                          </div>
                          <div className="-ml-4">
                            <span className="px-4 py-1 rounded-full text-xs uppercase tracking-wide font-medium bg-green-50 text-green-700">
                              {' '}
                              Learned{' '}
                            </span>
                          </div>
                          <div className="hidden md:block text-slate-600 text-sm">
                            N/A
                          </div>
                          <div className="hidden md:block text-slate-600 text-sm">
                            May 08, 2023 07:00 PM
                          </div>
                        </a>
                        <div
                          data-headlessui-state
                          className="relative w-16 text-center"
                        >
                          <button
                            id="headlessui-menu-button-7"
                            type="button"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            data-headlessui-state
                            className="button px-2"
                          >
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
                        </div>
                        {/**/}
                        {/**/}
                      </div>
                      {/**/}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Directories
