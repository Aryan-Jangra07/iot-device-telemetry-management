import React from 'react';

const Tooltip = ({ children, content }) => {
  return (
    <div className="group relative pr-1 inline-block">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
        <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded-md py-1 px-2 shadow-xl whitespace-nowrap">
          {content}
        </div>
        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-zinc-900 dark:border-t-zinc-100 absolute left-1/2 -translate-x-1/2 top-full" />
      </div>
    </div>
  );
};

export default Tooltip;
