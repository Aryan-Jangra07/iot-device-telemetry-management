import React from 'react';

const EmptyState = ({ icon: Icon, title, message, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/5 dark:bg-zinc-800/50 backdrop-blur-md rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 h-full w-full">
      <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full mb-6">
        {Icon && <Icon size={48} className="stroke-[1.5]" />}
      </div>
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {onAction && actionText && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
