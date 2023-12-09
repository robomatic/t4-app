'use client'

import { TodolistScreen } from 'app/features/todolist/screen'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>Todo List</title>
      </Head>
      <TodolistScreen />
    </>
  )
}
