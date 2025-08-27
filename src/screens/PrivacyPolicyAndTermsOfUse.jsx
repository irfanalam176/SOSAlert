import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useStyle} from '../style/style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ExtraBoldText from '../components/text/ExtraBoldText';
import BoldText from '../components/text/BoldText';
import SmallText from '../components/text/SmallText';

const PrivacyPolicyAndTermsOfUse= ({navigation}) => {
  const style = useStyle()
  function goBack() {
    navigation.goBack();
  }
  return (
    <ScrollView style={[style.mainBg, style.wrapper]} contentContainerStyle={{paddingBottom:100}}>
      <View style={style.header}>
        <TouchableOpacity onPress={goBack}>
          <FontAwesome5 name="chevron-left" size={25} style={style.formIcon} />
        </TouchableOpacity>
        <Image
          source={require('../assets/images/logo.png')}
          style={[style.logo, {marginHorizontal: 'auto'}]}
        />
      </View>
      <ExtraBoldText
        style={{marginBottom: 0, marginHorizontal: 'auto', fontSize: 18}}>
        Privacy Policy & Terms of Use
      </ExtraBoldText>

      <SmallText>
        Welcome to SOS Alert. Your privacy is important to us. This
        Privacy Policy explains how we collect, use, and protect your personal
        information when you use our app
      </SmallText>
      <ExtraBoldText style={style.extraBoldTextDark}>
        Information We Collect
      </ExtraBoldText>

      <BoldText style={style.boldTextSubTopic}>Personal Information</BoldText>
      <SmallText>
        We collect Name, phone number, and emergency contact details provided by
        the user
      </SmallText>

      <BoldText style={style.boldTextSubTopic}>Location Data</BoldText>
      <SmallText>
        Real-time location tracking to enable quick response in emergencies.
      </SmallText>

      <BoldText style={style.boldTextSubTopic}>Communication Data</BoldText>
      <SmallText>
        SMS, emails, or notifications sent through the app to trusted contacts
        and emergency services.
      </SmallText>

      <ExtraBoldText style={style.extraBoldTextDark}>
        How We Use Information
      </ExtraBoldText>

      <View style={{flexDirection: 'row', gap: 10}}>
        <FontAwesome5
          name="exclamation-circle"
          size={15}
          style={style.formIcon}
        />
        <SmallText>
          Facilitate real-time emergency alerts to trusted contacts and
          authorities
        </SmallText>
      </View>
      <View style={{flexDirection: 'row', gap: 10}}>
        <FontAwesome5 name="map-marker-alt" size={15} style={style.formIcon} />
        <SmallText>
          Share location details to improve emergency response times.
        </SmallText>
      </View>
      <View style={{flexDirection: 'row', gap: 10}}>
        <FontAwesome5 name="mobile-alt" size={15} style={style.formIcon} />
        <SmallText>Enhance app functionality and user experience.</SmallText>
      </View>
      <View style={{flexDirection: 'row', gap: 10}}>
        <FontAwesome5 name="lock" size={15} style={style.formIcon} />
        <SmallText>
          Ensure compliance with security and legal requirements.
        </SmallText>
      </View>

      <ExtraBoldText style={style.extraBoldTextDark}>
        Data Protection & Security
      </ExtraBoldText>
      <SmallText>We prioritize data security by implementing:</SmallText>
      <BoldText style={style.boldTextSubTopic}>Encryption</BoldText>
      <SmallText>
        Personal and location data are encrypted to prevent unauthorized access.
      </SmallText>

      <BoldText style={style.boldTextSubTopic}>Restricted Access</BoldText>
      <SmallText>
        Only authorized individuals (trusted contacts, emergency services) can
        access user data.
      </SmallText>

      <BoldText style={style.boldTextSubTopic}>Secure Storage</BoldText>
      <SmallText>
        Data is stored securely and deleted when no longer needed.
      </SmallText>

      <ExtraBoldText style={style.extraBoldTextDark}>
        Third-Party Services
      </ExtraBoldText>
      <SmallText>
        The app may integrate with emergency services or third-party APIs to
        enhance functionality. However, user data is never shared with
        advertisers or unauthorized entities.
      </SmallText>
    </ScrollView>
  );
};

export default PrivacyPolicyAndTermsOfUse;
