'use client'

import {
  Button,
  Checkbox,
  Form,
  Input,
  ScrollView,
  XStack,
  YStack,
  Paragraph,
  Separator,
  H1
} from '@t4/ui'
import { Check } from '@tamagui/lucide-icons'
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
    <ScrollView className='m-10'>
      <YStack flex={1} jc='center' ai='center' p='$4' space='$4'>
      <H1>To Do List</H1>
      <YStack gap="$4">
        <ToDoInput onCreateItem={pushItem} />
        <Button
          onPress={clearCompletedItems}
          className='block rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm hover:bg-blue-500'
        >
          Clear Completed
        </Button>
        {items && items.map((item, index) => <ToDoItem key={index} item={item} />)}
      </YStack>
      </YStack>
    </ScrollView>
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
    <XStack alignItems="center" gap="$4">
        <Checkbox
          size="$6"
          className='w-6 h-6 cursor-pointer'
          checked={item.get('done')}
          onPress={onCompleted}
        >
          <Checkbox.Indicator>
            <Check />
          </Checkbox.Indicator>
        </Checkbox>
        <Input
          
          className='bg-transparent p-1 rounded text-lg'
          value={item.get('text')}
          onChange={(e) => item.set('text', e.target.value)}
        />
    </XStack>
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
    <Form onSubmit={onSubmit} className='flex flex-row space-x-2 max-w-2xl'>
      <XStack gap="$4">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className='flex-1 block ring-black rounded-md border-0 px-3.5 py-2 text-gray-900 ring-1 ring-inset placeholder:text-gray-400'
        />
        <Form.Trigger asChild>
          <Button
            className='block rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm hover:bg-blue-500'
          >
            Add
          </Button>
        </Form.Trigger>
      </XStack>
    </Form>
  )
}
