from flask import Flask, request, jsonify
from flask_cors import CORS  # 导入CORS模块

app = Flask(__name__)
CORS(app)  # 启用跨域支持

# 用于处理接收到的年龄、体重和身高
@app.route('/process_data', methods=['POST'])
def process_data():
    # 获取前端传来的 JSON 数据
    data = request.json  # 使用 .json 来解析 JSON 格式的请求体
    age = data.get('age')  # 获取年龄
    weight = data.get('weight')  # 获取体重
    height = data.get('height')  # 获取身高

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
    # BMI 计算公式：BMI = 体重(kg) / 身高(m)^2
    height_m = height / 100  # 将身高从厘米转换为米
    bmi = weight / (height_m ** 2)
    return round(bmi, 2)

if __name__ == '__main__':
    app.run(debug=True)