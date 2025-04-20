import express from "express";
import { sendNotification } from "./firebaseAdmin"; // Import hàm gửi thông báo

const app = express();
const PORT = process.env.PORT || 5001; // Cổng mà server sẽ chạy

app.use(express.json()); // Để xử lý JSON từ client

// Route để nhận token và gửi thông báo
app.post("/save-token", (req, res) => {
  const { token } = req.body;  // Nhận token từ client
  console.log("Token người dùng đã nhận:", token);

  // Giả sử số bước người dùng đạt được
  const userSteps = 10500;
  const goal = 10000;

  if (userSteps >= goal) {
    // Gửi thông báo khi đạt mục tiêu
    sendNotification(
      token,  // Thay token của người dùng vào đây
      "Chúc mừng!",
      `Bạn đã đạt được mục tiêu ${goal} bước hôm nay! Tiếp tục đi nhé!`
    );
  } else {
    // Gửi thông báo nhắc nhở khi chưa đạt mục tiêu
    sendNotification(
      token,  // Thay token của người dùng vào đây
      "Nhắc nhở!",
      `Hôm nay bạn đã đi ${userSteps} bước. Cố gắng thêm chút nữa để đạt mục tiêu ${goal} bước nhé!`
    );
  }

  res.status(200).send("Token đã được lưu và thông báo đã gửi!");
});

// Lắng nghe trên cổng
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
