// GlobeView.jsx
import React, { useRef, useEffect } from 'react';
import Globe from 'globe.gl';

export default function GlobeView({ globeContainerRef, onReady }) {
  const globeElRef = useRef();

  useEffect(() => {
    const g = Globe()(globeContainerRef.current)
      .showAtmosphere(true)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .pointOfView({ altitude: 2.0 });

    globeElRef.current = g;
    if (onReady) onReady(g);

    return () => { try { globeContainerRef.current.innerHTML = ''; } catch (e) {} };
  }, [globeContainerRef, onReady]);

  return null;
}
