import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { MarkerStatus } from '@/services/api';

interface Props {
  status: MarkerStatus;
}

const LABEL: Record<MarkerStatus, string> = {
  high: 'HIGH',
  low: 'LOW',
  normal: 'NORMAL',
  unknown: '—',
};

const COLOR: Record<MarkerStatus, string> = {
  high: Colors.high,
  low: Colors.low,
  normal: Colors.normal,
  unknown: Colors.textMuted,
};

export default function AbnormalBadge({ status }: Props) {
  return (
    <View style={[styles.badge, { borderColor: COLOR[status] }]}>
      <Text style={[styles.text, { color: COLOR[status] }]}>{LABEL[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
