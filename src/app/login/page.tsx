import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Masuk | Web BPS Kab. Pangandaran",
};

export default async function LoginPage() {
  if (await getCurrentUser()) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left Section */}
      <section className="hidden md:flex relative isolate flex-col justify-center bg-[url('/images/kantorbps.jpg')] bg-cover bg-center bg-no-repeat px-8 py-16 text-primary-foreground sm:px-12 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#0B2545]/90 via-[#164E83]/80 to-[#0B2545]/60" />
        <div className="mx-auto w-full max-w-lg z-10">
          <img className="h-10 my-4" src="/images/logo.png" alt="" />
          <p className="mb-6 text-sm font-medium tracking-widest text-primary-foreground/60 uppercase">
            Badan Pusat Statistik
          </p>

          <h1 className="text-6xl font-bold tracking-tight sm:text-5xl">
            SIMARLIN
            <span className="mt-2 block text-primary-foreground text-4xl">
              BPS Pangandaran
            </span>
          </h1>

          <div className="mt-8 h-1 w-16 rounded-full bg-primary-foreground" />

          <p className="mt-8 max-w-md text-base leading-relaxed text-primary-foreground sm:text-lg">
            Satu platform digital terintegrasi untuk mendukung pengelolaan
            administrasi, kegiatan, dan layanan informasi BPS Kabupaten
            Pangandaran secara efektif dan efisien.
          </p>

          <p className="mt-16 text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} BPS Kabupaten Pangandaran
          </p>
        </div>
      </section>

      {/* Right Section */}
      <section className="flex items-center justify-center bg-background px-6 py-16 text-foreground sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-3xl text-center font-bold tracking-tight">
              Selamat Datang
            </h2>

            <p className="mt-3 text-base text-center text-foreground">
              Silakan masuk menggunakan akun yang telah terdaftar.
            </p>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
