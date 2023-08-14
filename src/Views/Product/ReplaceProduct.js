import React, { useState } from 'react';
import {Alert, ScrollView, StyleSheet, Text} from 'react-native';
import {Button, LoaderScreen, View} from 'react-native-ui-lib';
import {useSelector} from 'react-redux';
import { FunctionGetDetailCustomer } from '../../Api/Customers/ApiCustumer';
import { FuncionFocalizarProductos, FuncionGetDetailProductByCardCode } from '../../Api/Products/ApiProduct';
import { UpdateOrderAddLine, UpdateOrderDeleteLine } from '../../Api/Documents/ApiDocuments';
import { useNavigation } from '@react-navigation/native';
const ReplaceItem = () => {
  const DataProductChange = useSelector(state => state.Product);
  const company = useSelector(state => state.company.CompanySelected);
  const [loadState,setLoadState]   = useState(false);
  const navigation = useNavigation();

  const Card = ({title, description}) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    );
  };

  const ReplacementSymbol = () => {
    return (
      <View style={styles.replacementSymbolContainer}>
        <Text style={styles.replacementSymbol}>↔️</Text>
      </View>
    );
  };
  const HandleChangeItem=async()=>{
    try{
        // console.log(DataProductChange?.itemReplace)
        // console.log(DataProductChange?.itemReplace?.LineNum )
        // return;
        let Base = DataProductChange?.itemReplace?.Base =="SI" ? "Y":'N'
        setLoadState(true);
        const customer = await FunctionGetDetailCustomer(DataProductChange?.DataDocumentSelect?.CardCode,company?.NombreDB);
        if(customer ==  null){
            Alert.alert("Ocurrió un error, intente nuevamente");
            return;
        }
        //console.log(customer?.PriceList)
        const Data={
            Encabezado:{
                Log:{
                    DBSAP:company?.NombreDB
                },
                ValidarContraseña:true,
                CardCode:DataProductChange?.DataDocumentSelect?.CardCode,
                AutoUpdt:'Y'
                
            },
            Detalle:[{
                EsClienteKCP:false,
                Margen:0,
                Lista:customer?.PriceList,
                IdProducto:DataProductChange?.newItem.IdProducto,
                Precio:DataProductChange?.itemReplace.PrecioIVA,
                U_NCunitario:1
            }]
        }
        //console.log(DataProductChange?.newItem);
        const StatusAddItemToClient = await FuncionFocalizarProductos(Data);
        if(StatusAddItemToClient!=null){
            if(StatusAddItemToClient.Resultado){
                //segunda accion es agregarlo al pedido
                const getDetailItem = await FuncionGetDetailProductByCardCode(company?.NombreDB,DataProductChange?.newItem.IdProducto,Base,DataProductChange?.DataDocumentSelect?.CardCode);
                if(getDetailItem!=null){
                    let Detail  =[];
                    getDetailItem.Cantidad = DataProductChange?.itemReplace?.Cantidad  
                    Detail.push(getDetailItem);

                    const DocumentUpdateObject = {
                        Encabezado:{
                            TipoUpdate:"NuevaLinea",
                            BaseDatos:company?.NombreDB,
                            DocEntry:DataProductChange?.DataDocumentSelect?.DocEntry,
                            IdUsuario:1
                        },
                        Detalle:Detail
                    }
                    //console.log(DocumentUpdateObject);
                    const statusAddLine = await UpdateOrderAddLine(DocumentUpdateObject); 
                    if(statusAddLine!=null){
                        if(statusAddLine.Resultado){
                            //eliminar el item antiguo
                            const dataDeleteOrder = {
                                Encabezado:{
                                    BaseDatos:company?.NombreDB,
                                    DocEntry:DataProductChange?.DataDocumentSelect?.DocEntry,
                                    IdUsuario:1,
                                    Comentario:DataProductChange?.itemReplace?.VisualOrder -1,
                                    TipoUpdate:"EliminarLinea"
                                }
                            }
                            const DeleteItem = await UpdateOrderDeleteLine(dataDeleteOrder);
                            if(DeleteItem!=null){
                                if(!DeleteItem.Resultado){
                                   Alert.alert("","Se agregó el nuevo producto pero no se pudo eliminar el antiguo"); 
                                }else if(DeleteItem.Resultado){
                                    Alert.alert("Se realizó el cambio con éxito");
                                    setLoadState(false);
                                    //volver atras
                                    navigation.goBack();
                                    navigation.goBack();
                                    navigation.goBack();
                                }
                            }
                        }else{
                            Alert.alert("",statusAddLine.Mensaje);
                        }                        
                    }                   
                }
            }else{
                Alert.alert(StatusAddItemToClient.Mensaje);
            }            
        }
    }finally{
        setLoadState(false);
    }
    
  }

  return (
    <ScrollView>
      <View style={styles.BackroundColor}>
        <Text style={styles.Title}>Cambio de producto</Text>
      </View>
      <Card title="Item Antiguo" description={DataProductChange?.itemReplace.Descripcion} />
      <ReplacementSymbol />
      <Card title="Item Nuevo" description={DataProductChange?.newItem.Descripcion} />
      <Text style={{paddingLeft:'6%'}} >Por un precio de: Q {DataProductChange?.itemReplace.PrecioIVA}</Text>
        {loadState ? 
        <LoaderScreen color="black"></LoaderScreen>
        :
        <Button
        style={{backgroundColor:'black',maxWidth:'35%',marginTop:'2%',marginLeft:'4%'}}
        onPress={HandleChangeItem}
      >
        <Text style={{color:'white'}}>Continuar</Text>
      </Button>
        }
  
    </ScrollView>
  );
};
export default ReplaceItem;
const styles = StyleSheet.create({
  BackroundColor: {
    backgroundColor: '#f5f4f0',
    flex: 1,
  },
  Title: {
    fontSize: 18,
    fontWeight: 600,
    color: 'black',
    padding: '9%',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    flex: 1,
    
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color:'black'
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  replacementSymbolContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  replacementSymbol: {
    fontSize: 24,
  },
});
