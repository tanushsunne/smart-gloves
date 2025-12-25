
import React, { useState, useEffect, useRef } from 'react';
import { SystemStatus, SensorData, GestureLog } from './types';
import Visualizer3D from './components/Visualizer3D';
import { analyzeGesture } from './services/geminiService';
import TeachableMachine from "./components/TeachableMachine";

const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>(SystemStatus.IDLE);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [aiInsight, setAiInsight] = useState<string>("SYSTEM STANDBY");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (status === SystemStatus.ACTIVE) {
      const interval = setInterval(() => {
        setSensorData(prev => {
          const newData: SensorData = {
            timestamp: Date.now(),
            accelX: (Math.random() - 0.5) * 5,
            accelY: (Math.random() - 0.5) * 5,
            accelZ: (Math.random() - 0.5) * 5,
            flexIndex: Math.random(),
            flexMiddle: Math.random(),
            flexRing: Math.random(),
            flexLittle: Math.random(),
            flexThumb: Math.random(),
          };
          const nextData = [...prev, newData];
          return nextData.slice(-1);
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [status]);

  const toggleSystem = () => {
    if (status === SystemStatus.ACTIVE) {
      setStatus(SystemStatus.IDLE);
      setAiInsight("OFFLINE");
    } else {
      setStatus(SystemStatus.SCANNING);
      setAiInsight("CALIBRATING...");
      setTimeout(() => {
        setStatus(SystemStatus.ACTIVE);
        setAiInsight("LINK ACTIVE");
      }, 1000);
    }
  };

  const handleCameraToggle = () => {
    setIsCameraActive((prev) => !prev);
  };


  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setAiInsight("ANALYZING GESTURE...");
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    const base64 = dataUrl.split(',')[1];

    try {
      const result = await analyzeGesture(base64);
      setAiInsight(`${result.gesture.toUpperCase()} DETECTED`);
    } catch (err) {
      setAiInsight("ANALYSIS FAILED");
    }
  };

  const latestFlex = sensorData.length > 0 ? sensorData[0] : {
    flexThumb: 0.2, flexIndex: 0.3, flexMiddle: 0.1, flexRing: 0.4, flexLittle: 0.2
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center tech-bg p-6">
      {/* Centered Title */}
      <div className="mb-8 text-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-[0.2em] text-white uppercase drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
          A Demo for Smart Gesture Control Glove
        </h1>
      </div>

      {/* Small Central Box */}
      <div className="relative w-full max-w-md bg-black rounded-none neon-border overflow-hidden flex flex-col">
        {/* Status Indicator Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-emerald-900/30 bg-emerald-500/5">
          <div className="flex items-center space-x-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                status === SystemStatus.ACTIVE
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-red-500"
              }`}
            ></div>
            <span className="text-[9px] font-bold tracking-widest text-emerald-500/80">
              LINK: {status}
            </span>
          </div>
          <span className="text-[9px] font-mono text-emerald-500/60 uppercase">
            {aiInsight}
          </span>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col items-center bg-slate-950/20">
          <div className="w-full mb-6 relative border border-emerald-900/20 bg-black/40 p-2">
            {isCameraActive && status === SystemStatus.ACTIVE ? (
              <TeachableMachine />
            ) : (
              <Visualizer3D
                flexValues={{
                  thumb: latestFlex.flexThumb,
                  index: latestFlex.flexIndex,
                  middle: latestFlex.flexMiddle,
                  ring: latestFlex.flexRing,
                  little: latestFlex.flexLittle,
                }}
              />
            )}
          </div>

          <div className="w-full flex flex-col space-y-3">
            <div className="flex space-x-3">
              <button
                onClick={toggleSystem}
                className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors"
              >
                {status === SystemStatus.ACTIVE ? "DISCONNECT" : "INITIALIZE"}
              </button>
              <button
                onClick={handleCameraToggle}
                className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors"
              >
                {isCameraActive ? "HUD MODE" : "VISUAL SCAN"}
              </button>
            </div>

            {isCameraActive && (
              <button
                onClick={captureAndAnalyze}
                className="w-full py-2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all"
              >
                EXECUTE AI SCAN
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Border Elements */}
      <div className="fixed top-0 left-0 w-full h-px bg-emerald-500/10"></div>
      <div className="fixed bottom-0 left-0 w-full h-px bg-emerald-500/10"></div>
      <div className="fixed left-0 top-0 h-full w-px bg-emerald-500/10"></div>
      <div className="fixed right-0 top-0 h-full w-px bg-emerald-500/10"></div>
    </div>
  );
};

export default App;
