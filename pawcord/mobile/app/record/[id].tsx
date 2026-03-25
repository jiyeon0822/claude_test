import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { api, CheckupRecord } from '@/services/api';
import MarkerGrid from '@/components/MarkerGrid';

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [record, setRecord] = useState<CheckupRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getRecord(id)
      .then(setRecord)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

  if (error || !record) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? '기록을 찾을 수 없습니다.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Metadata */}
      <View style={styles.meta}>
        <Text style={styles.metaTitle}>{record.exam_date ?? '날짜 없음'}</Text>
        {record.hospital && <Text style={styles.metaSub}>{record.hospital}</Text>}
        {record.cat_name && (
          <Text style={styles.metaSub}>고양이: {record.cat_name}</Text>
        )}
        {record.weight_kg !== null && (
          <Text style={styles.metaSub}>체중: {record.weight_kg} kg</Text>
        )}
      </View>

      {/* CBC panel */}
      {Object.keys(record.cbc).length > 0 && (
        <MarkerGrid title="CBC (혈구 검사)" panel={record.cbc} />
      )}

      {/* Chemistry panel */}
      {Object.keys(record.chemistry).length > 0 && (
        <MarkerGrid title="Chemistry (혈청 검사)" panel={record.chemistry} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.high,
    fontSize: 14,
  },
  meta: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  metaTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  metaSub: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
