import React from 'react';
import { 
  MousePointer, 
  Crop, 
  RotateCw, 
  Palette, 
  Sliders, 
  Type, 
  Layers,
  Scissors,
  Sparkles,
  History,
  Brush,
  Eraser,
  Move,
  ZoomIn,
  Eye,
  Square,
  Circle,
  Triangle,
  Pen
} from 'lucide-react';

interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  hasImage: boolean;
  onShowLayers: () => void;
  onShowHistory: () => void;
  showLayers: boolean;
  showHistory: boolean;
}

const tools = [
  { id: 'select', icon: MousePointer, label: 'Select', group: 'basic' },
  { id: 'move', icon: Move, label: 'Move', group: 'basic' },
  { id: 'crop', icon: Crop, label: 'Crop', group: 'transform' },
  { id: 'rotate', icon: RotateCw, label: 'Rotate', group: 'transform' },
  { id: 'brush', icon: Brush, label: 'Brush', group: 'paint' },
  { id: 'eraser', icon: Eraser, label: 'Eraser', group: 'paint' },
  { id: 'pen', icon: Pen, label: 'Pen', group: 'paint' },
  { id: 'adjust', icon: Sliders, label: 'Adjust', group: 'color' },
  { id: 'filters', icon: Sparkles, label: 'Filters', group: 'effects' },
  { id: 'text', icon: Type, label: 'Text', group: 'content' },
  { id: 'shapes', icon: Square, label: 'Shapes', group: 'content' },
  { id: 'zoom', icon: ZoomIn, label: 'Zoom', group: 'view' },
];

const Toolbar: React.FC<ToolbarProps> = ({ 
  activeTool, 
  onToolChange, 
  hasImage, 
  onShowLayers, 
  onShowHistory,
  showLayers,
  showHistory 
}) => {
  return (
    <div className="w-20 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 space-y-2">
      {/* Main Tools */}
      <div className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          const isDisabled = !hasImage && tool.id !== 'select';
          
          return (
            <button
              key={tool.id}
              onClick={() => !isDisabled && onToolChange(tool.id)}
              disabled={isDisabled}
              className={`
                w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 scale-105' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white hover:scale-105'
                }
                ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
              title={tool.label}
            >
              <Icon className="w-6 h-6" />
              
              {/* Tooltip */}
              <div className="absolute left-20 ml-2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                {tool.label}
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Separator */}
      <div className="w-10 h-px bg-white/20 my-6" />
      
      {/* Panel Toggles */}
      <div className="space-y-2">
        <button 
          onClick={onShowLayers}
          className={`
            w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 group relative
            ${showLayers 
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25' 
              : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
            }
          `}
          title="Layers Panel"
        >
          <Layers className="w-6 h-6" />
          <div className="absolute left-20 ml-2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            Layers Panel
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
          </div>
        </button>
        
        <button 
          onClick={onShowHistory}
          className={`
            w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 group relative
            ${showHistory 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25' 
              : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
            }
          `}
          title="History Panel"
        >
          <History className="w-6 h-6" />
          <div className="absolute left-20 ml-2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            History Panel
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
          </div>
        </button>
      </div>
      
      {/* Separator */}
      <div className="w-10 h-px bg-white/20 my-6" />
      
      {/* Quick Actions */}
      <div className="space-y-2">
        <button 
          className="w-14 h-14 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-200 flex items-center justify-center group relative shadow-lg shadow-orange-500/25"
          title="Quick Enhance"
        >
          <Sparkles className="w-6 h-6" />
          <div className="absolute left-20 ml-2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            Quick Enhance
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
          </div>
        </button>
        
        <button 
          className="w-14 h-14 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-center group relative"
          title="Preview Mode"
        >
          <Eye className="w-6 h-6" />
          <div className="absolute left-20 ml-2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            Preview Mode
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;