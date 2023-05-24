import React from 'react'
import Header from './header'
import Footer from './footer'

function Pricing() {
  return (
    <div>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
            <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
              <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                Simple, transparent pricing
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Unlock any feature based on your individual or business needs.
              </p>
            </div>
            <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px] hover:border-black">
              <div className="grid gap-6">
                <h3 className="text-xl font-bold sm:text-2xl">
                  What&#39;s included in the FREE plan for QIQO
                </h3>
                <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                  
                <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    Ask you PDFs / TXTs docs
                  </li>
                  
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    Ask multiple sources doc
                  </li>
                  
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    5 files collection
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    Document Upload: <span class="font-bold text-orange-500">10 MB</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    Monthly Tokens: <span class="font-bold text-orange-500">1000</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4 text-center">
                <div>
                  <h4 className="text-7xl font-bold">$0</h4>
                  <p className="text-sm font-medium text-muted-foreground">
                    Billed Monthly
                  </p>
                </div>
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded sm:rounded-0.3rem border-2 border-orange-500"
                >
                  Get Started
                </a>
              </div>
            </div>
            <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px] hover:border-black">
              <div className="grid gap-6">
                <h3 className="text-xl font-bold sm:text-2xl">
                  What&#39;s included in the Standard plan
                </h3>
                <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    Everything in Free plan
                  </li>

                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    Complete document support
                  </li>



                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    10 files collection
                  </li>

                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    Document Upload: <span class="font-bold text-orange-500">100 MB</span>
                  </li>



                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    Monthly Tokens: <span class="font-bold text-orange-500">6000</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4 text-center">
                <div>
                  <h4 className="text-7xl font-bold">$10</h4>
                  <p className="text-sm font-medium text-muted-foreground">
                    Billed Monthly
                  </p>
                </div>
                <a
                  href="/upgradeSTANDARD"
                  className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary  text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded sm:rounded-0.3rem border-2 border-black"
                >
                  Get Started
                </a>
              </div>
            </div>
            <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px] hover:border-black">
              <div className="grid gap-6">
                <h3 className="text-xl font-bold sm:text-2xl">
                  What&#39;s included in the PRO plan
                </h3>
                <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    Everything in free plan
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    Support unstructured PDFs & TXTs 
                  </li>

                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    20 files collection
                  </li>

                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    Document Upload: <span class="font-bold text-orange-500">200 MB</span>
                  </li>

                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    Monthly Tokens: <span class="font-bold text-orange-500">12000</span>
                  </li>

                </ul>
              </div>
              <div className="flex flex-col gap-4 text-center">
                <div>
                  <h4 className="text-7xl font-bold">$20</h4>
                  <p className="text-sm font-medium text-muted-foreground">
                    Billed Monthly
                  </p>
                </div>
                <a
                  href="/upgradePRO"
                  className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded sm:rounded-0.3rem border-2 border-orange-500"
                >
                  Get Started
                </a>
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-[58rem] flex-col gap-4">
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:leading-7">
              QIQO is in its beta phase.{' '}
                <strong>
                  You can test the upgrade and won&#39;t be charged.
                </strong>
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Pricing