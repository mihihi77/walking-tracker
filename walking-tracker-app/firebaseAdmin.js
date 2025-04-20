const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Hàm gửi thông báo
const sendNotification = (token, title, body) => {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,  // token người dùng nhận thông báo
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Thông báo đã được gửi thành công:", response);
    })
    .catch((error) => {
      console.error("Lỗi khi gửi thông báo:", error);
    });
};

// Hàm gửi thông báo khích lệ
const sendEncouragement = (token, userSteps, goal, rank) => {
  const body = `Chúc mừng! Bạn đã đạt được ${userSteps} bước hôm nay và đốt cháy được ${userSteps * 0.04} calo! Bạn đang đứng thứ ${rank} trên bảng xếp hạng! Tiếp tục cố gắng nhé!`;
  sendNotification(token, "Khích lệ từ Walking Tracker!", body);
};

// Hàm gửi thông báo nhắc nhở
const sendReminder = (token, userSteps, goal) => {
  const body = `Hôm nay bạn mới đi ${userSteps} bước. Cố gắng thêm chút nữa để đạt mục tiêu ${goal} bước nhé! Bạn vẫn có thể làm được!`;
  sendNotification(token, "Nhắc nhở từ Walking Tracker", body);
};

module.exports = { sendNotification, sendEncouragement, sendReminder };
