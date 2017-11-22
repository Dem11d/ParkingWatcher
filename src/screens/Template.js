import React, {Component} from 'react';
import {
  Button,
  Container,
  Card,
  CardItem,
  Body,
  Content,
  Header,
  Title,
  Left,
  Icon,
  Right
} from "native-base";
import {StatusBar, StyleSheet, Platform} from "react-native";

export default class Template extends Component {
  render() {
    let innerContent = this.props.content;
    let title = this.props.title;
    // console.log(this.props);
    return (
        <Container style={styles.navigationPadding}>
          <StatusBar
              backgroundColor="#000"
              barStyle="light-content"
          />
          <Header>
            <Left>
              <Button
                  transparent
                  onPress={() => this.props.navigation.navigate("DrawerOpen")}
              >
                <Icon name="menu"/>
              </Button>
            </Left>
            <Body>
            <Title>{title}</Title>
            </Body>
            <Right/>
          </Header>
          <Container style={styles.bodyContent}>
            {innerContent}
          </Container>
        </Container>
    );
  }
}

const styles = StyleSheet.create({
  navigationPadding: {
    paddingTop: (Platform.OS === 'ios' ? 0 : 25),
    backgroundColor: "#ccc",
    // height: Expo.Constants.statusBarHeight + 56,
  },
  bodyContent: {
    backgroundColor: "#fff",
  }
});