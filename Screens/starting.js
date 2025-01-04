
import { Text, View, StyleSheet, TextInput,TouchableOpacity,StatusBar, Alert, ToastAndroid} from 'react-native';
import * as React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';

var navigate = false
var rainingHours = []
var amount = 0

var customFont = {
  
}

export default class Start extends React.Component{

  constructor(){
    super();
    this.state = {
      fontsLoaded: false,
      name: '',
      loctEmoji: '',
      disabled: true,
      value: '',
      text: 'Click to Allow Location',
    }
  }

  componentDidMount(){
    this.checkLocation()
  }



  checkLocation = async () =>{
    var loct = await Location.getForegroundPermissionsAsync()
    console.log(loct.granted)
    if(loct.granted){
      navigate = true
      this.setState({
        loctEmoji: '✅',
        text: 'Location Granted'
      })
    }else{
      this.setState({
        loctEmoji: '❌',
        text: 'Click to Allow Location'
      })
    }
  }

  updateButton=()=>{
    if(this.state.loctEmoji == '✅' && this.state.name != ''){
      this.setState({
        disabled: false
      })
    }else{
      this.setState({
        disabled: true
      })
    }
  }

  requestLocation = async () => {
    let status = await Location.requestForegroundPermissionsAsync()
    if(status.status == 'granted'){
      this.checkLocation()
      ToastAndroid.show('Location Granted :)', ToastAndroid.BOTTOM)
      let location = await Location.getCurrentPositionAsync({});
      console.log(location)
    }else{
      Alert.alert({
        title: 'Location Needed!',
        message: 'Allow location in settings and click button to refresh.'
      })
    }
    this.updateButton()
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
        this.props.navigation.navigate('norain')
        return;
    }
    for(i = 0; i < 24; i++){
        amount += temp2[i]
    }
    // the amount of precipitation
    amount = Math.round(amount)
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
    }else{
        AsyncStorage.setItem('rainStart', rainS.toString() + ' am')
    }
    if(rainE > 12){
        rainE -= 12
        AsyncStorage.setItem('rainStop', rainE.toString() + ' pm')
        if(rainE == 12) AsyncStorage.setItem('rainStop', rainE.toString() + ' am')
    }else{
        AsyncStorage.setItem('rainStop', rainE.toString() + ' am')
    }
    AsyncStorage.setItem('amount', amount.toString())

    this.props.navigation.navigate('rain')
  }

  getData = async () => {
    console.log('working')
    try{
        var location = await Location.getCurrentPositionAsync({})
        var address = await Location.reverseGeocodeAsync({
          longitude: location.coords.longitude,
          latitude: location.coords.latitude
        })
        AsyncStorage.setItem('address', address[0].city + ', ' + address[0].region + ', ' + address[0].isoCountryCode)
        var name = await AsyncStorage.getItem('name')
        if(name == null){
            this.props.navigation.navigate('start')
        }
        var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + location.coords.latitude + '&longitude=' + location.coords.longitude + '&hourly=precipitation_probability,precipitation&daily=precipitation_hours&timezone=auto&forecast_days=1'   
        
        axios.get(url)
        .then(res => {
            this.sortData(res.data)
        })
    }catch(error){
        console.log(error)
    }
  }

  storeData = async () => {
        try{
            AsyncStorage.setItem('name',this.state.name)
            this.props.navigation.replace('home')
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
                <Text style={styles.paragraph}>Hello!</Text>
                <Text style={{fontSize: 25,fontWeight: 'bold',textAlign: 'left',color: '#fff',marginLeft: '5%',marginTop:'2%'}}>Please enter details below...</Text>
                <TextInput style={styles.input} placeholder="Enter your name..." placeholderTextColor={'#fff'} value={this.state.name} onChangeText={(text)=>{this.setState({name: text}) 
                this.updateButton()}}/>
                <TouchableOpacity style={styles.button2} onPress={()=>{this.requestLocation()}}><Text style={{color: '#fff',margin: 7,fontSize: 21,fontWeight: 'bold',textAlign: 'center',}}>{this.state.text} {this.state.loctEmoji}</Text></TouchableOpacity> 
                
                <TouchableOpacity disabled={this.state.disabled} style={this.state.disabled ? styles.button : styles.button3} onPress={()=>{this.storeData()}}><Text style={styles.paragraph2}>Next</Text></TouchableOpacity> 
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0c3b2e',
        padding: 8,
      },
      paragraph: {
        marginTop: '30%',
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#fff',
        marginLeft: '5%'
      },
      paragraph2:{
        margin: 5,
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#oc3b2e'
      },
      input: {
        width: '90%',
        borderWidth: 2,
        alignSelf: "center",
        padding: 9,
        borderRadius: 20,
        marginTop: 20,
        borderColor: '#fff',
        fontSize: 20,
        color: '#fff'
      },
      button:{
        width: '50%',
        borderWidth: 2,
        alignSelf: "center",
        borderRadius: 20,
        justifyContent: 'center',
        marginTop: 20,
        borderColor: '#fff',
        backgroundColor: '#fff',
        opacity: 0.7
      },
      button3:{
        width: '50%',
        borderWidth: 2,
        alignSelf: "center",
        borderRadius: 20,
        justifyContent: 'center',
        marginTop: 20,
        borderColor: '#fff',
        backgroundColor: '#fff',
        opacity: 1
      },
      button2:{
        width: '90%',
        borderWidth: 2,
        alignSelf: "center",
        borderRadius: 20,
        justifyContent: 'center',
        marginTop: 20,
        borderColor: '#fff',

      },
      background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 300,
      },
});
