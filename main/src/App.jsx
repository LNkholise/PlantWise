import { useState } from "react";
import Spline from "@splinetool/react-spline";
import TextBox from "./components/TextBox";
import AccountModal from "./components/AccountModal";
import { puter } from "@heyputer/puter.js";

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to play a single message
  const playMessage = async (text) => {
    if (isPlaying) return;
    setIsPlaying(true);

    try {
      const audio = await puter.ai.txt2speech(text, {
        voice: "Joanna",
        engine: "neural",
        language: "en-US",
      });

      await new Promise((resolve) => {
        audio.onended = resolve;
        audio.play();
      });
    } catch (err) {
      console.error("TTS error:", err);
    } finally {
      setIsPlaying(false);
    }
  };

  function onSplineMouseDown(e) {
    if (e.target.name === 'Glass Ball') {
      setIsModalOpen(true);
    }
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Thinking indicator on top of avatar head */}
      <div className="absolute top-35 left-0 w-full flex justify-center p-6 z-50 pointer-events-none">
        {isThinking && (
          <div className="bg-white/90 text-gray-800 px-4 py-4 rounded-full flex space-x-1 items-center shadow-lg animate-pulse">
            <span className="w-1 h-1 bg-gray-800 rounded-full animate-bounceDot delay-0"></span>
            <span className="w-1 h-1 bg-gray-800 rounded-full animate-bounceDot delay-200"></span>
            <span className="w-1 h-1 bg-gray-800 rounded-full animate-bounceDot delay-400"></span>
          </div>
        )}
      </div>
      
      {/* Spline Background */}
      <Spline
        scene="https://prod.spline.design/cfusgqKcEoWAyogU/scene.splinecode"
        className="absolute inset-0 w-full h-full object-cover"
        onSplineMouseDown={onSplineMouseDown}
      />

      {/* Overlay TextBox with prompt */}
      <div className="absolute bottom-10 left-0 w-full flex flex-col items-center p-6 space-y-2">
        <TextBox onMessageReceived={playMessage} onThinking={setIsThinking} />
        <p className="text-gray-300 text-xs">
          Click on <span className="text-blue-400 font-semibold">Voddie</span> to access the menu!
        </p>
      </div>

      {/* Account Modal */}
      <AccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
