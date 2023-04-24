import {StyleSheet} from 'react-native';
import { ColorBackroundSecundary } from '../../Assets/Colors/Colors';
import { Dimensions } from 'react-native';
const windowHeight = Dimensions.get('window').height;
const StylesWrapper = StyleSheet.create({
  wraper: {
    padding:'5%',
    backgroundColor:ColorBackroundSecundary,    
    height:windowHeight-5,
  },
  secondWrapper: {
    padding:'5%',
    height:  windowHeight-10,
    backgroundColor:ColorBackroundSecundary,      
    marginBottom:'0%',
  },
});

export default StylesWrapper;