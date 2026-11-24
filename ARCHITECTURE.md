# SIMARLIN — Architecture & Development Guidelines

> Dokumen ini merupakan sumber acuan utama (Single Source of Truth) untuk pengembangan SIMARLIN.
>
> Semua developer dan AI Assistant yang terlibat wajib mengikuti keputusan, standar, dan konvensi dalam dokumen ini.

---

# 1. Project Overview

**Nama Project:** SIMARLIN

**Kepanjangan:** Sistem Informasi Manajemen Administrasi dan Layanan Informasi BPS Kabupaten Pangandaran.

SIMARLIN merupakan sistem informasi internal untuk mendukung pengelolaan administrasi, surat-menyurat, kepegawaian, dokumen, operasional, dan layanan informasi di lingkungan BPS Kabupaten Pangandaran.

## Tujuan Pengembangan

- Memiliki struktur kode yang konsisten.
- Memudahkan pemeliharaan dan pengembangan fitur.
- Meminimalkan duplikasi kode.
- Memisahkan tanggung jawab setiap bagian aplikasi.
- Mendukung kolaborasi tiga developer.
- Memudahkan developer baru memahami project.

# 2. Technology Stack

Gunakan teknologi yang sudah ditetapkan dalam project.

| Kategori          | Teknologi          |
| ----------------- | ------------------ |
| Framework         | Next.js App Router |
| Language          | TypeScript         |
| UI                | React              |
| Styling           | Tailwind CSS       |
| Component Library | shadcn/ui          |
| ORM               | Prisma             |
| Database          | PostgreSQL (Neon)  |
| Validation        | Zod                |
| Testing           | Vitest             |
| Version Control   | Git & GitHub       |

**Aturan:** Jangan mengganti teknologi, menambahkan library besar, atau mengubah arsitektur tanpa alasan teknis yang jelas dan persetujuan pemilik project.

# 3. Architecture Pattern

SIMARLIN menggunakan:

**Modular Monolith + Feature-Based Architecture + Layered Architecture.**

Penjelasan:

- Modular Monolith: aplikasi tetap dalam satu codebase dan satu deployment.
- Feature-Based Architecture: kode dikelompokkan berdasarkan fitur atau domain bisnis.
- Layered Architecture: setiap layer mempunyai tanggung jawab yang jelas.

Prinsip arsitektur:

1. Separation of Concerns.
2. Single Responsibility Principle.
3. Don't Repeat Yourself (DRY).
4. Keep It Simple, Stupid (KISS).
5. Type Safety.
6. Maintainability.
7. Reusability.
8. Testability.

Hindari overengineering dan abstraksi yang belum dibutuhkan.

# 4. Project Structure

Struktur direktori acuan:

```text
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── pegawai/
│   │   ├── surat/
│   │   ├── disposisi/
│   │   └── ...
│   ├── api/
│   │   ├── pegawai/
│   │   ├── surat/
│   │   ├── disposisi/
│   │   └── ...
│   ├── layout.tsx
│   └── globals.css
│
├── modules/
│   ├── auth/
│   ├── pegawai/
│   ├── surat/
│   ├── disposisi/
│   ├── dokumen/
│   ├── administrasi/
│   ├── kualitas-data/
│   ├── pengadaan/
│   ├── petugas/
│   ├── rekrutmen/
│   ├── teknis/
│   ├── umum/
│   ├── utilitas/
│   └── dashboard/
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── lib/
│   ├── auth/
│   ├── permissions/
│   ├── prisma/
│   └── utils/
│
├── config/
├── hooks/
├── types/
└── generated/
    └── prisma/
```

Catatan:

- Struktur di atas merupakan acuan, bukan perintah untuk membuat semua folder sekaligus.
- Folder dibuat ketika memang dibutuhkan.
- Pertahankan struktur aktual yang sudah benar.
- Jangan memindahkan file tanpa audit dan alasan yang jelas.

# 5. Module Architecture

Setiap fitur bisnis harus dikelompokkan dalam `src/modules/`.

Contoh standar modul Pegawai:

```text
modules/
└── pegawai/
    ├── components/
    │   ├── pegawai-table.tsx
    │   ├── pegawai-form.tsx
    │   └── pegawai-columns.tsx
    │
    ├── hooks/
    │   └── use-pegawai.ts
    │
    ├── services/
    │   └── pegawai.service.ts
    │
    ├── repositories/
    │   └── pegawai.repository.ts
    │
    ├── schemas/
    │   └── pegawai.schema.ts
    │
    ├── types/
    │   └── pegawai.type.ts
    │
    ├── constants/
    │   └── pegawai.constant.ts
    │
    ├── utils/
    ├── __tests__/
    └── index.ts
```

Tidak semua modul wajib memiliki seluruh folder tersebut.

Buat layer berdasarkan kebutuhan kompleksitas fitur.

## Tanggung Jawab Setiap Layer

### Components

- Bertanggung jawab terhadap UI.
- Menggunakan komponen shadcn/ui.
- Tidak mengakses database secara langsung.
- Tidak menampung business logic yang kompleks.

### Hooks

- Mengelola state React.
- Mengelola interaksi pengguna.
- Menghubungkan UI dengan sumber data.
- Tidak mengakses Prisma secara langsung.

### Services

- Menampung business logic.
- Mengatur proses bisnis.
- Mengorkestrasi operasi repository.
- Tidak bergantung pada React Component.

### Repositories

- Menangani query database.
- Menjadi lapisan akses Prisma.
- Mengelola operasi CRUD dan query kompleks.
- Tidak menampung business logic bisnis.

### Schemas

- Menggunakan Zod untuk validasi.
- Menentukan aturan input.
- Digunakan untuk validasi server dan kebutuhan frontend.

### Types

- Menyimpan tipe data khusus modul.
- Menghindari penggunaan `any`.
- Menggunakan tipe yang sesuai dengan kebutuhan aplikasi.

### Constants

- Menyimpan nilai konstan modul.
- Menghindari hardcoded value berulang.

### Utils

- Menyimpan helper khusus modul.
- Fungsi harus memiliki tanggung jawab jelas.

# 6. Application Layer

Direktori `src/app/` digunakan untuk routing dan komposisi aplikasi.

## Dashboard Pages

- Menggunakan Next.js App Router.
- Mengambil komponen dari modul terkait.
- Tidak menampung business logic kompleks.
- Menjaga page tetap sederhana.

## API Route Handlers

Tanggung jawab:

1. Menerima HTTP request.
2. Memeriksa autentikasi.
3. Memeriksa otorisasi.
4. Memvalidasi request.
5. Memanggil service.
6. Mengembalikan HTTP response.

Jangan meletakkan seluruh business logic dalam route handler.

## Data Flow

Untuk operasi melalui API:

```text
Client Component
       ↓
Custom Hook
       ↓
API Route Handler
       ↓
Authentication & Authorization
       ↓
Zod Validation
       ↓
Service
       ↓
Repository
       ↓
Prisma
       ↓
PostgreSQL
```

Catatan:

Tidak semua operasi harus melalui API Route Handler. Server Components dan Server Actions dapat digunakan jika lebih sesuai dengan kebutuhan Next.js.

Jangan memaksakan seluruh operasi melewati layer yang tidak diperlukan.

# 7. Database & Prisma

- Prisma menjadi ORM utama.
- Database menggunakan PostgreSQL Neon.
- Query database dilakukan di server.
- Jangan mengakses Prisma dari Client Component.
- Schema database harus dikoordinasikan antaranggota.
- Perubahan migration harus diperiksa sebelum digabungkan.
- Jangan mengedit file hasil generate Prisma secara manual.

Perhatikan kompatibilitas Prisma dengan konfigurasi project yang sudah ada.

# 8. Naming Convention

Gunakan konvensi berikut:

| Elemen     | Konvensi         | Contoh                  |
| ---------- | ---------------- | ----------------------- |
| Folder     | kebab-case       | `pegawai/`              |
| Component  | kebab-case       | `pegawai-table.tsx`     |
| Hook       | use-kebab-case   | `use-pegawai.ts`        |
| Service    | kebab-case       | `pegawai.service.ts`    |
| Repository | kebab-case       | `pegawai.repository.ts` |
| Schema     | kebab-case       | `pegawai.schema.ts`     |
| Function   | camelCase        | `getPegawai()`          |
| Variable   | camelCase        | `pegawaiList`           |
| Type       | PascalCase       | `PegawaiResponse`       |
| Interface  | PascalCase       | `Pegawai`               |
| Constant   | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE`     |

# 9. Coding Standards

Semua kode wajib mengikuti aturan berikut:

- Menggunakan TypeScript.
- Mengutamakan type safety.
- Menghindari `any`.
- Menggunakan single responsibility.
- Menghindari duplikasi kode.
- Membuat komponen reusable jika memang dibutuhkan.
- Menghindari komponen dengan terlalu banyak tanggung jawab.
- Memisahkan UI dan business logic.
- Menggunakan async/await secara konsisten.
- Menangani error secara terstruktur.
- Menggunakan server-side validation.
- Tidak menampilkan informasi sensitif dalam error response.

Untuk penulisan kode:

- Tanpa titik koma.
- Menggunakan single quotes.
- Menggunakan trailing comma jika sesuai sintaks.
- Gunakan nama variabel dan fungsi yang deskriptif.
- Hindari komentar yang hanya mengulang isi kode.

# 10. UI/UX Standards

SIMARLIN menggunakan:

- Tailwind CSS.
- shadcn/ui.
- Desain dashboard profesional.
- Konsistensi komponen antarhalaman.
- Responsive layout.
- Reusable components.

Ketentuan:

1. Gunakan komponen UI yang sudah tersedia sebelum membuat komponen baru.
2. Komponen reusable lintas modul ditempatkan di `components/shared/`.
3. Komponen shadcn/ui ditempatkan di `components/ui/`.
4. Komponen khusus fitur ditempatkan di modul terkait.
5. Hindari duplikasi tabel, dialog, form, dan komponen umum.
6. Pertahankan konsistensi desain seluruh dashboard.

# 11. Testing Standards

Gunakan Vitest.

Jenis pengujian:

- Unit testing: business logic, service, dan utility.
- Integration testing: API dan interaksi database.
- Validation testing: schema Zod.
- Component testing jika dibutuhkan.

Ketentuan:

- Fitur penting harus memiliki test.
- Jangan mengandalkan pengujian manual saja.
- Gunakan database testing terpisah.
- Jangan menjalankan test yang berpotensi mengubah database production.

# 12. Security Standards

- Autentikasi wajib diperiksa di server.
- Otorisasi harus dilakukan berdasarkan permission.
- Validasi input dilakukan di server.
- Password harus di-hash dengan algoritma yang sesuai.
- Gunakan HttpOnly Cookie untuk session jika menggunakan pendekatan cookie-based authentication.
- Jangan menyimpan secret dalam repository.
- Jangan mengekspos informasi sensitif melalui API.
- Batasi akses berdasarkan role dan permission.
- Jangan mempercayai validasi frontend sebagai satu-satunya perlindungan.

# 13. Git Workflow

Project dikembangkan oleh tiga developer menggunakan GitHub.

Branch strategy:

```text
main
  │
  └── develop
        ├── feature/auth
        ├── feature/pegawai
        ├── feature/surat
        └── feature/nama-fitur
```

## Branch Rules

- `main`: kode stabil dan siap dirilis.
- `develop`: integrasi fitur seluruh developer.
- `feature/*`: pekerjaan masing-masing developer.

## Workflow

1. Sinkronisasi dengan `develop`.
2. Buat branch fitur.
3. Kerjakan fitur.
4. Jalankan testing.
5. Commit perubahan.
6. Push ke GitHub.
7. Buat Pull Request menuju `develop`.
8. Lakukan code review.
9. Owner melakukan merge.
10. Testing integrasi.

Merge dari `develop` ke `main` dilakukan setelah seluruh fitur diuji.

## Commit Convention

Gunakan Conventional Commits:

```text
feat: menambahkan fitur
fix: memperbaiki bug
refactor: merapikan struktur kode
style: perubahan formatting
test: menambahkan pengujian
docs: memperbarui dokumentasi
chore: konfigurasi dan maintenance
```

Contoh:

```text
feat(pegawai): add employee CRUD
fix(surat): fix surat validation
refactor(disposisi): separate business logic
test(pegawai): add integration tests
```

## Team Responsibilities

- Repository Owner: mengelola repository, integrasi, review, dan merge.
- Developer 2: mengembangkan fitur sesuai pembagian tugas.
- Developer 3: mengembangkan fitur sesuai pembagian tugas.

Hanya repository owner yang berhak melakukan merge ke `develop` dan `main`, sesuai konfigurasi permission dan branch protection GitHub.

# 14. AI Assistant Instructions

Bagian ini WAJIB dipatuhi oleh setiap AI Assistant yang membantu pengembangan SIMARLIN.

## A. Architecture Compliance

- Jadikan dokumen ini sebagai sumber acuan utama arsitektur.
- Jangan mengubah pola arsitektur tanpa persetujuan.
- Jangan memperkenalkan arsitektur baru secara sepihak.
- Jangan membuat struktur folder yang bertentangan dengan standar ini.
- Pertahankan konsistensi antar-modul.

## B. Before Writing Code

Sebelum mengubah atau membuat kode:

1. Periksa struktur project aktual.
2. Periksa file terkait.
3. Pahami implementasi yang sudah ada.
4. Identifikasi pola yang sedang digunakan.
5. Tentukan layer yang tepat untuk perubahan.
6. Periksa kemungkinan dampak terhadap modul lain.

Jangan berasumsi bahwa implementasi project sama dengan contoh dokumentasi.

## C. When Modifying Existing Code

- Jangan menimpa seluruh file jika hanya sebagian yang perlu diubah.
- Pertahankan kode yang masih relevan.
- Hindari refactoring di luar ruang lingkup permintaan.
- Jangan menghapus fitur yang sudah berjalan tanpa persetujuan.
- Perhatikan kompatibilitas dengan implementasi sebelumnya.
- Jangan membuat duplikasi fungsi atau komponen.

## D. When Creating New Features

- Ikuti struktur modul yang sudah digunakan.
- Pisahkan UI, business logic, dan database access.
- Gunakan schema Zod untuk validasi.
- Gunakan repository jika akses database membutuhkan pemisahan layer.
- Gunakan service untuk business logic.
- Tambahkan testing sesuai kompleksitas fitur.
- Gunakan komponen UI yang sudah tersedia.

## E. Code Review

Ketika melakukan review:

- Periksa separation of concerns.
- Periksa duplikasi kode.
- Periksa type safety.
- Periksa validasi input.
- Periksa error handling.
- Periksa keamanan akses.
- Periksa dampak perubahan terhadap modul lain.
- Periksa konsistensi naming dan struktur.

## F. Communication Rules

- Gunakan Bahasa Indonesia.
- Berikan penjelasan teknis, jelas, dan langsung ke inti.
- Jangan melebar dari pertanyaan.
- Berikan langkah secara bertahap.
- Jangan mengubah banyak bagian sekaligus tanpa persetujuan.
- Jelaskan alasan teknis sebelum menyarankan perubahan arsitektur.
- Jangan mengklaim sudah mengubah file jika belum benar-benar melakukannya.

## G. Important Restrictions

AI Assistant DILARANG:

1. Mengganti stack teknologi tanpa persetujuan.
2. Membuat microservices tanpa kebutuhan yang jelas.
3. Membuat abstraksi berlebihan.
4. Mengakses Prisma langsung dari UI.
5. Menempatkan business logic kompleks di route handler.
6. Menggabungkan semua logic dalam satu file.
7. Mengubah struktur project secara massal tanpa audit.
8. Membuat file atau folder hanya demi memenuhi struktur.
9. Mengubah database schema tanpa mempertimbangkan migration dan dampaknya.
10. Mengabaikan implementasi aktual project.

# 15. Development Decision Rules

Jika terdapat beberapa pendekatan teknis:

1. Prioritaskan solusi yang paling sederhana.
2. Pilih solusi yang konsisten dengan arsitektur.
3. Pertimbangkan kemudahan maintenance.
4. Pertimbangkan kemampuan tiga developer dalam memelihara kode.
5. Hindari dependency tambahan jika tidak diperlukan.
6. Jelaskan trade-off jika ada beberapa pilihan yang layak.

Jangan mengubah keputusan arsitektur hanya karena ada pendekatan lain yang sedang populer.

---

# Final Principle

**SIMARLIN dikembangkan dengan mengutamakan maintainability, consistency, scalability, security, dan simplicity.**

Setiap perubahan harus menjaga kualitas arsitektur secara keseluruhan, bukan hanya membuat satu fitur berjalan.

Dokumen ini menjadi acuan bersama seluruh developer dan AI Assistant selama pengembangan SIMARLIN.

Jika terdapat perubahan keputusan arsitektur, dokumentasikan revisinya di file ini agar semua anggota tim menggunakan standar yang sama.
