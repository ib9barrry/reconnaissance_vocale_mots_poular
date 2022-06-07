import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { Audio } from 'expo-av';


const RECORDING_OPTIONS_PRESET_HIGH_QUALITY = {
  isMeteringEnabled: true,
  android: {
    extension: '.wav',
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.wav',
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};


const screen = Dimensions.get('window');

const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time - mins * 60;
    return { mins: formatNumber(mins), secs: formatNumber(secs) };
}

export default function App() {

  const [remainingSecs, setRemainingSecs] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { mins, secs } = getRemaining(remainingSecs);


  const [recording, setRecording] = React.useState();
  const [message, setMessage] = React.useState("");
  const [isrecording  , setIsrecording] = React.useState(false);
  const [lienApi , setLienApi] = React.useState("http://a45c-35-204-55-233.ngrok.io/post_mot_poular");


  const [fran , setFran ] = useState('');
  const [pou , setPou ] = useState('');

/*
  useEffect(()=>{
    // Get ngrok API link from google drive file.

    if(lienApi === "" || lienApi ==='fff'){
      let l = "";
      fetch('https://docs.google.com/uc?export=download&id=1wkZP3LQ2WRp3FKvtKM_2JINXWOYRthBO')
        .then(response => response.text())
        .then(data => {
          let ll = data.split("#");
          l = ll[1];
          setLienApi(l);
          console.log("Lien de L'API est :", l);
        });
    }
  });
*/

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        }); 
        setRemainingSecs(0);
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY = RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
          
        );
        setRecording(recording);
        setIsActive(!isActive);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    setIsActive(false);
    //const info = await FileSystem.getInfoAsync(recording.getURI() || "");
    const info = recording.getURI() || "" ;
    let formData = new FormData();
    const uri = info
    let apiUrl = lienApi ;
    //let apiUrl = 'http://192.168.1.18:5000/post_data'; 
    //let uriParts = uri.split('.');
    let fileType = '.m4a'
    console.log("\n\nInfo file : " , uri);
   
    formData.append('file', {
      uri,
      name: `recording.${fileType}`,
      type: `audio/x-${fileType}`,
    });
    console.log("formData : ", formData);
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
   
    fetch(apiUrl , options).then(res => res.json())
    .then(data =>{
     console.log("data: ",data );
    })
    .catch( error => { 
      console.log(error);
     } )
    setIsrecording(!isrecording);
  }

  toggle = () => {
    setIsActive(!isActive);
  }

  reset = () => {
    setRemainingSecs(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    console.log("effect 1")
    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs(remainingSecs => remainingSecs + 1);
      }, 1000);
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, remainingSecs]);


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.transView}>
        <Text style={styles.transText}>Poular: {pou}</Text>
        <Text style={{ color:"white" }}>   --------------------------------------------</Text>
        <Text style={styles.transText}>Francais: {fran}   </Text>
      </View>
      <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>
      {
        !isActive ? (<TouchableOpacity onPress={ startRecording } style={styles.button}>
          <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>) : 
        (
        <TouchableOpacity onPress={ stopRecording } style={[styles.button, styles.buttonReset]}>
          <Text style={styles.buttonText}>Stop</Text>
      </TouchableOpacity>
        ) 
      }      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07121B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
      borderWidth: 10,
      borderColor: '#B9AAFF',
      width: screen.width / 2,
      height: screen.width / 2,
      borderRadius: screen.width / 2,
      alignItems: 'center',
      justifyContent: 'center'
  },
  buttonText: {
      fontSize: 45,
      color: '#B9AAFF',
  },
  timerText: {
      color: '#fff',
      fontSize: 50,
      marginBottom: 20,
      fontFamily: "AppleSDGothicNeo-UltraLight",
  },
  buttonReset: {
      borderColor: "#FF851B"
  },
  buttonTextReset: {
    color: "#FF851B"
  },
  transView: {
    width: screen.width / 1.15,
    height: screen.height / 2.9,
  },
  transText : {
    color:"#FFF",
    fontSize: 36,
    margin:1,
    fontFamily: "AppleSDGothicNeo-UltraLight",
  }
});