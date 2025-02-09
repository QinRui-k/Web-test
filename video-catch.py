from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# 启用跨域支持，允许所有域访问 /process_data 路由
CORS(app, resources={r"/process_data": {"origins": "*"}})

@app.route('/process_data', methods=['POST'])
def process_data():
    # 获取前端传来的 JSON 数据
    data = request.json
    age = data.get('age')
    weight = data.get('weight')
    height = data.get('height')

    # 打印接收到的数据
    print(f"Received data: Age={age}, Weight={weight}, Height={height}")
    
    # 验证数据是否完整
    if not age or not weight or not height:
        return jsonify({'error': '请提供完整的年龄、体重和身高信息'}), 400

    # 计算 BMI
    bmi = calculate_bmi(float(weight), float(height))
    
    # 返回计算结果
    response = {
        "age": age,
        "weight": weight,
        "height": height,
        "bmi": bmi,
        "message": "数据处理成功"
    }
    return jsonify(response)

def calculate_bmi(weight, height):
    height_m = height / 100  # 将身高从厘米转换为米
    bmi = weight / (height_m ** 2)
    return round(bmi, 2)

if __name__ == '__main__':
    app.run(debug=True)