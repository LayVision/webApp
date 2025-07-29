const cloudinary = require('cloudinary').v2;

// ตั้งค่า Cloudinary โดยใช้ Environment Variables ที่เราตั้งไว้ในเว็บ Netlify
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async function (event, context) {
  // ตรวจสอบว่ามีข้อมูลส่งมาหรือไม่
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { file } = JSON.parse(event.body);
    
    // อัปโหลดไฟล์ไปยัง Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      upload_preset: 'chaoyouhome_preset', // ใส่ Upload Preset ของคุณ
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ secure_url: result.secure_url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};