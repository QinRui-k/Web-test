from flask import Flask, request, jsonify
from flask_cors import CORS  # 导入CORS模块
import base64  # 导入base64模块
import io
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app)  # 启用跨域支持

# 用于处理接收到的图片和数据
@app.route('/process_data', methods=['POST'])
def process_data():
    # 获取前端传来的数据
    age = request.form.get('age')
    weight = request.form.get('weight')
    height = request.form.get('height')
    image_data = request.form.get('image')  # Base64编码的图片数据
    
    # 解析图片
    image_bytes = base64.b64decode(image_data.split(',')[1])  # 去掉前缀 'data:image/jpeg;base64,' 等
    image = Image.open(io.BytesIO(image_bytes))
    
    # 处理数据（例如：计算 BMI）
    bmi = calculate_bmi(float(weight), float(height))
    
    # 假设你有更复杂的处理程序，这里只是一个示例
    # 将图片处理为 numpy 数组或进行其他处理
    image_np = np.array(image)
    
    # 返回数据
    response = {
        "bmi": bmi,
        "image_width": image.width,
        "image_height": image.height,
        "message": "数据处理成功"
    }
    return jsonify(response)

def calculate_bmi(weight, height):
    # BMI 计算公式：BMI = 体重(kg) / 身高(m)^2
    height_m = height / 100  # 将身高从厘米转换为米
    bmi = weight / (height_m ** 2)
    return round(bmi, 2)

if __name__ == '__main__':
    app.run(debug=True)
