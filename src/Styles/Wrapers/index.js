import {StyleSheet} from 'react-native';
import { ColorBackroundSecundary } from '../../Assets/Colors/Colors';
import { Dimensions } from 'react-native';
const windowHeight = Dimensions.get('window').height;
const StylesWrapper = StyleSheet.create({
  wraper: {
    padding:'10%',
    backgroundColor:ColorBackroundSecundary,    
    height:'auto'
  },

});

export default StylesWrapper;