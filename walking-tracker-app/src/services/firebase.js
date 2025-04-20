import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDZnesSHIfrXgvNtzjJDZKgseu_LEvB3io",
  authDomain: "walking-tracker-a6a38.firebaseapp.com",
  projectId: "walking-tracker-a6a38",
  storageBucket: "walking-tracker-a6a38.firebasestorage.app",
  messagingSenderId: "362493366243",
  appId: "1:362493366243:web:4c43963222fbba7d9d5ad6"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Cloud Messaging
const messaging = getMessaging(app);

// Hàm yêu cầu quyền nhận thông báo
export const requestPermission = async (userSteps, goal, rank) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey: "YOUR_PUBLIC_VAPID_KEY" });
      console.log("FCM Token:", token);
      if (token) {
        // Gửi token và thông tin lên server
        await sendTokenToServer(token, userSteps, goal, rank);
      }
      return token;
    } else {
      console.log("Người dùng từ chối nhận thông báo.");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy FCM Token:", error);
    return null;
  }
};

// Hàm gửi token và thông tin lên server
const sendTokenToServer = async (token, userSteps, goal, rank) => {
  try {
    await fetch("http://localhost:5001/save-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, userSteps, goal, rank }),  // Gửi token, số bước, mục tiêu, bảng xếp hạng lên server
    });
    console.log("Token và thông tin đã được gửi lên server thành công!");
  } catch (error) {
    console.error("Lỗi khi gửi token lên server:", error);
  }
};

// Lắng nghe thông báo khi ứng dụng đang mở
onMessage(messaging, (payload) => {
  console.log("Thông báo nhận được:", payload);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("✅ Service Worker đăng ký thành công:", registration);
    })
    .catch((error) => {
      console.error("❌ Service Worker đăng ký thất bại:", error);
    });
}
