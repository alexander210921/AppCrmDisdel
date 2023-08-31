import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useSelector} from 'react-redux';
import {FacturarDocumento} from '../../../Api/Documents/ApiDocuments';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ActualizarTrackingFactura} from '../../../Api/Traking/ApiTraking';
import {LoaderScreen} from 'react-native-ui-lib';
const FormularioFacturacion = ({route}) => {
  const [cliente, setCliente] = useState('');
  const [codigoNombre, setCodigoNombre] = useState('');
  const [nit, setNit] = useState('');
  const [tipoEspecial, setTipoEspecial] = useState('');
  const [lugarEntrega, setLugarEntrega] = useState('');
  const [direccionFiscal, setDireccionFiscal] = useState('');
  const [personaContacto, setPersonaContacto] = useState('');
  const [preguntarPor, setPreguntarPor] = useState('');
  const [confirmarCompra, setConfirmarCompra] = useState('N');
  const [requisicion, setRequisicion] = useState('');
  const [consignacion, setConsignacion] = useState('NA');
  const [enviarRCaja, setEnviarRCaja] = useState('N');
  const [ordenCompra, setOrdenCompra] = useState('');
  const [facturarEn, setFacturarEn] = useState('');
  const [promocionVenta, setPromocionVenta] = useState('N');
  const [comentarios, setComentarios] = useState('');
  const [DataDocument, setDataDocument] = useState(null);
  const company = useSelector(state => state.company.CompanySelected);
  const User = useSelector(state => state.login.user);
  const DocumentCheckerSelected = useSelector(state => state.Product);
  const [loadCreateBill, setLoadCreateBill] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    setDataDocument(route?.params);
    setCliente(route?.params?.Encabezado?.CardCode);
    setCodigoNombre(route?.params?.Encabezado?.NombreCliente);
    setNit(route?.params?.Encabezado?.DefinidiosUsuario?.DocNIT);
    setTipoEspecial(route?.params?.Encabezado?.U_TipoEspecial);
    setLugarEntrega(route?.params?.Encabezado?.DireccionEntrega);
    setDireccionFiscal(route?.params?.Encabezado?.DireccionFisicaEntrega);
    setPersonaContacto(route?.params?.Encabezado?.Contacto);
    setRequisicion(route?.params?.Encabezado?.U_Requicicion);
    setOrdenCompra(route?.params?.Encabezado?.U_OrdenCompra);
    setFacturarEn('D3');
    setComentarios(
      '. Basado en Pedidos de Cliente: ' + route?.params?.Encabezado?.DocNum,
    );
    //console.log("LOS PARAMETROS",route?.params)
  }, []);
  const enviarFormulario = async () => {
    // village  -55612  - 25/08/2023
    try {
      setLoadCreateBill(true);
      const data = {
        Encabezado: {
          BaseDatos: company.NombreDB,
          Serie: 288,
          CardCode: cliente,
          //codigoNombre,
          IdUsuario: User.EntityID,
          PreguntarPor: preguntarPor,
          Autor: User?.Datos?.NombreCompleto,
          EntregadoPor: '',
          FacturarEn: facturarEn,
          U_RutaEntrega: '',
          EsConsignacion: consignacion,
          ConfimacionOCompra: confirmarCompra == 'S' ? 1 : 0,
          U_ReciboCaja: '',
          Chequeador: '',
          U_Vehiculo: '',
          U_TipoEspecial: tipoEspecial,
          DireccionEntrega: lugarEntrega,
          DireccionFisicaEntrega: direccionFiscal,
          Contacto: personaContacto,
          enviarRCaja,
          EsPromocionVenta: promocionVenta,
          ComentarioDestino: comentarios,
          TipoCreacion:
            route?.params?.Encabezado.TipoBase == 'Pedido'
              ? 'BasePedido'
              : 'BaseEntrega',
          DefinidiosUsuario: {
            TipoEntrega:
              route?.params?.Encabezado?.DefinidiosUsuario?.TipoEntrega,
            DocNIT: nit,
            Requisicion: requisicion ? requisicion : '',
            OrdenCompra: ordenCompra ? ordenCompra : '',
          },
        },
        Detalle: route?.params?.Detalle,
      };
      const document = await FacturarDocumento(data);
      //const document = null;
      if (document?.Resultado) {
        let ListTrackingForUpdate = [];
        ListTrackingForUpdate.push(DocumentCheckerSelected.DataDocumentSelect);
        ListTrackingForUpdate = ListTrackingForUpdate.map(x => {
          x.isBill = 'Y';
          x.DocNumBill = document?.DocNum;
          x.TipoDoc =
            route?.params?.Encabezado.TipoBase == 'Pedido'
              ? 'Factura'
              : 'Entrega';
          return x;
        });
        await ActualizarTrackingFactura(ListTrackingForUpdate);
        navigation.goBack();
        navigation.goBack();
      }
      Alert.alert('', '' + document?.Mensaje);
    } finally {
      setLoadCreateBill(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.label}>Cliente</Text>
        <TextInput
          style={styles.input}
          placeholder="Cliente"
          value={cliente}
          onChangeText={setCliente}
          placeholderTextColor={"gray"}
        />

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={codigoNombre}
          onChangeText={setCodigoNombre}
          placeholderTextColor={"gray"}
        />

        <Text style={styles.label}>NIT</Text>
        <TextInput
          style={styles.input}
          placeholder="NIT"
          value={nit}
          onChangeText={setNit}
          placeholderTextColor={"gray"}
        />
        <Text style={styles.label}>Tipo Especial</Text>
        <TextInput
          style={styles.input}
          placeholder="Tipo Especial"
          value={tipoEspecial}
          onChangeText={setTipoEspecial}
          placeholderTextColor={"gray"}
        />

        <Text style={styles.label}>Lugar de Entrega</Text>
        <TextInput
          style={styles.input}
          placeholder="Lugar de Entrega"
          value={lugarEntrega}
          onChangeText={setLugarEntrega}
          placeholderTextColor={"gray"}
        />

        <Text style={styles.label}>Dirección Fiscal</Text>
        <TextInput
          style={styles.input}
          placeholder="Dirección Fiscal"
          value={direccionFiscal}
          onChangeText={setDireccionFiscal}
          placeholderTextColor={"gray"}
        />

        <Text style={styles.label}>Persona de Contacto</Text>
        <TextInput
          style={styles.input}
          placeholder="Persona de Contacto"
          value={personaContacto}
          onChangeText={setPersonaContacto}
          placeholderTextColor={"gray"}
        />

        <Text style={styles.label}>Preguntar Por</Text>
        <TextInput
          style={styles.input}
          placeholder="Preguntar Por"
          value={preguntarPor}
          onChangeText={setPreguntarPor}
          placeholderTextColor={"gray"}
        />

        <Text style={styles.label}>¿Confirmar Compra?</Text>
        <Picker
          selectedValue={confirmarCompra}
          onValueChange={itemValue => setConfirmarCompra(itemValue)}>
          <Picker.Item style={styles.PickerItem} label="SI" value="S" />
          <Picker.Item style={styles.PickerItem} label="NO" value="N" />
        </Picker>
        <Text style={styles.label}>Requisición</Text>
        <TextInput
          style={styles.input}
          placeholder="Requisición"
          value={requisicion}
          onChangeText={setRequisicion}
          placeholderTextColor={"gray"}
        />

        <Text style={styles.label}>¿Es consignacion?</Text>
        <Picker
          selectedValue={consignacion}
          onValueChange={itemValue => setConsignacion(itemValue)}>
          <Picker.Item style={styles.PickerItem} label="NO APLICA" value="NA" />
          <Picker.Item style={styles.PickerItem} label="SI" value="S" />
          <Picker.Item style={styles.PickerItem} label="NO" value="N" />
        </Picker>

        <Text style={styles.label}>¿Debe enviar R.Caja?</Text>
        <Picker
          selectedValue={enviarRCaja}
          onValueChange={itemValue => setEnviarRCaja(itemValue)}>
          <Picker.Item style={styles.PickerItem} label="SI" value="S" />
          <Picker.Item style={styles.PickerItem} label="NO" value="N" />
        </Picker>

        <Text style={styles.label}>Orden de Compra</Text>
        <TextInput
          style={styles.input}
          placeholder="Orden de compra"
          value={ordenCompra}
          onChangeText={setOrdenCompra}
          placeholderTextColor={"gray"}
        />

        <Text style={styles.label}>Facturar en:</Text>
        <TextInput
          style={styles.input}
          placeholder="Facturar En"
          value={facturarEn}
          onChangeText={setFacturarEn}
          placeholderTextColor={"gray"}
        />

        <Text style={styles.label}>¿Es promocion venta?</Text>
        <Picker
          selectedValue={promocionVenta}
          onValueChange={itemValue => setPromocionVenta(itemValue)}>
          <Picker.Item style={styles.PickerItem} label="SI" value="S" />
          <Picker.Item style={styles.PickerItem} label="NO" value="N" />
        </Picker>

        <Text style={styles.label}>Comentario:</Text>
        <TextInput
          style={styles.input}
          placeholder="Comentarios"
          value={comentarios}
          onChangeText={setComentarios}
          placeholderTextColor={"gray"}
        />

        {loadCreateBill ? (
          <LoaderScreen color="black"></LoaderScreen>
        ) : (
          <Button color={'black'} title="Facturar" onPress={enviarFormulario} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color:'gray'

  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color:'black',    
  },
  PickerItem:{
    color:'black',
    backgroundColor: '#fff'
  }
});

export default FormularioFacturacion;
