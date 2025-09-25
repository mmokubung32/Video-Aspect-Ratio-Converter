let currentVideo = null;
let convertedBlob = null;

// Elements
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const videoContainer = document.getElementById('videoContainer');
const videoPreview = document.getElementById('videoPreview');
const videoInfo = document.getElementById('videoInfo');
const aspectSelect = document.getElementById('aspectSelect');
const formatSelect = document.getElementById('formatSelect');
const methodSelect = document.getElementById('methodSelect');
const previewCanvas = document.getElementById('previewCanvas');
const convertButton = document.getElementById('convertButton');
const progressSection = document.getElementById('progressSection');
const progress = document.getElementById('progress');
const progressText = document.getElementById('progressText');
const downloadSection = document.getElementById('downloadSection');
const downloadButton = document.getElementById('downloadButton');

// Drag and drop
uploadSection.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadSection.classList.add('dragover');
});

uploadSection.addEventListener('dragleave', () => {
    uploadSection.classList.remove('dragover');
});

uploadSection.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadSection.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

function handleFile(file) {
    if (!file.type.startsWith('video/')) {
        alert('Please upload a valid video file.');
        return;
    }

    const url = URL.createObjectURL(file);
    videoPreview.src = url;
    videoPreview.load();
    videoContainer.style.display = 'block';

    currentVideo = file;

    videoPreview.onloadedmetadata = () => {
        document.getElementById('currentRatio').textContent = 
            (videoPreview.videoWidth / videoPreview.videoHeight).toFixed(2);
        document.getElementById('currentResolution').textContent = 
            `${videoPreview.videoWidth} x ${videoPreview.videoHeight}`;
        document.getElementById('videoDuration').textContent = 
            `${videoPreview.duration.toFixed(1)}s`;
        document.getElementById('fileSize').textContent = 
            (file.size / (1024*1024)).toFixed(2) + ' MB';
    };
}

convertButton.addEventListener('click', () => {
    if (!currentVideo) {
        alert('Please upload a video first!');
        return;
    }

    progressSection.style.display = 'block';
    let progressValue = 0;
    const interval = setInterval(() => {
        progressValue += 10;
        progress.style.width = progressValue + '%';
        progressText.textContent = `Processing: ${progressValue}%`;
        if (progressValue >= 100) {
            clearInterval(interval);
            completeConversion();
        }
    }, 500);
});

function completeConversion() {
    downloadSection.style.display = 'block';
    document.getElementById('convertedFormat').textContent = formatSelect.value.toUpperCase();
    document.getElementById('convertedRatio').textContent = aspectSelect.value;
    document.getElementById('convertedMethod').textContent = methodSelect.value;
    document.getElementById('convertedSize').textContent = 
        (currentVideo.size / (1024*1024)).toFixed(2) + ' MB';
    
    convertedBlob = currentVideo; // simulation
}

downloadButton.addEventListener('click', () => {
    if (!convertedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(convertedBlob);
    a.download = `converted.${formatSelect.value}`;
    a.click();
});
