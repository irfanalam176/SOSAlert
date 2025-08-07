import {NativeStackNavigationProp} from '@react-navigation/native-stack';
export type RootStack={
    sos:undefined;
    loginPage:undefined;
    registrationPage:undefined;
    setting:undefined;
    locationPage:undefined;
    profileManagement:any;
    contactsManagement:any;
    notifications:undefined;
    listOFTrustedConacts:undefined;
    addContactsToTrustedList:undefined;
    privacyPolicyAndTermsOfUse:undefined
    colors:undefined;
    colorPallet:undefined;
    authCheck:undefined;
    layout:undefined;
}

export type navigationProps=NativeStackNavigationProp<RootStack>

export type NavigationType={
    navigation:navigationProps;
    route:any
}


export type ContactListType = {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  

