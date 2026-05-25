# TradeTrack — 현장 기술직 업무 관리 PWA

> 에어컨·배관·전기 등 소규모 기술직 사업자를 위한 모바일 퍼스트 업무 관리 앱

## Features

- **작업 관리** — 고객별 작업 일정·상태(예약/진행/완료/취소) 추적
- **고객 관리** — 고객 정보 CRUD 및 작업 이력 조회
- **청구서 생성** — 항목별 PDF 청구서 자동 생성 및 다운로드
- **대시보드** — 오늘·이번주 작업, 미수금 현황 요약
- **현장 사진 첨부** — 작업별 사진 업로드 및 기록
- **PWA** — 오프라인 지원, 홈 화면 설치 가능

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Database | SQLite via better-sqlite3 |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS v4 |
| PDF | @react-pdf/renderer |
| Validation | Zod |
| PWA | next-pwa |
| Testing | Jest + ts-jest |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Database Setup

```bash
npx drizzle-kit migrate
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

### Tests

```bash
npm test
npm run test:coverage
```

## Project Structure

```
app/                  # Next.js App Router pages & API routes
components/           # UI components (customer, job, invoice, layout)
repositories/         # Data access layer (Repository pattern)
lib/
  utils.ts            # Formatting helpers (KRW, date, phone)
  validations/        # Zod schemas
  pdf/                # Invoice PDF template
db/
  schema.ts           # Drizzle table definitions
  migrations/         # SQL migration files
__tests__/            # Jest unit & integration tests
```

## License

MIT
