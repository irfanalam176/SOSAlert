import {ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useStyle} from '../style/style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ExtraBoldText from '../components/text/ExtraBoldText';
import {useColor} from '../hooks/context/ColorContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ColorPallet= ({navigation}) => {
  const style = useStyle();
  const [selectedColor, setSelectedColor] = useState('#E50046');
  const {setSecondaryColor} = useColor();
  async function changeTheme(color) {
    setSelectedColor(color);
    setSecondaryColor(color);
    try {
      await AsyncStorage.setItem('color', color);
    } catch (e) {
      console.log('cannot set color');
    }
  }

  useEffect(() => {
    getTheme();
  }, []);
  async function getTheme() {
    try {
      const value = await AsyncStorage.getItem('color');
      changeTheme(value);
      if (value == null) {
        changeTheme('#E50046');
      }
    } catch (e) {
      console.log('cannot get color');
    }
  }
  const colorsList = [
    {hex: '#E50046'},
    {hex: '#09122C'},
    {hex: '#FF69B4'},
    {hex: '#FFD700'},
    {hex: '#800080'},
    {hex: '#FFDAB9'},
    {hex: '#FF6F61'},
    {hex: '#A294F9'},
    {hex: '#40E0D0'},
    {hex: '#98FB98'},
    {hex: '#87CEEB'},
    {hex: '#B76E79'},
  ];

  function goBack() {
    navigation.goBack();
  }

  return (
    <ScrollView
      style={[style.wrapper, style.mainBg]}
      contentContainerStyle={{paddingBottom: 100}}>
      <View style={style.header}>
        <TouchableOpacity onPress={goBack}>
          <FontAwesome5 name="chevron-left" size={25} style={style.formIcon} />
        </TouchableOpacity>
        <ExtraBoldText style={{marginBottom: 0, marginHorizontal: 'auto'}}>
          Color Pallete
        </ExtraBoldText>
      </View>

      <View style={[style.pallet, {marginTop: 30}]}>
        {colorsList.map((color, key) => (
          <TouchableOpacity
            key={key}
            onPress={() => changeTheme(color.hex)}
            style={[
              style.colorBtn,
              {backgroundColor: color.hex},
              selectedColor === color.hex && {
                borderWidth: 3,
                borderColor: '#22177A',
              }, // Adds border to selected color
            ]}>
            
            {
              selectedColor === color.hex &&
              <FontAwesome5
              name="check-double"
              size={50}
              color={'#22177A'}
              style={{textShadowColor: 'white', textShadowRadius: 5}}
            />
            }

          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default ColorPallet;
