import React, { useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import SOS from './src/screens/SOS';
import LoginPage from './src/screens/LoginPage';
import RegistrationPage from './src/screens/RegistrationPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LayOut from './src/screens/layout/LayOut';
import { ColorProvider } from './src/hooks/context/ColorContext';
import AuthCheck from './src/screens/auth/AuthCheck';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

const App = () => {
  useEffect(() => {
    getPermission();
    setupForegroundHandler();
    setupBackgroundHandler();
    setupNotificationOpenedHandler();
  }, []);

  // Request notification permissions
  async function getPermission() {
    if (Platform.OS === 'android') {
      const isGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (isGranted === PermissionsAndroid.RESULTS.GRANTED) {
     
      } else {
        console.log("Permission not granted");
      }
    } else {
    }
  }


  // Handle foreground notifications
  const setupForegroundHandler = () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("Foreground Notification:", remoteMessage);
      displayNotification(remoteMessage);
    });

    return unsubscribe;
  };

  // Handle background notifications
  const setupBackgroundHandler = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log("Background Notification:", remoteMessage);
      displayNotification(remoteMessage);
    });
  };

  // Handle notification clicks (when the app is in background or quit state)
  const setupNotificationOpenedHandler = async () => {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      console.log("Notification opened:", initialNotification);
      // Handle navigation or other actions here
    }

    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log("Notification pressed:", detail.notification);
        // Handle navigation or other actions here
      }
    });
  };

  // Display notification using notifee
  const displayNotification = async (remoteMessage:any) => {
    try {
      const channelId = await notifee.createChannel({
        id: 'sos_channel',
        name: 'SOS Alerts',
        sound:"sound",
        vibration:true,
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'SOS Alerts',
        body: remoteMessage.notification?.body || 'Emergency Occurred',
        android: {
          channelId,
          sound:"sound",
          smallIcon: 'ic_launcher', // Make sure this icon exists in your project
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.log("Error displaying notification:", error);
    }
  };

  const Stack = createNativeStackNavigator();
  return (
    <ColorProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='authCheck'>
          <Stack.Screen name='authCheck' component={AuthCheck} />
          <Stack.Screen name='loginPage' component={LoginPage} />
          <Stack.Screen name='registrationPage' component={RegistrationPage} />
          <Stack.Screen name='sos' component={SOS} />
          <Stack.Screen name='layout' component={LayOut} />
        </Stack.Navigator>
      </NavigationContainer>
    </ColorProvider>
  );
};

export default App;