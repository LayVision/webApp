const axios = require('axios');
const FormData = require('form-data');

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // รับ base64 string จากหน้าเว็บ และตัดส่วนหัว "data:image/..." ออก
    const base64File = JSON.parse(event.body).file.split(',')[1];

    const formData = new FormData();
    formData.append('image', base64File);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      formData,
      { headers: formData.getHeaders() }
    );

    if (response.data.success) {
      return {
        statusCode: 200,
        body: JSON.stringify({ secure_url: response.data.data.url }),
      };
    } else {
      throw new Error(response.data.error.message || 'ImgBB upload failed');
    }

  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server error: ${error.message}` }),
    };
  }
};