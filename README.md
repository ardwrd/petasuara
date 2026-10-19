# PetaSuara

Proyek independen untuk mengeksplorasi hasil Pemilu Indonesia lewat peta sederhana dan responsif.

## Tersedia
- Pilpres 2024: peta interaktif 38 provinsi, perolehan tiga pasangan calon, filter intensitas warna.
- DPR RI 2024: perolehan suara sah 18 partai **tingkat nasional** (KPU 1204/2024). Karena data suara partai per provinsi belum dimuat, peta DPR ditampilkan netral.
- Dukungan keyboard, mobile, dan lisensi open source.

## Mulai
Persyaratan Node.js 20+.

    npm install
    npm run dev
    npm test
    npm run build

## Deploy ke GitHub Pages
Workflow deploy membangun aplikasi saat perubahan masuk ke `main`. Pengaturan yang direkomendasikan: **Settings → Pages → Source → GitHub Actions**.
Alamat target: https://ardwrd.github.io/petasuara/

Aplikasi juga dapat berjalan jika Pages masih dalam mode **Deploy from a branch** (`main`/`root`):
- `index.html` memuat CSS melalui path relatif `./src/styles.css`.
- Import map menyediakan dependensi ES modules untuk situs statis tanpa bundler.
- Dataset dibaca langsung dari `/data/` dengan path relatif.
- Dalam mode GitHub Actions, Vite membundel JavaScript/CSS dan menyalin JSON ke `dist/data/`.

Pilih satu mode deploy saja dalam pengaturan Pages untuk menghindari saling menimpa deployment.


## Sumber
- Pilpres: KPU 360/2024; [transkripsi Zonautara](https://zonautara.com/dataset/sebaran-suara-pilpres-2024-di-semua-provinsi/).
- DPR RI: [KPU 1204/2024](https://jdih.kpu.go.id/data/data_kepkpu/2024kpt1204.pdf).
- Peta: [Indonesia GeoJSON & TopoJSON Maps 38 Provinces (denyherianto)](https://github.com/denyherianto/indonesia-geojson-topojson-maps-with-38-provinces), **CC BY 4.0**.
- Penjelasan lengkap: [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md).

Kode berlisensi MIT, geometri peta mengikuti lisensi CC BY 4.0.
