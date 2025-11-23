# Scanner App — Expo Router Project

Scanner App adalah aplikasi mobile berbasis Expo + React Native + Expo Router yang digunakan untuk melakukan scan barcode, autentikasi pengguna, dan pengelolaan data sesuai kebutuhan aplikasi. Proyek ini menggunakan file-based routing, Auth Provider global, dan struktur folder modern yang mudah dikembangkan.

## Get started

Fitur Utama
 - Autentikasi
   
   - Login & Register menggunakan API backend.
	- Penyimpanan token & sesi melalui AuthProvider.
	- Redirect otomatis jika pengguna belum login.

 - Barcode Scanner
   - Menggunakan expo-barcode-scanner.
	- Permission handling & real-time scanning.
	- Anti double-scan event.
   
 - Navigasi Modern (Expo Router)
   - Routing berbasis folder.
	- Protected Routes (Auth Guard).
	- Tab Navigation untuk Home, Scanner, dan Profile/Account.
   
 - UI/UX Modern
   - Tema biru clean yang konsisten.
	- Komponen custom (Button, Input, Overlay, dsb).
	- Struktur UI yang mudah dikembangkan.
   
## Learn more

Gimana cara copy codenya?

```bash
git clone <repository-url>
cd Scanner_App
npm install
npx expo start
```
Aplikasi dapat dijalankan melalui:
	•	Expo Go
	•	Android Emulator
	•	iOS Simulator
	•	Development Build
