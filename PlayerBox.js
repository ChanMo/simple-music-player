import React, { useState } from 'react'
import { TouchableOpacity, View, Text, Button } from 'react-native'
import TrackPlayer, { useTrackPlayerEvents, State, Event, useProgress } from 'react-native-track-player'
import Ionicons from 'react-native-vector-icons/Ionicons'

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
      <View style={{flexDirection:'row'}}>
        {isPlaying ? (
        <TouchableOpacity
          onPress={()=>TrackPlayer.pause()}>
          <Ionicons name='pause-outline' color='white' size={24} />
        </TouchableOpacity>
        ) : (
        <TouchableOpacity
          onPress={()=>TrackPlayer.play()}>
          <Ionicons name='play-outline' color='white' size={24} />
        </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handlePlay}
          style={{marginLeft:6}}
        >
          <Ionicons name='play-skip-forward-outline' color='white' size={24} />
        </TouchableOpacity>
      </View>
    </View>
    </View>
  )
}


export default PlayerBox
