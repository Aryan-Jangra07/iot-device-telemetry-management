import React from 'react';

const Tooltip = ({ children, content }) => {
  return (
    <div className="group/tooltip relative inline-flex items-center justify-center">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-200 z-50">
        <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-medium rounded-md py-1 px-2.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] whitespace-nowrap">
          {content}
        </div>
        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-zinc-900 dark:border-t-zinc-100 absolute left-1/2 -translate-x-1/2 top-full" />
      </div>
    </div>
  );
};

export default Tooltip;
