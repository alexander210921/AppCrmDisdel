import RNFetchBlob from 'rn-fetch-blob';
export function _base64ToArrayBuffer(base64) {    
   return  null;
}
export async function sendFileToServer(fileUri) {  
 try{
   const CHUNK_SIZE = 1024 * 1024; // 1 MB
   const readStream = await RNFetchBlob.fs.readStream(fileUri, 'base64', CHUNK_SIZE);      
 }catch(ex){
   console.log(ex,"Error al abrir la imagen")
 }
}