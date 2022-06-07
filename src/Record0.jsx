import * as React from 'react';
//import App1 from './src/App1';
//import Record from './src/Record';
import AudioRecorderPlayer, { 
  AVEncoderAudioQualityIOSType,
  AVEncodingOption, 
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType, 
 } from 'react-native-audio-recorder-player';
import {Card, Button, Title, Divider} from 'react-native-paper';

export default class App extends React.Component {

  
    constructor(props) {
        super(props);
        this.state = {
            isLoggingIn: false,
            recordSecs: 0,
            recordTime: '00:00:00',
            currentPositionSec: 0,
            currentDurationSec: 0,
            playTime: '00:00:00',
            duration: '00:00:00',
        };
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        //audioRecorderPlayer.setSubscriptionDuration(0.09);

    }


  onStartRecord = async () => {
      const path = 'hello.m4a';
      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };
      console.log('audioSet', audioSet);
      const uri = await this.audioRecorderPlayer.startRecorder(path, audioSet);
      this.audioRecorderPlayer.addRecordBackListener((e) => {
        this.setState({
          recordSecs: e.current_position,
          recordTime: this.audioRecorderPlayer.mmssss(
            Math.floor(e.current_position),
          ),
        });
      });
      console.log(`uri: ${uri}`);
    };

  onStopRecord = async () => { 
  const result = await this.audioRecorderPlayer.stopRecorder();
  this.audioRecorderPlayer.removeRecordBackListener();
  this.setState({
      recordSecs: 0,
  });
  console.log(result); 
  };


  onStartPlay = async (e) => {
      console.log('onStartPlay');
      const path = 'hello.m4a'
      const msg = await this.audioRecorderPlayer.startPlayer(path);
      this.audioRecorderPlayer.setVolume(1.0);
      console.log(msg);
      this.audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.current_position === e.duration) {
          console.log('finished');
          this.audioRecorderPlayer.stopPlayer();
        }
        this.setState({
          currentPositionSec: e.current_position,
          currentDurationSec: e.duration,
          playTime: this.audioRecorderPlayer.mmssss(
            Math.floor(e.current_position),
          ),
          duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
        });
      }); 
    };


  onPausePlay = async (e) => { 
      await this.audioRecorderPlayer.pausePlayer();
  };

  onStopPlay = async (e) => {
      console.log('onStopPlay');
      this.audioRecorderPlayer.stopPlayer();
      this.audioRecorderPlayer.removePlayBackListener();
  };



  render(){
    return (
 
        <Card style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center', alignSelf: 'center' }}>   
              <Title>{this.state.recordTime}</Title>
              <Button mode="contained" icon="record" onPress={() => this.onStartRecord()}>
                RECORD
            </Button>
    
              <Button
                icon="stop"
                mode="outlined"
                onPress={() => this.onStopRecord()}
              >
                STOP
        </Button>
              <Divider />
              <Title>{this.state.playTime} / {this.state.duration}</Title>
              <Button mode="contained" icon="play" onPress={() => this.onStartPlay()}>
                PLAY
            </Button>
    
              <Button
                icon="pause"
                mode="contained"
                onPress={() => this.onPausePlay()}
              >
                PAUSE
        </Button>
              <Button
                icon="stop"
                mode="outlined"
                onPress={() => this.onStopPlay()}
              >
                STOP
        </Button>
          
          </Card>
  

      );
  }
}