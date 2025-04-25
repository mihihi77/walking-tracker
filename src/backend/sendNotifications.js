const express = require('express');
const admin = require('firebase-admin');

// Tạo server express
const app = express();
const port = 3000;

// Thêm Firebase Admin SDK credentials
const serviceAccount = require('./credentials/walking-tracker-a6a38-firebase-adminsdk-fbsvc-c3a3d1d62e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// API gửi thông báo
app.get('/send-notification', (req, res) => {
  const registrationToken = req.query.token; // Token của user

  const message = {
    notification: {
      title: 'You have a new activity reminder!',
      body: 'Start your workout today!',
    },
    token: registrationToken,
  };
  
  admin.messaging().send(message)
    .then((response) => {
      res.send('Notification sent successfully: ' + response);
    })
    .catch((error) => {
      res.status(500).send('Error sending message: ' + error);
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
