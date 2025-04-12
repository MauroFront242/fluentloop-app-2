import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import axios from "axios";

export default function FluentLoopApp() {
  const [dailyPrompt, setDailyPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [recordings, setRecordings] = useState([]);
  const [fluencyData, setFluencyData] = useState([
    { day: "Mon", secondsSpoken: 20 },
    { day: "Tue", secondsSpoken: 35 },
    { day: "Wed", secondsSpoken: 50 },
    { day: "Thu", secondsSpoken: 40 },
    { day: "Fri", secondsSpoken: 60 }
  ]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState(null);

  useEffect(() => {
    const prompts = [
      "Order a coffee at your favorite café.",
      "Describe your day to a friend.",
      "Ask for directions to the nearest train station.",
      "Talk about your favorite movie.",
      "Explain your job to someone who doesn’t know you."
    ];
    const todayIndex = new Date().getDay() % prompts.length;
    setDailyPrompt(prompts[todayIndex]);
  }, []);

  const handleSave = () => {
    const newEntry = { text: response, date: new Date().toLocaleDateString() };
    setRecordings([...recordings, newEntry]);
    setResponse("");
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(blob);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `practice-${new Date().toISOString()}.webm`;
      a.click();
    }
  };

  const analyzePronunciation = async () => {
    if (!audioBlob) return;
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const { data } = await axios.post("https://api.pronunciation-eval.example/analyze", formData);
      setPronunciationScore(data.score);
    } catch (error) {
      console.error("Pronunciation evaluation failed", error);
    }
  };

  return (
    <div className="p-6 grid gap-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600">FluentLoop - Daily Practice</h1>

      <div className="border p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">🎯 Today's Scenario</h2>
        <p className="mb-4">{dailyPrompt}</p>
        <input
          className="border p-2 w-full"
          placeholder="Type or dictate your response..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2" onClick={handleSave}>Save Response</button>
        <div className="mt-4 flex gap-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={startRecording} disabled={isRecording}>🎙️ Start Recording</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={stopRecording} disabled={!isRecording}>⏹️ Stop</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={downloadRecording} disabled={!audioBlob}>⬇️ Download</button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded" onClick={analyzePronunciation} disabled={!audioBlob}>🧠 Evaluate</button>
        </div>
        {pronunciationScore !== null && (
          <p className="mt-2 text-green-600 font-semibold">Pronunciation Score: {pronunciationScore}/100</p>
        )}
      </div>

      <div className="border p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">📈 Fluency Tracker</h2>
        <LineChart width={500} height={300} data={fluencyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="secondsSpoken" stroke="#8884d8" name="Seconds Spoken" />
        </LineChart>
      </div>

      <div className="border p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">🗣️ My Practice Log</h2>
        <ul className="list-disc ml-4">
          {recordings.map((entry, index) => (
            <li key={index}>{entry.date}: {entry.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
