import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

interface DataPoint {
  x: string;
  y: number;
}

interface Props {
  marker: string;
  data: DataPoint[];
  refLow?: number;
  refHigh?: number;
}

// Victory Native requires react-native-svg which needs native linking.
// This component renders a simple SVG-free fallback chart using React Native Views.
// Replace VictoryLine once native modules are linked in the actual Expo build.
export default function TrendChart({ marker, data, refLow, refHigh }: Props) {
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.markerLabel}>{marker}</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>데이터 없음</Text>
        </View>
      </View>
    );
  }

  const values = data.map((d) => d.y);
  const minVal = Math.min(...values, refLow ?? Infinity);
  const maxVal = Math.max(...values, refHigh ?? -Infinity);
  const range = maxVal - minVal || 1;

  const CHART_HEIGHT = 80;
  const CHART_WIDTH = 220;

  return (
    <View style={styles.container}>
      <Text style={styles.markerLabel}>{marker}</Text>
      <View style={[styles.chart, { width: CHART_WIDTH, height: CHART_HEIGHT }]}>
        {/* Reference band */}
        {refLow !== undefined && refHigh !== undefined && (
          <View
            style={[
              styles.refBand,
              {
                bottom: ((refLow - minVal) / range) * CHART_HEIGHT,
                height: ((refHigh - refLow) / range) * CHART_HEIGHT,
              },
            ]}
          />
        )}
        {/* Data points */}
        {data.map((point, i) => {
          const x = (i / Math.max(data.length - 1, 1)) * (CHART_WIDTH - 8);
          const y = ((point.y - minVal) / range) * CHART_HEIGHT;
          const isHigh = refHigh !== undefined && point.y > refHigh;
          const isLow = refLow !== undefined && point.y < refLow;
          const dotColor = isHigh ? Colors.high : isLow ? Colors.low : Colors.normal;
          return (
            <View
              key={i}
              style={[
                styles.dot,
                { left: x, bottom: y - 4, backgroundColor: dotColor },
              ]}
            />
          );
        })}
      </View>
      <Text style={styles.latestValue}>
        최근: {data[data.length - 1].y}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 244,
  },
  markerLabel: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  chart: {
    position: 'relative',
    backgroundColor: Colors.background,
    borderRadius: 6,
  },
  refBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Colors.normal + '22',
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  empty: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  latestValue: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 6,
  },
});
