# ROADMAP — tradetrack

## 기술 스택

| 레이어 | 기술 | 결정 근거 |
|--------|------|-----------|
| 프레임워크 | Next.js 15 (App Router) | SSR + RSC로 모바일 FCP < 2s 달성, PWA 지원 |
| UI | shadcn/ui + Tailwind CSS v4 | 터치 친화적 컴포넌트, 빠른 커스터마이징 |
| DB | Drizzle ORM + better-sqlite3 | 단일 파일 SQLite, 타입 안전, 배포 단순성 |
| PDF | @react-pdf/renderer | React 컴포넌트 기반 청구서 생성 |
| PWA | next-pwa | 오프라인 기본 UI, 홈 화면 설치 |
| 테스트 | Jest + Testing Library + Playwright | 유닛/통합/E2E 전 계층 커버리지 |

---

## DB 스키마 (Drizzle)

```typescript
// src/db/schema.ts

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull().default(''),
  notes: text('notes').default(''),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  customerId: text('customer_id').notNull().references(() => customers.id),
  title: text('title').notNull(),
  type: text('type').notNull(),           // hvac | plumbing | electrical | other
  status: text('status').notNull().default('scheduled'),  // scheduled | in_progress | completed | cancelled
  scheduledAt: integer('scheduled_at', { mode: 'timestamp' }).notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  notes: text('notes').default(''),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const jobPhotos = sqliteTable('job_photos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  jobId: text('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  caption: text('caption').default(''),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  jobId: text('job_id').notNull().references(() => jobs.id),
  amount: integer('amount').notNull().default(0),   // 원 단위 정수
  items: text('items', { mode: 'json' }).notNull().default('[]'),  // InvoiceItem[]
  issuedAt: integer('issued_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  paidAt: integer('paid_at', { mode: 'timestamp' }),
})
```

### 타입 정의

```typescript
type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
type JobType = 'hvac' | 'plumbing' | 'electrical' | 'other'
type InvoiceItem = { label: string; qty: number; unitPrice: number }
```

---

## 컴포넌트 구조도

```
src/
├── app/
│   ├── layout.tsx                    # RootLayout, PWA meta, fonts
│   ├── page.tsx                      # 대시보드 (이번 달 요약)
│   ├── jobs/
│   │   ├── page.tsx                  # 작업 목록 (오늘/이번주 필터)
│   │   ├── new/page.tsx              # 작업 생성
│   │   └── [id]/
│   │       ├── page.tsx              # 작업 상세
│   │       └── edit/page.tsx         # 작업 편집
│   ├── customers/
│   │   ├── page.tsx                  # 고객 목록
│   │   ├── new/page.tsx              # 고객 생성
│   │   └── [id]/page.tsx             # 고객 상세 + 작업 이력
│   ├── invoices/
│   │   ├── page.tsx                  # 청구서 목록
│   │   └── [id]/page.tsx             # 청구서 상세 + PDF 다운로드
│   └── api/
│       ├── jobs/route.ts             # GET, POST
│       ├── jobs/[id]/route.ts        # GET, PUT, DELETE
│       ├── jobs/[id]/photos/route.ts # POST (파일 업로드)
│       ├── customers/route.ts        # GET, POST
│       ├── customers/[id]/route.ts   # GET, PUT, DELETE
│       ├── invoices/route.ts         # GET, POST
│       └── invoices/[id]/pdf/route.ts # GET (PDF 스트림)
│
├── components/
│   ├── ui/                           # shadcn/ui 기본 컴포넌트
│   ├── job/
│   │   ├── JobCard.tsx               # 작업 카드 (목록용)
│   │   ├── JobForm.tsx               # 생성/편집 폼
│   │   ├── JobStatusBadge.tsx        # 상태 뱃지
│   │   └── PhotoUpload.tsx           # 사진 첨부 (drag & drop + camera)
│   ├── customer/
│   │   ├── CustomerCard.tsx
│   │   └── CustomerForm.tsx
│   ├── invoice/
│   │   ├── InvoicePreview.tsx        # @react-pdf/renderer 미리보기
│   │   └── InvoiceItems.tsx          # 항목 추가/편집 UI
│   ├── dashboard/
│   │   ├── StatCard.tsx              # 매출/작업 수 카드
│   │   └── RecentJobs.tsx            # 최근 작업 5개
│   └── layout/
│       ├── MobileNav.tsx             # 하단 탭 네비게이션
│       └── PageHeader.tsx            # 페이지 헤더
│
├── db/
│   ├── index.ts                      # DB 연결 (singleton)
│   ├── schema.ts                     # Drizzle 스키마
│   └── migrations/                   # drizzle-kit 마이그레이션
│
├── repositories/
│   ├── customer.repository.ts        # CRUD + 작업 이력 조회
│   ├── job.repository.ts             # CRUD + 상태 변경
│   └── invoice.repository.ts         # CRUD + PDF 데이터 조합
│
├── lib/
│   ├── pdf/
│   │   └── InvoiceDocument.tsx       # @react-pdf 청구서 템플릿
│   ├── validations/
│   │   ├── job.schema.ts             # zod 스키마
│   │   ├── customer.schema.ts
│   │   └── invoice.schema.ts
│   └── utils.ts                      # cn(), formatKRW(), formatDate()
│
└── types/
    └── index.ts                      # 공유 타입 정의
```

---

## Sprint 계획

### Sprint 0 — 프로젝트 셋업 (½일)

**목표**: 빌드·린트·테스트가 동작하는 빈 프로젝트

- [ ] `create-next-app` with TypeScript, App Router, Tailwind v4
- [ ] shadcn/ui init
- [ ] Drizzle + better-sqlite3 설치, DB 연결 설정
- [ ] @react-pdf/renderer 설치
- [ ] Jest + Testing Library + Playwright 설정
- [ ] ESLint + Prettier 설정
- [ ] `npm run build` 통과 확인

**검증**: `npx tsc --noEmit && npm run lint && npm run build` 성공

---

### Sprint 1 — DB 스키마 + Repository (½일)

**목표**: 데이터 계층 완성 + Repository 유닛 테스트 80%+

- [ ] `src/db/schema.ts` 작성
- [ ] `drizzle-kit generate` + `migrate` 실행
- [ ] `customer.repository.ts` 구현 (findAll, findById, create, update, delete)
- [ ] `job.repository.ts` 구현 + 상태 전이 유효성 검증
- [ ] `invoice.repository.ts` 구현
- [ ] 각 Repository 유닛 테스트 (in-memory SQLite)

**검증**: `npm test -- --coverage` 80%+ 통과

---

### Sprint 2 — API Routes (½일)

**목표**: REST API 완성 + 통합 테스트

- [ ] `app/api/customers/*` 라우트
- [ ] `app/api/jobs/*` 라우트 + 사진 업로드 (`/jobs/[id]/photos`)
- [ ] `app/api/invoices/*` 라우트
- [ ] `app/api/invoices/[id]/pdf` 라우트 (PDF 스트림)
- [ ] zod 입력 유효성 검증
- [ ] API 통합 테스트

**검증**: API 라우트 통합 테스트 통과

---

### Sprint 3 — 핵심 UI (1일)

**목표**: 작업 CRUD + 고객 관리 화면

- [ ] `MobileNav` 하단 탭 (작업 / 고객 / 청구서 / 대시보드)
- [ ] 작업 목록 (`/jobs`) — 오늘/이번 주 필터, 상태 배지
- [ ] 작업 생성/편집 (`/jobs/new`, `/jobs/[id]/edit`)
- [ ] 작업 상세 (`/jobs/[id]`) — 상태 변경 버튼, 사진 첨부
- [ ] 고객 목록 + 상세 (`/customers`, `/customers/[id]`)
- [ ] 터치 친화적 폼 (숫자 키패드, 날짜 피커)

**검증**: 작업 CRUD E2E 플로우 통과

---

### Sprint 4 — 청구서 + PDF (½일)

**목표**: 청구서 자동 생성 + PDF 미리보기/다운로드

- [ ] `InvoiceDocument.tsx` (@react-pdf 템플릿) — 업체명, 작업 내역, 합계
- [ ] 청구서 생성 UI (작업 → 청구서 자동 연동)
- [ ] PDF 미리보기 (`<PDFViewer>`)
- [ ] PDF 다운로드 버튼
- [ ] 청구서 납부 완료 처리

**검증**: 청구서 생성 → PDF 다운로드 E2E 통과

---

### Sprint 5 — 대시보드 + PWA (½일)

**목표**: 대시보드 + 오프라인 PWA

- [ ] 대시보드 (`/`) — 이번 달 작업 수, 매출 합계, 미완료 작업
- [ ] `StatCard`, `RecentJobs` 컴포넌트
- [ ] `next-pwa` 설정 — Service Worker, `manifest.json`
- [ ] 오프라인 fallback 페이지
- [ ] Lighthouse PWA 점수 90+ 확인

**검증**: `npm run build` + PWA manifest 유효성 통과

---

### Sprint 6 — 최종 QA + README + Push (½일)

**목표**: 빌드·테스트 완전 통과, GitHub push

- [ ] 전체 테스트 커버리지 80%+ 확인
- [ ] `npx tsc --noEmit && npm run lint && npm run build` 최종 통과
- [ ] `README.md` 작성
- [ ] `git init && gh repo create tradetrack --public && git push`

---

## 기술 결정 근거

| 결정 | 이유 |
|------|------|
| Next.js 15 App Router | RSC로 초기 로드 최소화 → 모바일 FCP < 2s |
| better-sqlite3 (동기 API) | Next.js API Route에서 async/await 없이 단순하고 빠른 DB 접근 |
| @react-pdf/renderer | React 컴포넌트로 청구서 레이아웃 관리 가능, 한국어 폰트 지원 |
| Repository 패턴 | API Route ↔ DB 분리로 유닛 테스트 가능, 스토리지 교체 용이 |
| zod 입력 검증 | API 경계에서 타입 안전 보장, 에러 메시지 자동 생성 |
| Tailwind v4 | CSS 변수 기반 → 다크모드·브랜드 커스터마이징 단순화 |
