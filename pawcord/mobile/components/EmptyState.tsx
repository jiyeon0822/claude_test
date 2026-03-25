import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🐱</Text>
      <Text style={styles.title}>검진 기록이 없습니다</Text>
      <Text style={styles.sub}>
        PDF, 이미지, 또는 Excel 파일을{'\n'}업로드해서 혈액검사 결과를 분석해보세요
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  sub: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
