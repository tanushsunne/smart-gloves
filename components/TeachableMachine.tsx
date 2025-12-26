import { useEffect, useRef, useState } from "react";
console.log("tmImage =", window.tmImage);


declare global {
  interface Window {
    tmImage: any;
  }
}

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/JAvUemqiz/";

//const MODEL_URL = "https://teachablemachine.withgoogle.com/models/uqIVzV7xH/";



const TeachableMachine = () => {
  const webcamContainerRef = useRef<HTMLDivElement>(null);
  const labelContainerRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(true);


  useEffect(() => {
    if (!running) return;

    let webcam: any;
    let model: any;
    let rafId: number;

    const init = async () => {
      const modelURL = MODEL_URL + "model.json";
      const metadataURL = MODEL_URL + "metadata.json";

      model = await window.tmImage.load(modelURL, metadataURL);

      webcam = new window.tmImage.Webcam(240, 240, true);
      await webcam.setup();
      await webcam.play();

      if (webcamContainerRef.current) {
        webcamContainerRef.current.innerHTML = "";
        webcamContainerRef.current.appendChild(webcam.canvas);
        // Force canvas to fit container
        webcam.canvas.style.width = "100%";
        webcam.canvas.style.height = "100%";
        webcam.canvas.style.objectFit = "cover";
      }
      if (labelContainerRef.current) {
        labelContainerRef.current.innerHTML = "";
      }



      for (let i = 0; i < model.getTotalClasses(); i++) {
        const div = document.createElement("div");
        div.className = "text-[10px] font-mono text-emerald-400";
        labelContainerRef.current?.appendChild(div);
      }

      const loop = async () => {
        webcam.update();
        const predictions = await model.predict(webcam.canvas);

        predictions.forEach((p: any, i: number) => {
          const percent = Math.round(p.probability * 100);

          labelContainerRef.current!.children[i].innerHTML = `
    <div class="flex justify-between text-[9px] uppercase tracking-widest">
      <span>${p.className}</span>
      <span>${percent}%</span>
    </div>
    <div class="w-full h-1 bg-emerald-900/40 mt-1">
      <div 
        class="h-1 bg-emerald-500 transition-all duration-200"
        style="width: ${percent}%"
      ></div>
    </div>
  `;
        });


        rafId = requestAnimationFrame(loop);
      };

      loop();
    };

    init();

    return () => {
      cancelAnimationFrame(rafId);
      if (webcam) {
        webcam.stop();
      }
      if (webcamContainerRef.current) {
        webcamContainerRef.current.innerHTML = "";
      }
    };

  }, [running]);

  return (
    <div className="flex flex-col items-center space-y-3">
      

      <div
        ref={webcamContainerRef}
        className="w-full h-48 border border-emerald-500/30 bg-black/60 flex items-center justify-center"
      />

      <div ref={labelContainerRef} className="w-full space-y-1" />
    </div>
  );
};

export default TeachableMachine;
