import React from "react";
import { ScrollView,Text } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import CardVisit from "../../Components/Cards/Card1";
import StylesWrapper from "../../Styles/Wrapers";
import { SetUserDefaultCompany } from "../../Api/User/ApiUser";
import { useNavigation } from "@react-navigation/native";
import { GetUserRol } from "../../Api/User/ApiUser";
const SelectCompany=()=>{
    const company = useSelector(state=>state.company);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector(state=>state.login.user);
    const selectCompanyDefault=(company)=>{
        //navigation.navigate("");
        //console.log(user);
        dispatch(SetUserDefaultCompany(company));
        GetUserRol(user.EntityID,company.EntityID,navigation,dispatch);
    }   
    return (
            <ScrollView style={StylesWrapper.secondWrapper}>
                <Text style={{  padding: '7%',
    paddingBottom: 0,
    color: 'black',
    fontSize: 25,
    fontWeight: 600,}}>Seleccione la compañia</Text>
                {company.Company?
                company.Company.map((comp,index)=>(
                    <CardVisit key={index} handleSelectCard={()=>{
                        selectCompanyDefault(comp);
                    }} title={comp.NombreCompania} principalColor="red" >

                    </CardVisit>  
                ))
                :<Text style={{color:'black'}}>No se encontró ninguna compañia</Text>}
                            
            </ScrollView>
    )
}
export default SelectCompany;