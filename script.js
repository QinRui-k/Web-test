// 页面 DOM 元素
const chooseVideoButton = document.getElementById('chooseVideoButton');
const analyzeButton = document.getElementById('analyzeButton');
const videoInput = document.getElementById('videoInput');
const ageInput = document.getElementById('age');
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');

// 存储用户选择的视频文件
let selectedVideo = null;

// 选择视频：点击按钮触发隐藏的 file input
chooseVideoButton.addEventListener('click', function() {
  videoInput.click();
});

// 当用户选择视频后，保存该文件
videoInput.addEventListener('change', function(event) {
  const file = videoInput.files[0];
  if (file) {
    selectedVideo = file;  // 保存文件对象
    analyzeButton.disabled = false;  // 启用“分析”按钮
  }
});

// 分析按钮点击事件：发送年龄、体重、身高和视频文件到后端
analyzeButton.addEventListener('click', function() {
  // 获取用户输入的三个数据
  const age = ageInput.value;
  const weight = weightInput.value;
  const height = heightInput.value;

  // 检查所有字段是否填写
  if (!age || !weight || !height || !selectedVideo) {
    alert('请填写所有字段并选择视频文件');
    return;
  }

  // 创建一个 FormData 对象，用于上传文件和其他字段
  const formData = new FormData();
  formData.append('age', age);
  formData.append('weight', weight);
  formData.append('height', height);
  formData.append('video', selectedVideo);

  // 发送 POST 请求到后端（本地测试时使用本地地址）
  fetch('https://abfa-211-158-240-93.ngrok-free.app/process_data', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Response from backend:', data);
    alert(`数据处理成功，BMI: ${data.bmi}`);
  })
  .catch(error => {
    console.error('Error:', error);
    alert('发生错误，请稍后重试。');
  });
});