import React, { useState, useRef, useEffect } from 'react';

const PixelMusicPlayer = () => {
  const [moodIndex, setMoodIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);

  const MOODS = [
    {
      label: "INTRO",
      short: "INT",
      tracks: [{ title: "Intro", artist: "Buddhu", url: "/songs/intro.m4a" }]
    },
    {
      label: "CHATPATE",
      short: "CHT",
      tracks: [
        { title: "Chikni Chameli", artist: "Buddhu", url: "/songs/chatpate/chikni chameli.m4a" },
        { title: "Mera Nam Mary H", artist: "Buddhu", url: "/songs/chatpate/mera nam mary h.m4a" }
      ]
    },
    {
      label: "FLIRTING",
      short: "FLR",
      tracks: [
        { title: "Afreen Afreen", artist: "Buddhu", url: "/songs/flirting shlirting/afreen afreen.m4a" },
        { title: "Mujhe Haq H", artist: "Buddhu", url: "/songs/flirting shlirting/mujhe haq h.m4a" }
      ]
    },
    {
      label: "NO BAKBAK",
      short: "NOB",
      tracks: [
        { title: "Gulabi Aankhein", artist: "Buddhu", url: "/songs/koi bakbak sunne ko nhi h/gulabi aankhein.m4a" },
        { title: "Love Dose", artist: "Buddhu", url: "/songs/koi bakbak sunne ko nhi h/love dose.m4a" }
      ]
    },
    {
      label: "ANGRY",
      short: "ANG",
      tracks: [
        { title: "Acha Ji Mai Haari", artist: "Buddhu", url: "/songs/mai gussa hu/acha ji mai haari.m4a" },
        { title: "Tu Hai To", artist: "Buddhu", url: "/songs/mai gussa hu/tu hai to.m4a" }
      ]
    },
    {
      label: "SUKOON",
      short: "SUK",
      tracks: [
        { title: "Bade Ache Lgte H", artist: "Buddhu", url: "/songs/sukoon/bade ache lgte h.m4a" }
      ]
    },
    {
      label: "MISSING",
      short: "MIS",
      tracks: [
        { title: "Hey There Delilah", artist: "Buddhu", url: "/songs/yad aa rhi h/hey there delilah.m4a" },
        { title: "I'll Miss U", artist: "Buddhu", url: "/songs/yad aa rhi h/i'll miss u.m4a" }
      ]
    }
  ];

  const tracks = MOODS[moodIndex].tracks;

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
  }, [currentTrack, moodIndex]);

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

  const changeMood = (direction) => {
    let newIndex = moodIndex + direction;
    if (newIndex < 0) newIndex = MOODS.length - 1;
    if (newIndex >= MOODS.length) newIndex = 0;
    setMoodIndex(newIndex);
    setCurrentTrack(0);
    setProgress(0);
    setIsPlaying(true);
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

  // Exact Single Eighth Note from Image
  const PixelNote = () => (
    <svg width="32" height="32" viewBox="0 0 16 16" style={{ shapeRendering: 'crispEdges' }}>
       {/* Stem */}
       <rect x="8" y="2" width="2" height="10" fill="currentColor" />
       
       {/* Flag */}
       <rect x="10" y="2" width="2" height="2" fill="currentColor" />
       <rect x="12" y="3" width="1" height="2" fill="currentColor" />
       <rect x="12" y="5" width="1" height="1" fill="currentColor" />
       
       {/* Head */}
       <rect x="4" y="10" width="6" height="4" fill="currentColor" />
       <rect x="5" y="9" width="4" height="6" fill="currentColor" />
    </svg>
  );

  const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path d="M8 5v14l11-7z" fill="currentColor"/></svg>;
  const PauseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/></svg>;
  const PrevIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="currentColor"/></svg>;
  const NextIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="currentColor"/></svg>;
  const MoodPrevIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>;
  const MoodNextIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>;

  // Dynamic High Res Volume Icon
  const HighResVolumeIcon = ({ vol }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" style={{ shapeRendering: 'crispEdges' }}>
      {/* Speaker Body (Blue/Cyan with dark outline) */}
      <path d="M4 8h4l5-5v18l-5-5H4z" fill="#5DE2E7" stroke="#100f1f" strokeWidth="2" />
      <rect x="5" y="9" width="2" height="6" fill="#FFF" opacity="0.5" /> {/* Body Shine */}

      {/* Wave 1 (Low) */}
      <path d="M15 10v4" stroke="#FFF" strokeWidth="2" fill="none" 
            opacity={vol > 0 ? 1 : 0.2} strokeLinecap="square" />
      
      {/* Wave 2 (Medium) */}
      <path d="M18 8v8" stroke="#FFF" strokeWidth="2" fill="none" 
            opacity={vol > 0.33 ? 1 : 0.2} strokeLinecap="square" />

      {/* Wave 3 (High) */}
      <path d="M21 6v12" stroke="#FFF" strokeWidth="2" fill="none" 
            opacity={vol > 0.66 ? 1 : 0.2} strokeLinecap="square" />
    </svg>
  );

  const marqueeText = `  MOOD: ${MOODS[moodIndex].label}  +++  NOW PLAYING: ${tracks[currentTrack]?.title} - ${tracks[currentTrack]?.artist}   +++ \u00A0   `;

  return (
    <div className="pixel-player-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        body, html {
          margin: 0; padding: 0; background-color: #2D2B55;
        }

        .pixel-player-container {
          min-height: 100dvh; width: 100%; display: flex; align-items: center; justify-content: center;
          background-color: #2D2B55;
          background-image: radial-gradient(#4B4D89 2px, transparent 2px);
          background-size: 32px 32px;
          font-family: 'VT323', monospace; image-rendering: pixelated; color: #E2D9F3;
          padding: 16px; box-sizing: border-box;
        }

        .player-card {
          width: 100%; max-width: 360px; background: #1E1C38; padding: 32px 24px; position: relative;
          box-shadow: -4px 0 0 0 #0f0e1c, 4px 0 0 0 #0f0e1c, 0 -4px 0 0 #0f0e1c, 0 4px 0 0 #0f0e1c, -8px 8px 0 0 rgba(0,0,0,0.3);
        }

        .turntable-wrapper {
          position: relative; height: 240px; display: flex; justify-content: center; align-items: center;
          margin-bottom: 24px; background: #151329; box-shadow: inset 2px 2px 0 rgba(0,0,0,0.5);
        }

        .tonearm-assembly {
          position: absolute; top: 10px; right: 20px; width: 48px; height: 140px; pointer-events: none;
          z-index: 20; transform-origin: 32px 12px; transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .led-screen-container {
          background-color: #100505; border: 4px solid #151329; height: 50px; margin-bottom: 24px;
          position: relative; overflow: hidden; display: flex; align-items: center;
          box-shadow: inset 0 0 15px rgba(255, 85, 0, 0.2);
        }

        .led-text-wrapper {
          display: flex; white-space: nowrap; position: absolute; left: 0; animation: scroll 20s linear infinite;
        }

        .led-text {
          font-family: 'VT323', monospace; font-size: 28px; color: #FF5500;
          text-shadow: 0 0 4px rgba(255, 85, 0, 0.6), 0 0 8px rgba(255, 85, 0, 0.4);
          letter-spacing: 2px; text-transform: uppercase;
        }

        .led-scanlines {
          position: absolute; inset: 0; pointer-events: none; z-index: 5;
          background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.25) 50%); background-size: 100% 4px;
        }
        
        .led-glare {
          position: absolute; top: 0; right: 0; width: 40px; height: 100%; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05));
        }

        .progress-bar {
          height: 24px; background: #2D2B55; margin-bottom: 24px; position: relative; cursor: pointer;
          border: 4px solid #4B4D89; padding: 2px;
        }
        .progress-fill {
          height: 100%; position: relative; transition: width 0.1s linear;
          background: repeating-linear-gradient(45deg, #FF0055, #FF0055 4px, #D40046 4px, #D40046 8px);
        }
        .progress-fill::after {
          content: ''; position: absolute; right: -4px; top: -2px; bottom: -2px; width: 8px;
          background: #FFF; box-shadow: 2px 0 0 rgba(0,0,0,0.3);
        }

        .controls { display: flex; flex-direction: column; gap: 16px; }
        .btn-group { display: flex; gap: 16px; justify-content: center; width: 100%; }

        .pixel-btn {
          border: 4px solid #100f1f; background: #E2D9F3; color: #2D2B55; cursor: pointer;
          display: flex; align-items: center; justify-content: center; position: relative;
          box-shadow: inset 4px 4px 0px 0px rgba(255,255,255, 0.8), inset -4px -4px 0px 0px rgba(0,0,0, 0.3);
          transition: transform 0.05s, box-shadow 0.05s;
        }
        .pixel-btn:active {
          transform: translateY(4px);
          box-shadow: inset 4px 4px 0px 0px rgba(0,0,0, 0.3), inset -4px -4px 0px 0px rgba(255,255,255, 0.8);
        }
        .pixel-btn.primary { width: 72px; height: 72px; background: #5DE2E7; color: #1E1C38; }
        .pixel-btn.secondary { width: 56px; height: 56px; background: #A5A6C5; }
        .pixel-btn.mood { width: 48px; height: 48px; background: #FFB86C; color: #1E1C38; }

        /* --- Updated Vintage Volume Control --- */
        .volume-container {
          display: flex; align-items: center; justify-content: space-between;
          background: #151329; padding: 16px; border: 4px solid #4B4D89;
          margin-top: 8px; width: 100%; box-sizing: border-box;
          box-shadow: inset 2px 2px 8px rgba(0,0,0,0.4);
        }

        /* Segmented Track Look */
        input[type=range] {
          -webkit-appearance: none; background: transparent; width: 100%; height: 28px; margin: 0;
        }
        
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%; height: 20px;
          /* Alternating segments to create the 'bar' look */
          background: repeating-linear-gradient(
            to right,
            #151329,          /* Border start */
            #151329 2px,
            #FFB86C 2px,      /* Segment color (using existing mood orange/gold) */
            #FFB86C 14px,     
            #151329 14px,     /* Border end */
            #151329 16px      /* Gap */
          );
          border: 2px solid #100f1f;
          border-radius: 4px;
        }

        /* Rectangular Thumb (Handle) */
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 26px; width: 14px;
          background: #FF0055; /* Main Pink */
          border: 2px solid #100f1f;
          margin-top: -5px; /* Centers thumb over the 20px track */
          cursor: pointer;
          box-shadow: 
            inset 2px 2px 0 rgba(255, 255, 255, 0.4), /* Shine */
            inset -2px -2px 0 rgba(0, 0, 0, 0.2);
          /* Gloss effect on thumb */
          background-image: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%);
        }

        /* Mood LED Styles */
        .mood-section {
          display: flex; align-items: center; justify-content: space-between;
          background: #100505; padding: 12px 8px; border: 2px solid #4B4D89; margin-bottom: 16px;
        }
        .led-group { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
        .led-container { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .vintage-led {
          width: 12px; height: 12px; background-color: #400000; border: 1px solid #000;
          box-shadow: inset 1px 1px 2px rgba(0,0,0,0.8); border-radius: 2px;
        }
        .vintage-led.active {
          background-color: #FF3300; box-shadow: 0 0 6px #FF3300, inset 1px 1px 2px rgba(255,200,200,0.5);
        }
        .led-label {
          font-family: 'VT323', monospace; color: #555; font-size: 14px; line-height: 1;
        }
        .led-label.active { color: #FF5500; text-shadow: 0 0 4px rgba(255, 85, 0, 0.4); }
      `}</style>

      <div className="player-card">
        
        {isPlaying && (
          <div style={{
            position: 'absolute', top: '-10px', right: '6px', 
            color: '#5DE2E7', animation: 'float 3s infinite ease-in-out', zIndex: 30
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

        {/* LED Screen */}
        <div className="led-screen-container">
          <div className="led-text-wrapper">
            <span className="led-text">{marqueeText}</span>
            <span className="led-text">{marqueeText}</span>
          </div>
          <div className="led-scanlines"></div>
          <div className="led-glare"></div>
        </div>

        {/* Mood Controls */}
        <div className="mood-section">
           <button className="pixel-btn mood" onClick={() => changeMood(-1)} aria-label="Previous Mood"><MoodPrevIcon /></button>
           <div className="led-group">
             {MOODS.map((mood, idx) => (
               <div key={idx} className="led-container">
                 <div className={`vintage-led ${idx === moodIndex ? 'active' : ''}`} />
                 <span className={`led-label ${idx === moodIndex ? 'active' : ''}`}>{mood.short}</span>
               </div>
             ))}
           </div>
           <button className="pixel-btn mood" onClick={() => changeMood(1)} aria-label="Next Mood"><MoodNextIcon /></button>
        </div>

        <div className="progress-bar" onClick={handleProgressClick}>
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="controls">
          <div className="btn-group">
            <button className="pixel-btn secondary" onClick={prevTrack} aria-label="Previous Track"><PrevIcon /></button>
            <button className="pixel-btn primary" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className="pixel-btn secondary" onClick={nextTrack} aria-label="Next Track"><NextIcon /></button>
          </div>

          <div className="volume-container">
            <div style={{ marginRight: '16px', flexShrink: 0 }}>
              <HighResVolumeIcon vol={volume} />
            </div>
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
        src={tracks[currentTrack]?.url} 
        onLoadedData={() => { if(isPlaying) audioRef.current?.play(); }}
      />
    </div>
  );
};

export default PixelMusicPlayer;
