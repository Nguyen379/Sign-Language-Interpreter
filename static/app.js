const video = document.getElementById("videoElement");
const captureBtn = document.getElementById("captureBtn");
const stopBtn = document.getElementById("stopBtn");
const result = document.getElementById("result");
const loading = document.getElementById("loading");
let stream = null;

// Add mode elements
const practiceMode = document.getElementById("practiceMode");
const learningMode = document.getElementById("learningMode");
const practiceContainer = document.getElementById("practiceContainer");
const learningContainer = document.getElementById("learningContainer");
const learningCaptureBtn = document.getElementById("learningCaptureBtn");


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

    const response = await fetch("/interpret", {
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

// Add mode switching
practiceMode.addEventListener("click", () => {
  practiceMode.classList.add("active");
  learningMode.classList.remove("active");
  practiceContainer.style.display = "block";
  learningContainer.style.display = "none";
  initCamera(); // Reinitialize camera when switching to practice mode
});

learningMode.addEventListener("click", () => {
  learningMode.classList.add("active");
  practiceMode.classList.remove("active");
  learningContainer.style.display = "block";
  practiceContainer.style.display = "none";
  stopCamera(); // Stop camera when switching to learning mode
});

// Event listeners
captureBtn.addEventListener("click", captureAndInterpret);
stopBtn.addEventListener("click", stopCamera);

// Initialize camera when page loads
initCamera();

// Clean up camera when page is closed
window.addEventListener("beforeunload", stopCamera);

// Learning mode data
const lessonData = {
  alphabet: {
    title: "ASL Alphabet",
    signs: [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ],
  },
  numbers: {
    title: "Numbers 1-10",
    signs: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },
  basics: {
    title: "Basic Phrases",
    signs: [
      "Hello",
      "Thank You",
      "Please",
      "Sorry",
      "Good Morning",
      "Good Night",
      "Yes",
      "No",
      "How Are You",
      "Nice to Meet You",
    ],
  },
};

// Learning mode elements
const learningVideo = document.getElementById("learningVideo");
const lessonContent = document.getElementById("lessonContent");
const backToLessons = document.getElementById("backToLessons");
const lessonTitle = document.getElementById("lessonTitle");
const signsGrid = document.getElementById("signsGrid");
const learningResult = document.getElementById("learningResult");

// Add event listeners for lesson cards
document.querySelectorAll(".lesson-card").forEach((card) => {
  card.addEventListener("click", () => {
    const lessonType = card.dataset.lesson;
    showLesson(lessonType);
  });
});

// Show specific lesson
function showLesson(lessonType) {
  const lesson = lessonData[lessonType];

  // Update UI
  document.querySelector(".lessons-grid").style.display = "none";
  lessonContent.style.display = "block";
  lessonTitle.textContent = lesson.title;

  // Create signs grid
  signsGrid.innerHTML = "";
  lesson.signs.forEach((sign) => {
    const button = document.createElement("button");
    button.className = "sign-button";
    button.textContent = sign;
    button.addEventListener("click", () => practiceSign(sign));
    signsGrid.appendChild(button);
  });

  // Initialize camera for learning mode
  initLearningCamera();
}

// Initialize camera for learning mode
async function initLearningCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
    });
    learningVideo.srcObject = stream;
  } catch (err) {
    console.error("Error accessing camera:", err);
    learningResult.textContent = "Error: Unable to access camera";
  }
}

// Practice specific sign
function practiceSign(sign) {
  // Update UI to show active sign
  document.querySelectorAll(".sign-button").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.textContent === sign) {
      btn.classList.add("active");
    }
  });

  learningResult.textContent = `Practice the sign for "${sign}". Click any other sign to switch.`;
}

// Back to lessons button
backToLessons.addEventListener("click", () => {
  lessonContent.style.display = "none";
  document.querySelector(".lessons-grid").style.display = "grid";

  // Stop the camera
  if (learningVideo.srcObject) {
    learningVideo.srcObject.getTracks().forEach((track) => track.stop());
  }
});

// Update mode switching 
practiceMode.addEventListener("click", () => {
  practiceMode.classList.add("active");
  learningMode.classList.remove("active");
  practiceContainer.style.display = "block";
  learningContainer.style.display = "none";
  lessonContent.style.display = "none";
  document.querySelector(".lessons-grid").style.display = "grid";
  initCamera();
});

learningMode.addEventListener("click", () => {
  learningMode.classList.add("active");
  practiceMode.classList.remove("active");
  learningContainer.style.display = "block";
  practiceContainer.style.display = "none";
  stopCamera();
});

async function captureLearningSign() {
  const canvas = document.createElement("canvas");
  canvas.width = learningVideo.videoWidth;
  canvas.height = learningVideo.videoHeight;
  const ctx = canvas.getContext("2d");

  // Flip the image horizontally for mirror effect
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(learningVideo, 0, 0);

  const imageData = canvas.toDataURL("image/jpeg");

  try {
    // Get the currently selected letter
    const currentLetter = document.querySelector(
      ".sign-button.active"
    )?.textContent;
    learningResult.textContent = "Analyzing your sign...";

    const response = await fetch("/interpret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageData,
        mode: "learning",
        expectedSign: currentLetter,
      }),
    });

    const data = await response.json();
    learningResult.textContent = data.interpretation;
  } catch (err) {
    learningResult.textContent = "Error: " + err.message;
  }
}

// Update your showLesson function to include the capture button and event listener
function showLesson(lessonType) {
  const lesson = lessonData[lessonType];

  // Update UI
  document.querySelector(".lessons-grid").style.display = "none";
  lessonContent.style.display = "block";
  lessonTitle.textContent = lesson.title;

  // Create signs grid
  signsGrid.innerHTML = "";
  lesson.signs.forEach((sign) => {
    const button = document.createElement("button");
    button.className = "sign-button";
    button.textContent = sign;
    button.addEventListener("click", () => practiceSign(sign));
    signsGrid.appendChild(button);
  });

  // Add capture button if it doesn't exist
  if (!document.getElementById("learningCaptureBtn")) {
    const captureBtn = document.createElement("button");
    captureBtn.id = "learningCaptureBtn";
    captureBtn.className = "button";
    captureBtn.textContent = "Check My Sign";
    // Insert before signsGrid
    signsGrid.parentNode.insertBefore(captureBtn, signsGrid);
  }

  // Add event listener for capture button
  const learningCaptureBtn = document.getElementById("learningCaptureBtn");
  learningCaptureBtn.addEventListener("click", captureLearningSign);

  // Initialize camera for learning mode
  initLearningCamera();
}