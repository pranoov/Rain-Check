import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Start from '../Screens/starting';
import Home from '../Screens/Home';
import Rain from '../Screens/rainScreen';
import NoRain from '../Screens/noRainScreen';

const Stack = createStackNavigator()

export default StartStackNavigator=()=> {
  return (
    <Stack.Navigator 
        screenOptions={{
            headerShown: false
        }}
    >   
        
        <Stack.Screen name='home' component={Home}/>
        <Stack.Screen name='start' component={Start}/>
        <Stack.Screen name='norain' component={NoRain}/>
        <Stack.Screen name='rain' component={Rain}/>
    </Stack.Navigator>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
