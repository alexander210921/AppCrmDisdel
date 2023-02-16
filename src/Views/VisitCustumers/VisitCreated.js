import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Text, View} from 'react-native-ui-lib';
import StylesWrapper from '../../Styles/Wrapers';
import CardVisit from '../../Components/Cards/Card1';
import {useDispatch, useSelector} from 'react-redux';
import { SaveSelectVisitDetail } from '../../Api/Customers/ApiCustumer';
import { useNavigation } from '@react-navigation/native';
const VisitCreated = () => {
  const ListRoutes = useSelector(state => state.Customer);
  const dispatch = useDispatch();
  const Navigator = useNavigation();
  const SelectViewVisitDetail = (visit) => {
    dispatch(SaveSelectVisitDetail(visit));
    Navigator.navigate("DetailVisit");
  };
  return (
    <ScrollView style={StylesWrapper.secondWrapper}>
      {ListRoutes.RoutesInProgress.length > 0 ? (
        <View>
          <Text style={styles.Title}>En Proceso...</Text>
          <View flex center>
            {ListRoutes.RoutesInProgress.map(route => {
              return (
                <CardVisit data={route} title2={route.IdRegistro} title={route.CardCode} subtitle={route.Comentario} key={route.IdRegistro} handleSelectCard={SelectViewVisitDetail}></CardVisit>
              );
            })}
          </View>
        </View>
      ) : (
        <Text style={styles.Title}>No hay rutas en curso</Text>
      )}
    </ScrollView>
  );
};
export default VisitCreated;
const styles = StyleSheet.create({
  Title: {
    padding: '7%',
    paddingBottom: 0,
    color: 'black',
    fontSize: 25,
    fontWeight: 600,
  },
});
