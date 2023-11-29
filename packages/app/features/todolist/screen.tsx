'use client'

import { SharedDocContext } from '../../provider/yjs/context'
import { useArray } from '../../utils/y-hooks'
import * as Y from 'yjs'
import { useState } from 'react'

export function TodolistScreen() {
  // Initialize our To Do List as an array.
  // `useArray` returns a Y.Array and also subscribes to changes,
  // so that ToDoList is rerendered when the array changes.
  const items = useArray<Y.Map<any>>('todolist', SharedDocContext)

  const pushItem = (text: string) => {
    let item = new Y.Map([
      ['text', text],
      ['done', false],
    ] as [string, any][])

    items?.push([item])
  }

  const clearCompletedItems = () => {
    let indexOffset = 0
    items?.forEach((item, index) => {
      if (item.get('done')) {
        items.delete(index - indexOffset, 1)
        indexOffset += 1
      }
    })
  }

  return (
    <div className='m-10'>
      <div>To Do List</div>
      <div className='space-y-1'>
        <ToDoInput onCreateItem={pushItem} />
        <button
          onClick={clearCompletedItems}
          className='block rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm hover:bg-blue-500'
        >
          Clear Completed
        </button>
        {items && items.map((item, index) => <ToDoItem key={index} item={item} />)}
      </div>
    </div>
  )
}

type ToDoItemProps = {
  item: Y.Map<any>
}

export function ToDoItem({ item }: ToDoItemProps) {
  // Yjs has documentation for how to use its shared data types:
  // https://docs.yjs.dev/api/shared-types/y.map
  // For Y.Map, we can get and set values like so:
  const onCompleted = () => {
    item.set('done', !item.get('done'))
  }

  return (
    <div>
      <label className='flex flex-row space-x-2 items-center'>
        <input
          type='checkbox'
          className='w-6 h-6 cursor-pointer'
          checked={item.get('done')}
          onChange={onCompleted}
        />
        <input
          className='bg-transparent p-1 rounded text-lg'
          value={item.get('text')}
          onChange={(e) => item.set('text', e.target.value)}
        />
      </label>
    </div>
  )
}

export function ToDoInput(props: { onCreateItem: (text: string) => void }) {
  const [text, setText] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    props.onCreateItem(text)
    setText('')
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-row space-x-2 max-w-2xl'>
      <input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        className='flex-1 block ring-black rounded-md border-0 px-3.5 py-2 text-gray-900 ring-1 ring-inset placeholder:text-gray-400'
      />
      <button
        type='submit'
        className='block rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm hover:bg-blue-500'
      >
        Add
      </button>
    </form>
  )
}
