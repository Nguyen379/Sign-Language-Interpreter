const video = document.getElementById("videoElement");
const captureBtn = document.getElementById("captureBtn");
const stopBtn = document.getElementById("stopBtn");
const result = document.getElementById("result");
const loading = document.getElementById("loading");
let stream = null;

// Access webcam
async function initCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "user",
      },
    });
    video.srcObject = stream;
    stopBtn.style.display = "inline-block";
  } catch (err) {
    console.error("Error accessing camera:", err);
    result.textContent =
      "Error: Unable to access camera. Please ensure camera permissions are granted.";
  }
}

// Stop camera
function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
    stopBtn.style.display = "none";
  }
}

// Capture and send image to backend
async function captureAndInterpret() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");

  // Flip the image horizontally for mirror effect
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0);

  const imageData = canvas.toDataURL("image/jpeg");

  try {
    loading.style.display = "block";
    result.textContent = "";

    const response = await fetch("http://localhost:5000/interpret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageData }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    result.textContent = data.interpretation;
  } catch (err) {
    result.textContent = "Error: " + err.message;
  } finally {
    loading.style.display = "none";
  }
}

// Event listeners
captureBtn.addEventListener("click", captureAndInterpret);
stopBtn.addEventListener("click", stopCamera);

// Initialize camera when page loads
initCamera();

// Clean up camera when page is closed
window.addEventListener("beforeunload", stopCamera);
