import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

// Define the background fetch task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // Simulate a background fetch request
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();
    console.log('Fetched background data:', data);

    // Send a local notification when new data is fetched
    await sendNotification(data);

    // Return new data result
    return BackgroundFetch.Result.NewData;
  } catch (error) {
    console.error('Background fetch error:', error);
    return BackgroundFetch.Result.Failed;
  }
});

// Function to send notifications
const sendNotification = async (data) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "New Data Fetched",
      body: `Fetched item: ${data.title}`,
    },
    trigger: null, // Send immediately
  });
};

export default function App() {
  useEffect(() => {
    const registerBackgroundFetch = async () => {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Notification permission is required!');
        return;
      }

      // Check if background fetch is available
      const statusFetch = await BackgroundFetch.getStatusAsync();
      if (statusFetch !== BackgroundFetch.Status.Available) {
        console.log('Background fetch is not available');
        return;
      }

      // Register background fetch task immediately when the app opens
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 1, // In seconds, adjust to your needs
        stopOnTerminate: false, // Keep running even if the app is closed
        startOnBoot: true, // Start after device reboot
      });

      console.log('Background fetch task registered');
    };

    // Register the background fetch task when the app starts
    registerBackgroundFetch();
  }, []);

  return (
    <View>
      <Text>Background Fetch with Notifications Example</Text>
    </View>
  );
}
