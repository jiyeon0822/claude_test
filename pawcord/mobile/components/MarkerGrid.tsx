import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { LabItem } from '@/services/api';
import MarkerCard from './MarkerCard';

interface Props {
  title: string;
  panel: { [key: string]: LabItem | null };
}

export default function MarkerGrid({ title, panel }: Props) {
  const entries = Object.entries(panel);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={entries}
        keyExtractor={([key]) => key}
        numColumns={2}
        scrollEnabled={false}
        renderItem={({ item: [key, value] }) => (
          <MarkerCard name={key} item={value} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4,
  },
});
