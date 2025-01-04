import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TextInput,TouchableOpacity, SafeAreaView, Image} from 'react-native';
import * as React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

var customFont = {
  
}

export default class NoRain extends React.Component{

  constructor(){
    super();
    this.state = {
      fontsLoaded: false,
      name: 'ddsfdsf'
    }
  }

  componentDidMount(){
    this.getData()
  }

  getData = async () => {
    try{
        var name = await AsyncStorage.getItem('name')
        var address = await AsyncStorage.getItem('address')
        this.setState({
            name : name,
            add: address,
        })
    }catch(error){
        console.log(error)
    }
  }


    render(){
        return (
        <SafeAreaView style={styles.container}>
        <StatusBar
           animated={true}
           barStyle={'light-content'}
        />  
        <LinearGradient
        // Background Linear Gradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.background}
        />
      <Text style={styles.paragraph}>
        Hi, {this.state.name}!
      </Text>
      <View style={{marginTop: 40}}></View>
      <View style={styles.box}>
      <Text style={{fontSize: 40, color: '#fff', margin: 10, fontWeight: 'bold'}}>No rain today! </Text>
      </View>
      <View style={{flexDirection:"row", alignSelf: "center", width: "95%", justifyContent: "space-between" }}>
      </View> 
      <View style={styles.box}>
      <Text style={{fontSize:30, color: '#fff', margin: 10, fontWeight: 'bold'}}>Have to 💧 the 🪴 </Text> 
      </View>
      <View style={{flex: 1}}></View>
      <Text style={{color: '#fff', padding: 8}}>According to {this.state.add}</Text>
      <View style={{position: 'absolute', height: '100%', flexDirection: 'column', justifyContent: 'flex-end', width: '100%'}}>
        <Image style={styles.plant} source={require('../assets/plantFinal.png')}></Image>
      </View>
      <View style={{position: 'absolute', height: '100%', flexDirection: 'row', justifyContent: 'flex-end', width: '98%',marginTop:30}}>
      <TouchableOpacity onPress={()=>{this.props.navigation.replace('home')}}><Image style={styles.setting} source={require('../assets/reload.png')}></Image></TouchableOpacity>
       <TouchableOpacity onPress={()=>{this.props.navigation.navigate('start')}}><Image style={styles.setting} source={require('../assets/setting.png')}></Image></TouchableOpacity>  
      </View>
    
    </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0C3B2E',
      },
      paragraph: {
        marginTop: 50,
        marginLeft: 20,
        fontSize: 43,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#fff'
      },
      paragraph2:{
        margin: 5,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff'
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
      box:{
        backgroundColor: "#216653",
        width: "95%",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        alignSelf: "center",
        borderRadius: 10,
        marginTop: 10
      },
      box2:{
        backgroundColor: "#216653",
        width: "49%",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        alignSelf: "center",
        borderRadius: 10,
        marginTop: 10
      },
      plant:{
        width: 200,
        height: 275,
        resizeMode: 'cover',
        alignSelf: 'flex-end'
      },
      background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 300,
      },
      setting:{
        width: 20,
        height: 20,
        resizeMode: 'center',
        alignSelf: 'flex-end',
        margin: 5
      },
});
