import { Alert } from 'react-native/Libraries/Alert/Alert';

const signalR = require('@microsoft/signalr');
export class SignalRService {
  constructor(urlService) {
    this.urlService = urlService;
    this.connectionService = new signalR.HubConnectionBuilder().withUrl(
      urlService,
    ).build();
   // this.StartService();
  }
  ReceiveData() {
    //this.StartService();
    this.connectionService.on('ReceiveMessage', (response) => {
      
    });
  }
  StartService() {
    try{
        this.connectionService.start();
    }catch(ex){
        Alert.alert("No fué posible iniciar el servicio");
    }    
  }
  SendData(data) {
    //data save the latitude , longitude , IdVisit
    try{
      if(data.IDactividadVisita>0){
        this.connectionService.start().then(()=>this.connectionService.invoke("SendMessage",data));
      }      
    }catch(ex){
      Alert.alert(ex);
    }
    
  }
}
