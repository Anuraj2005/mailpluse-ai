import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div className={`shimmer-loader bg-slate-800/60 rounded-lg ${className}`} />
  );
}
