import {  Text, TextProps } from 'react-native'
import React from 'react'
import { useStyle } from '../../style/style'

const RegularText:React.FC<TextProps> = ({children,style:customStyle,...props}) => {
  const style = useStyle()
  return (
    <Text style={[style.regularText,customStyle]} {...props}>{children}</Text>
  )
}

export default RegularText