import { SizableText } from '@t4/ui'

export function ShareableBadge({ children }) {
  return (
    <SizableText
      backgroundColor='#0031df44'
      color='skyblue'
      paddingHorizontal='$3.5'
      paddingVertical='$1'
      size='$1'
      borderRadius={100}
      textAlign='center'
    >
      {children}
    </SizableText>
  )
}
