import { Text, TextProps } from 'react-native'
import React from 'react'
import { useStyle } from '../../style/style'

const SmallText:React.FC<TextProps> = ({children,style:customStyle}) => {
  const style = useStyle()
  return (
    <Text style={[style.smallText,customStyle]} >{children}</Text>
  )
}

export default SmallText