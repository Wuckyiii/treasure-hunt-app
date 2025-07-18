
// TreasureHuntApp (Multiplayer + Map + Sponsorships + Photo Upload)
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';

const sponsors = [
  { name: "Walmart", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg", clue: "Find the Walmart entrance and snap a photo of the blue welcome sign." }
];

const clues = [
  "Clue 1: I'm where you start your day, hot coffee comes my way.",
  "Clue 2: I'm full of pages, stories untold, knowledge and secrets from ages old.",
  "Clue 3: Look around, find the tree that stands alone. That's where the prize is shown!"
];

const prizes = [
  "$5 Amazon Gift Card",
  "$10 CashApp Transfer",
  "Bluetooth Earbuds",
  "Mystery Box!"
];

export default function TreasureHuntApp() {
  const [playerId] = useState(uuidv4());
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joined, setJoined] = useState(false);
  const [clue, setClue] = useState("Enter your nickname and join a room to begin.");
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [prize, setPrize] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    if (completed) {
      const reward = prizes[Math.floor(Math.random() * prizes.length)];
      setPrize(reward);
      setLeaderboard(prev => [...prev, { nickname, time: Date.now() }]);
    }
  }, [completed]);

  const startGame = () => {
    setClue(clues[0]);
    setStep(1);
  };

  const nextClue = () => {
    if (uploadedImage === null) {
      alert("Please upload a photo at the current clue location before continuing.");
      return;
    }
    setUploadedImage(null);
    if (step < clues.length) {
      setClue(clues[step]);
      setStep(step + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-100 to-orange-200">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Multiplayer Treasure Hunt</h1>

          {!joined ? (
            <>
              <input
                type="text"
                placeholder="Your Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border px-4 py-2 mb-2 w-full rounded"
              />
              <input
                type="text"
                placeholder="Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="border px-4 py-2 mb-4 w-full rounded"
              />
              <Button onClick={() => setJoined(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                Join Room
              </Button>
            </>
          ) : !completed ? (
            <>
              {sponsors[step - 1] && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Sponsored by</p>
                  <img src={sponsors[0].logo} alt="Sponsor" className="h-10 mx-auto" />
                </div>
              )}
              <p className="mb-4 text-lg">{clue}</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
              {uploadedImage && <img src={uploadedImage} alt="Upload Preview" className="mb-2 max-h-40 rounded-lg mx-auto" />}
              <Button onClick={step === 0 ? startGame : nextClue} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                {step === 0 ? "Start Hunt" : "Next Clue"}
              </Button>
            </>
          ) : (
            <>
              <p className="text-xl font-semibold">🎉 {nickname}, you completed the hunt!</p>
              <p className="mt-2 text-lg">Your prize is: <span className="font-bold text-green-600">{prize}</span></p>
              <h2 className="mt-4 text-lg font-bold">Leaderboard</h2>
              <ul className="mt-2 text-left">
                {leaderboard.sort((a, b) => a.time - b.time).map((entry, index) => (
                  <li key={index} className="text-sm">
                    {index + 1}. {entry.nickname} - 🏁
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
