import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import './App.css'


export default function IndexPage() {
  return (
    <>
      <div>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
              <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                <a
                  className="rounded-2xl bg-muted bg-gray-200 px-4 py-1.5 text-sm font-medium border border-gray-300 rounded-lg"
                  target="_blank"
                  href="https://twitter.com/QIQOaitech"
                  rel="noreferrer"
                >
                  Follow along on <span className="text-blue-500">Twitter</span>
                </a>
                <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                  Unlock <span className="text-orange-500">new performance frontiers</span> with your personal data.
                </h1>
                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                  We&#39;re building generative AI for everyone to use. Everyone has the potential to be reinvented with an AI assistance to their significant advantage.
                </p>
                <br />
                <div className="space-x-4">
                  <a
                    className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-11 px-8 rounded-md"
                    style={{borderRadius: '0.3rem',}}
                    href="/login"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </section>
            <section
              id="features"
              className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
            >
              <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                  Features
                </h2>
                <p className="max-w-[85%] bolder leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                  Imagine every employee has an assistant that "knew" everything your organization had ever known-the entire history, context, nuance and intent of the business and its operations-and could process, analyze and use that information in a matter of seconds, in repeatable ways.
                </p>
              </div>
              <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold text-orange-500">Business Questions</h3>
                      <p className="text-sm text-muted-foreground">
                        No more need to navigate through countless documents. Have instant information about your business using fine-tuned chatbot.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold text-orange-500">Personal Questions</h3>
                      <p className="text-sm">
                        Whether you are a student, researcher or entrepreneur, our AI chatbot is built to handle large document files.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold text-orange-500">Database</h3>
                      <p className="text-sm text-muted-foreground">
                        Your information and data is confidential with us. That is why we are using state-of-art server services for a speedy and reliable QA process.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold text-orange-500">Technology</h3>
                      <p className="text-sm text-muted-foreground">
                        Our cutting-edge technology stack is a forerunner using LLMs to provide QA best for conversational purposes.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold text-orange-500">Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        2FA as an extra layer to secure your information and data. Confidently explore our product after receiving your OTP.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold text-orange-500">Subscriptions</h3>
                      <p className="text-sm text-muted-foreground">
                        Free and paid subscriptions using Stripe. Upgrade to your personal needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto text-center md:max-w-[58rem]">
                <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                  See our documentation of more reference.
                </p>
              </div>
            </section>
            <section
              id="open-source"
              className="container py-8 md:py-12 lg:py-24"
            >
              <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                <h2 className="font-heading font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                  Quality In Quality Out
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                  QIQO is a chatbot platform for all your documents in one place.{' '}
                  <br /> {/* */}The code is available on{/* */}{' '}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                    href="https://github.com/BodyYvesEL/chatbot-ai-openai"
                  >
                    GitHub
                  </a>
                  .{/* */}{' '}
                </p>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
