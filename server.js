const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// إعداد التخزين للفيديوهات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'videos', req.body.section);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ملف البيانات JSON
const DATA_FILE = path.join(__dirname, 'posts.json');

// قراءة البيانات
function readData() {
  if (!fs.existsSync(DATA_FILE)) return { posts: [], videos: {} };
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// حفظ البيانات
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// إضافة منشور
app.post('/api/add_post', (req, res) => {
  const { section, content } = req.body;
  const data = readData();
  data.posts.push({ id: Date.now(), section, text: content });
  saveData(data);
  res.json({ status: 'success' });
});

// جلب المنشورات حسب القسم
app.post('/api/get_posts', (req, res) => {
  const { section } = req.body;
  const data = readData();
  const posts = data.posts.filter(p => p.section === section);
  res.json({ posts });
});

// رفع فيديو
app.post('/api/upload_video', upload.single('file'), (req, res) => {
  const section = req.body.section;
  const data = readData();
  if (!data.videos[section]) data.videos[section] = [];
  data.videos[section].push({ src: `/videos/${section}/${req.file.filename}` });
  saveData(data);
  res.json({ status: 'success' });
});

// جلب الفيديوهات حسب القسم
app.post('/api/get_videos', (req, res) => {
  const { section } = req.body;
  const data = readData();
  res.json({ videos: data.videos[section] || [] });
});

// توليد محتوى ذكاء اصطناعي
app.post('/api/ai/generate', async (req, res) => {
  const { section } = req.body;
  try {
    // مثال: استدعاء OpenAI (ضع مفتاحك هنا)
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: "text-davinci-003",
      prompt: `اكتبي منشورًا لطيفًا للنساء لقسم ${section}`,
      max_tokens: 100
    }, {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
    });
    const text = response.data.choices[0].text.trim();
    res.json({ text });
  } catch (e) {
    console.error(e.message);
    res.json({ text: "💖 لم يصل رد من الخادم" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
