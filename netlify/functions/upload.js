const cloudinary = require('cloudinary').v2;

exports.handler = async function (event, context) {
  // --- Start Debugging ---
  // บันทึก Log เพื่อตรวจสอบว่า Function อ่านค่า Environment Variables มาได้หรือไม่
  // คุณสามารถดู Log นี้ได้ในหน้าเว็บ Netlify
  console.log("Cloud Name from env:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("API Key from env:", process.env.CLOUDINARY_API_KEY ? "Loaded" : "MISSING");
  console.log("API Secret from env:", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "MISSING");
  // --- End Debugging ---

  // ตั้งค่า Cloudinary ภายใน handler เพื่อความแน่นอน
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

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
    // บันทึก Log error ที่เกิดขึ้นฝั่งเซิร์ฟเวอร์
    console.error("Cloudinary Upload Error:", error);
    
    // ส่งข้อความ error กลับไปให้หน้าเว็บ
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server error: ${error.message}` }),
    };
  }
};
