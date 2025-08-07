import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import { useStyle } from '../style/style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ExtraBoldText from '../components/text/ExtraBoldText';
import RegularText from '../components/text/RegularText';
import SmallText from '../components/text/SmallText';
import BoldText from '../components/text/BoldText';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withRepeat } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderKit from 'react-native-loader-kit';
import { useColor } from '../hooks/context/ColorContext';
import { apiUrl } from '../constants';

const Notifications = ({ navigation }) => {
  const style = useStyle();
  const scale = useSharedValue(1);
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { secondaryColor } = useColor();

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      if (id) setUserId(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/notifications/get-notifications/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const json = await response.json();
      setNotifications(json.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withSpring(1.2, { damping: 5, stiffness: 100 }),
        withSpring(1, { damping: 5, stiffness: 100 })
      ),
      -1,
      false
    );
  }, []);

  const activeEmergencyAnimation = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const goBack = () => {
    navigation.goBack();
  };

const trackLocation = async (senderId, notificationId) => {
  
  try {
    // 1. Mark notification as read
    await fetch(`${apiUrl}/notifications/mark-red/${notificationId}`, {
      method: 'GET',
    });

    // 2. Refresh the notification list to update UI
    fetchNotifications();

    // 3. Navigate to location tracking
    navigation.navigate('locationPage', { senderId, emergencyContactId: userId });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

  const deleteNotification = (notificationId) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`${apiUrl}/notifications/delete/${notificationId}`, {
                method: 'DELETE',
              });
              if (res.ok) {
                fetchNotifications(); // refresh list
              } else {
                throw new Error('Failed to delete notification');
              }
            } catch (error) {
              console.error('Error deleting notification:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[style.wrapper, style.mainBg]}>
      <View style={style.header}>
        <TouchableOpacity onPress={goBack}>
          <FontAwesome5 name="chevron-left" size={25} style={style.formIcon} />
        </TouchableOpacity>
        <ExtraBoldText style={{ marginBottom: 0, marginHorizontal: 'auto' }}>
          Notifications
        </ExtraBoldText>
      </View>

      {isLoading ? (
        <LoaderKit style={{ width: 100, height: 100, marginHorizontal: 'auto' }} name={'BallPulse'} color={secondaryColor} />
      ) : (
        <ScrollView style={[style.form, { marginTop: 20, height: 550 }]} contentContainerStyle={{ paddingBottom: 100 }}>
          {notifications.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No notifications found</Text>
          ) : (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.notificationId}
                style={style.notificationBtn}
                onPress={() => trackLocation(notification.senderId,notification.notificationId)}
              >
               <View style={{flexDirection:"row"}}>
                 <Animated.Text style={[style.activeEmergency, activeEmergencyAnimation]}>
                  {notification.status ==0 ? '🆘' : '✓'}
                </Animated.Text>
                
                <TouchableOpacity
                  
                  onPress={() => deleteNotification(notification.notificationId)}
                >
                  <FontAwesome5 name="trash" size={20} color="red" />
                </TouchableOpacity>
               </View>

                <RegularText>{notification.senderName}</RegularText>
                <SmallText>{notification.senderEmail}</SmallText>
                <BoldText>{notification.emergencyType || "SOS"}</BoldText>
                <SmallText style={{ textAlign: 'right' }}>
                  {new Date(notification.timestamp).toLocaleString()}
                </SmallText>

              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Notifications;
