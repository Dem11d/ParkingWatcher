import React from 'react';
import {Button, Content, Text, View} from "native-base";
import {LinearGradient} from "expo";

export default class Gradient extends React.Component {
  render() {
    return (
        <View style={{
          position: 'absolute',
          flex: 1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "space-between",
          paddingLeft: 6
        }}>
          <LinearGradient
              colors={['#79BC6A', '#BBCF4C', '#FFCF00', '#FF9A00', '#FF0000', '#A52A2A']}
              start={{x: 1.0, y: 0.0}} end={{x: 1.0, y: 1.0}}
              style={{
                position: 'absolute',
                left: 0,
                // right: 0,
                top: 0,
                bottom: 0,
                width: 20,
                marginTop: 18,
                marginBottom: 18,
                marginLeft: 5,
              }}
          />
          <Text>0</Text>
          <Text>50</Text>
          <Text>100</Text>
          <Text>200</Text>
          <Text>300</Text>
          <Text>400</Text>
          <Text>500</Text>
        </View>
    )
  }
}
