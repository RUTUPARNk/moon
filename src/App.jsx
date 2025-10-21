// App.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import GlobeView from './components/GlobeView';
import SatelliteLayer from './components/SatelliteLayer';
import ControlPanel from './components/ControlPanel';
import { fetchTLEs } from './services/tleService';

export default function App() {
  const globeRef = useRef();
  const [globe, setGlobe] = useState(null);
  const containerRef = useRef();
  const [dataset, setDataset] = useState('stations');
  const [satellites, setSatellites] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [timeMillis, setTimeMillis] = useState(Date.now());
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [followId, setFollowId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // onReady
  const handleGlobeReady = useCallback(g => {
    setGlobe(g);
    globeRef.current = g;
  }, []);

  // fetch TLEs
  useEffect(() => {
    let cancelled = false;
    fetchTLEs(dataset).then(list => {
      if (cancelled) return;
      // limit for demo: trim to first 200 to keep UI smooth
      setSatellites(list.slice(0, 500).map(s => ({ ...s })));
    }).catch(err => console.error(err));
    return () => cancelled = true;
  }, [dataset]);

  // search filter
  useEffect(() => {
    if (!searchTerm) setFiltered(satellites);
    else {
      const q = searchTerm.toLowerCase();
      setFiltered(satellites.filter(s => s.name.toLowerCase().includes(q)));
    }
  }, [searchTerm, satellites]);

  // simulation timer
  useEffect(() => {
    let raf;
    let last = performance.now();
    function frame(now) {
      const dt = now - last;
      last = now;
      if (playing) {
        // speed factor applied to wall time
        setTimeMillis(prev => prev + dt * speed);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed]);

  return (
    <div>
      <div ref={containerRef} style={{ width: '100vw', height: '85vh' }} />
      <GlobeView globeContainerRef={containerRef} onReady={handleGlobeReady} />
      {globe && (
        <SatelliteLayer
          globe={globe}
          satellites={filtered}
          timeMillis={timeMillis}
          timeScale={speed}
          followId={followId}
          onSelectSatellite={s => { console.log('selected', s); }}
        />
      )}
      <ControlPanel
        onDatasetChange={setDataset}
        onPlayPause={() => setPlaying(p => !p)}
        onSpeedChange={setSpeed}
        playing={playing}
        speed={speed}
        onSearch={setSearchTerm}
        satellitesCount={filtered.length}
        onFollow={setFollowId}
      />

      <footer style={{ textAlign: 'center', padding: '8px' }}>
        Humanity’s Eye Above the World — Built by Vedant pur, 2025
      </footer>
    </div>
  );
}
