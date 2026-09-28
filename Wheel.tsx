import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sounds } from './audio';
import { Volume2, VolumeX } from 'lucide-react';

export interface Sector {
  label: string;
  subLabel?: string;
  points: number;
  type: 'points' | 'plus' | 'chance' | 'prize' | 'x2';
  color: string;
  textColor: string;
}

export const WHEEL_SECTORS: Sector[] = [
  { label: '100', subLabel: 'pts', points: 100, type: 'points', color: '#1E3A8A', textColor: '#FFFFFF' }, // Blue
  { label: '+ Տառ', subLabel: 'Буква', points: 200, type: 'plus', color: '#047857', textColor: '#FFFFFF' }, // Green
  { label: '250', subLabel: 'pts', points: 250, type: 'points', color: '#B45309', textColor: '#FFFFFF' }, // Amber
  { label: 'Шанс', subLabel: 'Հնարավոր.', points: 300, type: 'chance', color: '#6D28D9', textColor: '#FFFFFF' }, // Purple
  { label: '150', subLabel: 'pts', points: 150, type: 'points', color: '#0369A1', textColor: '#FFFFFF' }, // Sky
  { label: '500', subLabel: 'pts', points: 500, type: 'points', color: '#BE123C', textColor: '#FFFFFF' }, // Rose
  { label: 'x2', subLabel: 'Կրկնակի', points: 200, type: 'x2', color: '#C2410C', textColor: '#FFFFFF' }, // Orange
  { label: 'Приз', subLabel: 'Մրցանակ', points: 400, type: 'prize', color: '#EAB308', textColor: '#1E293B' }, // Gold
  { label: '200', subLabel: 'pts', points: 200, type: 'points', color: '#15803D', textColor: '#FFFFFF' }, // Emerald
  { label: '350', subLabel: 'pts', points: 350, type: 'points', color: '#4338CA', textColor: '#FFFFFF' }, // Indigo
  { label: '300', subLabel: 'pts', points: 300, type: 'points', color: '#A21CAF', textColor: '#FFFFFF' }, // Fuchsia
  { label: '400', subLabel: 'pts', points: 400, type: 'points', color: '#0F766E', textColor: '#FFFFFF' }, // Teal
];

interface WheelProps {
  onSpinEnd: (sector: Sector) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const Wheel: React.FC<WheelProps> = ({
  onSpinEnd,
  isSpinning,
  setIsSpinning,
  soundEnabled,
  setSoundEnabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastSectorIndexRef = useRef<number>(-1);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);

  const numSectors = WHEEL_SECTORS.length;
  const arcSize = (2 * Math.PI) / numSectors;

  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 16;

    ctx.clearRect(0, 0, width, height);

    // Save state for rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    // Draw sectors
    for (let i = 0; i < numSectors; i++) {
      const sector = WHEEL_SECTORS[i];
      const startAngle = i * arcSize;
      const endAngle = startAngle + arcSize;

      // Sector slice
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = sector.color;
      ctx.fill();

      // Sector border
      ctx.strokeStyle = '#FFFFFF30';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sector text
      ctx.save();
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = sector.textColor;

      // Primary label
      ctx.font = 'bold 17px system-ui, -apple-system, sans-serif';
      ctx.fillText(sector.label, radius - 24, 0);

      // Sub label
      if (sector.subLabel) {
        ctx.font = '10px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = sector.textColor === '#FFFFFF' ? '#E2E8F0' : '#475569';
        ctx.fillText(sector.subLabel, radius - 24, 15);
      }

      ctx.restore();
    }

    // Outer ring with decorative pegs / bulbs
    ctx.restore(); // wheel rotation restored

    // Outer rim
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#D97706'; // Gold/Amber rim
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 13, 0, 2 * Math.PI);
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pegs on rim
    for (let i = 0; i < numSectors * 2; i++) {
      const pegAngle = angle + (i * Math.PI) / numSectors;
      const px = centerX + (radius + 8) * Math.cos(pegAngle);
      const py = centerY + (radius + 8) * Math.sin(pegAngle);

      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#FEF08A' : '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Center hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 38, 0, 2 * Math.PI);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner center gem
    ctx.beginPath();
    ctx.arc(centerX, centerY, 22, 0, 2 * Math.PI);
    const grad = ctx.createRadialGradient(centerX - 4, centerY - 4, 2, centerX, centerY, 22);
    grad.addColorStop(0, '#FDE047');
    grad.addColorStop(1, '#B45309');
    ctx.fillStyle = grad;
    ctx.fill();
  }, [arcSize, numSectors]);

  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [drawWheel]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedSector(null);

    const fullRotations = 4 + Math.random() * 4; // 4 to 8 full spins
    const randomSectorOffset = Math.random() * 2 * Math.PI;
    const targetDelta = fullRotations * 2 * Math.PI + randomSectorOffset;

    const startAngle = currentAngleRef.current;
    const finalAngle = startAngle + targetDelta;
    const duration = 4000 + Math.random() * 800; // 4 - 4.8 seconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic ease out deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3.2);
      const current = startAngle + targetDelta * easeOut;
      currentAngleRef.current = current;

      // Pointer is at the top (-Math.PI / 2)
      // Calculate sector under pointer:
      const normalizedAngle = (current % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      // Top pointer angle in wheel coordinate system:
      // Pointer is at 1.5 * Math.PI (or -Math.PI / 2)
      const pointerAngle = (1.5 * Math.PI - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
      const currentSectorIndex = Math.floor(pointerAngle / arcSize) % numSectors;

      if (currentSectorIndex !== lastSectorIndexRef.current) {
        lastSectorIndexRef.current = currentSectorIndex;
        sounds.playTick();
      }

      drawWheel(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        currentAngleRef.current = finalAngle % (2 * Math.PI);
        const winningSector = WHEEL_SECTORS[currentSectorIndex];
        setSelectedSector(winningSector);
        setIsSpinning(false);
        sounds.playCorrect();
        onSpinEnd(winningSector);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-3 relative">
      {/* Top pointer needle */}
      <div className="relative flex justify-center w-full mb-[-22px] z-20">
        <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-amber-400 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"></div>
      </div>

      {/* Wheel Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={380}
          height={380}
          className="max-w-[340px] sm:max-w-[380px] w-full aspect-square drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] cursor-pointer transition-transform hover:scale-[1.01]"
          onClick={spin}
          aria-label="Барабан Поле Чудес"
        />

        {/* Center Spin Button Overlay */}
        <button
          onClick={spin}
          disabled={isSpinning}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex flex-col items-center justify-center font-bold text-xs uppercase shadow-xl transition-all border-2 border-amber-300 ${
            isSpinning
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed scale-95 opacity-80'
              : 'bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 hover:brightness-110 active:scale-95 cursor-pointer hover:shadow-amber-500/30'
          }`}
          title="Нажмите, чтобы крутить барабан"
        >
          <span className="text-[13px] leading-tight font-black tracking-wider">КРУТИТЬ</span>
          <span className="text-[10px] opacity-90 font-medium">ՊՏՏԵԼ</span>
        </button>
      </div>

      {/* Control bar under wheel */}
      <div className="flex items-center justify-between w-full max-w-[360px] mt-4 px-2">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <span>Сектор:</span>
          {selectedSector ? (
            <span className="font-semibold text-amber-300">
              {selectedSector.label} {selectedSector.subLabel && `(${selectedSector.subLabel})`}
            </span>
          ) : (
            <span className="text-slate-500">Крутите барабан</span>
          )}
        </div>

        <button
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            sounds.setEnabled(next);
          }}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded bg-slate-800/80 border border-slate-700/60"
          title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Звук ВКЛ</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              <span>Звук ВЫКЛ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
