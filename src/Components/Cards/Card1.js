import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Text,TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from 'react-native-ui-lib';
const CardVisit = ({
  principalColor = 'rgba(249,214,125,255)',
  title = 'title',
  subtitle = '',
  handleSelectCard,
  data,
  title2 = '',
  FunctionInit
}) => {
  const styles = StyleSheet.create({

    mainCardView: {
      //height: 60,
      display:'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: principalColor,
      borderRadius: 15,
      shadowColor: 'shadow',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 14,
      paddingRight: 14,
      marginTop: 9,
      marginBottom: 9,
      width: '90%',
    
    },
    subCardView: {
      height: 50,
      width: 54,
      borderRadius: 25,
      backgroundColor: 'white',
      borderColor: 'white',
      borderWidth: 1,
      borderStyle: 'solid',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  const HandlePressButton = () => {
    handleSelectCard(data);
  };
  const HandlePressButtonIcon = () => {
    FunctionInit(data);
  };
  return (
    <TouchableWithoutFeedback>
      <View style={styles.mainCardView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* <View style={styles.subCardView}>
            <TouchableHighlight onPress={HandlePressButtonIcon}>
                <Icon  name="map-marker" size={30} color="black" />
            </TouchableHighlight>            
          </View> */}
          <View style={{marginLeft: 12}}>
            <Text
              style={{
                fontSize: 13,
                color: 'black',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}>
              {title}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: 'gray',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}>
              {title2}
            </Text>
            <View
              style={{
                marginTop: 0,
                borderWidth: 0,
                width: '100%',
              }}>
              {false ? null : (
                <Button
                  onPress={HandlePressButton}
                  size={Button.sizes.small}
                  backgroundColor={'white'}>
                  <Text style={{fontSize: 9,color:'black'}}> Seleccionar</Text>
                </Button>
              )}
              <Text
                style={{
                  color: 'gray',
                  fontSize: 8,
                }}>
                {subtitle}
              </Text>
              <Text
                style={{
                  color: 'gray',
                  fontSize: 1,
                }}></Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CardVisit;
