import {Dimensions, StyleSheet} from 'react-native';
import {
  primaryColor,
  darkColor,
  darkBlueColor,
  lightColor,
} from '../colors/Colors';
import { useColor } from '../hooks/context/ColorContext';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export const useStyle =()=>{
  const { secondaryColor } = useColor(); 

  return StyleSheet.create({
    homeHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    mainBg: {
      backgroundColor: primaryColor,
      minHeight: '100%',
    },
    gearIcon: {
      width: 40,
      height: 40,
    },
    logo: {
      width: 150,
      height: 70,
      objectFit: 'contain',
    },
    sosBtnOuter: {
      width: 280,
      height: 280,
      borderRadius: 300,
      backgroundColor: 'white',
      marginHorizontal: 'auto',
      marginTop: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sosButton: {
      width: 230,
      backgroundColor: secondaryColor,
      borderRadius: 200,
      alignItems: 'center',
      justifyContent: 'center',
      height:230
    },
    bgMap: {
      objectFit: 'contain',
      width: '100%',
    },
    map: {
      width: 650,
      flex: 1,
      backgroundColor: primaryColor,
    },
    warning: {
      textAlign: 'center',
      color: secondaryColor,
      fontFamily: 'Oxanium-Regular',
    },
    regularText: {
      fontSize: 16,
      fontFamily: 'Oxanium-Regular',
      color: darkColor,
    },
    smallText: {
      fontSize: 14,
      fontFamily: 'Oxanium-Light',
      color: darkColor,
      flexShrink: 1,
    },
    extraBoldText: {
      fontFamily: 'Oxanium-ExtraBold',
      fontSize: 25,
      color: secondaryColor,
      marginBottom: 20,
    },
    extraBoldTextDark: {
      fontSize: 18,
      color: darkColor,
      marginBottom: 10,
      marginTop: 10,
    },
    boldText: {
      fontFamily: 'Oxanium-Bold',
      fontSize: 20,
      color: darkColor,
    },
    boldTextSubTopic: {
      fontSize: 15,
      color: darkBlueColor,
    },
    wrapper: {
      padding: 10,
    },
    formHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    anchorBtn: {
      color: secondaryColor,
      textDecorationLine: 'underline',
    },
    form: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 30,
      paddingBottom: 50,
      marginTop: 100,
    },
    inputBox: {
      backgroundColor: '#FFFBDA',
      borderRadius: 10,
      paddingHorizontal: 10,
      marginTop: 7,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    formIcon: {
      color: secondaryColor,
    },
    input: {
      fontFamily: 'Oxanium-Regular',
      padding: 7,
      paddingVertical: 10,
      width: '80%',
      color:darkColor
    },
    mainBtn: {
      marginTop: 20,
      backgroundColor: secondaryColor,
      padding: 10,
      borderRadius: 10,
    },
    mainBtnText: {
      textAlign: 'center',
      color: primaryColor,
      fontFamily: 'Oxanium-Bold',
      fontSize: 20,
    },
    pattern: {
      minHeight: '100%',
      width: '100%',
    },
    overlay: {
      // ...StyleSheet.absoluteFillObject, // Covers the whole image
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay with 50% opacity
      minHeight: '100%',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    nameCircle: {
      width: 40,
      height: 40,
      backgroundColor: secondaryColor,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nameChracter: {
      color: primaryColor,
      fontSize: 25,
      marginBottom: 0,
    },
    settingLinks: {
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: primaryColor,
      padding: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      elevation: 5,
    },
    currentDimensions: {
      backgroundColor: secondaryColor,
      padding: 10,
      borderRadius: 7,
      position: 'relative',
    },
    copyBtn: {
      position: 'absolute',
      right: 10,
      top: '50%',
      zIndex: 99,
    },
    profileImage: {
      width: 150,
      height: 150,
      backgroundColor: secondaryColor,
      borderRadius: 100,
      overflow: 'hidden',
      borderColor: secondaryColor,
      borderWidth: 5,
      marginHorizontal: 'auto',
      marginTop: -75,
    },
    profileDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    seperator: {
      borderColor: secondaryColor,
      borderWidth: 1,
      marginVertical: 10,
    },
    dropdown: {
      borderWidth: 0,
      backgroundColor: secondaryColor,
      color: 'white',
    },
    contactCard: {
      borderBottomColor: secondaryColor,
      borderBottomWidth: 1,
      paddingBottom: 5,
      marginBottom: 10,
      padding:5,
      borderRadius:10
    },
  
    contactActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    contactActionBtn: {
      backgroundColor: 'red',
      width: '50%',
      paddingLeft: 10,
      height: 40,
      justifyContent: 'center',
    },
  
    deleteBtn:{
      backgroundColor:"#AC1754",
      paddingHorizontal:10,
      paddingVertical:5,
      borderRadius:5
    },
    floatingBtn: {
      backgroundColor: secondaryColor,
      width: 50,
      height: 50,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 100,
      right: 20,
      zIndex: 99,
      opacity: 0.7,
    },
  
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(8,8,8,0.7)',
      padding: 20,
    },
    modalView: {
      width: '100%',
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      paddingBottom: 50,
    },
  
    notificationBtn: {
      position: 'relative',
      backgroundColor: primaryColor,
      borderColor: secondaryColor,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      marginBottom: 20,
    },
    activeEmergency: {
      fontSize: 20,
      zIndex: 99,
      color: 'red',
      position: 'absolute',
      right: 10,
      top: 10,
    },
 
    colorBtn:{
      width:100,
      height:100,
      borderRadius:100,
      alignItems:"center",
      justifyContent:"center"
    },
    pallet:{
      gap:10,
      flexDirection:"row",
      flexWrap:"wrap",
      justifyContent:"center"
    },
    floatingSosBtn: {
      backgroundColor: secondaryColor,
      width: 70,
      height: 70,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      borderColor: lightColor,
      borderWidth: 2,
      position:"absolute",
      left:"50%",
      transform:[{translateX:-35}],
      top:-35
    },
    bottomBar:{
      backgroundColor:secondaryColor,
      position:"relative",
      height:50
    },
    error:{
      color:"red",
      marginVertical:5
    },
    lables:{
      marginTop:15
    }
  });
  
} 