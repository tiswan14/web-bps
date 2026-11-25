import type { MonitoringPulsaResponse } from '../types'
import { formatRupiah } from './format'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function exportMonitoringPulsaToExcel(data: MonitoringPulsaResponse): void {
  const { periode, summary, kegiatanList, petugasRows } = data

  const kegiatanHeaders = kegiatanList
    .map((k) => `<th style="background:#047857;color:#ffffff;padding:8px;border:1px solid #cbd5e1;">${escapeHtml(k.namaKegiatan)}</th>`)
    .join('')

  const matriksRows = petugasRows
    .map((row, idx) => {
      const cells = kegiatanList
        .map((k) => {
          const alokasi = row.kegiatanMap[k.id]
          if (!alokasi) {
            return `<td style="padding:6px;border:1px solid #cbd5e1;text-align:center;">-</td>`
          }
          const statusTxt =
            alokasi.status === 'DISETUJUI'
              ? 'Disetujui'
              : alokasi.status === 'DITOLAK'
                ? 'Ditolak'
                : 'Diajukan'
          return `<td style="padding:6px;border:1px solid #cbd5e1;text-align:right;">${formatRupiah(alokasi.nominal)} (${statusTxt})</td>`
        })
        .join('')

      return `
        <tr>
          <td style="padding:6px;border:1px solid #cbd5e1;text-align:center;">${idx + 1}</td>
          <td style="padding:6px;border:1px solid #cbd5e1;">${escapeHtml(row.nama)}${row.isDuplikasi ? ' [Duplikasi Kegiatan]' : ''}</td>
          <td style="padding:6px;border:1px solid #cbd5e1;text-align:center;">${row.tipe === 'ORGANIK' ? 'Organik' : 'Mitra'}</td>
          ${cells}
          <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;font-weight:bold;">${formatRupiah(row.totalAjuan)}</td>
          <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;font-weight:bold;color:#047857;">${formatRupiah(row.totalDisetujui)}</td>
        </tr>
      `
    })
    .join('')

  const breakdownRows = kegiatanList
    .map(
      (k) => `
      <tr>
        <td style="padding:6px;border:1px solid #cbd5e1;">${escapeHtml(k.namaKegiatan)}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;">${k.jumlahPetugas}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;">${k.jumlahDisetujui}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;">${formatRupiah(k.totalAjuan)}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;color:#047857;font-weight:bold;">${formatRupiah(k.totalDisetujui)}</td>
      </tr>
    `,
    )
    .join('')

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="UTF-8" /></head>
    <body style="font-family:Calibri,Arial,sans-serif;font-size:11pt;">
      <h2 style="margin-bottom:4px;">LAPORAN MONITORING PEMBELIAN PULSA / PAKET DATA</h2>
      <p style="margin-top:0;color:#475569;">BPS Kabupaten Pangandaran &mdash; Periode: <strong>${escapeHtml(periode.label)}</strong></p>

      <table style="border-collapse:collapse;margin-bottom:18px;">
        <tr>
          <th style="background:#f1f5f9;padding:6px 12px;border:1px solid #cbd5e1;">Total Petugas</th>
          <th style="background:#f1f5f9;padding:6px 12px;border:1px solid #cbd5e1;">Total Kegiatan</th>
          <th style="background:#f1f5f9;padding:6px 12px;border:1px solid #cbd5e1;">Total Nominal Ajuan</th>
          <th style="background:#f1f5f9;padding:6px 12px;border:1px solid #cbd5e1;">Total Disetujui PPK</th>
        </tr>
        <tr>
          <td style="padding:6px 12px;border:1px solid #cbd5e1;text-align:center;">${summary.totalPetugas} (Organik: ${summary.totalOrganik} | Mitra: ${summary.totalMitra})</td>
          <td style="padding:6px 12px;border:1px solid #cbd5e1;text-align:center;">${summary.totalKegiatan}</td>
          <td style="padding:6px 12px;border:1px solid #cbd5e1;text-align:right;font-weight:bold;">${formatRupiah(summary.totalNominalAjuan)}</td>
          <td style="padding:6px 12px;border:1px solid #cbd5e1;text-align:right;font-weight:bold;color:#047857;">${formatRupiah(summary.totalDisetujuiPpk)}</td>
        </tr>
      </table>

      <h3>1. Breakdown per Kegiatan &mdash; ${escapeHtml(periode.label)}</h3>
      <table style="border-collapse:collapse;margin-bottom:18px;">
        <thead>
          <tr>
            <th style="background:#047857;color:#ffffff;padding:8px;border:1px solid #cbd5e1;">Kegiatan</th>
            <th style="background:#047857;color:#ffffff;padding:8px;border:1px solid #cbd5e1;">Jml Petugas</th>
            <th style="background:#047857;color:#ffffff;padding:8px;border:1px solid #cbd5e1;">Disetujui (org)</th>
            <th style="background:#047857;color:#ffffff;padding:8px;border:1px solid #cbd5e1;">Total Ajuan</th>
            <th style="background:#047857;color:#ffffff;padding:8px;border:1px solid #cbd5e1;">Total Disetujui</th>
          </tr>
        </thead>
        <tbody>
          ${breakdownRows}
          <tr style="background:#f8fafc;font-weight:bold;">
            <td style="padding:6px;border:1px solid #cbd5e1;">JUMLAH</td>
            <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;">${summary.totalAlokasi}</td>
            <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;">${summary.totalDisetujuiOrg}</td>
            <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;">${formatRupiah(summary.totalNominalAjuan)}</td>
            <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;color:#047857;">${formatRupiah(summary.totalDisetujuiPpk)}</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Terbilang Total Disetujui:</strong> ${escapeHtml(summary.terbilangDisetujui)}</p>

      <h3>2. Matriks Daftar Pulsa Petugas &mdash; ${escapeHtml(periode.label)}</h3>
      <table style="border-collapse:collapse;">
        <thead>
          <tr>
            <th style="background:#047857;color:#ffffff;padding:8px;border:1px solid #cbd5e1;">No</th>
            <th style="background:#047857;color:#ffffff;padding:8px;border:1px solid #cbd5e1;">Nama</th>
            <th style="background:#047857;color:#ffffff;padding:8px;border:1px solid #cbd5e1;">Status</th>
            ${kegiatanHeaders}
            <th style="background:#047857;color:#ffffff;padding:8px;border:1px solid #cbd5e1;">Total Ajuan</th>
            <th style="background:#047857;color:#ffffff;padding:8px;border:1px solid #cbd5e1;">Total Disetujui</th>
          </tr>
        </thead>
        <tbody>
          ${matriksRows}
        </tbody>
      </table>
    </body>
    </html>
  `

  const blob = new Blob([html], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const safePeriod = periode.label.replace(/\s+/g, '_')
  link.href = url
  link.download = `Monitoring_Pulsa_${safePeriod}.xls`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
