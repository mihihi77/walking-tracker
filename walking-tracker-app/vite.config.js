import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Địa chỉ host mà ứng dụng sẽ chạy
    port: 5173, // Cổng mà ứng dụng sẽ chạy
    cors: true, // Cho phép CORS (Cross-Origin Resource Sharing)
    strictPort: true, // Nếu cổng đã được sử dụng, sẽ không tự động tìm cổng khác
    allowedHosts: [ 'all',
      'localhost', // Cho phép localhost
      '288f-42-113-114-115.ngrok-free.app',
      "3019-2405-4802-a5d0-3c90-e0e4-dced-c5b5-da25.ngrok-free.app"
    ], // Cho phép tất cả các host
    open: true, // Mở trình duyệt khi ứng dụng bắt đầu

  },
})
