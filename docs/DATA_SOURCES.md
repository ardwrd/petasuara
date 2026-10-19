# Sumber data dan lisensi

## Pilpres 2024
Sumber resmi: Keputusan KPU 360/2024 Lampiran I. [Transkripsi Zonautara](https://zonautara.com/dataset/sebaran-suara-pilpres-2024-di-semua-provinsi/) dan [pemeriksaan silang Election.org](https://election.org/country/indonesia/elections/2024/president).
38 provinsi + 1 kelompok luar negeri. Data suara sah; bukan partisipasi pemilih.

## DPR RI 2024
[Keputusan KPU 1204 Tahun 2024](https://jdih.kpu.go.id/data/data_kepkpu/2024kpt1204.pdf), Lampiran tertanggal 25 Agustus 2024; [salinan teks](https://pasal.id/peraturan/permen/kepkpu-1204-2024).
Suara sah nasional seluruh 18 partai: **151.793.293**. Angka bisa berbeda dari publikasi revisi lain; seluruh data DPR di sini konsisten dengan KPU 1204/2024.
Belum ada lapisan geografis DPR RI dalam versi ini. Peta DPR tidak mencerminkan hasil wilayah.

## Geometri 38 provinsi
[denyherianto/indonesia-geojson-topojson-maps-with-38-provinces](https://github.com/denyherianto/indonesia-geojson-topojson-maps-with-38-provinces), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Atribusi: “Indonesia GeoJSON & TopoJSON Maps (38 Provinces)” oleh denyherianto; isi geometrinya tidak diubah, hanya dipadatkan.
Kode KODE_PROV dari sumber **tidak unik** untuk beberapa provinsi Papua; join menggunakan nama PROVINSI.

## Validasi
Jalankan `npm test` untuk rekonsiliasi suara, cakupan 38 provinsi dan 18 partai. Hindari mencampur angka keputusan KPU berbeda tanpa catatan versi.
