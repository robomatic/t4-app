'use client'

import { Button, Checkbox, Form, Input, ScrollView, XStack, YStack, H1 } from '@t4/ui'
import { Check } from '@tamagui/lucide-icons'
import { useArray } from '../../utils/y-hooks'
import * as Y from 'yjs'
import { ChangeEvent, FormEvent, useState } from 'react'

interface TodolistProps {
  doc?: Y.Doc | undefined
  name?: string
}

export function Todolist({ doc = undefined, name = 'To Do List' }: TodolistProps) {
  const items = useArray<Y.Map<any>>('todolist', doc)

  const pushItem = (text: string) => {
    const item = new Y.Map([
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
        <H1>{name}</H1>
        <YStack gap='$4'>
          <ToDoInput onCreateItem={pushItem} />
          <Button onPress={clearCompletedItems}>Clear Completed</Button>
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
  const onCompleted = () => {
    item.set('done', !item.get('done'))
  }

  return (
    <XStack alignItems='center' gap='$4'>
      <Checkbox size='$6' checked={item.get('done')} onPress={onCompleted}>
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>
      <Input flexGrow={1} value={item.get('text')} onChangeText={(v) => item.set('text', v)} />
    </XStack>
  )
}

export function ToDoInput(props: { onCreateItem: (text: string) => void }) {
  const [text, setText] = useState('')

  const onSubmit = () => {
    props.onCreateItem(text)
    setText('')
  }

  return (
    <Form onSubmit={onSubmit} className='flex flex-row space-x-2 max-w-2xl'>
      <XStack gap='$4'>
        <Input
          value={text}
          onChangeText={setText}
          className='flex-1 block ring-black rounded-md border-0 px-3.5 py-2 text-gray-900 ring-1 ring-inset placeholder:text-gray-400'
        />
        <Form.Trigger asChild>
          <Button className='block rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm hover:bg-blue-500'>
            Add
          </Button>
        </Form.Trigger>
      </XStack>
    </Form>
  )
}
