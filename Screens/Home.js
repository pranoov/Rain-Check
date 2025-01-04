import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TextInput,TouchableOpacity,Image} from 'react-native';
import * as React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

var rainingHours = []
var amount = 0

var customFont = {
  
}

export default class Home extends React.Component{

  constructor(){
    super();
    this.state = {
      fontsLoaded: false
    }
  }

  componentDidMount(){
    this.getData()
  }

  

  sortData(data){
    var temp = data.hourly.precipitation_probability
    var temp2 = data.hourly.precipitation
    for(i = 0; i < 24; i++){
      if(temp2[i] > 0){
          rainingHours.push(i + 1)
      }
    }
  
    if(rainingHours[0] == null){
        this.props.navigation.replace('norain')
        return;
    }
    amount = 0
    for(i = 0; i < 24; i++){
        amount += temp2[i]
    }
    // the amount of precipitation
    amount = Math.round(amount * 100) / 100
    var rainS = rainingHours[0]
    var rainE = rainingHours[rainingHours.length - 1]
    var total = 0
    for(i = rainS - 1; i < rainE; i++){

        total += temp[i]
    }
    
    var average = Math.round(total/((rainE - rainS) + 1))
    AsyncStorage.setItem('percent', average.toString())
    //Converts to 12 hour clock
    if(rainS > 12){
        rainS -= 12
        AsyncStorage.setItem('rainStart', rainS.toString() + ' pm')
        if(rainS == 12) AsyncStorage.setItem('rainStart', rainS.toString() + ' am')
    }else{
        AsyncStorage.setItem('rainStart', rainS.toString() + ' am')
        if(rainS == 12) AsyncStorage.setItem('rainStart', rainS.toString() + ' pm')
    }
    if(rainE > 12){
        rainE -= 12
        AsyncStorage.setItem('rainStop', rainE.toString() + ' pm')
        if(rainE == 12) AsyncStorage.setItem('rainStop', rainE.toString() + ' am')
    }else{
        AsyncStorage.setItem('rainStop', rainE.toString() + ' am')
        if(rainE == 12) AsyncStorage.setItem('rainStop', rainE.toString() + ' pm')
    }
    AsyncStorage.setItem('amount', amount.toString())

    this.props.navigation.replace('rain')
  }

  getData = async () => {
    console.log('working')
    try{
        var name = await AsyncStorage.getItem('name')
        if(name == null){
            this.props.navigation.navigate('start')
        }
        var location = await Location.getCurrentPositionAsync({})
        var address = await Location.reverseGeocodeAsync({
          longitude: location.coords.longitude,
          latitude: location.coords.latitude
        })
        AsyncStorage.setItem('address', address[0].city + ', ' + address[0].region + ', ' + address[0].isoCountryCode)
        //modded api link to add users location
        var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + location.coords.latitude + '&longitude=' + location.coords.longitude + '&hourly=precipitation_probability,precipitation&daily=precipitation_hours&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=1'
        axios.get(url)
        .then(res => {
            this.sortData(res.data)
        })
    }catch(error){
        console.log(error)
    }
  }


    render(){
        return (
            <View style={styles.container}>
                <StatusBar
                  animated={true}
                  barStyle={'light-content'}
                />  
              <LinearGradient
              // Background Linear Gradient
              colors={['rgba(0,0,0,0.8)', 'transparent']}
              style={styles.background}
              />
              <Image style={styles.plant} source={require('../assets/logoCircle.png')}></Image>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0c3b2e',
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center'
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
      },
      plant:{
        width: '90%',
        height: '100%',
        resizeMode: 'center'
      },
      background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 300,
      },
});
