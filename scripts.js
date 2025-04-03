// Stress Level Check Logic
let questions = [
    "Do you struggle to sleep?",
    "Do you feel overwhelmed often?",
    "Do you experience physical tension?"
];
let score = 0;
let currentQuestion = 0;

function nextQuestion(value) {
    score += value;
    currentQuestion++;

    if (currentQuestion < questions.length) {
        document.getElementById("question").textContent = questions[currentQuestion];
    } else {
        let result;
        if (score <= 3) result = "😊 Low Stress";
        else if (score <= 6) result = "😐 Moderate Stress";
        else result = "😟 High Stress - Consider seeking support";

        document.getElementById("result").innerHTML = `
            <div class="alert alert-primary">
                Your result: ${result}<br>
                <button class="btn btn-sm btn-link" onclick="location.reload()">Retake Test</button>
            </div>
        `;
    }
}
//mindfulnesss
function startMindfulnessTimer() {
let timeLeft = 300; // 5 minutes in seconds
const timerElement = document.getElementById("mindfulness-timer");

const timer = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    if (timeLeft <= 0) {
        clearInterval(timer);
        timerElement.textContent = "Time's up! Great job!";
    } else {
        timeLeft--;
    }
}, 1000);
}

// Breathing Exercise Logic
let isBreathingActive = false;

function startBreathing() {
    console.log("Breathing exercise started"); // Debug log
    if (isBreathingActive) return;
    isBreathingActive = true;

    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breath-text');

    if (!circle || !text) {
        console.error("Breathing exercise elements not found"); // Debug log
        return;
    }

    const breatheCycle = () => {
        text.textContent = "Breathe In";
        circle.style.transform = "scale(1.8)";

        setTimeout(() => {
            text.textContent = "Hold";
            setTimeout(() => {
                text.textContent = "Breathe Out";
                circle.style.transform = "scale(1)";
                setTimeout(() => isBreathingActive = false, 4000);
            }, 2000);
        }, 4000);
    };

    breatheCycle();
}

// Voice Input Logic
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "en-US";

recognition.onstart = () => {
    console.log("Voice input started"); // Debug log
    document.getElementById("voice-status").textContent = "Listening...";
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("Voice input result:", transcript); // Debug log
    document.getElementById("journal-entry").value = transcript;
    document.getElementById("voice-status").textContent = "Done!";
};

recognition.onerror = (event) => {
    console.error("Voice input error:", event.error); // Debug log
    document.getElementById("voice-status").textContent = "Error: " + event.error;
};

recognition.onend = () => {
    console.log("Voice input ended"); // Debug log
    document.getElementById("voice-status").textContent = "Click 'Speak' and start talking...";
};

function startVoiceInput() {
    console.log("Starting voice input"); // Debug log
    recognition.start();
}

// Save Entry
function saveEntry() {
    const entry = document.getElementById("journal-entry").value;
    if (!entry.trim()) return;

    const date = new Date().toLocaleDateString();
    const entries = JSON.parse(localStorage.getItem("journal") || "[]");
    entries.push({ date, entry });
    localStorage.setItem("journal", JSON.stringify(entries));
    displayEntries();
    document.getElementById("journal-entry").value = "";
}

// Display Entries
function displayEntries() {
    const entries = JSON.parse(localStorage.getItem("journal") || "[]");
    const entriesHtml = entries
        .map((e, index) => `
            <div class="card mb-2">
                <div class="card-body">
                    📅 <strong>${e.date}</strong>: ${e.entry}
                    <button class="btn btn-sm btn-danger float-end" onclick="deleteEntry(${index})">Delete</button>
                </div>
            </div>
        `)
        .join("");
    document.getElementById("past-entries").innerHTML = entriesHtml;
}

// Delete Entry
function deleteEntry(index) {
    const entries = JSON.parse(localStorage.getItem("journal") || "[]");
    entries.splice(index, 1);
    localStorage.setItem("journal", JSON.stringify(entries));
    displayEntries();
}

// Stress Tips
function fetchNewTip() {
    fetch('https://api.adviceslip.com/advice')
        .then(res => res.json())
        .then(data => {
            document.getElementById('tips-content').innerHTML = `
                <div class="card">
                    <div class="card-body">💡 ${data.slip.advice}</div>
                </div>
            `;
        });
}
// // YouTube Data API Key (Replace with your actual API key)
// const YOUTUBE_API_KEY = "";
// async function fetchRandomSong() {
//     console.log("Fetching random song"); // Debug log
//     const musicPlayer = document.getElementById('music-player');
//     if (!musicPlayer) {
//         console.error("Music player element not found"); // Debug log
//         return;
//     }

//     musicPlayer.innerHTML = `<div class="spinner-border text-primary" role="status"></div>`;

//     try {
//         const queries = [
//             "relaxing music",
//             "calming music",
//             "stress relief music",
//             "meditation music",
//             "peaceful piano music"
//         ];
//         const randomQuery = queries[Math.floor(Math.random() * queries.length)];

//         const response = await fetch(
//             `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(randomQuery)}&type=video&key=${YOUTUBE_API_KEY}`
//         );

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("API response:", data); // Debug log

//         const videoId = data.items[0].id.videoId;
//         const videoTitle = data.items[0].snippet.title;

//         musicPlayer.innerHTML = `
//             <h4>Now Playing: ${videoTitle}</h4>
//             <iframe src="https://www.youtube.com/embed/${videoId}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
//         `;
//     } catch (error) {
//         console.error("Error fetching song:", error); // Debug log
//         musicPlayer.innerHTML = `<div class="alert alert-danger">Failed to fetch song. Please try again later.</div>`;
//     }
// }