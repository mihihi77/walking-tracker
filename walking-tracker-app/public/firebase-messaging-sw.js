importScripts("https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDZnesSHIfrXgvNtzjJDZKgseu_LEvB3io",
  authDomain: "walking-tracker-a6a38.firebaseapp.com",
  projectId: "walking-tracker-a6a38",
  storageBucket: "walking-tracker-a6a38.firebasestorage.app",
  messagingSenderId: "362493366243",
  appId: "1:362493366243:web:4c43963222fbba7d9d5ad6"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);

// Lấy đối tượng Firebase Cloud Messaging
const messaging = firebase.messaging();

// Lắng nghe thông báo khi ứng dụng chạy nền
messaging.onBackgroundMessage(function (payload) {
  console.log("Thông báo nền nhận được:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
