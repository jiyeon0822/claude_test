import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { CheckupRecord } from '@/services/api';
import { useAbnormalCount } from '@/hooks/useAbnormalCount';

interface Props {
  record: CheckupRecord;
  onPress: () => void;
}

export default function RecordListItem({ record, onPress }: Props) {
  const abnormalCount = useAbnormalCount(record);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <Text style={styles.date}>{record.exam_date ?? '날짜 없음'}</Text>
        <Text style={styles.sub}>
          {[record.hospital, record.cat_name].filter(Boolean).join(' · ') || '정보 없음'}
        </Text>
      </View>
      {abnormalCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{abnormalCount} 이상</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  left: {
    flex: 1,
  },
  date: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  sub: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.high + '33',
    borderWidth: 1,
    borderColor: Colors.high,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: Colors.high,
    fontSize: 12,
    fontWeight: '600',
  },
});
