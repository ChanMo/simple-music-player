import React, { useState, useEffect, useRef } from 'react'
import { TouchableWithoutFeedback, Pressable, ImageBackground, TouchableOpacity, useWindowDimensions, StyleSheet, StatusBar, SafeAreaView, View, Text, FlatList } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import TrackPlayer, { useTrackPlayerEvents, Event, State } from 'react-native-track-player'
import { fetchTracks } from './utils'

const HomeScreen = ({navigation}) => {
  const playerRef = useRef(null)
  const [tracks, setTracks] = useState([])

  const { height, width } = useWindowDimensions()
  const headerHeight = useHeaderHeight()
  const tabHeight = useBottomTabBarHeight()
  const itemHeight = height - headerHeight - tabHeight - StatusBar.currentHeight


  //useEffect(() => {
  //  const goHome = navigation.addListener('tabPress', (e) => {
  //    //await StackPlayer.play()
  //  })
  //})
  //
  useTrackPlayerEvents([Event.PlaybackTrackChanged], event => {
    if (playerRef != null && event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      playerRef.current.scrollToIndex({animated:true, index:event.nextTrack})
    }
  })

  useEffect(() => {
    const initTracks = async () => {
      const res = await fetchTracks()
      setTracks(res)
      await TrackPlayer.setupPlayer()
      await TrackPlayer.add(res)
      await TrackPlayer.play()
    }
    initTracks()
  }, [])

  const renderItem = ({item, index}) => (
    <Pressable
      style={{height:itemHeight}}
      onPress={handlePlayerControl}
    >
      <ImageBackground
        source={{uri:item.artwork}}
        resizeMode="cover"
        style={styles.image}
      >
        <Text>{item.title}</Text>
      </ImageBackground>
    </Pressable>
  )

  const handlePlayerControl = async() => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause()
    } else {
      await TrackPlayer.play()
    }
  }


  const handleSwitch = async (event) => {
    const currentHeight = event.nativeEvent.contentOffset.y
    const index = parseInt(currentHeight / itemHeight)
    await TrackPlayer.skip(index)
    await TrackPlayer.play()
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={playerRef}
        onMomentumScrollEnd={handleSwitch}
        disableIntervalMomentum={true}
        snapToInterval={itemHeight}
        showsVerticalScrollIndicator={false}
        data={tracks}
        renderItem={renderItem}
        keyExtractor={(item,index)=>index.toString()}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  },
  item: {
    //flexDirection: 'column',
    //justifyContent: 'center',
    //alignItems: 'center'
  },
  image: {
    flex: 1,
    justifyContent: 'center'
  }
})

export default HomeScreen
