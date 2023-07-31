"use server"

import Head from "next/head"

import Main from "./main"

// https://nextjs.org/docs/pages/building-your-application/optimizing/fonts 

export default async function IndexPage({ params: { ownerId } }: { params: { ownerId: string }}) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=5.0, minimum-scale=0.86" />
      </Head>
      <main className={
        `dark fixed inset-0 flex flex-col items-center
         bg-stone-900 text-stone-10 overflow-y-scroll
        `}>
        <Main />
      </main>
    </>
  )
}