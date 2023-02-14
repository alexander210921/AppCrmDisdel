import React from 'react'
import { ScrollView, StyleSheet } from "react-native";
import { View } from "react-native-ui-lib";
import StylesWrapper from "../../Styles/Wrapers";
import CardVisit from '../../Components/Cards/Card1';
const VisitCreated=()=>{
    const SelectViewVisitDetail=()=>{
        
    }
    return(
        <ScrollView style={StylesWrapper.secondWrapper}>
            <View style={StylesWrapper.wraper}>
               <CardVisit handleSelectCard={SelectViewVisitDetail} ></CardVisit>
            </View>
        </ScrollView>
    )
}
export default VisitCreated;
const styles = StyleSheet.create({
    CardContainer:{
        display:'flex',
        width:'70%',
        height:15,        
        backgroundColor:'#f4d384',
        color:'#b5b7bb'

    }
});