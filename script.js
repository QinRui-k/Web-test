// 页面索引，记录当前页数
let pageIndex = 1;

// 获取元素
const chooseVideoButton = document.getElementById('chooseVideoButton');
const analyzeButton = document.getElementById('analyzeButton');
const modal = document.getElementById('modal');
const closeButton = document.getElementById('closeButton');
const nextPageButton = document.getElementById('nextPage');
const prevPageButton = document.getElementById('prevPage');
const firstFrame = document.getElementById('firstFrame');
const lastFrame = document.getElementById('lastFrame');
const videoPlayer1 = document.getElementById('videoPlayer1');
const videoPlayer2 = document.getElementById('videoPlayer2');
const videoSource1 = document.getElementById('videoSource1');
const videoSource2 = document.getElementById('videoSource2');
const ageInput = document.getElementById('age');
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');

// 存储选择的视频路径
let selectedVideo = null;

// 设置第二个视频的预设路径
const secondVideoPath = "my-image/gt_test.mp4";  // 第二个视频路径
const firstVideoPath = "my-image/3.mp4";  // 第一个视频路径

// 选择视频并记录
chooseVideoButton.addEventListener('click', function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/*'; // 只接受视频文件

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            // 使用 URL.createObjectURL 生成视频的临时 URL
            selectedVideo = URL.createObjectURL(file);
            // 设置第一个视频播放器的源
            videoSource1.src = selectedVideo;
            videoPlayer1.load(); // 加载第一个视频播放器
            // 设置第二个视频播放器的源（预设视频）
            videoSource2.src = secondVideoPath;
            videoPlayer2.load(); // 加载第二个视频播放器
            analyzeButton.disabled = false;  // 启用分析按钮
        }
    });

    fileInput.click();  // 激活文件选择框
});

// 分析按钮，获取视频的第15帧和最后一帧并展示弹窗
analyzeButton.addEventListener('click', function() {
    // 获取用户输入的年龄、体重、身高
    const age = ageInput.value;
    const weight = weightInput.value;
    const height = heightInput.value;

    // 检查用户输入是否完整
    if (!age || !weight || !height) {
        alert('请填写所有字段！');
        return;
    }

    // 构造请求体
    const requestData = {
        age: age,
        weight: weight,
        height: height
    };

    // 发送 POST 请求到后端（ngrok 提供的 URL）
    fetch('https://d261-211-158-242-47.ngrok-free.app/process_data', {  // 使用 ngrok 提供的公网 URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())  // 如果后端返回数据，可以继续处理
    .then(data => {
        // 在此处可以根据后端返回的结果进行处理
        console.log('Data sent to backend:', data);
        // 目前不需要处理后端反馈，直接获取视频帧
    })
    .catch(error => {
        console.error('Error:', error);
        alert('发生错误，请稍后重试。');
    });

    // 获取视频的第15帧和最后一帧
    const video = document.createElement('video');
    video.src = selectedVideo;

    // 获取视频的第15帧
    video.currentTime = 15; // 设置为第15秒
    video.onloadeddata = function() {
        firstFrame.src = videoPoster(video, 15); // 视频第15帧
    };

    // 获取视频的最后一帧
    video.oncanplaythrough = function() {
        video.currentTime = video.duration - 0.1; // 设置为视频的最后一帧
    };
    video.onseeked = function() {
        lastFrame.src = videoPoster(video, video.duration - 0.1); // 视频最后一帧
    };

    // 显示弹窗并切换到第一页
    modal.style.display = 'flex';
    document.getElementById('page1').style.display = 'block';
    document.getElementById('page2').style.display = 'none';
    document.getElementById('page3').style.display = 'none';
});

// 页面的播放初始化，确保每一页的内容独立播放
nextPageButton.addEventListener('click', function() {
    if (pageIndex === 1) {
        document.getElementById('page1').style.display = 'none';
        document.getElementById('page2').style.display = 'block';
        videoSource1.src = firstVideoPath;  // 播放第一个预设的视频
        videoPlayer1.load();
        videoPlayer1.play();  // 播放第一个视频
        pageIndex = 2; // 更新为第二页
    } else if (pageIndex === 2) {
        document.getElementById('page2').style.display = 'none';
        document.getElementById('page3').style.display = 'block';
        videoSource2.src = secondVideoPath;  // 播放第二个预设的视频
        videoPlayer2.load();
        videoPlayer2.play();  // 播放第二个视频
        pageIndex = 3; // 更新为第三页
    }
});

// 上一页按钮，返回上一页
prevPageButton.addEventListener('click', function() {
    if (pageIndex === 2) {
        document.getElementById('page2').style.display = 'none';
        document.getElementById('page1').style.display = 'block';
        pageIndex = 1; // 更新为第一页
    } else if (pageIndex === 3) {
        document.getElementById('page3').style.display = 'none';
        document.getElementById('page2').style.display = 'block';
        pageIndex = 2; // 更新为第二页
    }
});

// 关闭弹窗时刷新页面
closeButton.addEventListener('click', function() {
    modal.style.display = 'none';
    location.reload();  // 刷新页面，清除所有存储和内容
});

// 点击弹窗外部区域关闭弹窗时刷新页面
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        location.reload();  // 刷新页面，清除所有存储和内容
    }
});

// 获取视频帧
function videoPoster(video, time) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png'); // 返回视频帧的 base64 数据
}