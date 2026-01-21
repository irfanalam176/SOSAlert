import {  TouchableOpacity,View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ContactsManagement from '../ContactsManagement'
import LocationPage from '../LocationPage'
import Notifications from '../Notifications'
import ProfileManagement from '../ProfileManagement'
import Setting from '../Setting'
import { NavigationType } from '../../types/Types'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { useStyle } from '../../style/style'
import PrivacyPolicyAndTermsOfUse from '../PrivacyPolicyAndTermsOfUse'
import ColorPallet from '../ColorPallet'
import DropShadow from 'react-native-drop-shadow'
import Help from '../Help'
import Audio from '../Audio'

const LayOut = ({navigation}) => {
  const style = useStyle()
      const Stack = createNativeStackNavigator()
  return (
 <>
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='setting'>
    <Stack.Screen name='setting' component={Setting} />
    <Stack.Screen name='locationPage' component={LocationPage}/>
    <Stack.Screen name='profileManagement' component={ProfileManagement}/>
    <Stack.Screen name='contactsManagement' component={ContactsManagement}/>
    <Stack.Screen name='notifications' component={Notifications}/>
    <Stack.Screen name='audio' component={Audio}/>
    <Stack.Screen name='privacyPolicyAndTermsOfUse' component={PrivacyPolicyAndTermsOfUse}/>
    <Stack.Screen name='colorPallet' component={ColorPallet}/>
    <Stack.Screen name='help' component={Help}/>
  </Stack.Navigator>
    
    <View style={[style.bottomBar]}>
    <TouchableOpacity style={style.floatingSosBtn} onPress={()=>navigation.navigate("sos")}>
    <DropShadow
     style={{
      shadowColor: "white",
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 1,
      shadowRadius: 5,
    }}
    >
        <FontAwesome5Icon name='bell' size={40} color={"white"}/>
    </DropShadow>
    </TouchableOpacity>
    </View>

 </>
  )
}

export default LayOut