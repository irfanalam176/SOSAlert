import { View, Text, TextProps } from 'react-native'
import React from 'react'
import { useStyle } from '../../style/style'

const BoldText:React.FC<TextProps> = ({children,style:customStyle,...props}) => {
  const style = useStyle()
  return (
    <Text style={[style.boldText,customStyle]} {...props}>{children}</Text>
  )
}

export default BoldText