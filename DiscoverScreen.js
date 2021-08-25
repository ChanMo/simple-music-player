import React, { useState, useEffect } from 'react'
import {
  useColorScheme,
  Button,
  SafeAreaView,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import TrackPlayer from 'react-native-track-player'
import PlayerBox from './PlayerBox'

import { fetchTracks } from './utils'

const DiscoverScreen = () => {
  const [tracks, setTracks] = useState([])
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  useEffect(() => {
    const getTracks = async () => {
      const res = await fetchTracks()
      setTracks(res)

      await TrackPlayer.add(res)
    }
    getTracks()
  }, [])

  const handlePlay = async (trackIndex) => {
    await TrackPlayer.skip(trackIndex)
    const state = await TrackPlayer.getState()
    if(state !== State.Playing) {
      await TrackPlayer.play()
    }
  }

  const renderTrackItem = ({item, index}) => (
    <TouchableOpacity
      style={{flex:1,flexDirection:'row',paddingVertical:8,paddingHorizontal:16}}
      onPress={()=>handlePlay(index)}
    >
      <Image
        style={{width:48,height:48}}
        source={{uri:item.artwork}}
      />
      <View style={{paddingHorizontal:8}}>
        <Text style={{fontWeight:'600',marginBottom:4}}>{item.title}</Text>
        <Text style={{color:'#666'}}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[{backgroundStyle}, {flex:1}]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <FlatList
        data={tracks}
        renderItem={renderTrackItem}
        ItemSeparatorComponent={()=><View style={{height:1,backgroundColor:'lightgrey'}} />}
        keyExtractor={(item,index) => index.toString()}
      />
      <View style={{backgroundColor:'#333'}}>
        <PlayerBox />
      </View>
    </SafeAreaView>
  );
}


export default DiscoverScreen
