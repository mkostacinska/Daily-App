import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import WelcomeScreen from './app/screens/WelcomeScreen';
import LoginScreen from './app/screens/LoginScreen';
import LandingScreen from './app/screens/LandingScreen';
import LoadingScreen from './app/screens/LoadingScreen';
import { useFonts } from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react/cjs/react.production.min';
import { auth } from './firebase';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    'Poppins-ExtraBold': require('./app/assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Medium': require('./app/assets/fonts/Poppins-Medium.ttf'),
    'Poppins': require('./app/assets/fonts/Poppins-Light.ttf'),
    'OpenSans': require('./app/assets/fonts/OpenSans.ttf'),
  })

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{
            headerShown: false,
          }} />
        <Stack.Screen
          name="SignUp"
          component={WelcomeScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_left',
          }} />
        <Stack.Screen
          name="LogIn"
          component={LoginScreen}
          options={{
            headerShown: false,
          }} />
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{
            headerShown: false,
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red',
    borderWidth: 3,
  },
});
