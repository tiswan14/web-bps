"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  FileClock,
  FileText,
  Filter,
  Search,
  Send,
  XCircle,
  X,
  AlertCircle,
  ArrowUpDown,
  ReceiptText,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SpjStatus =
  | "Draft"
  | "Ditolak"
  | "Bendahara"
  | "PPK"
  | "PPSPM"
  | "KPPN"
  | "Arsip";

type SpjItem = {
  id: string;
  judul: string;
  user: string;
  pengaju: string;
  jenis: string;
  kategori: string;
  status: SpjStatus;
  tanggal: string;
  nomor: string;
};

const initialData: SpjItem[] = [
  {
    id: "SUB26110332",
    judul:
      "Perjalanan dinas luar kota dalam rangka konsultasi kegiatan statistik kependudukan naker dan hansos",
    user: "Fungsi Sosial",
    pengaju: "Yesi Desiawati Sirman, S.ST., M.AP.",
    jenis: "Perjalanan Dinas",
    kategori: "Perjadin Luar Kota",
    status: "Draft",
    tanggal: "05:57 – 23/11/2026",
    nomor: "-",
  },
  {
    id: "SUB26110331",
    judul: "Belanja kegiatan koordinasi statistik sektoral",
    user: "Fungsi Neraca",
    pengaju: "Ahmad Fauzi, S.ST.",
    jenis: "Belanja Barang",
    kategori: "Operasional",
    status: "Bendahara",
    tanggal: "09:30 – 22/11/2026",
    nomor: "SPM/001/2026",
  },
  {
    id: "SUB26110330",
    judul: "Perjalanan dinas koordinasi kegiatan lapangan",
    user: "Fungsi Produksi",
    pengaju: "Dewi Anggraini, S.ST.",
    jenis: "Perjalanan Dinas",
    kategori: "Perjadin Dalam Kota",
    status: "PPK",
    tanggal: "14:20 – 21/11/2026",
    nomor: "-",
  },
  {
    id: "SUB26110329",
    judul: "Pembelian perlengkapan administrasi kantor",
    user: "Fungsi Distribusi",
    pengaju: "Rina Marlina, S.E.",
    jenis: "Belanja Barang",
    kategori: "ATK",
    status: "Ditolak",
    tanggal: "10:15 – 20/11/2026",
    nomor: "-",
  },
  {
    id: "SUB26110328",
    judul: "Pembayaran honorarium kegiatan statistik",
    user: "Fungsi IPDS",
    pengaju: "Andi Setiawan, S.Kom.",
    jenis: "Belanja Jasa",
    kategori: "Honorarium",
    status: "PPSPM",
    tanggal: "08:45 – 19/11/2026",
    nomor: "SPM/002/2026",
  },
  {
    id: "SUB26110327",
    judul: "Pengadaan kebutuhan kegiatan survei",
    user: "Fungsi Sosial",
    pengaju: "Budi Santoso, S.ST.",
    jenis: "Belanja Barang",
    kategori: "Operasional",
    status: "KPPN",
    tanggal: "11:10 – 18/11/2026",
    nomor: "SP2D/001/2026",
  },
  {
    id: "SUB26110326",
    judul: "Pertanggungjawaban perjalanan dinas",
    user: "Fungsi Neraca",
    pengaju: "Siti Aminah, S.E.",
    jenis: "Perjalanan Dinas",
    kategori: "Perjadin Dalam Kota",
    status: "Arsip",
    tanggal: "13:25 – 17/11/2026",
    nomor: "SP2D/002/2026",
  },
];

const tabs: {
  label: string;
  value: string;
  count: number;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    label: "Total",
    value: "Total",
    count: 328,
    icon: FileText,
    color: "text-blue-600",
  },
  {
    label: "Draft",
    value: "Draft",
    count: 41,
    icon: FileClock,
    color: "text-slate-500",
  },
  {
    label: "Ditolak",
    value: "Ditolak",
    count: 1,
    icon: XCircle,
    color: "text-red-500",
  },
  {
    label: "Bendahara",
    value: "Bendahara",
    count: 113,
    icon: Clock3,
    color: "text-indigo-500",
  },
  {
    label: "PPK",
    value: "PPK",
    count: 32,
    icon: Clock3,
    color: "text-orange-500",
  },
  {
    label: "PPSPM",
    value: "PPSPM",
    count: 10,
    icon: Clock3,
    color: "text-pink-500",
  },
  {
    label: "KPPN",
    value: "KPPN",
    count: 85,
    icon: Send,
    color: "text-violet-500",
  },
  {
    label: "Arsip",
    value: "Arsip",
    count: 37,
    icon: Archive,
    color: "text-emerald-500",
  },
];

const statusStyle: Record<SpjStatus, string> = {
  Draft: "bg-slate-100 text-slate-700 border-slate-200",
  Ditolak: "bg-red-50 text-red-700 border-red-200",
  Bendahara: "bg-indigo-50 text-indigo-700 border-indigo-200",
  PPK: "bg-orange-50 text-orange-700 border-orange-200",
  PPSPM: "bg-pink-50 text-pink-700 border-pink-200",
  KPPN: "bg-violet-50 text-violet-700 border-violet-200",
  Arsip: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function SigapSpjPage() {
  const [activeTab, setActiveTab] = useState("Total");
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSpj, setSelectedSpj] = useState<SpjItem | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const filteredData = useMemo(() => {
    let result = initialData.filter((item) => {
      const keyword = search.toLowerCase();

      const matchesSearch = [
        item.id,
        item.judul,
        item.user,
        item.pengaju,
        item.jenis,
      ].some((value) => value.toLowerCase().includes(keyword));

      const matchesTab = activeTab === "Total" || item.status === activeTab;

      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;

      const month = item.tanggal.split("/")[1];
      const matchesMonth = selectedMonth === "all" || month === selectedMonth;

      return matchesSearch && matchesTab && matchesStatus && matchesMonth;
    });

    result.sort((a, b) =>
      sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id),
    );

    return result;
  }, [search, activeTab, selectedMonth, selectedStatus, sortAsc]);

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 p-3 md:p-5">
      {/* HEADER */}
      <section className="rounded-xl border bg-card p-5 shadow-sm md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#163A5F]/10 text-[#163A5F]">
            <ReceiptText className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              SIGAP SPJ
            </h1>
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">
              Sinergi Gerak Administrasi Pengajuan — Surat Pertanggungjawaban
            </p>
          </div>
        </div>
      </section>

      {/* STATISTIC TABS */}
      <section className="rounded-xl border bg-card p-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-[#163A5F] text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon
                  className={`size-4 ${active ? "text-white" : tab.color}`}
                />
                {tab.label}
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* DATA TABLE */}
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-2 border-b p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              Daftar Pengajuan
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Kelola dan pantau proses pengajuan surat pertanggungjawaban.
            </p>
          </div>
          <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
            {activeTab}
          </span>
        </div>

        {/* FILTER TOOLBAR */}
        <div className="space-y-4 p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="size-4" />
              Filter:
            </div>

            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari ID, judul, atau pengaju..."
                className="h-11 rounded-lg bg-muted/40 pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border bg-background pl-9 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-40"
                >
                  <option value="all">Semua Bulan</option>
                  <option value="01">Januari</option>
                  <option value="02">Februari</option>
                  <option value="03">Maret</option>
                  <option value="04">April</option>
                  <option value="05">Mei</option>
                  <option value="06">Juni</option>
                  <option value="07">Juli</option>
                  <option value="08">Agustus</option>
                  <option value="09">September</option>
                  <option value="10">Oktober</option>
                  <option value="11">November</option>
                  <option value="12">Desember</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>

              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-11 w-full min-w-36 appearance-none rounded-lg border bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Semua Status</option>
                  {tabs.slice(1).map((tab) => (
                    <option key={tab.value} value={tab.value}>
                      {tab.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>

              <Button
                variant="outline"
                className="h-11"
                onClick={() => {
                  setSearch("");
                  setSelectedMonth("all");
                  setSelectedStatus("all");
                  setActiveTab("Total");
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* RESULT INFO */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Menampilkan{" "}
              <strong className="text-foreground">{filteredData.length}</strong>{" "}
              data dummy
            </span>
            <span className="hidden sm:inline">
              Data terakhir diperbarui: 23 November 2026
            </span>
          </div>

          {/* RESPONSIVE TABLE */}
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-262.5 border-collapse text-sm">
              <thead>
                <tr className="bg-muted/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-4">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => setSortAsc(!sortAsc)}
                    >
                      ID <ArrowUpDown className="size-3.5" />
                    </button>
                  </th>
                  <th className="px-4 py-4">Judul Pengajuan</th>
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">Pengaju</th>
                  <th className="px-4 py-4">Jenis Belanja</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Update Terakhir</th>
                  <th className="px-4 py-4">No SPM / SP2D</th>
                  <th className="px-4 py-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="whitespace-nowrap px-4 py-5 font-mono text-xs font-medium text-muted-foreground">
                        {item.id}
                      </td>
                      <td className="max-w-64 px-4 py-5">
                        <p className="font-semibold leading-relaxed text-foreground">
                          {item.judul}
                        </p>
                      </td>
                      <td className="px-4 py-5">
                        <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700">
                          {item.user}
                        </span>
                      </td>
                      <td className="max-w-48 px-4 py-5 text-sm leading-relaxed">
                        {item.pengaju}
                      </td>
                      <td className="px-4 py-5">
                        <div className="space-y-1">
                          <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                            {item.jenis}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {item.kategori}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle[item.status]}`}
                        >
                          <span className="size-1.5 rounded-full bg-current" />
                          {item.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 font-mono text-xs text-muted-foreground">
                        {item.tanggal}
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-center text-muted-foreground">
                        {item.nomor}
                      </td>
                      <td className="px-4 py-5 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 rounded-lg text-muted-foreground hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => setSelectedSpj(item)}
                          aria-label={`Lihat ${item.id}`}
                        >
                          <Eye className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Search className="size-8 opacity-40" />
                        <p className="font-medium">
                          Data pengajuan tidak ditemukan
                        </p>
                        <p className="text-xs">
                          Coba ubah kata kunci atau filter pencarian.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* DETAIL MODAL */}
      {selectedSpj && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setSelectedSpj(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h3 className="text-lg font-bold">Detail Pengajuan SPJ</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Informasi pengajuan surat pertanggungjawaban
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedSpj(null)}
              >
                <X className="size-5" />
              </Button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">ID Pengajuan</p>
                <p className="mt-1 font-mono font-semibold">{selectedSpj.id}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Judul Pengajuan</p>
                <p className="mt-1 text-sm font-semibold leading-relaxed">
                  {selectedSpj.judul}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Unit/Fungsi</p>
                  <p className="mt-1 text-sm font-medium">{selectedSpj.user}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pengaju</p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedSpj.pengaju}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Jenis Belanja</p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedSpj.jenis}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Nomor SPM/SP2D
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedSpj.nomor}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="mb-2 text-xs text-muted-foreground">
                  Status Pengajuan
                </p>
                <span
                  className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle[selectedSpj.status]}`}
                >
                  {selectedSpj.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end border-t bg-muted/20 p-4">
              <Button onClick={() => setSelectedSpj(null)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
