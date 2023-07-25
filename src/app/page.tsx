"use server"

import Head from "next/head"

import Main from "./main"

export default async function IndexPage({ params: { ownerId } }: { params: { ownerId: string }}) {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=5.0, minimum-scale=0.86" />
      </Head>
      <main className="dark fixed inset-0 flex flex-col items-center bg-stone-900 text-stone-10 overflow-y-scroll">
        <Main />
      </main>
    </div>
  )
}