const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cloudinary = require("cloudinary").v2;

admin.initializeApp();

// ดึงค่า Config ที่เราตั้งไว้อย่างปลอดภัย
const cloudinaryConfig = functions.config().cloudinary;
cloudinary.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret,
});

// สร้าง Function ชื่อ uploadImage ที่เรียกได้จากหน้าเว็บ
exports.uploadImage = functions.https.onCall(async (data, context) => {
  // ตรวจสอบว่าผู้ใช้ล็อกอินแล้ว
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "คุณต้องเข้าสู่ระบบก่อน");
  }

  const imageData = data.file; // รับข้อมูลรูปภาพ (base64) จากหน้าเว็บ

  try {
    // อัปโหลดไปยัง Cloudinary
    const result = await cloudinary.uploader.upload(imageData, {
      upload_preset: "chaoyouhome_preset", // ใช้ Upload Preset ของคุณ
      resource_type: "image",
    });

    // ส่ง URL ที่อัปโหลดสำเร็จกลับไป
    return { secure_url: result.secure_url };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new functions.https.HttpsError("internal", "เกิดข้อผิดพลาดในการอัปโหลด");
  }
});