import { Text, SafeAreaView, StyleSheet, TextInput,TouchableOpacity} from 'react-native';
import StartStackNavigator from './Navigators/stackNavigator';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
          <StartStackNavigator/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    marginTop: '30%',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paragraph2:{
    margin: 5,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',

  },
  input: {
    width: '80%',
    borderWidth: 2,
    alignSelf: "center",
    padding: 9,
    borderRadius: 20,
    marginTop: 20
  },
  button:{
    width: '50%',
    borderWidth: 2,
    alignSelf: "center",
    borderRadius: 20,
    justifyContent: 'center',
    marginTop: 20
  }
});
