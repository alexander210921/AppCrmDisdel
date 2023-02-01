import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Button} from 'react-native-ui-lib';
const CardCustomer = ({
  principalColor = 'orange',
  title = 'title',
  subtitle = 'subtitle',
  handleSelectCard,
  data
}) => {
  const HandlePressButton = () => {
    handleSelectCard(data);
  };
  return (
    <TouchableWithoutFeedback>
      <View style={styles.mainCardView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.subCardView}>
            <Icon name="user" size={30} color="gray" />
          </View>
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
            <View
              style={{
                marginTop: 0,
                borderWidth: 0,
                width: '90%',
              }}>
              {false ? null : (
                <Button
                  onPress={HandlePressButton}
                  size={Button.sizes.small}
                  backgroundColor={'#616969'}>
                  <Text style={{fontSize: 9}}> Seleccionar</Text>
                </Button>
              )}
              <Text
                style={{
                  color: 'gray',
                  fontSize: 12,
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainCardView: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
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
    marginTop: 7,
    marginBottom: 7,
    width: '100%',
  },
  subCardView: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default CardCustomer;
