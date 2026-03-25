import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { LabItem, getMarkerStatus } from '@/services/api';
import AbnormalBadge from './AbnormalBadge';

interface Props {
  name: string;
  item: LabItem | null;
}

export default function MarkerCard({ name, item }: Props) {
  const status = getMarkerStatus(item);
  const accentColor =
    status === 'high' ? Colors.high :
    status === 'low' ? Colors.low :
    status === 'normal' ? Colors.normal :
    Colors.border;

  return (
    <View style={[styles.card, { borderLeftColor: accentColor }]}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <AbnormalBadge status={status} />
      </View>
      {item ? (
        <>
          <Text style={[styles.value, { color: accentColor }]}>
            {item.value}
            <Text style={styles.unit}> {item.unit}</Text>
          </Text>
          {(item.ref_low !== null || item.ref_high !== null) && (
            <Text style={styles.ref}>
              ref {item.ref_low ?? '?'} – {item.ref_high ?? '?'}
            </Text>
          )}
        </>
      ) : (
        <Text style={styles.na}>N/A</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderLeftWidth: 3,
    borderRadius: 8,
    padding: 12,
    margin: 4,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
  unit: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  ref: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  na: {
    color: Colors.textMuted,
    fontSize: 16,
  },
});
