# PRD — tradetrack (트레이드트랙)

## 서비스 개요

HVAC·배관·전기 등 현장 기술직 소규모 업체(1–10인)를 위한 모바일 우선 작업 관리 웹앱.
스프레드시트와 수기 메모를 벗어나 현장 스케줄링, 고객 관리, 청구서 발행을 하나의 앱으로 처리한다.

## 타겟 사용자 페르소나

**김기사 (38세, HVAC 기사, 개인 사업자)**
- 하루 3–5건 현장 출동, 구글 캘린더 + 카카오톡으로 일정 관리 중
- 청구서는 엑셀로 만들고 카톡으로 발송
- 고통 포인트: 일정 겹침, 고객 연락처 분산, 청구서 누락
- 기술 수준: 스마트폰 능숙, PC 작업은 최소화 희망

**박사장 (45세, 배관 업체 대표, 직원 4명)**
- 직원별 일정 배정, 작업 완료 확인, 월말 정산이 주요 업무
- 전화/문자로 직원 일정 확인하는 시간 낭비 심각

## 핵심 기능 (MoSCoW)

### Must-Have
- 작업(Job) CRUD — 고객명, 주소, 작업 유형, 날짜/시간, 담당자
- 고객 관리 — 연락처, 작업 이력 조회
- 청구서 자동 생성 — 작업 내역 기반 PDF 미리보기 + 다운로드
- 모바일 최적화 UI — PWA, 터치 친화적

### Should-Have
- 작업 상태 트래킹 (예약됨 → 진행 중 → 완료)
- 현장 사진 첨부 (작업 전/후)
- 기본 대시보드 — 이번 달 작업 수, 매출 요약

### Could-Have
- 이메일/SMS 고객 알림
- 팀원 계정 (다중 사용자)
- Google Maps 연동 경로 최적화

### Won't-Have (v1)
- 회계 소프트웨어 연동
- 재고 관리
- 모바일 네이티브 앱

## 경쟁 서비스 분석

| 서비스 | 가격 | 문제점 |
|--------|------|--------|
| ServiceTitan | $398+/월 | 과도한 기능, 긴 온보딩, 엔터프라이즈 중심 |
| Jobber | $69/월 | 영어 전용, 기능 복잡, 소규모엔 과함 |
| Housecall Pro | $49/월 | 미국 시장 특화, 한국 현장 워크플로우 미지원 |

**차별점**: 5분 이내 셋업 / 한국 현장 워크플로우에 맞는 UX / 월 $0 프리미엄 플랜

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| 프레임워크 | Next.js 15 (App Router) |
| UI | shadcn/ui + Tailwind CSS v4 |
| DB | Drizzle ORM + better-sqlite3 |
| 파일 처리 | Next.js API Route + multer |
| PDF 생성 | @react-pdf/renderer |
| 테스트 | Jest + @testing-library/react + Playwright |

## 데이터 모델 초안

```
customers: id, name, phone, address, notes, created_at
jobs: id, customer_id, title, type, status, scheduled_at, completed_at, notes, created_at
job_photos: id, job_id, url, caption, created_at
invoices: id, job_id, amount, items(json), issued_at, paid_at
```

## 비기능 요구사항

- 모바일 First Paint < 2s (3G 기준)
- PWA — 오프라인 기본 UI 접근 가능
- SQLite 단일 파일 DB — 배포 복잡도 최소화
- 테스트 커버리지 80% 이상
