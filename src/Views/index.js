import React from 'react';
import {ScrollView, View} from 'react-native';
import {Card} from 'react-native-ui-lib';
export const Home = () => {
  const HandleMarkerSelectCardVisit = () => {};
  return (
    <ScrollView>
      <View>
        <Card
          selected={true}
          selectionOptions={styles.selectOptionCard}
          elevation={20}
          flexS
          style={styles.card}
          flex
          center
          onPress={HandleMarkerSelectCardVisit}>
          <Text>Crear Ruta</Text>
        </Card>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  card: {
    height: '17%',
    borderColor: 'black',
    marginTop: '4%',
    backgroundColor: '#ec7663',
  },
});
