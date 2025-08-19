import React from 'react';
import { History, RotateCcw, RotateCw, Clock, X } from 'lucide-react';

interface HistoryPanelProps {
  undoStack: any[];
  redoStack: any[];
  currentSettings: any;
  onHistorySelect: (settings: any) => void;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  undoStack,
  redoStack,
  currentSettings,
  onHistorySelect,
  onClose
}) => {
  const allHistory = [...undoStack, currentSettings, ...redoStack.reverse()];
  const currentIndex = undoStack.length;

  const getHistoryLabel = (settings: any, index: number) => {
    if (index === 0) return 'Original';
    if (index === currentIndex) return 'Current';
    
    // Determine what changed
    const prevSettings = index > 0 ? allHistory[index - 1] : {};
    const changes = [];
    
    Object.keys(settings).forEach(key => {
      if (settings[key] !== prevSettings[key]) {
        changes.push(key);
      }
    });
    
    if (changes.length === 1) {
      return `Adjusted ${changes[0]}`;
    } else if (changes.length > 1) {
      return `Multiple adjustments`;
    }
    
    return `Step ${index}`;
  };

  const formatTime = (index: number) => {
    const now = new Date();
    const minutesAgo = (allHistory.length - index) * 2; // Simulate time
    const time = new Date(now.getTime() - minutesAgo * 60000);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-80 bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <History className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">History</h3>
              <p className="text-xs text-gray-400">Edit timeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History Stats */}
      <div className="p-4 border-b border-white/10">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <RotateCcw className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Undo</span>
            </div>
            <div className="text-lg font-bold text-white">{undoStack.length}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <RotateCw className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Redo</span>
            </div>
            <div className="text-lg font-bold text-white">{redoStack.length}</div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {allHistory.map((settings, index) => {
          const isCurrent = index === currentIndex;
          const isPast = index < currentIndex;
          const isFuture = index > currentIndex;
          
          return (
            <div
              key={index}
              onClick={() => onHistorySelect(settings)}
              className={`
                p-3 rounded-xl border cursor-pointer transition-all duration-200 group
                ${isCurrent 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50' 
                  : isPast
                  ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                  : 'bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center
                  ${isCurrent 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : isPast
                    ? 'bg-blue-500/50'
                    : 'bg-gray-500/50'
                  }
                `}>
                  {isCurrent ? (
                    <Clock className="w-4 h-4 text-white" />
                  ) : isPast ? (
                    <RotateCcw className="w-4 h-4 text-white" />
                  ) : (
                    <RotateCw className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {getHistoryLabel(settings, index)}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center space-x-2">
                    <span>{formatTime(index)}</span>
                    {isCurrent && <span className="text-purple-400">• Current</span>}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 font-mono">
                  #{index.toString().padStart(2, '0')}
                </div>
              </div>
              
              {/* Settings Preview */}
              <div className="mt-2 text-xs text-gray-400">
                <div className="flex flex-wrap gap-1">
                  {Object.entries(settings).slice(0, 3).map(([key, value]) => (
                    <span key={key} className="bg-white/10 px-2 py-1 rounded">
                      {key}: {typeof value === 'number' ? value.toFixed(1) : String(value)}
                    </span>
                  ))}
                  {Object.keys(settings).length > 3 && (
                    <span className="text-gray-500">+{Object.keys(settings).length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-gray-500/10 to-gray-600/10">
        <div className="space-y-2">
          <button
            onClick={() => onHistorySelect(allHistory[0] || {})}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Original</span>
          </button>
          <div className="text-xs text-gray-400 text-center">
            Click any step to jump to that point in history
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;