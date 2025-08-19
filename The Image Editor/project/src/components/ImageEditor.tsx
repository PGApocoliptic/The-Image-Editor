import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, RotateCw, Crop, Palette, Layers, Settings, Undo, Redo, Zap, Save, Share2 } from 'lucide-react';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import Sidebar from './Sidebar';
import FileUpload from './FileUpload';
import LayersPanel from './LayersPanel';
import HistoryPanel from './HistoryPanel';

interface ImageState {
  original: HTMLImageElement | null;
  current: HTMLImageElement | null;
  history: ImageData[];
  historyIndex: number;
}

interface EditorSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  rotation: number;
  scale: number;
  hue: number;
  exposure: number;
  highlights: number;
  shadows: number;
  vibrance: number;
  warmth: number;
  tint: number;
  vignette: number;
  grain: number;
  sharpen: number;
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: string;
  imageData?: ImageData;
}

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<ImageState>({
    original: null,
    current: null,
    history: [],
    historyIndex: -1
  });
  
  const [settings, setSettings] = useState<EditorSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    rotation: 0,
    scale: 1,
    hue: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    vibrance: 0,
    warmth: 0,
    tint: 0,
    vignette: 0,
    grain: 0,
    sharpen: 0
  });
  
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayer, setActiveLayer] = useState<string>('');
  const [activeTool, setActiveTool] = useState<string>('select');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [undoStack, setUndoStack] = useState<EditorSettings[]>([]);
  const [redoStack, setRedoStack] = useState<EditorSettings[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = useCallback((file: File) => {
    const img = new Image();
    img.onload = () => {
      setImage(prev => ({
        ...prev,
        original: img,
        current: img,
        history: [],
        historyIndex: -1
      }));
      
      // Create initial layer
      const initialLayer: Layer = {
        id: 'layer-1',
        name: 'Background',
        visible: true,
        opacity: 100,
        blendMode: 'normal'
      };
      setLayers([initialLayer]);
      setActiveLayer('layer-1');
      
      // Reset settings
      const initialSettings = {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        blur: 0,
        rotation: 0,
        scale: 1,
        hue: 0,
        exposure: 0,
        highlights: 0,
        shadows: 0,
        vibrance: 0,
        warmth: 0,
        tint: 0,
        vignette: 0,
        grain: 0,
        sharpen: 0
      };
      setSettings(initialSettings);
      setUndoStack([]);
      setRedoStack([]);
    };
    img.src = URL.createObjectURL(file);
  }, []);

  const saveToHistory = useCallback((newSettings: EditorSettings) => {
    setUndoStack(prev => [...prev, settings]);
    setRedoStack([]);
  }, [settings]);

  const applyFilters = useCallback(() => {
    if (!image.current || !canvasRef.current) return;
    
    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.current.width;
    canvas.height = image.current.height;

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((settings.rotation * Math.PI) / 180);
    ctx.scale(settings.scale, settings.scale);
    
    // Advanced filter string with all adjustments
    const filterString = `
      brightness(${100 + settings.brightness}%)
      contrast(${100 + settings.contrast}%)
      saturate(${100 + settings.saturation}%)
      blur(${settings.blur}px)
      hue-rotate(${settings.hue}deg)
      sepia(${Math.abs(settings.warmth) / 100})
    `.trim();
    
    ctx.filter = filterString;
    
    ctx.drawImage(image.current, -image.current.width / 2, -image.current.height / 2);
    
    // Apply additional effects
    if (settings.vignette > 0) {
      applyVignette(ctx, canvas.width, canvas.height, settings.vignette);
    }
    
    if (settings.grain > 0) {
      applyGrain(ctx, canvas.width, canvas.height, settings.grain);
    }
    
    ctx.restore();
    
    setTimeout(() => setIsProcessing(false), 100);
  }, [image.current, settings]);

  const applyVignette = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) => {
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    gradient.addColorStop(0, `rgba(0,0,0,0)`);
    gradient.addColorStop(1, `rgba(0,0,0,${intensity/100})`);
    
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  };

  const applyGrain = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity * 2;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    if (image.current) {
      applyFilters();
    }
  }, [settings, applyFilters]);

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousSettings = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, settings]);
      setSettings(previousSettings);
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextSettings = redoStack[redoStack.length - 1];
      setUndoStack(prev => [...prev, settings]);
      setSettings(nextSettings);
      setRedoStack(prev => prev.slice(0, -1));
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `edited-image-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png', 1.0);
    link.click();
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    
    // Save to localStorage for persistence
    const imageData = canvasRef.current.toDataURL('image/png', 1.0);
    const projectData = {
      image: imageData,
      settings,
      layers,
      timestamp: Date.now()
    };
    
    localStorage.setItem('pixelforge-project', JSON.stringify(projectData));
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    notification.textContent = 'Project saved successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const resetSettings = () => {
    saveToHistory(settings);
    const resetSettings = {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      rotation: 0,
      scale: 1,
      hue: 0,
      exposure: 0,
      highlights: 0,
      shadows: 0,
      vibrance: 0,
      warmth: 0,
      tint: 0,
      vignette: 0,
      grain: 0,
      sharpen: 0
    };
    setSettings(resetSettings);
  };

  const quickEnhance = () => {
    saveToHistory(settings);
    setSettings(prev => ({
      ...prev,
      brightness: 10,
      contrast: 15,
      saturation: 20,
      sharpen: 0.5,
      vibrance: 15
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              The Image Editor
            </h1>
            <div className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
              v2.0
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-white/20 mx-2" />
            <button
              onClick={quickEnhance}
              disabled={!image.current}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
            >
              <Zap className="w-4 h-4" />
              <span>Enhance</span>
            </button>
            <button
              onClick={handleSave}
              disabled={!image.current}
              className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={resetSettings}
              disabled={!image.current}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button
              onClick={handleDownload}
              disabled={!image.current}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Toolbar */}
        <Toolbar 
          activeTool={activeTool} 
          onToolChange={setActiveTool}
          hasImage={!!image.current}
          onShowLayers={() => setShowLayers(!showLayers)}
          onShowHistory={() => setShowHistory(!showHistory)}
          showLayers={showLayers}
          showHistory={showHistory}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {!image.current ? (
            <FileUpload onFileUpload={handleFileUpload} />
          ) : (
            <div className="flex-1 flex">
              {/* Canvas Area */}
              <div className="flex-1 p-6">
                <Canvas 
                  ref={canvasRef}
                  image={image.current}
                  isProcessing={isProcessing}
                  cropMode={cropMode}
                  cropArea={cropArea}
                  onCropChange={setCropArea}
                />
              </div>
              
              {/* Sidebar */}
              <Sidebar 
                settings={settings}
                onSettingsChange={(newSettings) => {
                  saveToHistory(settings);
                  setSettings(newSettings);
                }}
                activeTool={activeTool}
                layers={layers}
                activeLayer={activeLayer}
                onLayerChange={setActiveLayer}
              />
            </div>
          )}
        </div>

        {/* Layers Panel */}
        {showLayers && (
          <LayersPanel
            layers={layers}
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
            onLayersUpdate={setLayers}
            onClose={() => setShowLayers(false)}
          />
        )}

        {/* History Panel */}
        {showHistory && (
          <HistoryPanel
            undoStack={undoStack}
            redoStack={redoStack}
            currentSettings={settings}
            onHistorySelect={(historySettings) => {
              saveToHistory(settings);
              setSettings(historySettings);
            }}
            onClose={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ImageEditor;