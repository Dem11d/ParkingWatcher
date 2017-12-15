import {Button, Text, View} from "native-base";
import {ScrollView} from "react-native";
import {Parking} from "./Parking";
import {languageService} from "../../lang/MessageProcessor";
import * as React from "react";
import Modal from 'react-native-modal'


export class ParkingModal extends React.Component {

  render(){
    return(<Modal {...this.props} >
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

            <Parking marker={this.props.parkingToShow}/>

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
    </Modal>)
  }
}
