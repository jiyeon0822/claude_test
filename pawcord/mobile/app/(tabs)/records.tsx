import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Colors } from '@/constants/colors';
import { CheckupRecord } from '@/services/api';
import { useRecordsStore } from '@/store/useRecordsStore';
import RecordListItem from '@/components/RecordListItem';

export default function RecordsScreen() {
  const router = useRouter();
  const { records, fetchRecords, deleteRecord, isLoading } = useRecordsStore();

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('기록 삭제', '이 검진 기록을 삭제하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteRecord(id),
        },
      ]);
    },
    [deleteRecord],
  );

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => handleDelete(id)}
    >
      <Text style={styles.deleteText}>삭제</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: CheckupRecord }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <RecordListItem
        record={item}
        onPress={() => router.push(`/record/${item.id}`)}
      />
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onRefresh={fetchRecords}
        refreshing={isLoading}
        ListEmptyComponent={
          <Text style={styles.empty}>기록이 없습니다. PDF를 업로드해 보세요.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  empty: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 60,
    fontSize: 14,
  },
  deleteAction: {
    backgroundColor: Colors.high,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 10,
    marginBottom: 8,
    marginLeft: 8,
  },
  deleteText: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
});
