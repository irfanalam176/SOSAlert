import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
} from 'react-native';
import {useStyle} from '../style/style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ExtraBoldText from '../components/text/ExtraBoldText';
import RegularText from '../components/text/RegularText';
import Clipboard from '@react-native-clipboard/clipboard';
import WebView from 'react-native-webview';
import {lightColor} from '../colors/Colors';
import Geolocation from '@react-native-community/geolocation';
import io from 'socket.io-client';
import {apiUrl} from '../constants';

const SOCKET_SERVER_URL = 'http://192.168.227.73:4000';

const LocationPage = ({navigation, route}) => {
  const style = useStyle();
  const webViewRef = useRef(null);

  const {senderId, emergencyContactId} = route.params;

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    // Fetch initial location from backend
    const fetchInitialLocation = async () => {
      try {
        const res = await fetch(`${apiUrl}/sos/get-location/${senderId}`);
        const data = await res.json();
        if (res.ok && data.latitude && data.longitude) {
          setLatitude(data.latitude);
          setLongitude(data.longitude);

          if (webViewRef.current) {
            const jsCode = `updateSenderMarker(${data.latitude}, ${data.longitude}); true;`;
            webViewRef.current.injectJavaScript(jsCode);
          }
        } else {
          console.warn('Invalid location data received:', data);
        }
      } catch (err) {
        console.error('Error fetching initial location:', err);
      }
    };

    fetchInitialLocation();
  }, [senderId]);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {transports: ['websocket']});

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
      socketRef.current.emit('registerUser', emergencyContactId);
    });

    socketRef.current.on('locationUpdate', data => {
      if (data.userId === senderId) {
        console.log('Received Location:', data);
        setLatitude(data.latitude);
        setLongitude(data.longitude);

        if (webViewRef.current) {
          const jsCode = `updateSenderMarker(${data.latitude}, ${data.longitude}); true;`;
          webViewRef.current.injectJavaScript(jsCode);
        }
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [senderId, emergencyContactId]);

  const copyToClipboard = () => {
    if (latitude && longitude) {
      Clipboard.setString(`${latitude},${longitude}`);
      setIsCopied(true);
    }
  };

  const openGoogleMaps = (lat, lng, label = 'Location') => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${label}`;
    Linking.openURL(url).catch(err =>
      console.error('Failed to open Google Maps:', err),
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  const leafletMap = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <style>
    #map { height: 100vh; width: 100vw; margin:0; padding:0; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([0, 0], 15);  // Zoom set to 15
    L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { attribution: '© Google Maps', maxZoom: 20 }).addTo(map);
    var senderMarker = L.marker([0, 0]).addTo(map).bindPopup('Needy Location').openPopup();

    function updateSenderMarker(lat, lng) {
      senderMarker.setLatLng([lat, lng]);
      map.panTo([lat, lng], { animate: true, duration: 0.5 });
    }
  </script>
</body>
</html>

  `;

  const coordinatesAvailable = latitude !== null && longitude !== null;

  return (
    <View style={[style.wrapper, style.mainBg]}>
      <View style={style.header}>
        <TouchableOpacity onPress={goBack}>
          <FontAwesome5 name="chevron-left" size={25} style={style.formIcon} />
        </TouchableOpacity>
        <ExtraBoldText style={{marginBottom: 0, marginHorizontal: 'auto'}}>
          Location Tracking
        </ExtraBoldText>
      </View>
      <RegularText style={{marginVertical: 20}}>
        Current Coordinates
      </RegularText>
      <View style={style.currentDimensions}>
        <Text style={{color: lightColor}}>
          {coordinatesAvailable ? `${latitude}, ${longitude}` : 'Fetching...'}
        </Text>
        <TouchableOpacity style={style.copyBtn} onPress={copyToClipboard}>
          {isCopied ? (
            <FontAwesome5
              name="check-double"
              size={20}
              solid
              color={lightColor}
            />
          ) : (
            <FontAwesome5 name="clone" size={20} solid color={lightColor} />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => openGoogleMaps(latitude, longitude)}
        style={[
          style.mainBtn,
          {
            width: 140,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: 'green',
            alignSelf:"flex-end"
          },
        ]}>
        <FontAwesome5 name="map" size={20} solid color={lightColor} />
        <Text style={[style.smallText, {color: lightColor}]}>
          Open in Google Map
        </Text>
      </TouchableOpacity>

      <View
        style={{
          height: 550,
          marginTop: 20,
          paddingRight: 10,
          backgroundColor: lightColor,
        }}>
        <WebView
          ref={webViewRef}
          style={{margin: 0, padding: 0, flex: 1, width: '100%'}}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          source={{html: leafletMap}}
        />
      </View>
    </View>
  );
};

export default LocationPage;
