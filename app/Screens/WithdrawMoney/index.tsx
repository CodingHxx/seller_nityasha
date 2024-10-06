import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc';

export default function WithdrawMoney() {
  return (
    <SafeAreaView style={tw`flex items-center justify-center h-full w-full bg-[#0e0e0e]`}>
      <Text style={tw`text-[#fff]`}>WithdrawMoney</Text>
    </SafeAreaView>
  )
}