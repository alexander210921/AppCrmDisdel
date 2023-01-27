import React from "react";
import { View } from "react-native-ui-lib";
import SearchBar from "../../Components/SearchBar";

const VisitirCustomer=()=>{
    const SubmitSearch=(value)=>{
        console.log(value);
    }
    return (
        <View>
            <SearchBar  onSubmit={SubmitSearch}></SearchBar>
        </View>
    )
}
export default VisitirCustomer;