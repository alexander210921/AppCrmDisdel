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
    this.connectionService.on('ReceiveMessage', (param1, param2) => {
      console.log(param1, param2);
    });
  }
  StartService() {
    try{
        this.connectionService.start();
    }catch(ex){
        console.log(ex);
    }    
  }
  SendData(coords) {
    this.connectionService.start().then(()=>this.connectionService.invoke("SendMessage",coords.longitude,coords.latitude));
  }
}
