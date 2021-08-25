/**
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import type {Node} from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import HomeScreen from './HomeScreen'
import DiscoverScreen from './DiscoverScreen'

const Tab = createBottomTabNavigator()

const App: () => Node = () => {

  const screenOptions = ({route}) => ({
    tabBarIcon: ({focused, color, size}) => {
      let iconName

      if(route.name === 'Home') {
        iconName = focused ? 'home-sharp' : 'home-outline'
      } else if (route.name === 'Discover') {
        iconName = focused ? 'flame-sharp' : 'flame-outline'
      }

      return <Ionicons name={iconName} size={size} color={color} />
    },
    tabBarActiveTintColor: 'orange',
    tabBarInactiveTintColor: 'gray'
  })

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={screenOptions}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          name="Discover"
          component={DiscoverScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App
