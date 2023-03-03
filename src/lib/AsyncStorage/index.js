import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const AsyncStorageSaveDataJson = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    Alert.alert(error);
    // Error saving data
  }
};
export const AsyncStorageSaveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    Alert.alert(error);
  }
};

export async function AsyncStorageGetData(key) {
  try {
    const data = await AsyncStorage.getItem(key);
    return data;
  
  } catch {
      return null;
  }
}

export async function AsyncStorageDeleteData(key) {
  try {
    const data = await AsyncStorage.removeItem(key);
    return data
  
  } catch {
      return false;
  }
}

