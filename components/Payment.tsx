import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from 'twrnc';

export default function Payment() {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust this offset based on your need
    >
      <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()}>
        <View />
      </Pressable>
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={50}
        tint="dark"
        style={{
          height: "30%",
          width: "100%",
          position: "absolute",
          bottom: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowRadius: 8,
          shadowOpacity: 0.15,
          padding: 16,
        }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={{ color: "#007AFF", fontSize: 17 }}>Cancel</Text>
            </Pressable>
          </View>
          <View style={{ gap: 10, paddingTop: 16 }}>
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 32,
                fontWeight: "900",
              }}
            >
              Now Value - $3
            </Text>
            <TextInput
              style={tw`flex mt-6 items-center justify-center w-full rounded-lg bg-white text-black py-2 px-3`}
            />
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.9}
              style={{
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 17,
                  color: "black",
                  textAlign: "center",
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </BlurView>
    </KeyboardAvoidingView>
  );
}
