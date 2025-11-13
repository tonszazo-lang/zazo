#!/data/data/com.termux/files/usr/bin/bash

# ====== ضبط مفتاح OpenAI ======
export OPENAI_API_KEY="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"

# ====== الانتقال لمجلد المشروع ======
cd ~/zazo

# ====== تشغيل Flask Backend على Port 5000 في الخلفية ======
nohup python server.py > flask.log 2>&1 &

# ====== تشغيل HTML Static Server على Port 9000 في الخلفية ======
cd ~/zazo/www
nohup python -m http.server 9000 > http.log 2>&1 &

echo "🚀 الخوادم تعمل الآن:"
echo "Flask API: http://127.0.0.1:5000"
echo "واجهة التطبيق: http://127.0.0.1:9000"
