'use client'

import { Check } from '@tamagui/lucide-icons'
import { useSharedDoc } from 'app/atoms/lofi-store'
import { Todolist } from './todolist'
import { Shareable } from '../shareable/shareable'
import { Stack, YStack, Text } from '@t4/ui'
import { useAwareness, usePresence } from 'app/utils/y-hooks'

export function TodolistScreen() {
  const awareness = useAwareness()
  const presence = usePresence()
  const [sharedDoc] = useSharedDoc()

  return (
    <YStack
      justifyContent='space-evenly'
      alignContent='space-around'
      $gtSm={{ flexDirection: 'row' }}
    >
      <Stack>
        <Todolist />
      </Stack>
      <Shareable>
        <Todolist doc={sharedDoc} name='Shared To Do List' />
      </Shareable>
    </YStack>
  )
}
