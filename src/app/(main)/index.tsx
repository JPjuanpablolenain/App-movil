import { Redirect } from 'expo-router';
import { Roboto_400Regular_Italic, useFonts } from "@expo-google-fonts/roboto";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

const Main = () => {
    const [fontsLoaded] = useFonts({
        Roboto_400Regular_Italic,
    });

    useEffect(() => {
        if (fontsLoaded){
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);
    
    // Redirigir a la pantalla home
    return <Redirect href="/(main)/home" />;
};

export default Main;