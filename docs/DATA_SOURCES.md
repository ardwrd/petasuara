# Sumber dan metodologi data

## Pilpres 2024
- Otoritas: Komisi Pemilihan Umum (KPU), Keputusan Nomor 360 Tahun 2024, Lampiran I (suara sah).
- Transkripsi tingkat provinsi: [Zonautara](https://zonautara.com/dataset/sebaran-suara-pilpres-2024-di-semua-provinsi/) (diolah 22 Maret 2024).
- Pemeriksaan silang nasional dan 38 provinsi: [Election.org, data Annex I KPU](https://election.org/country/indonesia/elections/2024/president).
- Pemilih luar negeri dipisahkan dari 38 provinsi, agar jumlah suara sah nasional cocok. Rumus: jumlah nasional = jumlah 38 provinsi + suara luar negeri.
- Angka menyatakan **suara sah kandidat**, bukan jumlah pemilih terdaftar atau tingkat partisipasi.
- Jenis pemilihan atau periode lain tidak boleh diberi nilai sintetis.

## Peta provinsi
- Sumber geometri: [denyherianto/indonesia-geojson-topojson-maps-with-38-provinces](https://github.com/denyherianto/indonesia-geojson-topojson-maps-with-38-provinces), berlisensi [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Atribusi: “Indonesia GeoJSON & TopoJSON Maps (38 Provinces)” oleh denyherianto, digunakan tanpa perubahan geometri (format JSON dipadatkan).
- **Catatan penting:** kode `KODE_PROV` tidak unik di sejumlah provinsi Papua pada dataset asal. Join data **menggunakan `PROVINSI`**, bukan kode tersebut.
- Geometri untuk eksplorasi data; bukan rujukan penetapan batas administratif atau yurisdiksi.

## Memperbarui dataset
1. Lacak nomor dan versi dokumen keputusan KPU.
2. Catat format, tanggal ekstraksi, dan perubahan angka.
3. Jalankan `npm test` untuk pemeriksaan 38 nama provinsi dan rekonsiliasi hasil nasional.
4. Periksa kembali ke dokumen sumber sebelum menggabungkan PR.
