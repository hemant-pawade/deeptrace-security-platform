import React from 'react';

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="w-full animate-pulse divide-y divide-slate-800">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex items-center px-6 py-4 gap-4">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div
              key={cIdx}
              className={`h-4 bg-slate-800/80 rounded ${
                cIdx === 0 ? 'w-1/4' : cIdx === 1 ? 'w-1/3' : 'w-1/6'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
