import {Button, Text, View} from "native-base";
import {ScrollView} from "react-native";
import {Parking} from "./Parking";
import {languageService} from "../../lang/MessageProcessor";
import * as React from "react";
import Modal from 'react-native-modal'


export class InfoPointerModal extends React.Component {

  render() {

    let content = this.props.pointToShow ?
        <View>
          {Object.keys(this.props.pointToShow.properties).map((key,index) => {
            let value = this.props.pointToShow.properties[key];
            return <Text key={index}>{key} : {value}</Text>
          })}
        </View>
        :
        <View></View>;
    return (
        <Modal {...this.props} >
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
                <Button
                    block warning
                    style={{marginTop: 7}}
                    onPress={this.props.hideModal}>
                  <Text>
                    {languageService.getMessage("maps_modal_close")}
                  </Text>
                </Button>
              </ScrollView>
            </View>
          </View>
        </Modal>);
  }
}
