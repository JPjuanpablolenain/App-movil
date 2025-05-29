import { Roboto_400Regular_Italic, useFonts } from "@expo-google-fonts/roboto";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from 'react';
import { SafeAreaView, Text } from 'react-native';

SplashScreen.preventAutoHideAsync();

const  Main = () => {
    const [fontsLoaded] = useFonts({
        Roboto_400Regular_Italic,
    })

    useEffect(() => {
        if (fontsLoaded){
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);
    return (
        <SafeAreaView
            style={{ 
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Text style={{fontSize: 32, fontWeight: 400}}>Hello!</Text>
        </SafeAreaView>
    )   
    
};

export default Main;