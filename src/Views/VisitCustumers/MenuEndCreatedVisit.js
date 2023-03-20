import { View,Text,Card ,LoaderScreen} from "react-native-ui-lib";
import React, { useState } from 'react'
import { Alert, ScrollView,StyleSheet } from "react-native";
import StylesWrapper from "../../Styles/Wrapers";
import stylesTitle from "../../Styles/Titles";
import { useSelector } from "react-redux";
import PhotoProfile from "../../Components/Header/HeaderAvatar";
import { useNavigation } from "@react-navigation/native";
import { GetBasesVendor } from "../../Api/Vendors/ApiVendors";
import CardVisit from "../../Components/Cards/Card1";
 const MenuEndVisit=()=>{
    const User = useSelector(state => state.login.user);  
    const ListRoutes = useSelector(state => state.Customer);
    const navigation = useNavigation();
    const [bases,setBases]=useState([]);
    const [isLoad,setIsLoad] = useState(false);
    const goToCreateMoreVisit=()=>{
        navigation.navigate("VisitCreated");
    }
    const SelectBase=(base)=>{
        console.log(base)
    }
    const GetBasesUser=async()=>{ 
        try{
            setIsLoad(true);
            const bases = await GetBasesVendor(User.EntityID);
            if( bases && bases.length>0){
                setBases(bases);
            }else if(bases && bases.length==0){
                Alert.alert("No posee bases","Estimado usuario no posee bases asignadas");
            } 
        }finally{
            setIsLoad(false);
        }                   
    }
    return(
            <ScrollView style={StylesWrapper.secondWrapper}>
            <View  style={StylesWrapper.wraper}>
              <View right>
                {User?.ImagePath? 
                  <PhotoProfile image={User.ImagePath}></PhotoProfile>
                  :null
                }
              </View>
              <View top style={styles.wrapperButtons}>
                <View left>
                  <Text style={stylesTitle.TitleMedium}> ¿Que desea hacer? </Text>
                </View>
              </View>
              <Card
                selected={false}
                selectionOptions={styles.selectOptionCard}
                elevation={10}
                flexS
                style={styles.card}
                flex
                center 
                onPress={goToCreateMoreVisit}>
                <Text>Ir a otra visita</Text>
              </Card>
              <Card
                selected={false}
                selectionOptions={styles.selectOptionCard}
                elevation={10}
                flexS
                style={styles.card2}
                flex
                center
                onPress={GetBasesUser}>
                <Text>Regresar a base</Text>
              </Card>
              <View style={styles.ContainerCardsBase} center>
                {
                    isLoad?
                        <LoaderScreen  color="black" messague="Cargando..."></LoaderScreen>
                    :null
                }
              {bases.length>0?                
                bases.map((base,index)=>(                    
                    <CardVisit data={base} handleSelectCard={SelectBase} keindexy={index} principalColor="#F3BBB1" subtitle={base["<NombreBase>k__BackingField"]} title={base["<Descripcion>k__BackingField"]}></CardVisit>
                ))
              :null}
              </View>
            </View>
        </ScrollView>
    )
}
export default MenuEndVisit;
const styles = StyleSheet.create({
    wrapperButtons: {
      margin: '1%',
      marginBottom: '10%',
    },
    HeaderSection: {
      height: 80,
      backgroundColor: '#f3f5f7',
    },
    card: {
      height: '17%',
      borderColor: 'black',
      marginTop: '4%',
      backgroundColor: '#CECBD6',
    },
    card2: {
      height: '17%', 
      borderColor: 'black',
      marginTop: '4%',
      backgroundColor: '#CAE9E0',
    },
    selectOptionCard: {
      color: 'green',
    },
    ContainerCardsBase:{
        marginTop:20
    }
 
  });
  