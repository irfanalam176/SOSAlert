import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState, useRef} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
  PermissionsAndroid,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  ImageBackground,
  NativeModules,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import {useStyle} from '../style/style';
import DropShadow from 'react-native-drop-shadow';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {lightColor} from '../colors/Colors';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ExtraBoldText from '../components/text/ExtraBoldText';
import {useColor} from '../hooks/context/ColorContext';
import {apiUrl, socketUrl} from '../constants';
import {promptForEnableLocationIfNeeded} from 'react-native-android-location-enabler';
import useContects from '../hooks/useContects';
const {SmsModule} = NativeModules;
const SOCKET_SERVER_URL = socketUrl; // Your server IP & port

const SOS = ({navigation}) => {
  const style = useStyle();
  const {secondaryColor} = useColor();
  const hasSentSms = useRef(false);
  const phoneNum = useContects();

  const webviewRef = useRef(null);
  const socketRef = useRef(null);
  const initialCoords = {latitude: 33.6265, longitude: 73.0759};

  const [latitude, setLatitude] = useState(initialCoords.latitude);
  const [longitude, setLongitude] = useState(initialCoords.longitude);
  const [userId, setUserId] = useState('');
  const [disable, setDisable] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs location access to work properly.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return status === RESULTS.GRANTED;
    }
  };

  useEffect(() => {
    const init = async () => {
      await requestLocationPermission();

      const id = await AsyncStorage.getItem('userId');
      if (id) setUserId(id);

      socketRef.current = io(SOCKET_SERVER_URL, {
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to socket server, id:', socketRef.current.id);
        setSocketConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from socket server');
        setSocketConnected(false);
      });
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socketConnected && socketRef.current && userId) {
      socketRef.current.emit('registerUser', userId);
      console.log('Socket user registered:', userId);
    }
  }, [socketConnected, userId]);

  useEffect(() => {
    let watchId;

    if (isTracking && userId && socketConnected) {
      watchId = Geolocation.watchPosition(
        pos => {
          const {latitude, longitude} = pos.coords;

          if (!hasSentSms.current) {
            hasSentSms.current = true; // ✅ lock it
            sendSilentSms(
              `This contact needs help. Location: https://maps.google.com/?q=${latitude},${longitude}`,
            );
            console.log('Silent SMS sent once ✅');
          }

          setLatitude(latitude);
          setLongitude(longitude);

          socketRef.current.emit('updateLocation', {
            userId,
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
          });

          if (webviewRef.current) {
            webviewRef.current.postMessage(
              JSON.stringify({latitude, longitude}),
            );
          }
        },
        error => console.error(error),
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          interval: 1000,
          fastestInterval: 1000,
        },
      );
    }

    return () => {
      if (watchId) Geolocation.clearWatch(watchId);
    };
  }, [isTracking, userId, socketConnected]);

  // Start sharing location
  const sosBtnPressed = async () => {
    if (Platform.OS === 'android') {
      try {
        await promptForEnableLocationIfNeeded();
        console.log('Location services enabled or already enabled');
      } catch (enableError) {
        console.warn('Location services not enabled:', enableError);
        // Stop here, do not proceed if location not enabled
        return;
      }
    }

    scale.value = withSpring(0.9, {damping: 5, stiffness: 100});
    setDisable(true);
    setIsTracking(true);

    try {
      if (!userId) throw new Error('User ID not found');

      socketRef.current?.emit('startSOS', userId);

      const userName = (await AsyncStorage.getItem('userName')) || '';

      const sosData = {
        userId,
        userName,
        latitude,
        longitude,
      };

      const response = await fetch(`${apiUrl}/sos/set-sos/${userId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sosData),
      });

      if (!response.ok) throw new Error('Failed to send SOS request.');

      const result = await response.json();
      console.log('SOS request successful:', result);
    } catch (error) {
      console.error('Error sending SOS request:', error);
    } finally {
      setDisable(false);
    }
  };

  // Stop sharing location
  const stopSharing = () => {
    scale.value = withSpring(1, {damping: 5, stiffness: 100});
    setIsTracking(false);
    socketRef.current?.emit('stopSOS', userId);
    console.log('Stopped sharing location for user:', userId);
  };

  const leafletMap = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>#map { height: 100vh; width: 100vw; margin:0; padding:0; }</style>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${initialCoords.latitude}, ${initialCoords.longitude}], 15);
        L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
          attribution: '© Google Maps',
          maxZoom: 20,
          subdomains: ['mt0','mt1','mt2','mt3']
        }).addTo(map);
        var marker = L.marker([${initialCoords.latitude}, ${initialCoords.longitude}]).addTo(map)
          .bindPopup('You are here')
          .openPopup();

        document.addEventListener('message', function(event) {
          var data = JSON.parse(event.data);
          marker.setLatLng([data.latitude, data.longitude]);
          map.panTo([data.latitude, data.longitude], { animate: true, duration: 1 });
        });
      </script>
    </body>
    </html>
  `;

  async function sendSilentSms(message) {

    if (Platform.OS !== 'android') {
      console.log('Silent SMS is only supported on Android');
      return;
    }
    // Check if permission is already granted
    const result = await check(PERMISSIONS.ANDROID.SEND_SMS);

    if (result === RESULTS.GRANTED) {
      SmsModule.sendSms(phoneNum, message);
    } else {
      // Request permission if not granted
      const reqResult = await request(PERMISSIONS.ANDROID.SEND_SMS);

      if (reqResult === RESULTS.GRANTED) {
        SmsModule.sendSms(phoneNum, message);
      } else {
        console.log('SMS permission denied');
      }
    }
  }

  return (
    <View style={style.mainBg}>
      <View style={style.homeHeader}>
        <Image
          style={style.logo}
          source={require('../assets/images/logo.png')}
        />
        <TouchableOpacity onPress={() => navigation.navigate('layout')}>
          <FontAwesome5Icon name="cogs" size={30} color={secondaryColor} />
        </TouchableOpacity>
      </View>

      <Text style={style.warning}>Keep Your Location Enabled</Text>
      <Text style={style.warning}>{latitude}</Text>
      <Text style={style.warning}>{longitude}</Text>

      <ImageBackground
        source={require('../assets/images/map.png')}
        style={style.bgMap}>
        <DropShadow
          style={{
            shadowColor: disable ? secondaryColor : 'black',
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 1,
            shadowRadius: 5,
          }}>
          <View style={style.sosBtnOuter}>
            {!isTracking ? (
              <Pressable onPress={sosBtnPressed} disabled={disable}>
                <DropShadow
                  style={{
                    shadowColor: disable ? secondaryColor : 'black',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 1,
                    shadowRadius: 5,
                  }}>
                  <Animated.View style={[style.sosButton, animatedStyle]}>
                    <ExtraBoldText style={{color: lightColor, fontSize: 100}}>
                      SOS
                    </ExtraBoldText>
                  </Animated.View>
                </DropShadow>
              </Pressable>
            ) : (
              <Pressable onPress={stopSharing}>
                <DropShadow
                  style={{
                    shadowColor: 'red',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 1,
                    shadowRadius: 5,
                  }}>
                  <Animated.View
                    style={[
                      style.sosButton,
                      animatedStyle,
                      {backgroundColor: 'red'},
                    ]}>
                    <ExtraBoldText style={{color: lightColor, fontSize: 40}}>
                      Stop Sharing
                    </ExtraBoldText>
                  </Animated.View>
                </DropShadow>
              </Pressable>
            )}
          </View>
        </DropShadow>
      </ImageBackground>

      <View
        style={{
          height: 300,
          marginTop: 20,
          paddingRight: 10,
          backgroundColor: lightColor,
        }}>
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{html: leafletMap}}
          javaScriptEnabled
          domStorageEnabled
          style={style.map}
        />
      </View>

      {latitude && longitude && (
        <View style={{alignItems: 'center', marginTop: 10}}>
          <Text>Latitude: {latitude.toFixed(6)}</Text>
          <Text>Longitude: {longitude.toFixed(6)}</Text>
        </View>
      )}
    </View>
  );
};

export default SOS;
