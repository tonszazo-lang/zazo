from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import os
import openai
from werkzeug.utils import secure_filename

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

DB_PATH = "rqqa_app.db"
UPLOAD_FOLDER = "static/videos"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ✅ مفتاح OpenAI
OPENAI_KEY = "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"
openai.api_key = OPENAI_KEY

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    section TEXT,
                    content TEXT
                 )''')
    c.execute('''CREATE TABLE IF NOT EXISTS videos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    section TEXT,
                    filename TEXT
                 )''')
    conn.commit()
    conn.close()

def generate_text(prompt, max_tokens=300):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role":"user","content":prompt}],
            max_tokens=max_tokens,
            temperature=0.7
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"خطأ في توليد النص: {str(e)}"

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/api/ai/generate', methods=['POST'])
def ai_generate():
    data = request.get_json()
    section = data.get('section','mashaer')
    prompt = f"اكتبي منشورًا قصيرًا وجميلاً للقسم {section} باللغة العربية، نص فقط"
    text = generate_text(prompt)
    return jsonify({"text": text})

@app.route('/api/add_post', methods=['POST'])
def add_post():
    data = request.get_json()
    section = data.get('section','mashaer')
    content = data.get('content','')
    if not content: return jsonify({"status":"error","message":"نص فارغ"}),400
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO posts (section, content) VALUES (?,?)",(section,content))
    conn.commit()
    conn.close()
    return jsonify({"status":"success","message":"تم إضافة المنشور"})

@app.route('/api/get_posts', methods=['POST'])
def get_posts():
    data = request.get_json()
    section = data.get('section','mashaer')
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT content FROM posts WHERE section=? ORDER BY id DESC",(section,))
    posts = [{"text": r[0]} for r in c.fetchall()]
    conn.close()
    return jsonify({"posts": posts})

@app.route('/api/upload_video', methods=['POST'])
def upload_video():
    section = request.form.get('section','mashaer')
    if 'file' not in request.files:
        return jsonify({"status":"error","message":"لا يوجد ملف"}),400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"status":"error","message":"اسم الملف فارغ"}),400
    filename = secure_filename(file.filename)
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO videos (section, filename) VALUES (?,?)",(section,filename))
    conn.commit()
    conn.close()
    return jsonify({"status":"success","message":"تم رفع الفيديو", "url": f"/static/videos/{filename}"})

@app.route('/api/get_videos', methods=['POST'])
def get_videos():
    data = request.get_json()
    section = data.get('section','mashaer')
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT filename FROM videos WHERE section=? ORDER BY id DESC",(section,))
    videos = [{"src": f"/static/videos/{r[0]}"} for r in c.fetchall()]
    conn.close()
    return jsonify({"videos": videos})

if __name__ == "__main__":
    init_db()
    app.run(host='0.0.0.0', port=9000, debug=True)
