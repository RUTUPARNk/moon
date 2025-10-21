// ControlPanel.jsx
import React from 'react';

export default function ControlPanel({
  onDatasetChange,
  onPlayPause,
  onSpeedChange,
  playing,
  speed,
  onSearch,
  satellitesCount,
  onFollow
}) {
  return (
    <div className="control-panel">
      <div>
        <select onChange={e => onDatasetChange(e.target.value)}>
          <option value="stations">Stations (ISS)</option>
          <option value="starlink">Starlink</option>
          <option value="active">Active</option>
        </select>
        <button onClick={onPlayPause}>{playing ? 'Pause' : 'Play'}</button>
        <select value={speed} onChange={e => onSpeedChange(Number(e.target.value))}>
          <option value={1}>1x</option>
          <option value={10}>10x</option>
          <option value={60}>60x</option>
        </select>
      </div>

      <div>
        <input placeholder="Search satellite..." onChange={e => onSearch(e.target.value)} />
        <button onClick={() => onFollow(null)}>Unfollow</button>
      </div>

      <div>Satellites loaded: {satellitesCount}</div>
    </div>
  );
}
