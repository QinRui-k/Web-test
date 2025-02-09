from flask import Flask, request, jsonify
from flask_cors import CORS  # 启用跨域支持
import os

app = Flask(__name__)
CORS(app)  # 启用跨域支持

# 配置上传文件的保存目录
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 设置最大文件大小为100MB

# 如果上传目录不存在，则创建目录
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# 允许上传的视频文件扩展名
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'flv', 'webm'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/process_data', methods=['POST'])
def process_data():
    # 获取文本数据：年龄、体重、身高
    age = request.form.get('age')
    weight = request.form.get('weight')
    height = request.form.get('height')
    
    # 验证数据是否完整
    if not age or not weight or not height:
        return jsonify({'error': '请提供完整的年龄、体重和身高信息'}), 400

    # 获取上传的视频文件
    if 'video' not in request.files:
        return jsonify({'error': '没有上传视频文件'}), 400
    video_file = request.files['video']
    
    if video_file.filename == '':
        return jsonify({'error': '没有选择视频文件'}), 400

    if video_file and allowed_file(video_file.filename):
        filename = video_file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        video_file.save(file_path)
    else:
        return jsonify({'error': '不支持的视频格式'}), 400

    # 计算 BMI
    try:
        bmi = calculate_bmi(float(weight), float(height))
    except Exception as e:
        return jsonify({'error': '计算BMI时出错', 'details': str(e)}), 500

    # 返回结果
    response = {
        "age": age,
        "weight": weight,
        "height": height,
        "bmi": bmi,
        "video_filename": filename,
        "video_path": file_path,
        "message": "数据处理成功"
    }
    return jsonify(response)

def calculate_bmi(weight, height):
    print(weight,height)
    # BMI 计算公式：BMI = 体重(kg) / (身高(m))^2
    height_m = height / 100.0  # 将身高从厘米转换为米
    bmi = weight / (height_m ** 2)
    return round(bmi, 2)

if __name__ == '__main__':
    app.run(debug=True)