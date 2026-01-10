import React, { useState, useRef, useEffect } from 'react';
import songData from './songData';

const PixelMusicPlayer = () => {
  // --- Mood Logic ---
  const moods = Object.keys(songData);
  const [currentMood, setCurrentMood] = useState(moods[0]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);

  // Derive tracks from currentMood
  const tracks = songData[currentMood];

  // Reset track index when mood changes
  useEffect(() => {
    setCurrentTrack(0);
    setIsPlaying(false);
    setProgress(0);
  }, [currentMood]);

  // --- Audio Logic ---
  useEffect(() => {
    if(audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if(!audio) return;
    const updateProgress = () => { if(audio.duration) setProgress((audio.currentTime / audio.duration) * 100); };
    const handleEnded = () => nextTrack();
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, currentMood]);

  const togglePlay = () => {
    if(isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const cycleMood = (direction) => {
    const currentIndex = moods.indexOf(currentMood);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = moods.length - 1;
    if (nextIndex >= moods.length) nextIndex = 0;
    setCurrentMood(moods[nextIndex]);
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if(audioRef.current) audioRef.current.currentTime = pos * audioRef.current.duration;
  };

  // --- Components ---

  const PixelRecord = ({ isSpinning }) => {
    const outerSize = 32;
    const outerCenter = outerSize / 2;
    const outerRadius = 16; 
    const outerPixels = [];
    const sheenPixels = [];

    for(let y = 0; y < outerSize; y++) {
      for(let x = 0; x < outerSize; x++) {
        const dx = x + 0.5 - outerCenter;
        const dy = y + 0.5 - outerCenter;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if(dist <= outerRadius) {
           if(dist > 5.5) {
              outerPixels.push(<rect key={`o-${x}-${y}`} x={x} y={y} width="1" height="1" fill="#111" />);
           }
           if(dist > 5.5 && dx < 0 && dy < 0) {
              if(Math.floor(dist) % 4 === 0) {
                 sheenPixels.push(<rect key={`s-${x}-${y}`} x={x} y={y} width="1" height="1" fill="rgba(255,255,255,0.15)" />);
              }
           }
        }
      }
    }

    const innerSize = 64;
    const innerCenter = innerSize / 2;
    const labelRadiusHighRes = 11;
    const innerPixels = [];

    for(let y = 0; y < innerSize; y++) {
      for(let x = 0; x < innerSize; x++) {
        const dx = x + 0.5 - innerCenter;
        const dy = y + 0.5 - innerCenter;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if(dist <= labelRadiusHighRes) {
           let color = "#FF0055";
           if(dist <= 4) color = "#EEE";
           innerPixels.push(<rect key={`i-${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />);
        }
      }
    }

    const spinAnimation = isSpinning ? 'spin 3.9s linear infinite' : 'none';

    return (
      <div style={{ width: '220px', height: '220px', position: 'relative' }}>
        <svg viewBox={`0 0 ${outerSize} ${outerSize}`} width="100%" height="100%" style={{ shapeRendering: 'crispEdges', position: 'absolute', inset: 0, animation: spinAnimation }}>
           {outerPixels}
        </svg>
        <svg viewBox={`0 0 ${innerSize} ${innerSize}`} width="100%" height="100%" style={{ shapeRendering: 'crispEdges', position: 'absolute', inset: 0, animation: spinAnimation }}>
           {innerPixels}
        </svg>
        <svg viewBox={`0 0 ${outerSize} ${outerSize}`} width="100%" height="100%" style={{ shapeRendering: 'crispEdges', position: 'absolute', inset: 0, pointerEvents: 'none' }}>
           {sheenPixels}
        </svg>
      </div>
    );
  };

  const PixelTonearm = () => (
    <svg width="48" height="140" viewBox="0 0 48 140" style={{ shapeRendering: 'crispEdges' }}>
      <rect x="24" y="0" width="16" height="24" fill="#475569" />
      <rect x="28" y="4" width="8" height="16" fill="#64748b" />
      <rect x="30" y="24" width="4" height="80" fill="#94a3b8" />
      <rect x="26" y="104" width="4" height="4" fill="#94a3b8" />
      <rect x="22" y="108" width="4" height="4" fill="#94a3b8" />
      <rect x="18" y="112" width="4" height="4" fill="#94a3b8" />
      <rect x="8" y="116" width="14" height="20" fill="#FF0055" />
      <rect x="10" y="118" width="10" height="16" fill="#fb7185" />
    </svg>
  );

  const PixelNote = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" style={{ shapeRendering: 'crispEdges' }}>
      {/* High-res pixelated beamed note */}
      {/* Beam */}
      <rect x="8" y="8" width="34" height="6" fill="currentColor" />
      {/* Stems */}
      <rect x="8" y="14" width="6" height="22" fill="currentColor" />
      <rect x="36" y="14" width="6" height="22" fill="currentColor" />
      {/* Note heads */}
      <rect x="4" y="32" width="14" height="10" fill="currentColor" />
      <rect x="32" y="32" width="14" height="10" fill="currentColor" />

      {/* Pixel detailing */}
      <rect x="9" y="9" width="32" height="2" fill="rgba(255,255,255,0.3)" />
      <rect x="9" y="14" width="2" height="22" fill="rgba(255,255,255,0.3)" />
      <rect x="37" y="14" width="2" height="22" fill="rgba(255,255,255,0.3)" />
      <rect x="5" y="33" width="4" height="4" fill="rgba(255,255,255,0.3)" />
      <rect x="33" y="33" width="4" height="4" fill="rgba(255,255,255,0.3)" />
    </svg>
  );

  const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path d="M8 5v14l11-7z" fill="currentColor"/></svg>;
  const PauseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/></svg>;
  const PrevIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="currentColor"/></svg>;
  const NextIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="currentColor"/></svg>;
  const VolumeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="currentColor"/></svg>;
  const ArrowUpIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path d="M7 14l5-5 5 5z" fill="currentColor"/></svg>;
  const ArrowDownIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg>;

  // Prepare text for continuous scrolling
  const marqueeText = `  NOW PLAYING: ${tracks[currentTrack].title} - ${tracks[currentTrack].artist}   +++ \u00A0   `;

  return (
    <div className="pixel-player-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        
        @keyframes scroll { 
          0% { transform: translateX(0); } 
          100% { transform: translateX(-50%); } 
        }

        body, html {
          margin: 0;
          padding: 0;
          background-color: #2D2B55;
        }

        .pixel-player-container {
          min-height: 100dvh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #2D2B55;
          background-image: radial-gradient(#4B4D89 2px, transparent 2px);
          background-size: 32px 32px;
          font-family: 'VT323', monospace;
          image-rendering: pixelated;
          color: #E2D9F3;
          padding: 16px;
          box-sizing: border-box;
        }

        .player-card {
          width: 100%;
          max-width: 360px;
          background: #1E1C38;
          padding: 32px 24px;
          position: relative;
          box-shadow: 
            -4px 0 0 0 #0f0e1c, 
            4px 0 0 0 #0f0e1c, 
            0 -4px 0 0 #0f0e1c, 
            0 4px 0 0 #0f0e1c, 
            -8px 8px 0 0 rgba(0,0,0,0.3);
        }

        .turntable-wrapper {
          position: relative;
          height: 240px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 24px;
          background: #151329;
          box-shadow: inset 2px 2px 0 rgba(0,0,0,0.5);
        }

        .tonearm-assembly {
          position: absolute;
          top: 10px;
          right: 20px;
          width: 48px;
          height: 140px;
          pointer-events: none;
          z-index: 20;
          transform-origin: 32px 12px; 
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .led-screen-container {
          background-color: #100505;
          border: 4px solid #151329;
          height: 50px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          box-shadow: inset 0 0 15px rgba(255, 85, 0, 0.2);
        }

        .led-text-wrapper {
          display: flex;
          white-space: nowrap;
          position: absolute;
          left: 0;
          animation: scroll 30s linear infinite;
        }

        .led-text {
          font-family: 'VT323', monospace;
          font-size: 28px;
          color: #FF5500;
          text-shadow: 0 0 4px rgba(255, 85, 0, 0.6), 0 0 8px rgba(255, 85, 0, 0.4);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .led-scanlines {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.25) 50%);
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 5;
        }
        
        .led-glare {
          position: absolute;
          top: 0; right: 0;
          width: 40px; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05));
          pointer-events: none;
        }

        .progress-bar {
          height: 24px;
          background: #2D2B55;
          margin-bottom: 24px;
          position: relative;
          cursor: pointer;
          border: 4px solid #4B4D89;
          padding: 2px;
        }
        .progress-fill {
          height: 100%;
          background: repeating-linear-gradient(
            45deg,
            #FF0055,
            #FF0055 4px,
            #D40046 4px,
            #D40046 8px
          );
          position: relative;
          transition: width 0.1s linear;
        }
        .progress-fill::after {
          content: '';
          position: absolute;
          right: -4px; top: -2px; bottom: -2px;
          width: 8px;
          background: #FFF;
          box-shadow: 2px 0 0 rgba(0,0,0,0.3);
        }

        .controls {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .btn-group {
          display: flex;
          gap: 20px;
          justify-content: center;
          width: 100%;
          align-items: center;
        }

        /* 3D BUTTON STYLE */
        .pixel-btn {
          position: relative;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          outline: none;
          transition: transform 0.1s;
        }

        .pixel-btn-inner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom right, var(--btn-light), var(--btn-main));
          box-shadow:
            inset 4px 4px 0px 0px rgba(255,255,255, 0.4),
            inset -4px -4px 0px 0px rgba(0,0,0, 0.3),
            0px 6px 0px 0px var(--btn-shadow),
            0px 8px 8px 0px rgba(0,0,0,0.4);
        }

        .pixel-btn:active {
          transform: translateY(6px);
        }
        .pixel-btn:active .pixel-btn-inner {
          box-shadow:
            inset 4px 4px 0px 0px rgba(255,255,255, 0.4),
            inset -4px -4px 0px 0px rgba(0,0,0, 0.3),
            0px 0px 0px 0px var(--btn-shadow);
        }

        .pixel-btn.secondary {
          width: 64px; height: 64px;
          --btn-light: #A5A6C5;
          --btn-main: #8485A4;
          --btn-shadow: #5D5E75;
          color: #2D2B55;
        }

        .pixel-btn.primary {
          width: 80px; height: 80px;
          --btn-light: #6EF3F8;
          --btn-main: #5DE2E7;
          --btn-shadow: #3AA9AD;
          color: #1E1C38;
        }

        .pixel-btn.tertiary {
           width: 50px; height: 50px;
           --btn-light: #FF9E64;
           --btn-main: #FF702E;
           --btn-shadow: #CC5500;
           color: #1E1C38;
        }

        .pixel-btn svg {
          filter: drop-shadow(2px 2px 0 rgba(0,0,0,0.2));
        }

        .volume-container {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #151329;
          padding: 12px 16px;
          border: 4px solid #4B4D89;
          margin-top: 8px;
          width: 100%;
          box-sizing: border-box;
        }
        input[type=range] {
          -webkit-appearance: none;
          background: transparent;
          width: 100%;
          height: 32px;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px; width: 24px;
          background: #FF0055;
          border: 3px solid #FFF;
          cursor: pointer;
          margin-top: -8px;
          box-shadow: 2px 2px 0 rgba(0,0,0,0.5);
          image-rendering: pixelated;
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%; height: 8px;
          background: #4B4D89;
          border: 2px solid #000;
          box-shadow: inset 1px 1px 0 rgba(0,0,0,0.5);
        }

        /* MOOD UI */
        .mood-section {
          background: #100f1f;
          border: 4px solid #4B4D89;
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .mood-screen {
          background: #000;
          padding: 8px 12px;
          border: 2px solid #333;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
          color: #2F2;
          font-family: 'VT323', monospace;
          text-transform: uppercase;
          font-size: 20px;
          box-shadow: inset 0 0 10px rgba(0, 255, 0, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .led-indicator {
           width: 8px; height: 8px;
           background: #111;
           border-radius: 50%;
           box-shadow: 0 0 2px #000;
        }
        .led-indicator.on {
           background: #0F0;
           box-shadow: 0 0 8px #0F0;
        }

        .mood-controls {
           display: flex;
           align-items: center;
           gap: 16px;
           justify-content: center;
        }

        .mood-label {
           color: #8485A4;
           font-size: 14px;
           letter-spacing: 1px;
        }

      `}</style>

      <div className="player-card">
        
        {isPlaying && (
          <div style={{
            position: 'absolute', top: '-40px', right: '10px',
            color: '#5DE2E7',
            animation: 'float 2s infinite ease-in-out',
            zIndex: 30
          }}>
            <PixelNote />
          </div>
        )}

        <div className="turntable-wrapper">
          <PixelRecord isSpinning={isPlaying} />
          <div className="tonearm-assembly" style={{ transform: isPlaying ? 'rotate(25deg)' : 'rotate(0deg)' }}>
             <PixelTonearm />
          </div>
        </div>

        {/* MOOD SECTION */}
        <div className="mood-section">
           <div className="mood-screen">
              <div className={`led-indicator ${isPlaying ? 'on' : ''}`} style={{ background: '#F00', boxShadow: isPlaying ? '0 0 8px #F00' : 'none' }}></div>
              <span style={{ margin: '0 8px' }}>MOOD: {currentMood}</span>
              <div className="led-indicator on"></div>
           </div>

           <div className="mood-controls">
              <button className="pixel-btn tertiary" onClick={() => cycleMood(-1)} aria-label="Previous Mood">
                <div className="pixel-btn-inner"><ArrowUpIcon /></div>
              </button>
              <span className="mood-label">CHANNEL</span>
              <button className="pixel-btn tertiary" onClick={() => cycleMood(1)} aria-label="Next Mood">
                 <div className="pixel-btn-inner"><ArrowDownIcon /></div>
              </button>
           </div>
        </div>

        {/* LED Screen with Continuous Scrolling */}
        <div className="led-screen-container">
          <div className="led-text-wrapper">
            <span className="led-text">{marqueeText}</span>
            <span className="led-text">{marqueeText}</span>
          </div>
          <div className="led-scanlines"></div>
          <div className="led-glare"></div>
        </div>

        <div className="progress-bar" onClick={handleProgressClick}>
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="controls">
          <div className="btn-group">
            <button className="pixel-btn secondary" onClick={prevTrack} aria-label="Previous Track">
              <div className="pixel-btn-inner"><PrevIcon /></div>
            </button>
            <button className="pixel-btn primary" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
              <div className="pixel-btn-inner">
                 {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </div>
            </button>
            <button className="pixel-btn secondary" onClick={nextTrack} aria-label="Next Track">
              <div className="pixel-btn-inner"><NextIcon /></div>
            </button>
          </div>

          <div className="volume-container">
            <div style={{ marginRight: '12px', color: '#A5A6C5' }}><VolumeIcon /></div>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))} 
              aria-label="Volume Control"
            />
          </div>
        </div>

      </div>

      <audio 
        ref={audioRef} 
        src={tracks[currentTrack].url} 
        onLoadedData={() => { if(isPlaying) audioRef.current?.play(); }}
      />
    </div>
  );
};

export default PixelMusicPlayer;
