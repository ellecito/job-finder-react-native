import React, { Component } from 'react';
import { StyleSheet, Platform, View, ActivityIndicator, FlatList, Text, Image, Linking, Alert } from 'react-native';

import moment from 'moment';
import 'moment/locale/es'
moment.locale('es');

import InAppBrowser from 'react-native-inappbrowser-reborn'


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  async GetItem(url) {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: 'gray',
          preferredControlTintColor: 'white',
          readerMode: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#6200EE',
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_right',
            endExit: 'slide_out_left',
          },
          headers: {
            'my-custom-header': 'my custom header value'
          },
        })
      }
      else Linking.openURL(url)
    } catch (error) {
      console.error(error)
      Alert.alert(error.message)
    }
  }

  FlatListItemSeparator = () => {
    return (
      <View style={{
        height: .5,
        width: "100%",
        backgroundColor: "#000",
      }} />
    );
  }

  webCall = () => {
    return fetch('https://job-finder-express.herokuapp.com/')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson
        }, function () {
          // In this block you can do something with new state.
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    this.webCall();
  }

  render() {

    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={styles.MainContainer}>
        <FlatList
          data={this.state.dataSource}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item }) =>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Image onPress={this.GetItem.bind(this, item.url)} source={{ uri: item.img }} style={styles.imageView} />
              <Text onPress={this.GetItem.bind(this, item.url)} style={styles.textView} >
                {item.title}{"\n"}
                {item.address}{"\n"}
                {moment(item.date).format('lll')}
              </Text>
            </View>
          }
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 5,
    marginTop: (Platform.OS === 'ios') ? 20 : 0,
  },
  imageView: {
    width: '50%',
    height: 40,
    margin: 7,
    borderRadius: 7
  },
  textView: {
    width: '50%',
    textAlignVertical: 'center',
    padding: 10,
    color: '#000'

  }
});
