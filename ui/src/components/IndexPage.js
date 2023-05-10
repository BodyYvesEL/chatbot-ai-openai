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
                  className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
                  target="_blank"
                  href="https://twitter.com/shadcn"
                  rel="noreferrer"
                >
                  Follow along on Twitter
                </a>
                <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                  An example app built using Next.js 13 server components.
                </h1>
                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                  I&#39;m building a web app with Next.js 13 and open sourcing
                  everything. Follow along as we figure this out together.
                </p>
                <div className="space-x-4">
                  <a
                    className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-11 px-8 rounded-md"
                    style={{borderRadius: '0.5rem',}}
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
                  This project is an experiment to see how a modern app, with
                  features like auth, subscriptions, API routes, and static
                  pages would work in Next.js 13 app dir.
                </p>
              </div>
              <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">Next.js 13</h3>
                      <p className="text-sm text-muted-foreground">
                        App dir, Routing, Layouts, Loading UI and API routes.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">React 18</h3>
                      <p className="text-sm">
                        Server and Client Components. Use hook.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">Database</h3>
                      <p className="text-sm text-muted-foreground">
                        ORM using Prisma and deployed on PlanetScale.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">Components</h3>
                      <p className="text-sm text-muted-foreground">
                        UI components built using Radix UI and styled with
                        Tailwind CSS.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Authentication using NextAuth.js and middlewares.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">Subscriptions</h3>
                      <p className="text-sm text-muted-foreground">
                        Free and paid subscriptions using Stripe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto text-center md:max-w-[58rem]">
                <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                  Taxonomy also includes a blog and a full-featured
                  documentation site built using Contentlayer and MDX.
                </p>
              </div>
            </section>
            <section
              id="open-source"
              className="container py-8 md:py-12 lg:py-24"
            >
              <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                  Proudly Open Source
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                  Taxonomy is open source and powered by open source software.{' '}
                  <br /> {/* */}The code is available on{/* */}{' '}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                    href="https://github.com/shadcn/taxonomy"
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
