import { Stack } from '@t4/ui'
import { ShareableBadge } from './shareable-badge'

export function Shareable({ children }) {
  return (
    <Stack>
      <Stack marginBottom='$-6' zi={2} w='$7' alignSelf='flex-end'>
        <ShareableBadge>Shared</ShareableBadge>
      </Stack>
      {children}
    </Stack>
  )
}
