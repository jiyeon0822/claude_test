import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';
import { useRecordsStore } from '@/store/useRecordsStore';
import LoadingOverlay from './LoadingOverlay';

type UploadState = 'idle' | 'picking' | 'uploading' | 'success' | 'error';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function UploadButton() {
  const [state, setState] = useState<UploadState>('idle');
  const uploadFile = useRecordsStore((s) => s.uploadFile);

  const handlePress = async () => {
    if (state !== 'idle') return;
    setState('picking');

    let result: DocumentPicker.DocumentPickerResult;
    try {
      result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/csv',
        ],
        copyToCacheDirectory: true,
      });
    } catch {
      setState('idle');
      return;
    }

    if (result.canceled || !result.assets?.length) {
      setState('idle');
      return;
    }

    const asset = result.assets[0];

    if (asset.size && asset.size > MAX_FILE_SIZE) {
      setState('idle');
      Alert.alert('파일이 너무 큽니다', '최대 10MB까지 업로드 가능합니다.');
      return;
    }

    setState('uploading');
    try {
      await uploadFile(
        asset.uri,
        asset.name,
        asset.mimeType ?? 'application/octet-stream',
      );
      setState('idle');
      Alert.alert('완료', '검진 기록이 저장되었습니다!');
    } catch (e) {
      setState('idle');
      Alert.alert('오류', (e as Error).message || '업로드에 실패했습니다.');
    }
  };

  return (
    <>
      <LoadingOverlay
        visible={state === 'uploading'}
        message="AI로 파싱 중..."
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={state !== 'idle'}
      >
        <Text style={styles.fabText}>+ 업로드</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    backgroundColor: Colors.brand,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 14,
    shadowColor: Colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
