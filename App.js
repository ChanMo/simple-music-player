/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import type {Node} from 'react';
import {
  ProgressBar,
  Button,
  SafeAreaView,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import TrackPlayer, { useTrackPlayerEvents, State, Event, STATE_PLAYING, TrackPlayerEvents, useProgress } from 'react-native-track-player'

const domain = 'https://mpoc.dsoou.com'


const PlayerBox = () => {
  const [track, setTrack] = useState({})
  const [playerState, setPlayerState] = useState(null)
  const progress = useProgress()

  useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const nextTrack = await TrackPlayer.getTrack(event.nextTrack);
      setTrack(nextTrack)
    }
    if(event.type === Event.PlaybackState) {
      setPlayerState(event.state)
    }
  })

  if(Object.keys(track).length <= 0) {
    return <View />
  }

  const isPlaying = playerState === 3 || playerState === 6

  const handlePlay = async () => {
    await TrackPlayer.skipToNext()
    const state = await TrackPlayer.getState()
    if(state !== State.Playing) {
      await TrackPlayer.play()
    }
  }

  const progressValue = parseInt((progress.position / progress.buffered) * 100)

  return (
    <View>
      <View style={{backgroundColor:'#000',height:3}}>
        <View style={{backgroundColor:'orange',height:3,width:`${progressValue}%`}}></View>
      </View>
    <View style={{flexDirection:'row',paddingVertical:8,alignItems:'center',justifyContent:'space-between',paddingHorizontal:16}}>
      <Text style={{flex:1,color:'white'}}>{track.title}</Text>
      {/*<Text>{progress.position} / {progress.buffered}</Text>*/}
      {/*<Button
        title="Previous"
        onPress={()=>TrackPlayer.skipToPrevious()} />*/}
      <View style={{flexDirection:'row'}}>
        {isPlaying ? (
        <Button
          color="transparent"
          title="Pause"
          onPress={()=>TrackPlayer.pause()} />
        ) : (
        <Button
          color="transparent"
          title="Play"
          onPress={()=>TrackPlayer.play()} />
        )}
        <Button
          color="transparent"
          title="Next >"
          onPress={handlePlay} />
      </View>
    </View>
    </View>
  )
}

const App: () => Node = () => {
  const [tracks, setTracks] = useState([])
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const fetchTracks = async () => {
      const url = 'https://mpoc.dsoou.com/api/v2/albums/random/?limit=5'
      try {
        const res = await fetch(url)
        const resJson = await res.json()
        let tracksTmp = []
        resJson.map(row => {
          tracksTmp.push({
            url: `${domain}${row.media}`,
            title: row.title,
            artist: row.artist.nickname,
            artwork: `${domain}${row.album_cover}`,
            duration: 200
          })
        })
        setTracks(tracksTmp)

        await TrackPlayer.setupPlayer()
        await TrackPlayer.add(tracksTmp)

      } catch (err) {
        console.warning(err)
      }
    }
    fetchTracks()
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
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
