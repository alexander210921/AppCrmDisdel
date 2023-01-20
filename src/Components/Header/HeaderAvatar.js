import React from "react";
import { Avatar } from "react-native-ui-lib";
const PhotoProfile=({nameUser="",image})=>{   
   return (
      <Avatar useAutoColors={true} name={nameUser} isOnline={true} badgePosition="TOP_RIGHT" label={"User"}/>
   ) 
}
export default PhotoProfile;