import React, {useRef} from 'react';
import {Text, View} from 'react-native-ui-lib';
import {StyleSheet, ScrollView} from 'react-native';
import ListDocuments from './ListDocuments';
import {useSelector} from 'react-redux';
const ListDocumentHome = () => {
  const GetListDocuments = useSelector(state => state.Customer.DocumentsOpen);
  //console.log(GetListDocuments);
  const scrollViewRef = useRef();
  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 100) {
      // Mostrar botón
    } else {
      // Ocultar botón
    }
  };

  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({y: 0, animated: true});
  };
  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={styles.BackroundColor}>
      <View flex>

      {GetListDocuments  &&GetListDocuments.length==0 ? <Text style={{fontSize:20,fontWeight:800,padding:'4%'}}>No hay Documentos abiertos</Text> :null  }
        {GetListDocuments ? (
          <ListDocuments
            scrollToTop={scrollToTop}
            ListData={GetListDocuments}></ListDocuments>
        ) : null}
      </View>
    </ScrollView>
  );
};
export default ListDocumentHome;

const styles = StyleSheet.create({
  BackroundColor: {
    backgroundColor: '#fff',
  },
});
