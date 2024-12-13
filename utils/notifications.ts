import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const configureNotifications = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
};

export const requestUserPermission = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }
    return true;
  }
  console.log('Must use physical device for Push Notifications');
  return false;
};

export const getDeviceToken = async (): Promise<string | null> => {
  try {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return null;
    }

    const hasPermission = await requestUserPermission();
    if (!hasPermission) return null;

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;
    
    // Log the token to the console
    console.log('Push Notification Token:', token);
    
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};


export const sendLocalNotification = async (
  title: string,
  message: string,
  data: Record<string, unknown> = {}
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: message,
      data,
    },
    trigger: null,
  });
};

export const scheduleLocalNotification = async (
  title: string,
  message: string,
  date: Date,
  data: Record<string, unknown> = {}
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: message,
      data,
    },
    trigger: date,
  });
};

// Initialize notifications when importing this file
configureNotifications();

// Add listener for notification received
Notifications.addNotificationReceivedListener((notification) => {
  console.log('Notification received:', notification);
});

// Add listener for notification response (when user taps notification)
Notifications.addNotificationResponseReceivedListener((response) => {
  console.log('Notification response:', response);
});
