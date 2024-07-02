document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                document.originalImage = img;
                analyzeImage(img);
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

function generateStyles() {
    const output = document.getElementById('output');
    output.innerHTML = '';
    const timesOfDay = ['Morning', 'Sunrise', 'Late Morning', 'Noon', 'Afternoon', 'Evening', 'Sunset', 'Night'];

    timesOfDay.forEach(time => {
        const canvas = document.createElement('canvas');
        canvas.width = document.originalImage.width;
        canvas.height = document.originalImage.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(document.originalImage, 0, 0);

        applyStyle(ctx, time);

        const img = new Image();
        img.classList.add('output-image');
        img.src = canvas.toDataURL();
        output.appendChild(img);
    });
}

function analyzeImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let totalBrightness = 0;
    let totalRed = 0;
    let totalGreen = 0;
    let totalBlue = 0;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        const brightness = (red + green + blue) / 3;
        totalBrightness += brightness;
        totalRed += red;
        totalGreen += green;
        totalBlue += blue;
    }

    const pixelCount = data.length / 4;
    document.averageBrightness = totalBrightness / pixelCount;
    document.averageRed = totalRed / pixelCount;
    document.averageGreen = totalGreen / pixelCount;
    document.averageBlue = totalBlue / pixelCount;
}

function applyStyle(ctx, time) {
    const canvas = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const averageBrightness = document.averageBrightness;
    const averageRed = document.averageRed;
    const averageGreen = document.averageGreen;
    const averageBlue = document.averageBlue;

    switch (time) {
        case 'Morning':
            applyMorningStyle(data, averageBrightness, averageRed, averageGreen, averageBlue, canvas.width, canvas.height);
            break;
        case 'Sunrise':
            applySunriseStyle(data, averageBrightness, averageRed, averageGreen, averageBlue, canvas.width, canvas.height);
            break;
        case 'Late Morning':
            applyLateMorningStyle(data, averageBrightness, averageRed, averageGreen, averageBlue, canvas.width, canvas.height);
            break;
        case 'Noon':
            applyNoonStyle(data, averageBrightness, averageRed, averageGreen, averageBlue, canvas.width, canvas.height);
            break;
        case 'Afternoon':
            applyAfternoonStyle(data, averageBrightness, averageRed, averageGreen, averageBlue, canvas.width, canvas.height);
            break;
        case 'Evening':
            applyEveningStyle(data, averageBrightness, averageRed, averageGreen, averageBlue, canvas.width, canvas.height);
            break;
        case 'Sunset':
            applySunsetStyle(data, averageBrightness, averageRed, averageGreen, averageBlue, canvas.width, canvas.height);
            break;
        case 'Night':
            applyNightStyle(data, averageBrightness, averageRed, averageGreen, averageBlue, canvas.width, canvas.height);
            break;
    }

    ctx.putImageData(imageData, 0, 0);
}

function applyMorningStyle(data, avgBrightness, avgRed, avgGreen, avgBlue, width, height) {
    adjustBrightness(data, 1.05);
    adjustColor(data, 5, 2, -5);
    addGradientOverlay(data, 'rgba(255, 223, 186, 0.3)', 'rgba(255, 255, 255, 0)', width, height);
}

function applySunriseStyle(data, avgBrightness, avgRed, avgGreen, avgBlue, width, height) {
    adjustBrightness(data, 1.1);
    adjustColor(data, 10, 5, -10);
    addGradientOverlay(data, 'rgba(255, 102, 102, 0.3)', 'rgba(255, 255, 255, 0)', width, height);
}

function applyLateMorningStyle(data, avgBrightness, avgRed, avgGreen, avgBlue, width, height) {
    adjustBrightness(data, 1.02);
    addGradientOverlay(data, 'rgba(255, 255, 204, 0.15)', 'rgba(255, 255, 255, 0)', width, height);
}

function applyNoonStyle(data, avgBrightness, avgRed, avgGreen, avgBlue, width, height) {
    adjustBrightness(data, 1.1);
    addGradientOverlay(data, 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0)', width, height);
}

function applyAfternoonStyle(data, avgBrightness, avgRed, avgGreen, avgBlue, width, height) {
    adjustBrightness(data, 1.1);
    adjustColor(data, 0, 5, 10);
    addGradientOverlay(data, 'rgba(255, 204, 153, 0.25)', 'rgba(255, 255, 255, 0)', width, height);
}

function applyEveningStyle(data, avgBrightness, avgRed, avgGreen, avgBlue, width, height) {
    adjustBrightness(data, 0.95);
    adjustColor(data, -10, 0, 20);
    addGradientOverlay(data, 'rgba(255, 153, 51, 0.4)', 'rgba(255, 255, 255, 0)', width, height);
}

function applySunsetStyle(data, avgBrightness, avgRed, avgGreen, avgBlue, width, height) {
    adjustBrightness(data, 0.85);
    adjustColor(data, -20, 0, 30);
    addGradientOverlay(data, 'rgba(255, 94, 77, 0.4)', 'rgba(255, 255, 255, 0)', width, height);
}

function applyNightStyle(data, avgBrightness, avgRed, avgGreen, avgBlue, width, height) {
    adjustBrightness(data, 0.7);
    adjustColor(data, -30, 0, 40);
    addGradientOverlay(data, 'rgba(0, 0, 51, 0.5)', 'rgba(0, 0, 0, 0)', width, height);
    addStars(data, width, height);
}

function adjustBrightness(data, factor) {
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(data[i] * factor, 255);
        data[i + 1] = Math.min(data[i + 1] * factor, 255);
        data[i + 2] = Math.min(data[i + 2] * factor, 255);
    }
}

function adjustColor(data, rAdjust, gAdjust, bAdjust) {
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(Math.max(data[i] + rAdjust, 0), 255);
        data[i + 1] = Math.min(Math.max(data[i + 1] + gAdjust, 0), 255);
        data[i + 2] = Math.min(Math.max(data[i + 2] + bAdjust, 0), 255);
    }
}

function addGradientOverlay(data, colorStart, colorEnd, width, height) {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const overlayData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(data[i] + overlayData[i] * overlayData[i + 3] / 255, 255);
        data[i + 1] = Math.min(data[i + 1] + overlayData[i + 1] * overlayData[i + 3] / 255, 255);
        data[i + 2] = Math.min(data[i + 2] + overlayData[i + 2] * overlayData[i + 3] / 255, 255);
    }
}

function addStars(data, width, height) {
    const numStars = 20;

    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height / 2; // 在上半部分的天空生成星星
        const radius = Math.random() * 2; // 星星的大小
        const brightness = Math.random() * 255; // 星星的亮度

        drawStar(data, x, y, radius, brightness, width);
    }
}

function drawStar(data, x, y, radius, brightness, width) {
    const startX = Math.floor(x - radius);
    const endX = Math.floor(x + radius);
    const startY = Math.floor(y - radius);
    const endY = Math.floor(y + radius);

    for (let xi = startX; xi <= endX; xi++) {
        for (let yi = startY; yi <= endY; yi++) {
            if (xi >= 0 && xi < width && yi >= 0 && yi < width / 2) {
                const distance = Math.sqrt((xi - x) * (xi - x) + (yi - y) * (yi - y));
                if (distance <= radius) {
                    const index = (yi * width + xi) * 4;
                    const intensity = Math.max(0, 255 - distance * (255 / radius));
                    data[index] = Math.min(data[index] + brightness * intensity / 255, 255);
                    data[index + 1] = Math.min(data[index + 1] + brightness * intensity / 255, 255);
                    data[index + 2] = Math.min(data[index + 2] + brightness * intensity / 255, 255);
                    data[index + 3] = 255; // Alpha channel
                }
            }
        }
    }
}

