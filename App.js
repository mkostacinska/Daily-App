import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import WelcomeScreen from './app/screens/WelcomeScreen';
import LoginScreen from './app/screens/LoginScreen';
import { useFonts } from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

//Ctrl+M to bring up developer menu in the emulator

export default function App() {
  const [loaded] = useFonts({
    'Poppins-ExtraBold': require('./app/assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Medium': require('./app/assets/fonts/Poppins-Medium.ttf'),
    'OpenSans': require('./app/assets/fonts/OpenSans.ttf'),
  })

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
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