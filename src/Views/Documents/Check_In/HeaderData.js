// InvoiceForm.js
import React, { useState } from 'react';
import { View, ScrollView,TextInput,Button,Text } from 'react-native';


const InvoiceForm = () => {
  const [clienteInfo, setClienteInfo] = useState({
    nombreCliente: '',
    nit: '',
    lugarEntrega: '',
    direccionesEntrega: [],
    direccionFiscal: '',
    personaContacto: '',
    preguntarPor: '',
    confirmaOrden: 'NO',
    ordenCompra: '',
    requisicion: '',
    consignacion: 'NO',
    enviarRCaja: 'NO',
    esPromocion: 'NO',
    comentarios: ''
  });

  const handleDireccionEntregaChange = (index, value) => {
    const updatedDirecciones = [...clienteInfo.direccionesEntrega];
    updatedDirecciones[index] = value;

    setClienteInfo(prevState => ({
      ...prevState,
      direccionesEntrega: updatedDirecciones
    }));
  };

  const handleSave = () => {
    // Aquí puedes hacer lo que necesites con los valores de clienteInfo
    console.log(clienteInfo);
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <TextInput
        label="Nombre del Cliente"
        value={clienteInfo.nombreCliente}
        onChangeText={text => setClienteInfo(prevState => ({ ...prevState, nombreCliente: text }))}
      />
      <TextInput
        label="NIT"
        value={clienteInfo.nit}
        onChangeText={text => setClienteInfo(prevState => ({ ...prevState, nit: text }))}
      />
      <TextInput
        label="Lugar de Entrega"
        value={clienteInfo.lugarEntrega}
        onChangeText={text => setClienteInfo(prevState => ({ ...prevState, lugarEntrega: text }))}
      />
      
      {/* Direcciones de entrega (usando map) */}
      {clienteInfo.direccionesEntrega.map((direccion, index) => (
        <TextInput
          key={index}
          label={`Dirección de Entrega ${index + 1}`}
          value={direccion}
          onChangeText={text => handleDireccionEntregaChange(index, text)}
        />
      ))}
      
      {/* ... otros campos ... */}
      
      <Button title='Guardar Factura' mode="contained" style={{ marginTop: 16 }} onPress={handleSave}>
        {/* <Text>Guardar Factura</Text> */}
      </Button>
    </ScrollView>
  );
};

export default InvoiceForm;
