# Pawcord — React Native 앱 개발 플랜

> 고양이 건강검진 PDF를 업로드하면 혈액검사 수치를 파싱해서 트렌드 차트 + AI 분석 요약을 보여주는 앱

---

## 현재 상태

| 영역 | 상태 | 기술 |
|------|------|------|
| 백엔드 API | 완성 (수정 없음) | FastAPI + Railway |
| DB | 완성 | Supabase (PostgreSQL) |
| AI 파싱 | 완성 | Claude API (claude-opus-4-6) |
| 웹 프론트 | 완성 | 순수 HTML/JS + Chart.js |
| **모바일 앱** | **작업 예정** | React Native + Expo |

---

## 기술 스택 (모바일)

| 항목 | 선택 |
|------|------|
| 프레임워크 | React Native + Expo SDK 51+ |
| 네비게이션 | Expo Router (파일 기반) |
| 차트 | Victory Native |
| PDF 업로드 | expo-document-picker + expo-file-system |
| 상태 관리 | Zustand |
| 스타일 | StyleSheet (NativeWind 선택적) |

---

## 디렉토리 구조

```
pawcord/
└── mobile/
    ├── app/
    │   ├── (tabs)/
    │   │   ├── index.tsx       # 메인 대시보드
    │   │   └── records.tsx     # 검진 기록 목록
    │   └── record/
    │       └── [id].tsx        # 검진 상세
    ├── components/
    ├── hooks/
    ├── services/
    │   └── api.ts              # FastAPI 연동 (중앙 관리)
    └── package.json
```

---

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/upload` | PDF 업로드 → Claude 파싱 → 저장 |
| GET | `/api/records` | 전체 검진 기록 목록 |
| GET | `/api/records/{id}` | 특정 검진 상세 |
| DELETE | `/api/records/{id}` | 검진 기록 삭제 |
| GET | `/api/analyze` | 전체 기록 AI 분석 요약 |

---

## 데이터 구조

```typescript
interface Record {
  id: string;            // "20240315123045" (타임스탬프)
  exam_date: string;     // "2024-03-15"
  hospital: string | null;
  cat_name: string | null;
  weight_kg: number | null;
  filename: string;
  cbc: { [key: string]: LabItem | null };      // RBC, HGB, HCT, MCV, MCH, MCHC, WBC, NEU, LYM, MONO, EOS, PLT
  chemistry: { [key: string]: LabItem | null }; // BUN, CREA, ALT, AST, ALP, GGT, TP, ALB, GLOB, GLU, CHOL, PHOS, Ca, Na, K, Cl
}

interface LabItem {
  value: number;
  unit: string;
  ref_low: number | null;
  ref_high: number | null;
}
```

이상 수치 판단:
- `value > ref_high` → 높음 (빨강)
- `value < ref_low` → 낮음 (노랑)
- 정상 범위 내 → 정상 (초록)

---

## 디자인 시스템

```
배경:    #0f1117
서피스:  #181c27
보더:    #2a3045
강조:    #7eb8f7  (파랑)
경고:    #f77e7e  (빨강 — 수치 높음)
낮음:    #f7d07e  (노랑 — 수치 낮음)
정상:    #7ef7b0  (초록)
고양이:  #ffb347  (주황 — 브랜드 포인트)
```

---

## 개발 우선순위

### Phase 1 — 기반 세팅
- [ ] `mobile/` 폴더 Expo 프로젝트 초기화
- [ ] 환경변수 설정 (`EXPO_PUBLIC_API_URL`)
- [ ] `services/api.ts` — FastAPI 연동 함수 모음 작성
- [ ] Zustand 스토어 설계

### Phase 2 — 핵심 화면
- [ ] 탭 네비게이션 구조 설정
- [ ] 메인 대시보드 (`index.tsx`) — Victory Native 트렌드 차트
- [ ] 검진 기록 목록 (`records.tsx`) — 날짜/병원/수치 이상 여부 표시
- [ ] 검진 상세 (`record/[id].tsx`) — 전체 CBC + Chemistry 수치 표시

### Phase 3 — 핵심 기능
- [ ] PDF 업로드 (`expo-document-picker`) — 업로드 후 자동 파싱
- [ ] 업로드 진행 상태 UI (로딩 + 완료/오류)
- [ ] AI 분석 화면 (`/api/analyze` 결과 표시)

### Phase 4 — 마무리
- [ ] 이상 수치 배지/강조 UI 통일
- [ ] 검진 기록 삭제 (스와이프 or 버튼)
- [ ] iOS / Android 빌드 테스트

---

## 환경변수

```bash
# 모바일 로컬 개발 (.env)
EXPO_PUBLIC_API_URL=https://your-app.railway.app
```

---

## 작업 규칙

- 백엔드 `app.py` 절대 수정 안 함
- 모든 API 호출은 `services/api.ts` 에서만
- 새 기능은 `mobile/` 폴더 안에서만 작업
