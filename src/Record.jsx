import React, { useEffect } from 'react';
import {StyleSheet, Button , Text, View , TouchableOpacity ,StatusBar, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
//import { Recording } from 'expo-av/build/Audio';

const screen = Dimensions.get('window');

const Record = (props) => {


  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [isrecording  , setIsrecording] = React.useState(false);
  const [lienApi , setLienApi] = React.useState("");

  useEffect(()=>{
    // Get API link from google file.
    let l = "";
    fetch('https://docs.google.com/uc?export=download&id=1wkZP3LQ2WRp3FKvtKM_2JINXWOYRthBO')
      .then(response => response.text())
      .then(data => {
        let ll = data.split("#");
        l = ll[1];
        setLienApi(l);
      	console.log("Lien de L'API est :", l);
      });

      getDurationFormatted()

  } );

  async function startRecording() {

    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        setIsrecording(!isrecording);


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
    //const info = await FileSystem.getInfoAsync(recording.getURI() || "");
    const info = recording.getURI() || "" ;
    let formData = new FormData();
    const uri = info
    //let apiUrl = this.state.lien ;
    let apiUrl = 'http://192.168.1.18:5000/post_data'; 
    //let uriParts = uri.split('.');
    let fileType = '.m4a'
    console.log("\n\nInfo file : " , uri);
   /*
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
     } );*/
    setIsrecording(!isrecording);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }


  /*
  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
          <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
          <Button style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)} title="Share"></Button>
        </View>
      );
    });
  }
  */


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity onPress={ ()=> null } style={styles.button}>
        <Text style={styles.buttonText}>{recording ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>


 {/*s
      <Text> Timer : {  } </Text>
      <Button
        color={ recording ? 'red' : '#007AFF' }
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
        />
      <StatusBar style="auto" />
  */}
    </View>
  );
}


export default Record;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07121B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderWidth:10,
    borderColor:'#B9AAFF',
    width: screen.width / 2,
    hight: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent : 'center',
  }, 
  buttonText: {
    fontSize: 50,
    color: '#B9AAFF',
  }
});