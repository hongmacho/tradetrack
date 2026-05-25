import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { InvoiceWithJob } from '@/types'

Font.register({
  family: 'NotoSansKR',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgm203Tq4JJWq209pU0DPdWuqxJFA4GNDCBYtw.0.woff',
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansKR',
    padding: 40,
    fontSize: 11,
    color: '#1e293b',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 11, color: '#64748b', marginTop: 4 },
  sectionLabel: { fontSize: 9, color: '#94a3b8', marginBottom: 2, textTransform: 'uppercase' },
  sectionValue: { fontSize: 11, marginBottom: 12 },
  divider: { borderBottomWidth: 1, borderColor: '#e2e8f0', marginVertical: 16 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e2e8f0',
    padding: 8,
  },
  colLabel: { flex: 3 },
  colQty: { flex: 1, textAlign: 'center' },
  colUnit: { flex: 2, textAlign: 'right' },
  colAmount: { flex: 2, textAlign: 'right' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  totalLabel: { fontSize: 13, fontWeight: 'bold', marginRight: 24 },
  totalAmount: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 9, color: '#94a3b8' },
})

function formatKRW(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원'
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('ko-KR')
}

interface InvoiceDocumentProps {
  invoice: InvoiceWithJob
}

export function InvoiceDocument({ invoice }: InvoiceDocumentProps) {
  const { job, items } = invoice

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>청구서</Text>
            <Text style={styles.subtitle}>Invoice #{invoice.id.slice(0, 8).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.sectionLabel}>발행일</Text>
            <Text style={styles.sectionValue}>{formatDate(invoice.issuedAt)}</Text>
            {invoice.paidAt && (
              <>
                <Text style={styles.sectionLabel}>납부 완료</Text>
                <Text style={styles.sectionValue}>{formatDate(invoice.paidAt)}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <View>
            <Text style={styles.sectionLabel}>고객</Text>
            <Text style={styles.sectionValue}>{job.customer.name}</Text>
            <Text style={styles.sectionLabel}>연락처</Text>
            <Text style={styles.sectionValue}>{job.customer.phone}</Text>
          </View>
          <View>
            <Text style={styles.sectionLabel}>작업</Text>
            <Text style={styles.sectionValue}>{job.title}</Text>
            <Text style={styles.sectionLabel}>작업 일자</Text>
            <Text style={styles.sectionValue}>{formatDate(job.scheduledAt)}</Text>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colLabel}>항목</Text>
          <Text style={styles.colQty}>수량</Text>
          <Text style={styles.colUnit}>단가</Text>
          <Text style={styles.colAmount}>금액</Text>
        </View>
        {(items as import('@/types').InvoiceItem[]).map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colLabel}>{item.label}</Text>
            <Text style={styles.colQty}>{item.qty}</Text>
            <Text style={styles.colUnit}>{formatKRW(item.unitPrice)}</Text>
            <Text style={styles.colAmount}>{formatKRW(item.qty * item.unitPrice)}</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>합계</Text>
          <Text style={styles.totalAmount}>{formatKRW(invoice.amount)}</Text>
        </View>

        <Text style={styles.footer}>TradeTrack — 현장 기술직 작업 관리</Text>
      </Page>
    </Document>
  )
}
