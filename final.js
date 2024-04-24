// Function to load and run object detection model
async function runObjectDetection(video, model) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    async function detectFrame() {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const predictions = await model.detect(canvas);
        drawPredictions(context, predictions);
        requestAnimationFrame(detectFrame);
    }

    detectFrame();
}

// Function to draw predictions on the canvas
function drawPredictions(context, predictions) {
    predictions.forEach(prediction => {
        const { class: objectClass, score, bbox } = prediction;
        // Draw bounding box
        context.beginPath();
        context.rect(...bbox);
        context.lineWidth = 2;
        context.strokeStyle = 'red';
        context.fillStyle = 'red';
        context.stroke();
        // Draw class and score
        context.font = '16px Arial';
        context.fillText(`${objectClass} (${Math.round(score * 100)}%)`, bbox[0], bbox[1] > 10 ? bbox[1] - 5 : 10);
    });
}

// Function to initialize webcam
async function setupWebcam() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use rear-facing camera if available
    });
    video.srcObject = stream;
    return new Promise(resolve => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

// Main function
async function main() {
    const video = await setupWebcam();
    const model = await cocoSsd.load();
    runObjectDetection(video, model);
}

main();
