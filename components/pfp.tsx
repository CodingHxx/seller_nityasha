import React, { useState, useEffect } from 'react';
import { View, Image, Alert, TouchableOpacity, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PfpUpload({ pfp }) {
    const [image, setImage] = useState(null);
console.log(pfp)
    // Load default profile picture on mount
    useEffect(() => {
        if (pfp) {
            setImage(pfp); // Set the default profile picture from props
        }
    }, [pfp]);

    // Function to pick an image
    const pickImage = async () => {
        console.log("Attempting to pick an image");

        // Request permission to access media library
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log("Permission result:", permissionResult);

        if (permissionResult.granted === false) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log("ImagePicker result:", result);

        if (!result.canceled) {
            const uri = result.assets[0].uri;  // Get the image URI
            setImage(uri);  // Update UI with the selected image
            await uploadImage(uri);  // Call upload function
        }
    };

    // Function to upload the image
    const uploadImage = async (uri) => {
        console.log("Attempting to upload image", uri);

        const storedUserId = await AsyncStorage.getItem('userId');
        console.log("Stored User ID:", storedUserId);

        if (!storedUserId) {
            Alert.alert('User ID not found in storage');
            return;
        }

        // Remove 'file://' prefix for iOS compatibility (if needed)
        const imageUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

        const formData = new FormData();
        formData.append('file', {
            uri: imageUri,
            name: 'profile.jpg',  // You can set a default name or derive it from the file
            type: 'image/jpeg',  // Set the appropriate MIME type
        });

        try {
            // Try the new API endpoint first
            const mainApiResponse = await fetch(`https://nityasha.vercel.app/api/v1/consultantss/${storedUserId}/pfp`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (mainApiResponse.ok) {
                const data = await mainApiResponse.json();
                if (data.success) {
                    Alert.alert('Profile picture updated successfully!');
                    setImage(uri); // Update the image to the newly uploaded one
                    return;
                }
            }

            // If the main API fails, try the fallback API
            const fallbackResponse = await fetch(`https://insightword.in/pfp.php?id=${storedUserId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("Server response:", fallbackResponse);

            if (fallbackResponse.ok) {
                const data = await fallbackResponse.json();
                console.log("Response data:", data);
                if (data.success) {
                    Alert.alert('Profile picture updated successfully!');
                    setImage(uri); // Update the image to the newly uploaded one
                } else {
                    Alert.alert('Failed to upload image.');
                }
            } else {
                Alert.alert('Error uploading image. Status Code: ' + fallbackResponse.status);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            Alert.alert('An error occurred while uploading the image. Please try again later.');
        }
    };

    return (
        <TouchableOpacity onPress={pickImage} style={tw`w-24 h-24 rounded-full mt-3`}>
            {image ? (
                <Image source={{ uri: image }} style={tw`w-24 h-24 rounded-full  border-2 border-white`} />
            ) : (
                    <Image source={{ uri: pfp }} style={tw`w-24 h-24 rounded-full`} />
            )}
        </TouchableOpacity>
    );
}
