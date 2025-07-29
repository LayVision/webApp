const cloudinary = require('cloudinary').v2;

exports.handler = async function (event, context) {
  // --- [TESTING] เราจะลองใส่ค่า cloud_name เข้าไปโดยตรง ---
  const hardcodedCloudName = "dgqb5fbdh";

  const cloudinaryConfig = {
    cloud_name: hardcodedCloudName, // ใช้ค่าที่ใส่โดยตรง
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { file } = JSON.parse(event.body);
    
    // อัปโหลดไฟล์ไปยัง Cloudinary โดยส่ง Config เข้าไปด้วยโดยตรง
    const result = await cloudinary.uploader.upload(file, {
      ...cloudinaryConfig,
      upload_preset: 'chaoyouhome_preset',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ secure_url: result.secure_url }),
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server error: ${error.message}` }),
    };
  }
};