"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Filter,
  Search,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";

const activities = [
  "Honor petugas pendataan lapangan Survei Harga Konsumen (HK 2.1 pasar)",
  "Honor petugas pendataan survei SKTNP Barang",
  "honor petugas pendataan lapangan survei tahunan usaha penggalian bahan industri dan konstruksi",
  "Honor petugas pengolahan Survei Harga Kemahalan Konstruksi",
  "Honor petugas pendataan lapangan Survei Harga Konsumen (HK 2.2 pasar)",
  "Honor petugas pendataan lapangan Survei Harga Konsumen (HK 2.2 outlet)",
  "honor petugas pendataan lapangan survei kesejahteraan petani (skp)",
  "honor petugas pendataan lapangan SKJG",
];

const honorData = [
  {
    id: 1,
    bulan: "Oktober",
    tahun: "2026",
    nama: "Ade Firmansyah",
    bank: "BNI",
    rekening: "••••••0623",
    kegiatan: activities[0],
  },
];

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function Page() {
  const [searchName, setSearchName] = useState("");
  const [searchActivity, setSearchActivity] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("Oktober");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const filteredActivities = activities.filter((activity) =>
    activity.toLowerCase().includes(searchActivity.toLowerCase()),
  );

  const filteredData = useMemo(() => {
    return honorData.filter((item) => {
      const matchName = item.nama
        .toLowerCase()
        .includes(searchName.toLowerCase());

      const matchMonth = item.bulan === selectedMonth;
      const matchYear = item.tahun === selectedYear;

      const matchActivity =
        selectedActivities.length === 0 ||
        selectedActivities.includes(item.kegiatan);

      return matchName && matchMonth && matchYear && matchActivity;
    });
  }, [searchName, selectedMonth, selectedYear, selectedActivities]);

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((item) => item !== activity)
        : [...prev, activity],
    );
  };

  const resetFilters = () => {
    setSearchName("");
    setSearchActivity("");
    setSelectedMonth("Oktober");
    setSelectedYear("2026");
    setSelectedActivities([]);
  };

  return (
    <main className="min-h-full bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Informasi Akses Terbatas */}
        <section className="flex gap-4 border border-amber-200 bg-amber-50 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <AlertTriangle size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-amber-900">
              Informasi Akses Terbatas
            </h2>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              Anda login sebagai <strong>Tamu Jauh</strong>. Akses fitur
              spreadsheet/download excel hanya tersedia untuk role Pejabat
              Pembuat Komitmen, Bendahara, atau Pejabat Pengadaan.
            </p>
          </div>
        </section>

        {/* Filter Data */}
        <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#163A5F]">
              <Filter size={22} />
            </div>

            <h2 className="text-xl font-bold text-[#163A5F] sm:text-2xl">
              Filter Data
            </h2>
          </div>

          {/* Filter Utama */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {/* Search Nama */}
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Cari Nama Petugas..."
                className="h-12 w-full border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#163A5F] focus:ring-2 focus:ring-[#163A5F]/10"
              />
            </div>

            {/* Filter Bulan */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="h-12 w-full appearance-none border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#163A5F] focus:ring-2 focus:ring-[#163A5F]/10"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* Filter Tahun */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="h-12 w-full appearance-none border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#163A5F] focus:ring-2 focus:ring-[#163A5F]/10"
              >
                {["2024", "2025", "2026", "2027"].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className="flex h-12 items-center justify-center gap-2 border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-600 transition hover:border-[#163A5F] hover:bg-blue-50 hover:text-[#163A5F]"
            >
              <RotateCcw size={16} />
              Reset Semua
            </button>
          </div>

          {/* Filter Kegiatan */}
          <div className="my-6 border-t border-slate-100" />

          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Pilih Kegiatan yang Ditampilkan:
            </label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchActivity}
                onChange={(e) => setSearchActivity(e.target.value)}
                placeholder="Cari kegiatan..."
                className="h-12 w-full border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#163A5F] focus:ring-2 focus:ring-[#163A5F]/10"
              />
            </div>

            {/* Activity Chips */}
            <div className="mt-4 flex flex-wrap gap-2.5">
              {filteredActivities.map((activity) => {
                const active = selectedActivities.includes(activity);

                return (
                  <button
                    key={activity}
                    onClick={() => toggleActivity(activity)}
                    className={`rounded-full border px-4 py-2 text-left text-xs font-semibold transition sm:text-sm ${
                      active
                        ? "border-[#163A5F] bg-[#163A5F] text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-[#163A5F] hover:bg-blue-50 hover:text-[#163A5F]"
                    }`}
                  >
                    {activity}
                  </button>
                );
              })}

              {filteredActivities.length === 0 && (
                <p className="text-sm text-slate-400">
                  Kegiatan tidak ditemukan.
                </p>
              )}
            </div>

            {selectedActivities.length > 0 && (
              <p className="mt-3 text-xs text-[#163A5F]">
                {selectedActivities.length} kegiatan dipilih
              </p>
            )}
          </div>
        </section>

        {/* Rekap Honor */}
        <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          {/* Header Rekap */}
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#163A5F]">
                  <BookOpen size={22} />
                </div>

                <h2 className="text-xl font-bold text-[#163A5F] sm:text-2xl">
                  Rekap Honor
                </h2>

                <span className="text-xl font-bold text-[#163A5F] sm:text-2xl">
                  {selectedMonth} {selectedYear}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Data rekap honor bulanan mitra statistik BPS Kab. Majalengka
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Total: 88 petugas
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200">
            <table className="w-full min-w-[750px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-100 text-[#163A5F]">
                  <th className="px-5 py-3 font-bold">No</th>
                  <th className="px-5 py-3 font-bold">Bulan</th>
                  <th className="px-5 py-3 font-bold">Nama Petugas</th>
                  <th className="px-5 py-3 font-bold">Nama Bank</th>
                  <th className="px-5 py-3 font-bold">No Rekening</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="transition hover:bg-blue-50/50">
                    <td className="px-5 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-5 py-4 text-slate-600">{item.bulan}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {item.nama}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{item.bank}</td>
                    <td className="px-5 py-4 font-medium text-slate-600">
                      {item.rekening}
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                          <Search size={22} />
                        </div>
                        <p className="font-semibold text-slate-600">
                          Data tidak ditemukan
                        </p>
                        <p className="text-xs text-slate-400">
                          Silakan ubah filter pencarian Anda.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-4 flex flex-col justify-between gap-2 text-xs text-slate-400 sm:flex-row sm:items-center">
            <p>Menampilkan {filteredData.length} data pada tampilan contoh</p>
            <p>Data dikelola melalui sistem administrasi BPS.</p>
          </div>
        </section>

        {/* Information Footer */}
        <section className="flex gap-4 border border-blue-100 bg-blue-50/60 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#163A5F]">
            <ShieldAlert size={21} />
          </div>
          <div>
            <h3 className="font-semibold text-[#163A5F]">
              Informasi Pengelolaan Data
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Data rekap honor digunakan sebagai informasi administrasi
              pembayaran petugas. Pastikan data yang ditampilkan sesuai dengan
              periode dan kegiatan yang dipilih.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
