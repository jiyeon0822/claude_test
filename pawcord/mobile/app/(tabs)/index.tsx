import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { useRecordsStore } from '@/store/useRecordsStore';
import UploadButton from '@/components/UploadButton';
import TrendChart from '@/components/TrendChart';
import EmptyState from '@/components/EmptyState';
import AnalysisSummary from '@/components/AnalysisSummary';
import LoadingOverlay from '@/components/LoadingOverlay';

const DEFAULT_MARKERS = ['BUN', 'CREA', 'HGB', 'WBC'];

export default function DashboardScreen() {
  const { records, fetchRecords, fetchAnalysis, analysisText, isAnalyzing } =
    useRecordsStore();
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const latestRecord = records[0];

  const getChartData = (marker: string) =>
    records
      .filter((r) => {
        const item = r.cbc[marker] ?? r.chemistry[marker];
        return item !== null && item !== undefined;
      })
      .map((r) => {
        const item = r.cbc[marker] ?? r.chemistry[marker];
        return { x: r.exam_date ?? r.id, y: item!.value };
      })
      .reverse();

  const getRefRange = (marker: string) => {
    for (const r of records) {
      const item = r.cbc[marker] ?? r.chemistry[marker];
      if (item) return { refLow: item.ref_low ?? undefined, refHigh: item.ref_high ?? undefined };
    }
    return {};
  };

  const handleAnalysis = async () => {
    await fetchAnalysis();
    setShowAnalysis(true);
  };

  if (records.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState />
        <UploadButton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header info */}
        <View style={styles.header}>
          <Text style={styles.catName}>{latestRecord?.cat_name ?? '고양이'}</Text>
          <Text style={styles.lastDate}>
            최근 검진: {latestRecord?.exam_date ?? '—'}
          </Text>
        </View>

        {/* Trend charts */}
        <Text style={styles.sectionTitle}>트렌드</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.charts}
        >
          {DEFAULT_MARKERS.map((marker) => {
            const data = getChartData(marker);
            const { refLow, refHigh } = getRefRange(marker);
            return (
              <TrendChart
                key={marker}
                marker={marker}
                data={data}
                refLow={refLow}
                refHigh={refHigh}
              />
            );
          })}
        </ScrollView>

        {/* AI analysis button */}
        <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalysis}>
          <Text style={styles.analyzeText}>AI 분석 보기</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      <UploadButton />

      <LoadingOverlay visible={isAnalyzing} message="AI 분석 중..." />

      <AnalysisSummary
        visible={showAnalysis && !!analysisText}
        text={analysisText ?? ''}
        onClose={() => setShowAnalysis(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  catName: {
    color: Colors.brand,
    fontSize: 24,
    fontWeight: '800',
  },
  lastDate: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  charts: {
    paddingBottom: 8,
  },
  analyzeButton: {
    marginTop: 24,
    backgroundColor: Colors.accent + '22',
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  analyzeText: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
});
