import {Button, Text, View} from "native-base";
import {ScrollView} from "react-native";
import {languageService} from "../../lang/MessageProcessor";
import * as React from "react";
import {Bar} from "react-native-pathjs-charts";


const chartOptions = {
  width: 200,
  height: 100,
  margin: {
    top: 0,
    left: 20,
    bottom: 30,
    right: 0
  },
  color: '#2980B9',
  gutter: 20,
  animate: {
    type: 'oneByOne',
    duration: 200,
    fillTransition: 3
  },
  axisX: {
    showAxis: true,
    showLines: true,
    showLabels: true,
    showTicks: true,
    zeroAxis: false,
    orient: 'bottom',
    label: {
      fontSize: 8,
      fontWeight: true,
      fill: '#34495E',
    }
  },
  axisY: {
    showAxis: true,
    showLines: true,
    showLabels: true,
    showTicks: true,
    zeroAxis: false,
    orient: 'left',
    label: {
      fontSize: 8,
      fontWeight: true,
      fill: '#34495E'
    }
  }
};

export class PointInfo extends React.Component {

  render() {
    let data = [
      [{
        "v": 49,
        "name": "apple"
      }, {
        "v": 42,
        "name": "apple"
      }],
      [{
        "v": 69,
        "name": "banana"
      }, {
        "v": 62,
        "name": "banana"
      }],
      [{
        "v": 29,
        "name": "grape"
      }, {
        "v": 15,
        "name": "grape"
      }]
    ]

    const chartData = [Object.keys(this.props.point.properties)
        .filter(key=>Number.isFinite(this.props.point.properties[key]))
        .map(key=>{
      return {v:this.props.point.properties[key],
        name:key};
    })];
    // console.log(chartData);
    let content = this.props.point ?
        <View>
          <Bar data={chartData} options={chartOptions} accessorKey='v'/>
        </View>
        :
        <View></View>;
    return (
          <View style={{
            justifyContent: "center",
            alignItems: "center",
          }}
                onPress={() => console.log("pressed")}
          >
            <View style={{
              width: 300,
              backgroundColor: "white",
              borderRadius: 7,
              padding: 15
            }}>
              <ScrollView>
                {content}
              </ScrollView>
            </View>
          </View>);
  }
}
