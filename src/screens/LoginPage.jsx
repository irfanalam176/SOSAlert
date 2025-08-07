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
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import messaging from '@react-native-firebase/messaging';
import { apiUrl } from '../constants';

const LoginPage = ({ navigation }) => {
  const style = useStyle();
  const [isHidden, setIsHidden] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [incorrectData, setIncorrectData] = useState(false);
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

  const validateInputs = () => {
    
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!emailRegex.test(email))
      newErrors.email = 'Please enter a valid email address.';

    if (!passwordRegex.test(password))
      newErrors.password =
        'Password must be at least 8 characters long and include both uppercase and lowercase letters.';

    setErrors(newErrors);

    console.log("errors = "+newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const togglePassword = () => {
    setIsHidden(!isHidden);
  };

  const goToRegisterPage = () => {
    navigation.navigate('registrationPage');
  };

const login = async () => {
  setIsLoading(true);
  setIncorrectData(false);
  
  if (validateInputs()) {
    try {
      const payload = {
        email,
        password,
        fcmToken,
      };

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 200 && result.isLogedin) {
        // Save user data to AsyncStorage
        await AsyncStorage.setItem('userId', result.userId);
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userName', result.name || '');

        console.log('User logged in successfully!');
        navigation.navigate('sos'); // Navigate to SOS page
      } else if (response.status === 404 && result.emailNotExist) {
        setIncorrectData(true);
      } else if (response.status === 401 && result.passwordNotValid) {
        setIncorrectData(true);
      } else {
        console.error('Login failed:', result.message || 'Unknown error');
        setIncorrectData(true);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setIncorrectData(true);
    } finally {
      setIsLoading(false);
    }
  } else {
    setIsLoading(false);
  }
};


  const isLoggedIn = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId !== null) {
        navigation.navigate('sos'); // Navigate to SOS page if already logged in
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    isLoggedIn(); // Check if the user is already logged in
  }, []);

  return (
    <ScrollView style={style.mainBg}>
      <ImageBackground source={require('../assets/images/map2.jpg')} style={style.pattern}>
        <View style={[style.overlay, style.wrapper]}>
          <View style={style.formHeader}>
            <Image source={require('../assets/images/logo.png')} style={[style.logo, { marginLeft: 'auto' }]} />
            <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={goToRegisterPage}>
              <RegularText style={[style.anchorBtn, { textShadowColor: lightColor, textShadowRadius: 3 }]}>
                Sign Up
              </RegularText>
            </TouchableOpacity>
          </View>
          <View style={style.form}>
            <ExtraBoldText>Sign In</ExtraBoldText>

            <SmallText>Email</SmallText>
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

            <SmallText style={{ marginTop: 30 }}>Password</SmallText>
            <View style={style.inputBox}>
              <FontAwesome5 name="lock" size={20} style={style.formIcon} />
              <TextInput
                placeholder="********"
                style={style.input}
                secureTextEntry={isHidden}
                placeholderTextColor="#999"
                onChangeText={setPassword}
              />
              <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={togglePassword}>
                {isHidden ? (
                  <FontAwesome5 name="eye-slash" size={20} style={style.formIcon} />
                ) : (
                  <FontAwesome5 name="eye" size={20} style={style.formIcon} />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && <SmallText style={style.error}>{errors.password}</SmallText>}
          

            <TouchableOpacity style={style.mainBtn} onPress={login} disabled={isLoading}>
              {isLoading ? (
                <LoaderKit
                  style={{ width: 50, height: 30, marginHorizontal: 'auto' }}
                  name={'BallPulse'}
                  color={'white'}
                />
              ) : (
                <Text style={style.mainBtnText}>Login</Text>
              )}
            </TouchableOpacity>
            {incorrectData && <SmallText style={[style.error,{textAlign:"center"}]}>Email or Password is Not Correct</SmallText>}
            <TouchableOpacity style={{ marginHorizontal: 'auto', marginTop: 20 }} onPress={goToRegisterPage}>
              <RegularText style={style.anchorBtn}>Create an Account Sign Up</RegularText>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default LoginPage;