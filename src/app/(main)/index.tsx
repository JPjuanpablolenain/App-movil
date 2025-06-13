import { Roboto_400Regular_Italic, useFonts } from "@expo-google-fonts/roboto";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from 'react';
//import MainNavigator from '../../components/MainNavigator';

SplashScreen.preventAutoHideAsync();

const Main = () => {
    const [fontsLoaded] = useFonts({
        Roboto_400Regular_Italic,
    })

    useEffect(() => {
        if (fontsLoaded){
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);
     
};

export default Main;