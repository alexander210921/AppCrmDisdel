import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import CupertinoFooter1 from "./CupertinoFooter";

function Footer(props) {
  return (
    <View style={styles.container}>
      <CupertinoFooter1 style={styles.cupertinoFooter1}></CupertinoFooter1>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cupertinoFooter1: {
    height: 40,
    width: 332,
    marginTop: 726,
    marginLeft: 22
  }
});

export default Footer;