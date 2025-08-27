import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {useStyle} from '../style/style';
import ExtraBoldText from '../components/text/ExtraBoldText';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BoldText from '../components/text/BoldText';
import SmallText from '../components/text/SmallText';
const Help = ({navigation}) => {
  const style = useStyle();
  function goBack() {
    navigation.goBack();
  }
  return (
    <ScrollView contentContainerStyle={[style.wrapper,{paddingBottom:50}]}>
      <View style={style.header}>
        <TouchableOpacity onPress={goBack}>
          <FontAwesome5 name="chevron-left" size={25} style={style.formIcon} />
        </TouchableOpacity>
        <ExtraBoldText style={{marginBottom: 0, marginHorizontal: 'auto'}}>
          Help & Support
        </ExtraBoldText>
      </View>

      <BoldText style={{marginTop: 20, marginBottom: 10}}>
        Alert !
      </BoldText>

      <SmallText style={{marginBottom:6}}>
        ✔️Make sure your GPS and internet connection are enabled for accurate location sharing.
      </SmallText>
      <SmallText>
        ✔️Only add people you trust as contacts.
      </SmallText>

   <BoldText style={{marginTop: 20, marginBottom: 10}}>Managing Contacts</BoldText>
      <SmallText style={{marginBottom:6}}>✔️Go to Settings {'>'} Contacts Management.</SmallText>
      <SmallText style={{marginBottom:6}}>✔️Tap the “+” button at the bottom-right corner.</SmallText>
      <SmallText style={{marginBottom:6}}>✔️Enter a valid email address to add a trusted contact.</SmallText>
      <SmallText>✔️Added contacts will receive your SOS alerts whenever you press the SOS button.</SmallText>

      <BoldText style={{ marginBottom: 10}}>
        Sending an SOS Alert
      </BoldText>
      <BoldText style={style.boldTextSubTopic}>SOS Button</BoldText>
      <SmallText>
        Open the app and tap the big SOS button on the home page. Your live
        location will be instantly shared with all your trusted contacts.
      </SmallText>
      <BoldText style={style.boldTextSubTopic}>SMS sending</BoldText>
      <SmallText>
        If you have balence or free SMS in your SIM 1 it will send your location
        co-ordinates in SMS to the contacts you have added once you press SOS
        button.
      </SmallText>


      <BoldText style={{marginBottom: 10}}>Receiving Alerts & Notifications</BoldText>
      <SmallText style={{marginBottom:6}}>✔️When someone adds you as a contact and sends an SOS alert, you will receive a notification.</SmallText>
      <SmallText style={{marginBottom:6}}>✔️Open the Notifications Page in settings to view all alerts you have received.</SmallText>
      <SmallText style={{marginBottom:6}}>✔️Tap on any notification to open the sender's live location on the map.</SmallText>
      <SmallText>✔️If the map is not loading, tap “Open in Google Maps” to view the coordinates directly in the Google Maps app.</SmallText>
    </ScrollView>
  );
};

export default Help;
