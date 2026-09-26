import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Clock, Flame } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

export const LiveCafeStatus: React.FC = () => {
  const { settings, orders } = useCafe();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio Ambient Cafe Generator (Gentle warm rain & cafe vinyl hum)
  const toggleAmbientSound = () => {
    if (isPlayingAudio) {
      if (gainNode) {
        gainNode.gain.linearRampToValueAtTime(0.001, (audioContext?.currentTime || 0) + 0.5);
        setTimeout(() => {
          audioContext?.suspend();
          setIsPlayingAudio(false);
        }, 500);
      }
    } else {
      try {
        const ctx = audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        setAudioContext(ctx);

        // Pink/brown noise generator for gentle cafe background murmur
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Bandpass filter to make it sound like warm acoustic room ambiance
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 520;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.2);
        setGainNode(gain);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        whiteNoise.start();
        setIsPlayingAudio(true);
      } catch (e) {
        console.error('Audio ambient failed', e);
      }
    }
  };

  const todayOrdersCount = Math.max(orders.length, 14);

  return (
    <div className="bg-[#171614] border-b border-[#2A2724] text-xs py-2 px-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        
        {/* Left: Active Kitchen Pulse */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400 tracking-wide">
              OPEN NOW
            </span>
          </div>

          <span aria-hidden="true" className="text-stone-700">·</span>

          <span className="text-stone-300 hidden sm:inline">
            Espresso & Kitchen active in <span className="text-stone-100 font-medium">Colombo 07</span>
          </span>

          <span aria-hidden="true" className="text-stone-700 hidden sm:inline">·</span>

          <div className="flex items-center gap-1 text-stone-400">
            <Clock className="w-3.5 h-3.5 text-amber-500/80" />
            <span className="font-mono text-stone-300">{currentTimeStr}</span>
          </div>
        </div>

        {/* Right: Live stats & Cozy Ambient Soundscape */}
        <div className="flex items-center gap-4 text-stone-400">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-stone-300 font-medium tabular-nums font-mono">
              {todayOrdersCount} orders
            </span>
            <span className="text-stone-500 hidden md:inline">served today</span>
          </div>

          <span aria-hidden="true" className="text-stone-700">·</span>

          {/* Ambient Cafe Sound Player */}
          <button
            onClick={toggleAmbientSound}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border ${
              isPlayingAudio
                ? 'bg-amber-950/70 border-amber-600/60 text-amber-200 shadow-sm'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
            }`}
            title="Toggle soothing coffeehouse background acoustics"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3 h-3 text-amber-400 animate-pulse" />
                <span className="font-mono text-[10px]">Ambient Ambiance: ON</span>
                <span className="flex gap-0.5 items-end h-2.5 w-2.5 ml-0.5">
                  <span className="w-0.5 bg-amber-400 h-2 animate-bounce"></span>
                  <span className="w-0.5 bg-amber-400 h-1.5 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-0.5 bg-amber-400 h-2.5 animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3 text-stone-500" />
                <span>Cafe Audio Ambiance</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
