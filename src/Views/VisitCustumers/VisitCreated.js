import React from 'react'
import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";
import StylesWrapper from "../../Styles/Wrapers";
import CardVisit from '../../Components/Cards/Card1';
const VisitCreated=()=>{
    const SelectViewVisitDetail=()=>{
        
    }
    return(
        <ScrollView style={StylesWrapper.secondWrapper}>
            <Text style={styles.Title}>En Proceso...</Text>
            <View flex center >
               <CardVisit handleSelectCard={SelectViewVisitDetail} ></CardVisit>
            </View>
        </ScrollView>
    )
}
export default VisitCreated;
const styles = StyleSheet.create({
    Title:{
        padding:'7%',
        paddingBottom:0,
        color:'black',
        fontSize:25,
        fontWeight:600

    }
});