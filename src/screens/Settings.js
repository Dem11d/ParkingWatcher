import React from 'react';
import {AsyncStorage, Slider, StyleSheet,} from 'react-native';
import {
  Body,
  Card,
  Container,
  Content, H2,
  Header,
  Icon,
  Left,
  List,
  ListItem,
  Radio,
  Right,
  Switch,
  Text,
  View,
  Button
} from "native-base";
import {dataSource} from "../data/dataService";
import Template from "./Template";


export default class Settings extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      radius: Number.parseInt(dataSource.getState().radius),
      language: dataSource.getState().language,
      languageArray: [
        {label: 'English', value: 0},
        {label: 'Русский', value: 1},
        {label: 'Українська', value: 2}
      ]
    }
  }

  setRadius(val) {
    dataSource.updateState({radius: JSON.stringify(val)});
    AsyncStorage.setItem("radius", JSON.stringify(val));
    this.setState({"radius": val});
  }

  setLanguage(value) {
    console.log("setting language");
    dataSource.updateState({language: JSON.stringify(value)});
    AsyncStorage.setItem("language", JSON.stringify(value));
    this.setState({"language": value,languageArray:this.state.languageArray});
  }

  render() {
    let content = (
        <Container>
          <Content>

              <H2 style={[styles.text__indents, styles.text__center]}>Radius settings</H2>
            <Slider
                step={1}
                minimumValue={3}
                maximumValue={20}
                value={this.state.radius}
                onSlidingComplete={val => this.setRadius(val)}
            />
            <Text style={{textAlign:"center"}}>radius {this.state.radius} km </Text>

            <H2 style={[styles.text__indents, styles.text__center]}>Language settings</H2>
            <List>
              {this.state.languageArray.map((item, index) =>{
                return (
                    <ListItem
                        key = {index}
                        button={true}
                        onPress={() => this.setLanguage(item.value)}
                    >
                      <Body>
                      <Text>{item.label}</Text>
                      </Body>
                      <Right>
                        <Radio
                            selected={item.value === Number.parseInt(this.state.language)}
                        />
                      </Right>
                    </ListItem>
                )
              })}
            </List>
          </Content>
        </Container>
    );
    return (<Template {...this.props} content={content} title={"Settings"}/>);

  }
}


const styles = StyleSheet.create({
  text__indents:{
    margin:15,
  },
  text__center:{
    textAlign:"center",
  },

  container: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  name: {
    textAlign: 'center',
    marginBottom: 25
  },
});