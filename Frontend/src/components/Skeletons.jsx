import React from 'react';

const CardSkeleton = () => (
  <div className="bg-white/5 dark:bg-zinc-800/50 backdrop-blur-md rounded-xl p-6 border border-zinc-200/50 dark:border-zinc-700/50 animate-pulse transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-zinc-300 dark:bg-zinc-700 rounded w-1/3"></div>
      <div className="h-10 w-10 bg-zinc-300 dark:bg-zinc-700 rounded-lg"></div>
    </div>
    <div className="h-10 bg-zinc-300 dark:bg-zinc-700 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-1/4"></div>
  </div>
);

const ChartSkeleton = () => (
  <div className="bg-white/5 dark:bg-zinc-800/50 backdrop-blur-md rounded-xl p-6 border border-zinc-200/50 dark:border-zinc-700/50 animate-pulse h-80 flex flex-col justify-end gap-2 px-6 pb-6">
    <div className="flex flex-row justify-between items-end h-full w-full gap-2 mt-10">
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className="bg-zinc-300 dark:bg-zinc-700 rounded-t w-full" 
          style={{ height: `${Math.random() * 60 + 20}%` }}
        ></div>
      ))}
    </div>
  </div>
);

const TableSkeleton = ({ rows = 5 }) => (
  <div className="overflow-hidden bg-white/5 dark:bg-zinc-800/50 backdrop-blur-md rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 animate-pulse">
    <div className="grid grid-cols-5 p-4 border-b border-zinc-200/50 dark:border-zinc-700/50 gap-4 bg-zinc-100/50 dark:bg-zinc-800/80">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-full"></div>
      ))}
    </div>
    {[...Array(rows)].map((_, r) => (
      <div key={r} className="grid grid-cols-5 p-4 border-b border-zinc-200/20 dark:border-zinc-700/30 gap-4 items-center">
        {[...Array(5)].map((_, c) => (
          <div key={`${r}-${c}`} className={`h-4 bg-zinc-300 dark:bg-zinc-700 rounded ${c === 0 ? 'w-3/4' : 'w-1/2'}`}></div>
        ))}
      </div>
    ))}
  </div>
);

export { CardSkeleton, ChartSkeleton, TableSkeleton };
