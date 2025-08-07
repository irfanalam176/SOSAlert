import { Text, TextProps } from 'react-native'
import React from 'react'
import { useStyle } from '../../style/style'

const ExtraBoldText:React.FC<TextProps> = ({children,style:customStyle,...props}) => {
  const style = useStyle()
  return (
    <Text style={[style.extraBoldText,customStyle]} {...props}>{children}</Text>
  )
}

export default ExtraBoldText