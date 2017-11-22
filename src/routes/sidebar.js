import React from "react";
import {StyleSheet, Platform} from 'react-native';
import {Container, Content, Text, Button} from "native-base";
import {dataSource} from "../data/dataService";
import {googleAuth} from "../auth";

const routes = ["Home","Settings", "Help", "Exit"];

export class SideBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
     routes: this.getCurrentRoutes()
    }
  }

  componentDidMount(){

    googleAuth.addEventListener("logout",()=>{
      this.setState({routes:this.getCurrentRoutes()});
    });
    googleAuth.addEventListener("login",()=>{
      this.setState({routes:this.getCurrentRoutes()});
    })
  }

  getCurrentRoutes(){
    if(dataSource.getState().userId)
      return this.props.navigation.state.routes.map(route=>route.routeName);
    else
      return ["Home"];
  }

  render() {
    return (
        <Container style={styles.navigationPadding}>
          <Content>

            {this.state.routes.map((data, id) => {
              return (
                  <Button
                      style={{marginTop:10}}
                      key={id}
                      block
                      light
                      onPress={() => {
                        this.props.navigation.navigate(data);
                      }}
                  >
                    <Text>{data}</Text>
                  </Button>
              );
            })
            }

          </Content>
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