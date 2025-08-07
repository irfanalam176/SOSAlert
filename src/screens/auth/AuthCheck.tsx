import React, { useEffect, useState } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationType } from "../../types/Types";
import { useStyle } from "../../style/style";
import LoaderKit from 'react-native-loader-kit';
const AuthCheck:React.FC<NavigationType> = ({navigation}) => {
    const style = useStyle();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    
    const checkUser = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          navigation.replace("sos"); // Navigate to SOS Page
        } else {
          navigation.replace("loginPage"); // Navigate to Login Page
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {

    return (
      <View style={[style.mainBg,{alignItems:"center",justifyContent:"center"}]}>
        <LoaderKit
                  style={{width: 100, height: 100}}
                  name={'BallPulse'} // Optional: see list of animations below
                  color={"#E50046"} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                />
      </View>
    );
  }

  return null;
};

export default AuthCheck;
