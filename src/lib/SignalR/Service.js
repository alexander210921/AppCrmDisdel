import {Alert} from 'react-native';

const signalR = require('@microsoft/signalr');
export class SignalRService {
  constructor(urlService) {
    this.urlService = urlService;
    this.NumberConnection = 0;
    this.connectionService = new signalR.HubConnectionBuilder()
      .withUrl(urlService)
      .build();
  }
  ReceiveData() {
    //this.StartService();
    this.connectionService.on('ReceiveMessage', response => {
      console.log('ServerResponse', response);
    });
  }

  async StartService() {
    try {
      await this.connectionService.start();
      return true;
    } catch (ex) {
      console.log(ex);
      Alert.alert('' + ex);
      return false;
    }
  }
  SendData(data) {
    try {
      console.log('SERVICIO DE CONEXION', this.connectionService.state);
      //const startService = await this.StartService();
      if (this.connectionService.state == 'Connected') {
        this.connectionService.invoke('SendCoords', data);
      } else if (this.connectionService.state == 'Disconnected') {
        this.connectionService.start().then(() => {
          this.connectionService.invoke('SendCoords', data);
        });
      }
      //Alert.alert(this.connectionService.state)
    } catch (ex) {
      Alert.alert('error' + ex);
    }
  }
}
