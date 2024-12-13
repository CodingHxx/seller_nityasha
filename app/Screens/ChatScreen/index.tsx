import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Image,
  AppState // Import AppState
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '@/lib/Firebase'; // Ensure correct path
import { ref, onValue, set } from 'firebase/database';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { Send } from 'lucide-react-native';
import Backgroundchat from '@/assets/images/backgroundchat.png';

const ChatScreen = ({ route }) => {
  const { roomN, userId, time } = route.params;

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [userSession, setUserSession] = useState(null);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [consultants, setConsultants] = useState([]);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState(time * 60);
  const appState = useRef(AppState.currentState); 
  const [lastTimestamp, setLastTimestamp] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(prevTime => Math.max(prevTime - 1, 0));
    }, 1000);

    if (remainingTime === 0) {
      navigation.goBack(); // Navigate back to the previous screen
    }

    return () => clearInterval(interval);
  }, [remainingTime, navigation]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const currentTime = Date.now();
        const timeElapsed = Math.floor((currentTime - lastTimestamp) / 1000);
        setRemainingTime(prevTime => Math.max(prevTime - timeElapsed, 0));
      } else if (nextAppState === 'background') {
        setLastTimestamp(Date.now());
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [lastTimestamp]);

  useEffect(() => {
    const loadUserSession = async () => {
      const session = await AsyncStorage.getItem('userSession');
      const parsedSession = JSON.parse(session);
      setUserSession(parsedSession);
    };

    loadUserSession();
  }, []);

  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    const unsubscribe = onValue(messagesRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const messageArray = Object.values(data).filter(
          message => message.roomName === roomN // Filter by roomName
        );
        setMessages(messageArray);
      }
    });

    return () => unsubscribe();
  }, [roomN]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: Date.now(),
        text: messageText,
        username: userSession ? userSession.username : 'User',
        roomName: roomN,
      };
      set(ref(db, 'messages/' + newMessage.id), newMessage);
      setMessageText('');
    }
  };

  const fetchConsultants = async () => {
    try {
      const response = await fetch(`https://nityasha.vercel.app/api/v1/users/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setConsultants([data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchConsultants(); // Fetch every 3 seconds
    }, 2000);
  return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const formatTime = time => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderMessageItem = ({ item }) => (
    <View
      style={tw`p-2 my-1 ${item.username === (userSession ? userSession.username : 'User')
          ? 'bg-orange-500 self-end text-white mr-2 rounded-lg rounded-tr-none'
          : 'bg-orange-500 ml-2 self-start rounded-lg rounded-tl-none'
        }`}
    >
      <Text style={[tw`text-white`, { fontFamily: 'Urbanist_600SemiBold' }]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <ImageBackground source={Backgroundchat} style={tw`flex h-full`}>
      <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={tw`flex px-5 bg-white flex-row items-center justify-between pb-2`}>
        <View style={tw`flex h-full`}>
          {Array.isArray(consultants) && consultants.length > 0 ? (
            consultants.map((consultant, index) => (
              <TouchableOpacity key={index} style={tw`flex flex-row gap-3 items-center justify-center`}>
                <Image source={{ uri: consultant.pfp }} style={tw`w-12 h-12 rounded-full`} />
                <Text style={tw`font-bold`}>{consultant.username}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No consultants available</Text>
          )}
        </View>
        <Text>{formatTime(remainingTime)}</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={item => item.id.toString()}
          />
        </View>
        <View style={tw`flex items-center justify-center flex-row w-full rounded-full gap-1 px-1 py-2`}>
          <TextInput
            style={[tw`flex w-[86%] border py-2 rounded-full pl-3 bg-white`, { fontFamily: 'Urbanist_600SemiBold' }]}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type your message..."
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity onPress={sendMessage} style={[tw`flex rounded-full items-center justify-center p-2 bg-emerald-500`, { fontFamily: 'Urbanist_600SemiBold' }]}>
            <Send color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
});

export default ChatScreen;
