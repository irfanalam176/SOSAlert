import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Text,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useStyle } from '../style/style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ExtraBoldText from '../components/text/ExtraBoldText';
import DropShadow from 'react-native-drop-shadow';
import BoldText from '../components/text/BoldText';
import RegularText from '../components/text/RegularText';
import DropDownPicker from 'react-native-dropdown-picker';
import { lightColor } from '../colors/Colors';
import { useColor } from '../hooks/context/ColorContext';
import LoaderKit from 'react-native-loader-kit';
import { apiUrl } from '../constants';



const ProfileManagement = ({ navigation, route }) => {
  const { userId } = route.params;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('security');
  const [items, setItems] = useState([
    { label: 'Security', value: 'security' },
    { label: 'Medical', value: 'medical' },
    { label: 'Fire', value: 'fire' },
  ]);
  const style = useStyle();
  const { secondaryColor } = useColor();
  const [numberModal, setNumberModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [profileData, setProfileData] = useState(null);

  // Fetch profile data from your API
  const getProfile = async () => {
    try {
      const response = await fetch(`${apiUrl}/profile/get-profile/${userId}`,{method:"GET"});
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const {data} = await response.json();
      
      setProfileData(data);
      setMobile(data.phone || '');
      setAddress(data.address || '');
    } catch (e) {
      console.log('Error fetching profile:', e);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // Update mobile number API call
  const updateMobile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/profile/update-phone/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const result = await response.json();
      if (response.ok && result.update) {
        setNumberModal(false);
        getProfile(); // refresh profile data
      } else {
        throw new Error(result.message || 'Failed to update mobile');
      }
    } catch (e) {
      console.log('Error updating mobile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Update address API call
  const updateAddress = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/profile/update-address/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const result = await response.json();
      if (response.ok && result.update) {
        setAddressModal(false);
        getProfile(); // refresh profile data
      } else {
        throw new Error(result.message || 'Failed to update address');
      }
    } catch (e) {
      console.log('Error updating address:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={[style.wrapper, style.mainBg]} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Mobile Number Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={numberModal}
        onRequestClose={() => setNumberModal(false)}
      >
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <View style={style.header}>
              <ExtraBoldText style={{ marginBottom: 0, marginHorizontal: 'auto' }}>
                Edit Number
              </ExtraBoldText>
              <TouchableOpacity onPress={() => setNumberModal(false)}>
                <FontAwesome5 name="times-circle" size={25} style={style.formIcon} />
              </TouchableOpacity>
            </View>

            <RegularText style={{ marginTop: 40 }}>Edit Number</RegularText>
            <View style={style.inputBox}>
              <FontAwesome5 name="phone" size={20} style={style.formIcon} />
              <TextInput
                style={style.input}
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={mobile}
                onChangeText={setMobile}
              />
            </View>
            <TouchableOpacity style={style.mainBtn} onPress={updateMobile} disabled={isLoading}>
              {isLoading ? (
                <LoaderKit
                  style={{ width: 50, height: 30, marginHorizontal: 'auto' }}
                  name={'BallPulse'}
                  color={'white'}
                />
              ) : (
                <Text style={style.mainBtnText}>Update</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Address Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addressModal}
        onRequestClose={() => setAddressModal(false)}
      >
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <View style={style.header}>
              <ExtraBoldText style={{ marginBottom: 0, marginHorizontal: 'auto' }}>
                Edit Address
              </ExtraBoldText>
              <TouchableOpacity onPress={() => setAddressModal(false)}>
                <FontAwesome5 name="times-circle" size={25} style={style.formIcon} />
              </TouchableOpacity>
            </View>

            <RegularText style={{ marginTop: 40 }}>Edit Address</RegularText>
            <View style={style.inputBox}>
              <FontAwesome5 name="map-marker-alt" size={20} style={style.formIcon} />
              <TextInput
                style={[style.input, { height: 70 }]}
                placeholderTextColor="#999"
                multiline
                textAlignVertical="top"
                value={address}
                onChangeText={setAddress}
              />
            </View>
            <TouchableOpacity style={style.mainBtn} onPress={updateAddress} disabled={isLoading}>
              {isLoading ? (
                <LoaderKit
                  style={{ width: 50, height: 30, marginHorizontal: 'auto' }}
                  name={'BallPulse'}
                  color={'white'}
                />
              ) : (
                <Text style={style.mainBtnText}>Update</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Header */}
      <View style={style.header}>
        <TouchableOpacity onPress={goBack}>
          <FontAwesome5 name="chevron-left" size={25} style={style.formIcon} />
        </TouchableOpacity>
        <ExtraBoldText style={{ marginBottom: 0, marginHorizontal: 'auto' }}>
          Profile
        </ExtraBoldText>
      </View>

      {/* Profile Details */}
      <DropShadow
        style={{
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
        }}
      >
        <View style={[style.form, { paddingTop: 0 }]}>
          <TouchableOpacity style={style.profileImage}>
            <Image source={require('../assets/images/daffy.jpg')} style={{ width: 150, height: 150 }} />
          </TouchableOpacity>
          <BoldText style={{ marginHorizontal: 'auto' }}>{profileData?.name}</BoldText>

          <View style={style.profileDetail}>
            <RegularText>Email</RegularText>
            <RegularText>{profileData?.email}</RegularText>
          </View>
          <View style={style.profileDetail}>
            <RegularText>Phone</RegularText>
            <TouchableOpacity onPress={() => setNumberModal(true)}>
              <RegularText>
                {profileData?.phone}
                <FontAwesome5 name="edit" size={15} style={style.formIcon} />
              </RegularText>
            </TouchableOpacity>
          </View>

          <View style={style.seperator}></View>

          <View style={[style.profileDetail, { flexDirection: 'column', alignItems: 'flex-start', gap: 10 }]}>
            <RegularText>Living Address</RegularText>
            <TouchableOpacity style={{ width: '100%' }} onPress={() => setAddressModal(true)}>
              <RegularText>{profileData?.address}</RegularText>
              <FontAwesome5 name="edit" size={15} style={[style.formIcon, { marginLeft: 'auto' }]} />
            </TouchableOpacity>
          </View>

          <View style={style.seperator}></View>

          <View style={[style.profileDetail, { flexDirection: 'column', alignItems: 'flex-start', gap: 10 }]}>
            <RegularText>Default Emergency Type</RegularText>
            <DropDownPicker
              dropDownContainerStyle={{ borderColor: secondaryColor }}
              dropDownDirection="AUTO"
              style={style.dropdown}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              textStyle={{
                color: 'black',
                fontFamily: 'Oxanium-Bold',
                fontSize: 17,
              }}
              labelStyle={{
                color: lightColor,
                fontFamily: 'Oxanium-Bold',
                fontSize: 17,
              }}
            />
          </View>
        </View>
      </DropShadow>
    </ScrollView>
  );
};

export default ProfileManagement;
