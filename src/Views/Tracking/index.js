import {StyleSheet, ScrollView,View} from 'react-native';
import { useSelector } from 'react-redux';

const TrackingDocumentsAsigned=()=>{
    const documents = useSelector(state=>state.DocumentsAsigned);
    return (
        <ScrollView>
            <View>

            </View>
        </ScrollView>
    )
}
export default TrackingDocumentsAsigned;