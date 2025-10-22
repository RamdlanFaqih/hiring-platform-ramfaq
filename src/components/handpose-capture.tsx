/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { X, ChevronRight, Camera } from "lucide-react"
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (modal: boolean) => void;
}

type GestureStep = 'three' | 'two' | 'one' | 'captured';

const HOLD_MS = 700;
const STABLE_REQUIRED = 2;
const COUNTDOWN_SECONDS = 3;

const HandposeCapture = ({ isModalOpen, setIsModalOpen }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<GestureStep>('three');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  // mutable refs to avoid stale closures
  const currentStepRef = useRef<GestureStep>(currentStep);
  useEffect(() => {
    currentStepRef.current = currentStep;
    // reset hold when step changes
    holdStartRef.current = null;
    stableCountRef.current = 0;
  }, [currentStep]);

  const holdStartRef = useRef<number | null>(null);
  const stableCountRef = useRef(0);

  // final-pose flag: true after pose 3 has been confirmed
  const finalPoseDoneRef = useRef(false);

  // countdown state & refs
  const [countdown, setCountdown] = useState<number | null>(null); // null = no countdown
  const countdownRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const countdownActiveRef = useRef(false);

  // prevent concurrent startPipeline
  const pipelineStartingRef = useRef(false);

  useEffect(() => {
    if (isModalOpen) {
      // open pipeline when modal opens
      startPipeline();
    } else {
      stopPipeline();
      resetCaptureState();
    }
    return () => stopPipeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const startPipeline = async () => {
    // guard: don't start if already starting/started
    if (pipelineStartingRef.current || handsRef.current || cameraRef.current) return;
    pipelineStartingRef.current = true;

    try {
      // ensure video element exists
      if (!videoRef.current) {
        pipelineStartingRef.current = false;
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });

      // attach stream
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setIsWebcamActive(true);

      // dynamic import mediapipe
      const mpHands = await import('@mediapipe/hands');
      const mpCameraUtils = await import('@mediapipe/camera_utils');
      const Hands = mpHands.Hands;
      const Camera = mpCameraUtils.Camera;

      const hands = new Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
      });

      // register the onResults callback
      hands.onResults(onResults);

      const camera = new Camera(videoRef.current, {
        onFrame: async () => { if (!videoRef.current) return; await hands.send({ image: videoRef.current }); },
        width: 640,
        height: 480
      });

      camera.start();
      handsRef.current = hands;
      cameraRef.current = camera;
    } catch (err) {
      console.error('Error initializing camera/hands:', err);
    } finally {
      pipelineStartingRef.current = false;
    }
  };

  const stopPipeline = () => {
    // stop media tracks
    try {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
    } catch (e) { /* ignore */ }

    // stop camera/hands
    try { cameraRef.current?.stop?.(); } catch {}
    try { handsRef.current?.close?.(); } catch {}

    handsRef.current = null;
    cameraRef.current = null;
    setIsWebcamActive(false);
    clearOverlay();
    stopCountdown();
  };

  const resetCaptureState = () => {
    setCurrentStep('three');
    setCapturedImage(null);
    holdStartRef.current = null;
    stableCountRef.current = 0;
    finalPoseDoneRef.current = false;
    setCountdown(null);
    countdownRef.current = null;
    countdownActiveRef.current = false;
  };

  // IMPROVED resetCapture: ensure pipeline fully stopped then restart after small delay
  const resetCapture = () => {
    // stop pipeline and countdown immediately
    stopPipeline();

    // reset states
    resetCaptureState();

    // restart after a short delay to ensure tracks are cleaned up and DOM stable
    setTimeout(() => {
      if (isModalOpen) startPipeline();
    }, 150);
  };

  const capturePhoto = useCallback(() => {
    if (currentStepRef.current === 'captured') return;

    if (!videoRef.current || !captureCanvasRef.current) return;
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
    setCurrentStep('captured');
    currentStepRef.current = 'captured';
    finalPoseDoneRef.current = false;

    stopCountdown();
    setTimeout(() => stopPipeline(), 600);
  }, []);

  const startCountdown = (seconds = COUNTDOWN_SECONDS) => {
    if (countdownActiveRef.current) return;
    countdownActiveRef.current = true;
    countdownRef.current = seconds;
    setCountdown(seconds);

    countdownIntervalRef.current = window.setInterval(() => {
      if (countdownRef.current === null) return;
      countdownRef.current = countdownRef.current - 1;
      setCountdown(countdownRef.current);
      if (countdownRef.current <= 0) {
        stopCountdown();
        capturePhoto();
      }
    }, 1000);
  };

  const stopCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    countdownRef.current = null;
    countdownActiveRef.current = false;
    setCountdown(null);
  };

  const clearOverlay = () => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
  };


  const onResults = (results: any) => {
    if (!videoRef.current) return;
    if (currentStepRef.current === 'captured') return;

    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext('2d');
    if (!ctx) return;

    const vw = videoRef.current.videoWidth || 640;
    const vh = videoRef.current.videoHeight || 480;

    if (overlay.width !== vw || overlay.height !== vh) {
      overlay.width = vw;
      overlay.height = vh;
    }
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const landmarks = results.multiHandLandmarks?.[0] as Array<{x:number,y:number,z:number}> | undefined;

    // If final pose was done and hand disappears -> start countdown
    if (finalPoseDoneRef.current && !landmarks && !countdownActiveRef.current) {
      // user lowered hand after final pose -> start countdown
      startCountdown(COUNTDOWN_SECONDS);
      // show message on overlay
      drawStatusBox(ctx, null, 'Lower your hand to take photo', 'green', 0, vw, vh);
      return;
    }

    // If countdown active and hand reappears -> cancel countdown
    if (countdownActiveRef.current && landmarks) {
      stopCountdown();
      // continue processing current frame to show overlay
    }

    if (!landmarks) {
      drawStatusBox(ctx, null, 'Undetected', 'gray', 0, vw, vh);
      holdStartRef.current = null;
      stableCountRef.current = 0;
      return;
    }

    // bounding box
    let minX = 1, minY = 1, maxX = 0, maxY = 0;
    for (const p of landmarks) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
    const box = { x: minX * vw, y: minY * vh, w: (maxX - minX) * vw, h: (maxY - minY) * vh };

    const f = detectFingers(landmarks);
    const expected = currentStepRef.current;
    const isMatch = (() => {
      if (expected === 'three') return isPoseThree(f);
      if (expected === 'two') return isPoseTwo(f);
      if (expected === 'one') return isPoseOne(f);
      return false;
    })();

    const label = expected === 'three' ? 'Pose 1' : expected === 'two' ? 'Pose 2' : 'Pose 3';

    if (isMatch) {
      if (!holdStartRef.current) {
        holdStartRef.current = performance.now();
        stableCountRef.current = 1;
      } else {
        stableCountRef.current += 1;
      }
      const heldMs = performance.now() - (holdStartRef.current || 0);
      const progress = Math.min(1, heldMs / HOLD_MS);

      // Special: when we confirm Pose 3 (final), mark finalPoseDoneRef true and show prompt to lower hand
      if (expected === 'one' && heldMs >= HOLD_MS && stableCountRef.current >= STABLE_REQUIRED) {
        // mark final-pose done but DO NOT start countdown yet
        finalPoseDoneRef.current = true;
        // Show green box with instruction
        drawStatusBox(ctx, box, 'Pose 3 confirmed — lower hand', 'green', 1, vw, vh);
        // keep waiting for hand to disappear; do not auto-capture here
      } else {
        // normal advance behavior for steps three -> two -> one (except final capture logic)
        drawStatusBox(ctx, box, label, 'green', progress, vw, vh);
        if (heldMs >= HOLD_MS && stableCountRef.current >= STABLE_REQUIRED) {
          if (currentStepRef.current === 'three') {
            setCurrentStep('two');
            currentStepRef.current = 'two';
          } else if (currentStepRef.current === 'two') {
            setCurrentStep('one');
            currentStepRef.current = 'one';
            // don't set finalPoseDoneRef here; we require hold confirmation on subsequent frames
          }
          holdStartRef.current = null;
          stableCountRef.current = 0;
        }
      }
    } else {
      // wrong pose
      holdStartRef.current = null;
      stableCountRef.current = 0;
      drawStatusBox(ctx, box, 'Wrong Pose', 'red', 0, vw, vh);
    }

    // draw countdown big number on overlay canvas (kept for backward compatibility)
    if (countdown !== null) {
      drawCountdownBig(ctx, countdown, vw, vh);
    }

    drawLandmarks(ctx, landmarks, vw, vh);
  };

  // finger detection ignoring thumb
  const detectFingers = (landmarks: Array<{x:number,y:number,z:number}>) => {
    const tip = (i:number) => landmarks[i];
    const pip = (i:number) => landmarks[i - 2];

    const indexUp = tip(8).y < pip(8).y;
    const middleUp = tip(12).y < pip(12).y;
    const ringUp = tip(16).y < pip(16).y;
    const pinkyUp = tip(20).y < pip(20).y;

    return { index: indexUp, middle: middleUp, ring: ringUp, pinky: pinkyUp };
  };

  const isPoseThree = (f: {index:boolean,middle:boolean,ring:boolean,pinky:boolean}) => {
    return f.index && f.middle && f.ring && !f.pinky;
  };
  const isPoseTwo = (f: {index:boolean,middle:boolean,ring:boolean,pinky:boolean}) => {
    return f.index && f.middle && !f.ring && !f.pinky;
  };
  const isPoseOne = (f: {index:boolean,middle:boolean,ring:boolean,pinky:boolean}) => {
    return f.index && !f.middle && !f.ring && !f.pinky;
  };

  const drawStatusBox = (ctx: CanvasRenderingContext2D, box: {x:number,y:number,w:number,h:number} | null, label: string, color: 'green' | 'red' | 'gray', progress: number, vw: number, vh: number) => {
    const pad = 8;
    ctx.save();
    ctx.lineWidth = 4;
    const strokeColor = color === 'green' ? 'rgba(34,197,94,0.95)' : color === 'red' ? 'rgba(239,68,68,0.95)' : 'rgba(120,120,120,0.9)';
    const fillColor = strokeColor;

    if (box) {
      ctx.strokeStyle = strokeColor;
      ctx.strokeRect(box.x - pad, box.y - pad, Math.max(30, box.w + pad*2), Math.max(30, box.h + pad*2));
      const labelX = Math.max(8, box.x - pad);
      const labelY = Math.max(8, box.y - 26 - pad);
      ctx.fillStyle = fillColor;
      ctx.font = '14px sans-serif';
      const textWidth = ctx.measureText(label).width;
      const bgW = textWidth + 12;
      ctx.fillRect(labelX, labelY, bgW, 22);
      ctx.fillStyle = 'white';
      ctx.fillText(label, labelX + 6, labelY + 16);

      if (progress > 0) {
        const barW = 80;
        const barX = labelX;
        const barY = labelY + 26;
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(barX, barY, barW, 6);
        ctx.fillStyle = strokeColor;
        ctx.fillRect(barX, barY, barW * progress, 6);
      }
    } else {
      ctx.fillStyle = fillColor;
      ctx.font = '16px sans-serif';
      ctx.fillText(label, 8, 18);
    }
    ctx.restore();
  };

  const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: Array<{x:number,y:number}>, vw: number, vh: number) => {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    for (const p of landmarks) {
      const x = p.x * vw;
      const y = p.y * vh;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const drawCountdownBig = (ctx: CanvasRenderingContext2D, seconds: number | null, vw: number, vh: number) => {
    if (seconds === null) return;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, vw, vh); // dim background
    ctx.fillStyle = 'white';
    ctx.font = `${Math.max(48, Math.floor(vw / 6))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(seconds), vw / 2, vh / 2);
    ctx.restore();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    resetCapture();
  };

  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-[#ffffff] rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 border-b border-[#e0e0e0]">
              <div>
                <h2 className="text-xl font-semibold text-[#1d1f20]">Raise Your Hand to Capture</h2>
                <p className="text-sm text-[#757575] mt-1">
                  {currentStep === 'captured' ? 'Photo captured successfully!' : 'Follow the hand poses in sequence to capture your photo.'}
                </p>
              </div>
              <button onClick={handleClose} className="p-1 hover:bg-[#f6f1eb] rounded transition-colors">
                <X className="w-6 h-6 text-[#1d1f20]" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="rounded-lg overflow-hidden bg-[#e6e6e6] relative">
                {capturedImage ? (
                  <Image src={capturedImage} alt="Captured photo" width={640} height={480} className="w-full h-auto object-cover" unoptimized />
                ) : (
                  <>
                    {/* Mirror video visually so it feels like a selfie */}
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto object-cover transform scale-x-[1]" />
                    <canvas ref={overlayRef} className="absolute left-0 top-0 w-full h-full pointer-events-none transform scale-x-[1]" />
                  </>
                )}

                {/* Gesture Status Overlay */}
                {!capturedImage && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {currentStep === 'three' && 'Show 3 fingers'}
                        {currentStep === 'two' && 'Show 2 fingers'}
                        {currentStep === 'one' && 'Show 1 finger'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Countdown UI (React overlay) */}
                {countdown !== null && !capturedImage && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center justify-center w-40 h-40 rounded-full bg-black/60">
                      <span className="text-5xl font-bold text-white select-none">{countdown}</span>
                    </div>
                  </div>
                )}

              </div>

              <canvas ref={captureCanvasRef} className="hidden" />

              <p className="text-sm text-[#333333] leading-relaxed">
                {capturedImage ? 'Your photo has been captured successfully! You can retake the photo if needed.' :
                  'To take a picture, follow the hand poses in the order shown below. The system will automatically capture the image once the final pose is detected.'}
              </p>

              {/* Pose sequence */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-lg flex items-center justify-center transition-all duration-300 ${currentStep === 'three' ? 'bg-[#01959f] scale-110 shadow-lg' : currentStep === 'two' || currentStep === 'one' || currentStep === 'captured' ? 'bg-[#e0e0e0]' : 'bg-[#f6f1eb]'}`}>
                    <Image src={'/three-hand-sign.png'} width={20} height={45} alt="three-hand-sign" className={currentStep === 'three' ? 'brightness-0 invert' : ''} />
                  </div>
                </div>

                <ChevronRight className={`w-6 h-6 transition-colors ${currentStep === 'two' || currentStep === 'one' || currentStep === 'captured' ? 'text-[#01959f]' : 'text-[#757575]'}`} />

                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-lg flex items-center justify-center transition-all duration-300 ${currentStep === 'two' ? 'bg-[#01959f] scale-110 shadow-lg' : currentStep === 'one' || currentStep === 'captured' ? 'bg-[#e0e0e0]' : 'bg-[#f6f1eb]'}`}>
                    <Image src={'/two-hand-sign.png'} width={20} height={45} alt="two-hand-sign" className={currentStep === 'two' ? 'brightness-0 invert' : ''} />
                  </div>
                </div>

                <ChevronRight className={`w-6 h-6 transition-colors ${currentStep === 'one' || currentStep === 'captured' ? 'text-[#01959f]' : 'text-[#757575]'}`} />

                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-lg flex items-center justify-center transition-all duration-300 ${currentStep === 'one' ? 'bg-[#01959f] scale-110 shadow-lg' : currentStep === 'captured' ? 'bg-[#4ade80]' : 'bg-[#f6f1eb]'}`}>
                    <Image src={'/one-hand-sign.png'} width={20} height={45} alt="one-hand-sign" className={currentStep === 'one' ? 'brightness-0 invert' : currentStep === 'captured' ? 'brightness-0 invert' : ''} />
                  </div>
                </div>
              </div>

              {capturedImage && (
                <div className="flex gap-3 justify-center">
                  <button onClick={resetCapture} className="px-6 py-2 bg-[#01959f] text-white rounded-lg hover:bg-[#017a8a] transition-colors font-medium">Retake Photo</button>
                  <button onClick={() => { setIsModalOpen(false); resetCapture(); }} className="px-6 py-2 bg-[#e0e0e0] text-[#1d1f20] rounded-lg hover:bg-[#d0d0d0] transition-colors font-medium">Done</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandposeCapture;
