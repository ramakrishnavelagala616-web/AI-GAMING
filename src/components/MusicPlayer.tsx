import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cybernetic Echo',
    artist: 'AI Oracle',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'Synthetix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Bass Drift',
    artist: 'Sub-Zero',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&h=400&auto=format&fit=crop'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="glass-panel p-6 neon-shadow-magenta border-neon-magenta/20 flex flex-col gap-4 w-80">
      <div className="flex items-center gap-2 mb-2">
        <Music className="w-4 h-4 text-neon-magenta" />
        <span className="text-xs font-mono uppercase tracking-widest text-neon-magenta opacity-80">Now Playing</span>
      </div>

      <div className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <p className="text-sm font-bold">{currentTrack.title}</p>
          <p className="text-xs opacity-60">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-lg leading-tight truncate">{currentTrack.title}</h3>
        <p className="text-sm text-neon-cyan/70 font-mono italic">{currentTrack.artist}</p>
      </div>

      <div className="space-y-2">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-neon-magenta shadow-[0_0_8px_rgba(255,0,255,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <button 
          onClick={prevTrack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center bg-neon-magenta text-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg neon-shadow-magenta"
        >
          {isPlaying ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6 ml-1" />}
        </button>

        <button 
          onClick={nextTrack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={nextTrack}
      />
    </div>
  );
}
