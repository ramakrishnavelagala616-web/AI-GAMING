import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Cpu, Wifi, Battery, Radio } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#000_100%)] z-0" />
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-neon-cyan rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-neon-magenta rounded-full blur-[150px]" />
      </div>

      {/* Top Bar / HUD */}
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">
              Neon<span className="text-neon-cyan">Riff</span>
            </h1>
            <div className="flex items-center gap-2 opacity-40 font-mono text-[10px] uppercase tracking-widest">
              <span className="w-2 h-2 bg-neon-lime rounded-full animate-pulse" />
              Connection: Stable
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-white/30 pointer-events-auto">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span className="text-[10px] font-mono">0.4 GFLOPS</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            <span className="text-[10px] font-mono">ENCRYPTED</span>
          </div>
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-neon-lime" />
            <span className="text-[10px] font-mono">100%</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 items-center">
        
        {/* Left Aesthetic Column (Desktop) */}
        <aside className="hidden lg:flex flex-col gap-8 items-start opacity-40">
          <div className="space-y-4">
            <div className="h-0.5 w-12 bg-neon-cyan" />
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] leading-relaxed max-w-[200px]">
              Transmitting neural wave patterns through localized matrix frequency. 
              Synchronization level: 98.4%.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Radio className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase">Frequency Guard IA-2</span>
            </div>
            <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-white/20 w-3/4" />
            </div>
          </div>
        </aside>

        {/* Center Game Window */}
        <section className="flex flex-col items-center">
          <SnakeGame />
          <div className="mt-8 flex gap-4 lg:hidden">
            <MusicPlayer />
          </div>
        </section>

        {/* Right Music Player (Desktop) */}
        <aside className="hidden lg:flex justify-end">
          <MusicPlayer />
        </aside>
      </main>

      {/* Footer / Credits */}
      <footer className="fixed bottom-0 left-0 w-full p-6 flex justify-center z-50 pointer-events-none opacity-20">
        <p className="text-[10px] font-mono uppercase tracking-[0.5em]">SYSTEM REV 4.2.0 // TERMINAL_ESTABLISH</p>
      </footer>
    </div>
  );
}
