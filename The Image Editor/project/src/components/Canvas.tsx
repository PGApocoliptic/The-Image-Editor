import React, { forwardRef, useEffect, useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Move, Maximize2, Minimize2, Grid3X3, Eye, EyeOff } from 'lucide-react';

interface CanvasProps {
  image: HTMLImageElement | null;
  isProcessing: boolean;
  cropMode?: boolean;
  cropArea?: { x: number; y: number; width: number; height: number };
  onCropChange?: (area: { x: number; y: number; width: number; height: number }) => void;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({ 
  image, 
  isProcessing, 
  cropMode = false, 
  cropArea = { x: 0, y: 0, width: 0, height: 0 },
  onCropChange 
}, ref) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(false);
  const [fitToScreen, setFitToScreen] = useState(true);
  const [showOriginal, setShowOriginal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (image && ref && 'current' in ref && ref.current && fitToScreen) {
      const canvas = ref.current;
      const container = containerRef.current;
      if (!container) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calculate optimal size
      const containerRect = container.getBoundingClientRect();
      const maxWidth = containerRect.width - 64; // padding
      const maxHeight = containerRect.height - 64;
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
      
      canvas.width = image.width;
      canvas.height = image.height;
      
      setZoom(scale);
      setPan({ x: 0, y: 0 });
      
      // Draw image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
    }
  }, [image, ref, fitToScreen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDragging) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(5, prev * 1.2));
  const handleZoomOut = () => setZoom(prev => Math.max(0.1, prev / 1.2));
  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const fitToScreenToggle = () => {
    setFitToScreen(!fitToScreen);
    if (!fitToScreen) {
      resetZoom();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-full bg-gradient-to-br from-black/20 to-black/40 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden"
    >
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
        <div className="bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center space-x-3 border border-white/10">
          <button 
            onClick={handleZoomOut}
            className="text-white hover:text-purple-300 transition-colors p-1 hover:bg-white/10 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-white text-sm font-mono min-w-[4rem] text-center bg-white/10 px-2 py-1 rounded">
            {Math.round(zoom * 100)}%
          </span>
          <button 
            onClick={handleZoomIn}
            className="text-white hover:text-purple-300 transition-colors p-1 hover:bg-white/10 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-white/20" />
          <button 
            onClick={resetZoom}
            className="text-white hover:text-purple-300 transition-colors p-1 hover:bg-white/10 rounded text-xs"
            title="Reset Zoom"
          >
            1:1
          </button>
        </div>
      </div>

      {/* Additional Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        <div className="bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center space-x-2 border border-white/10">
          <button 
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-purple-500 text-white' : 'text-white hover:text-purple-300 hover:bg-white/10'}`}
            title="Toggle Grid"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button 
            onClick={fitToScreenToggle}
            className={`p-2 rounded-lg transition-colors ${fitToScreen ? 'bg-blue-500 text-white' : 'text-white hover:text-blue-300 hover:bg-white/10'}`}
            title="Fit to Screen"
          >
            {fitToScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button 
            onMouseDown={() => setShowOriginal(true)}
            onMouseUp={() => setShowOriginal(false)}
            onMouseLeave={() => setShowOriginal(false)}
            className="p-2 rounded-lg text-white hover:text-green-300 hover:bg-white/10 transition-colors"
            title="Hold to Show Original"
          >
            {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
          <div className="bg-black/90 backdrop-blur-sm rounded-xl px-8 py-6 flex items-center space-x-4 border border-white/20">
            <div className="relative">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-purple-500 border-t-transparent"></div>
              <div className="absolute inset-0 rounded-full border-3 border-purple-500/20"></div>
            </div>
            <div>
              <div className="text-white font-medium">Processing Image</div>
              <div className="text-gray-400 text-sm">Applying filters and adjustments...</div>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Container */}
      <div 
        className="flex items-center justify-center h-full p-8 cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="relative">
          <canvas
            ref={ref}
            className={`
              max-w-full max-h-full rounded-lg shadow-2xl border-2 transition-all duration-300
              ${showOriginal ? 'border-green-500/50' : 'border-white/20 hover:border-purple-500/50'}
              ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
            `}
            style={{ 
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease',
              filter: showOriginal ? 'none' : undefined
            }}
          />
          
          {/* Canvas Overlay for Interactions */}
          <div className="absolute inset-0 border-2 border-transparent hover:border-purple-500/30 rounded-lg transition-colors duration-200 pointer-events-none" />
          
          {/* Crop Overlay */}
          {cropMode && (
            <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg">
              <div className="absolute inset-2 border border-dashed border-yellow-400/50">
                <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full -translate-x-1 -translate-y-1"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full translate-x-1 -translate-y-1"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-400 rounded-full -translate-x-1 translate-y-1"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-400 rounded-full translate-x-1 translate-y-1"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Overlay */}
      {showGrid && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      )}

      {/* Rule of Thirds Grid */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full relative">
            {/* Vertical lines */}
            <div className="absolute left-1/3 top-0 w-px h-full bg-white/20"></div>
            <div className="absolute left-2/3 top-0 w-px h-full bg-white/20"></div>
            {/* Horizontal lines */}
            <div className="absolute top-1/3 left-0 w-full h-px bg-white/20"></div>
            <div className="absolute top-2/3 left-0 w-full h-px bg-white/20"></div>
          </div>
        </div>
      )}

      {/* Image Info Overlay */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
          <div className="text-white text-sm space-y-1">
            {image && (
              <>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">Size:</span>
                  <span className="font-mono">{image.width} × {image.height}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">Zoom:</span>
                  <span className="font-mono">{Math.round(zoom * 100)}%</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;