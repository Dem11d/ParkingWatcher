import React from 'react';
import {
  StyleSheet, TouchableOpacity
} from 'react-native';
import Template from "./Template";
import {Body, Button, Content, Text, View} from "native-base";
import Modal from 'react-native-modal'

export default class Help extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false
    }
  }

  _showModal = () => this.setState({isModalVisible: true})

  _hideModal = () => this.setState({isModalVisible: false})

  render() {
    let content = (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: "center",
        }}>
          <View>
            <Button onPress={this._showModal}>
              <Text>Show Modal</Text>
            </Button>
          </View>
          <Modal isVisible={this.state.isModalVisible}>
            <View style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 7,
              padding:15
            }}>
              <Text>Hello!</Text>
              <View>
                <Button onPress={this._hideModal}>
                  <Text>
                    Close
                  </Text>
                </Button>
              </View>
            </View>

          </Modal>
        </View>
    )
    return (
        <Template {...this.props} title={"Help"} content={content}/>
    )
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  rowTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 10,
  },
});