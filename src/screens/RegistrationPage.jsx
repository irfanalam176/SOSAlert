import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useStyle } from '../style/style';
import RegularText from '../components/text/RegularText';
import SmallText from '../components/text/SmallText';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ExtraBoldText from '../components/text/ExtraBoldText';
import { lightColor } from '../colors/Colors';
import LoaderKit from 'react-native-loader-kit';
import { NavigationType } from '../types/Types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { apiUrl } from '../constants';

const RegistrationPage = ({ navigation }) => {
  const style = useStyle();
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isEmailExist, setIsEmailExist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch FCM token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await messaging().getToken();
        setFcmToken(token);
      } catch (error) {
        console.log('Error fetching FCM token:', error);
      }
    };
    fetchToken();
  }, []);

  const goToLoginPage = () => {
    navigation.navigate('loginPage');
  };

  const togglePassword = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  const toggleConfirmPassword = () => {
    setIsConfirmPasswordHidden(!isConfirmPasswordHidden);
  };

  const validateInputs = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^03[0-9]{9}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!nameRegex.test(name))
      newErrors.name = 'Please enter a valid name (letters and spaces only).';
    if (!emailRegex.test(email))
      newErrors.email = 'Please enter a valid email address.';
    if (!phoneRegex.test(phone))
      newErrors.phone = 'Please enter a valid phone number (e.g., 03XXXXXXXXX).';
    if (!passwordRegex.test(password))
      newErrors.password =
        'Password must be at least 8 characters long and include both uppercase and lowercase letters.';
    if (password !== confirmPassword)
      newErrors.confirmPassword = '*Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleRegister = async () => {
  setIsLoading(true);
  setIsEmailExist(false);

  if (validateInputs()) {
    try {
      // Prepare payload for backend
      const payload = {
        name,
        email,
        phone,
        password,
        address,
        fcmToken,
      };

      // Call your backend API for registration
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 201 && result.isUserAdded) {
        console.log('User registered successfully!');
        navigation.navigate('loginPage'); // Navigate after success
      } else if (response.status === 409 && result.emailExist) {
        setIsEmailExist(true);
      } else {
        // Handle other errors or show a generic message
        console.error('Registration failed:', result.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      setIsLoading(false);
    }
  } else {
    setIsLoading(false);
  }
};


  return (
    <ScrollView style={style.mainBg}>
      <ImageBackground source={require('../assets/images/map2.jpg')} style={style.pattern}>
        <View style={[style.overlay, style.wrapper]}>
          <View style={style.formHeader}>
            <Image source={require('../assets/images/logo.png')} style={[style.logo, { marginLeft: 'auto' }]} />
            <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={goToLoginPage}>
              <RegularText style={[style.anchorBtn, { textShadowColor: lightColor, textShadowRadius: 3 }]}>
                Sign In
              </RegularText>
            </TouchableOpacity>
          </View>
          <View style={[style.form, { marginTop: 10 }]}>
            <ExtraBoldText>Sign Up</ExtraBoldText>

            <SmallText>Name</SmallText>
            <View style={style.inputBox}>
              <FontAwesome5 name="user" size={20} style={style.formIcon} solid />
              <TextInput
                placeholder="Irfan"
                style={style.input}
                placeholderTextColor="#999"
                onChangeText={setName}
              />
            </View>
            {errors.name && <SmallText style={style.error}>{errors.name}</SmallText>}

            <SmallText style={style.lables}>Email</SmallText>
            <View style={style.inputBox}>
              <FontAwesome5 name="envelope" size={20} style={style.formIcon} solid />
              <TextInput
                placeholder="Daffodil@n.com"
                style={style.input}
                placeholderTextColor="#999"
                keyboardType="email-address"
                onChangeText={setEmail}
              />
            </View>
            {errors.email && <SmallText style={style.error}>{errors.email}</SmallText>}
            {isEmailExist && <SmallText style={style.error}>Email Already Exist</SmallText>}

            <SmallText style={style.lables}>Phone</SmallText>
            <View style={style.inputBox}>
              <FontAwesome5 name="mobile" size={20} style={style.formIcon} solid />
              <TextInput
                placeholder="03*********"
                style={style.input}
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                onChangeText={setPhone}
              />
            </View>
            {errors.phone && <SmallText style={style.error}>{errors.phone}</SmallText>}

            <SmallText style={style.lables}>Password</SmallText>
            <View style={style.inputBox}>
              <FontAwesome5 name="lock" size={20} style={style.formIcon} />
              <TextInput
                placeholder="********"
                style={style.input}
                secureTextEntry={isPasswordHidden}
                placeholderTextColor="#999"
                onChangeText={setPassword}
              />
              <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={togglePassword}>
                <FontAwesome5 name={isPasswordHidden ? 'eye-slash' : 'eye'} size={20} style={style.formIcon} />
              </TouchableOpacity>
            </View>
            {errors.password && <SmallText style={style.error}>{errors.password}</SmallText>}

            <SmallText style={style.lables}>Confirm Password</SmallText>
            <View style={style.inputBox}>
              <FontAwesome5 name="lock" size={20} style={style.formIcon} />
              <TextInput
                placeholder="********"
                style={style.input}
                secureTextEntry={isConfirmPasswordHidden}
                placeholderTextColor="#999"
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={toggleConfirmPassword}>
                <FontAwesome5 name={isConfirmPasswordHidden ? 'eye-slash' : 'eye'} size={20} style={style.formIcon} />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <SmallText style={style.error}>{errors.confirmPassword}</SmallText>}

            <SmallText style={style.lables}>Living Address (Optional)</SmallText>
            <View style={style.inputBox}>
              <FontAwesome5 name="map-marker-alt" size={20} style={style.formIcon} solid />
              <TextInput
                placeholder="Your Living Address"
                style={[style.input, { height: 70 }]}
                placeholderTextColor="#999"
                onChangeText={setAddress}
                multiline
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={style.mainBtn} onPress={handleRegister} disabled={isLoading}>
              {isLoading ? (
                <LoaderKit
                  style={{ width: 50, height: 30, marginHorizontal: 'auto' }}
                  name={'BallPulse'}
                  color={'white'}
                />
              ) : (
                <Text style={style.mainBtnText}>Register</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={{ marginHorizontal: 'auto', marginTop: 20 }} onPress={goToLoginPage}>
              <RegularText style={style.anchorBtn}>Already Have an Account? Sign In</RegularText>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default RegistrationPage;