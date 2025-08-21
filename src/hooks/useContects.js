import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from '../constants';

const useContects = () => {
    const[phoneNum,setPhoneNum]=useState([])
  async function getPhone() {
    try {
      const id = await AsyncStorage.getItem('userId');
      const constactNums = await fetch(
        `${apiUrl}/contact/get-phone/${id}`,
        {method: 'GET'},
      );
      const response = await constactNums.json();
      const filter = response.map(r=>r.phone)
      setPhoneNum(filter)
      console.log(phoneNum);
      
    } catch (e) {
      console.log('Error in use contects' + JSON.stringify(e, null, 2));
    }
  }

  useEffect(() => {
    getPhone();
  }, []);
  return {phoneNum,getPhone};
};

export default useContects;
