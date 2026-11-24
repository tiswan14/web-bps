import Link from "next/link";
import {
  FileText,
  ClipboardCheck,
  Download,
  ChartColumnIncreasing,
  Wallet,
  ArrowRight,
  CircleCheck,
} from "lucide-react";

const menus = [
  {
    number: "01",
    step: "1/4",
    title: "Entri Kegiatan",
    description:
      "Input target dan kegiatan yang akan dilaksanakan sesuai dengan rencana kerja dan kebutuhan administrasi.",
    icon: ClipboardCheck,
    href: "/administrasi/spk-bast/entri-kegiatan",
    color: "blue",
  },
  {
    number: "02",
    step: "2/4",
    title: "Download SPK & BAST",
    description:
      "Kelola dan unduh dokumen Surat Perjanjian Kerja serta Berita Acara Serah Terima secara praktis.",
    icon: FileText,
    href: "/administrasi/spk-bast/download",
    color: "emerald",
  },
  {
    number: "03",
    step: "3/4",
    title: "Cek Limit SBML",
    description:
      "Lihat rekapitulasi dan laporan penggunaan Standar Biaya Masukan Lainnya berdasarkan kegiatan.",
    icon: ChartColumnIncreasing,
    href: "/administrasi/spk-bast/limit-sbml",
    color: "amber",
  },
  {
    number: "04",
    step: "4/4",
    title: "SBML Tahunan",
    description:
      "Lihat riwayat dan informasi Standar Biaya Masukan Lainnya (SBML) berdasarkan periode tahunan.",
    icon: Wallet,
    href: "/administrasi/spk-bast/sbml-tahunan",
    color: "pink",
  },
];

const colorStyles = {
  blue: {
    border: "border-blue-200",
    iconBg: "bg-blue-50",
    icon: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
    decoration: "bg-blue-100",
  },
  emerald: {
    border: "border-emerald-200",
    iconBg: "bg-emerald-50",
    icon: "text-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
    decoration: "bg-emerald-100",
  },
  amber: {
    border: "border-amber-200",
    iconBg: "bg-amber-50",
    icon: "text-amber-600",
    button: "bg-amber-600 hover:bg-amber-700",
    decoration: "bg-amber-100",
  },
  pink: {
    border: "border-pink-200",
    iconBg: "bg-pink-50",
    icon: "text-pink-600",
    button: "bg-pink-600 hover:bg-pink-700",
    decoration: "bg-pink-100",
  },
};

export default function SpkBastPage() {
  return (
    <main className="min-h-full bg-slate-50/70 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-14 flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-[#163A5F]">
            <FileText size={32} strokeWidth={1.8} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#163A5F] sm:text-4xl">
            SPK dan BAST
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Kelola Surat Perjanjian Kerja (SPK) dan Berita Acara Serah Terima
            (BAST) melalui sistem administrasi yang terintegrasi, terstruktur,
            dan efisien.
          </p>
        </section>

        {/* Menu Cards */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const styles = colorStyles[menu.color as keyof typeof colorStyles];

            return (
              <article
                key={menu.number}
                className={`group relative flex flex-col overflow-hidden border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${styles.border}`}
              >
                {/* Decorative Circle */}
                <div
                  className={`absolute -right-7 -top-7 h-24 w-24 rounded-full opacity-70 ${styles.decoration}`}
                />

                <div className="relative mb-7 flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-sm ${styles.iconBg} ${styles.icon}`}
                  >
                    <Icon size={27} strokeWidth={1.9} />
                  </div>

                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                    {menu.step}
                  </span>
                </div>

                <div className="relative flex flex-1 flex-col">
                  <h2 className="text-lg font-bold tracking-tight text-slate-800">
                    {menu.title}
                  </h2>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
                    {menu.description}
                  </p>

                  <Link
                    href={menu.href}
                    className={`mt-6 flex w-full items-center justify-center gap-3 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors ${styles.button}`}
                  >
                    Buka Menu
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        {/* Information Panel */}
        <section className="mt-16 border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#163A5F]">
              <CircleCheck size={30} strokeWidth={1.8} />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-800">
                Sistem Terintegrasi SPK & BAST
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                Kelola seluruh proses administrasi kontrak kerja, mulai dari
                pencatatan kegiatan, pengelolaan dokumen Surat Perjanjian Kerja,
                hingga proses Berita Acara Serah Terima dalam satu platform.
                Dilengkapi dengan informasi dan rekapitulasi Standar Biaya
                Masukan Lainnya (SBML) untuk membantu proses monitoring,
                evaluasi, serta pengelolaan administrasi yang lebih terstruktur
                dan akuntabel.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
