import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const UserList = ({ users, onSelectUser }) => {
  return (
    <FlatList
      data={users}
      keyExtractor={user => user.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelectUser(item)}>
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  userName: {
    fontSize: 16,
  },
});

export default UserList;
