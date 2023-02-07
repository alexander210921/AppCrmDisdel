const signalR = require('@microsoft/signalr');
export const StartSignalR = (
  UrL = 'http://alexander9-001-site1.ftempurl.com/chatHub',
) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(UrL)
    .build();
  connection.on('ReceiveMessage', (param1, param2) => {
    console.log(param1, param2);
  });
  connection.start();
};
