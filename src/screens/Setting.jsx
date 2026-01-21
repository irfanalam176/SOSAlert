import {View, Image, TouchableOpacity, ScrollView, Modal, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import {useStyle} from '../style/style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RegularText from '../components/text/RegularText';
import ExtraBoldText from '../components/text/ExtraBoldText';
import { lightColor } from '../colors/Colors';
import { useColor } from '../hooks/context/ColorContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderKit from 'react-native-loader-kit';

const Setting = ({navigation}) => {


   const [modalVisible, setModalVisible] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const[userName,setUserName]=useState("")
   const[userId,setUserId]=useState("")
  function navigateTo(pageName){
    navigation.navigate(pageName)
  }
    const {secondaryColor } = useColor()
  const style = useStyle()
  function goBack(){
    navigation.goBack()
  }

  async function logOut(){
    setIsLoading(true)
    await AsyncStorage.removeItem("userId")
    setModalVisible(false)
    setIsLoading(false)
    navigation.navigate("loginPage")
  }

  useEffect(()=>{getUserName()},[])
  async function getUserName(){
    let name = await AsyncStorage.getItem("userName")
    let id = await AsyncStorage.getItem("userId")
    setUserId(id)
    if(name!=null){
      setUserName(name.trim().toUpperCase()[0])
    }
  }
  return (
    <ScrollView style={[style.mainBg, style.wrapper]} contentContainerStyle={{paddingBottom:100}}>

<Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <View style={style.header}>
              <ExtraBoldText
                style={{marginBottom: 0, marginHorizontal: 'auto'}}>
                Log Out
              </ExtraBoldText>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <FontAwesome5
                  name="times-circle"
                  size={25}
                  style={style.formIcon}
                />
              </TouchableOpacity>
            </View>

            <RegularText style={{marginTop: 40,textAlign:"center"}}>
              Do You Want To Log Out From Your Account?
            </RegularText>
            <View style={{flexDirection:"row",justifyContent:"flex-end",gap:10}}>
            <TouchableOpacity style={[style.mainBtn]} onPress={logOut} disabled={isLoading}>
            {isLoading ? (
                <LoaderKit
                  style={{ width: 50, height: 30, marginHorizontal: 'auto' }}
                  name={'BallPulse'}
                  color={'white'}
                />
              ) : (
                <Text style={style.mainBtnText}>Log Out</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={[style.mainBtn,{backgroundColor:"white",borderColor:secondaryColor,borderWidth:2}]} onPress={()=>setModalVisible(!modalVisible)}>
              <Text style={[style.mainBtnText,{color:secondaryColor}]}>Cancel</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={style.header}>
        <TouchableOpacity onPress={goBack}><FontAwesome5 name="chevron-left" size={25} style={style.formIcon} /></TouchableOpacity>
        <ExtraBoldText style={{marginBottom:0,marginHorizontal:"auto"}}>Setting</ExtraBoldText>
        <View style={style.nameCircle}>
          <ExtraBoldText style={style.nameChracter}>{userName}</ExtraBoldText>
        </View>
      </View>
      <Image
        source={require('../assets/images/logo.png')}
        style={{
          width: 300,
          objectFit: 'contain',
          height: 100,
          marginHorizontal: 'auto',
        }}
      />

      <View style={[style.form, {marginTop: 5}]}>
        <TouchableOpacity style={style.settingLinks} onPress={()=>navigation.navigate("profileManagement",{userId:userId})}>
          <RegularText>profile Management</RegularText>
          <FontAwesome5 name="chevron-right" size={20} style={style.formIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={style.settingLinks} onPress={()=>navigation.navigate("contactsManagement",{userId:userId})}>
          <RegularText>Contacts Management</RegularText>
          <FontAwesome5 name="chevron-right" size={20} style={style.formIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={style.settingLinks} onPress={()=>navigateTo("notifications")}>
          <RegularText>Notifications</RegularText>
          <FontAwesome5 name="chevron-right" size={20} style={style.formIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={style.settingLinks} onPress={()=>navigateTo("audio")}>
          <RegularText>Voice</RegularText>
          <FontAwesome5 name="chevron-right" size={20} style={style.formIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={style.settingLinks} onPress={()=>navigateTo("colorPallet")}>
          <RegularText>Themes</RegularText>
          <FontAwesome5 name="chevron-right" size={20} style={style.formIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={style.settingLinks} onPress={()=>navigateTo("privacyPolicyAndTermsOfUse")}>
          <RegularText>Privacy Policy & Terms of Use</RegularText>
          <FontAwesome5 name="chevron-right" size={20} style={style.formIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={style.settingLinks} onPress={()=>navigation.navigate("help")}>
          <RegularText>Help</RegularText>
          <FontAwesome5 name="chevron-right" size={20} style={style.formIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[style.settingLinks, {backgroundColor:secondaryColor }]}
          onPress={()=>setModalVisible(true)}
          >
          <RegularText style={{color: lightColor}}>Log Out</RegularText>
          <FontAwesome5 name="door-open" size={20} style={{color: lightColor}} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Setting;
