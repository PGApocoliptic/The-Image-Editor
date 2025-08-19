import React from 'react';
import { Sliders, Palette, Layers, Settings, Sparkles, Sun, Moon, Contrast, Droplets, Wind, Zap, Eye, Camera } from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: string;
}

interface SidebarProps {
  settings: {
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
  };
  onSettingsChange: (settings: any) => void;
  activeTool: string;
  layers: Layer[];
  activeLayer: string;
  onLayerChange: (layerId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  settings, 
  onSettingsChange, 
  activeTool, 
  layers, 
  activeLayer, 
  onLayerChange 
}) => {
  const handleSliderChange = (key: string, value: number) => {
    onSettingsChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const basicSliders = [
    { key: 'brightness', label: 'Brightness', min: -100, max: 100, step: 1, icon: Sun },
    { key: 'contrast', label: 'Contrast', min: -100, max: 100, step: 1, icon: Contrast },
    { key: 'saturation', label: 'Saturation', min: -100, max: 100, step: 1, icon: Droplets },
    { key: 'vibrance', label: 'Vibrance', min: -100, max: 100, step: 1, icon: Sparkles },
  ];

  const advancedSliders = [
    { key: 'exposure', label: 'Exposure', min: -200, max: 200, step: 1, icon: Camera },
    { key: 'highlights', label: 'Highlights', min: -100, max: 100, step: 1, icon: Sun },
    { key: 'shadows', label: 'Shadows', min: -100, max: 100, step: 1, icon: Moon },
    { key: 'warmth', label: 'Warmth', min: -100, max: 100, step: 1, icon: Sun },
    { key: 'tint', label: 'Tint', min: -100, max: 100, step: 1, icon: Palette },
    { key: 'hue', label: 'Hue', min: -180, max: 180, step: 1, icon: Palette },
  ];

  const effectSliders = [
    { key: 'blur', label: 'Blur', min: 0, max: 20, step: 0.1, icon: Wind },
    { key: 'sharpen', label: 'Sharpen', min: 0, max: 5, step: 0.1, icon: Zap },
    { key: 'vignette', label: 'Vignette', min: 0, max: 100, step: 1, icon: Eye },
    { key: 'grain', label: 'Film Grain', min: 0, max: 50, step: 1, icon: Sparkles },
  ];

  const transformSliders = [
    { key: 'rotation', label: 'Rotation', min: -180, max: 180, step: 1, icon: Settings },
    { key: 'scale', label: 'Scale', min: 0.1, max: 3, step: 0.1, icon: Settings },
  ];

  const presets = [
    { 
      name: 'Vintage', 
      settings: { brightness: 10, contrast: 20, saturation: -30, blur: 0.5, warmth: 30, vignette: 20 },
      gradient: 'from-amber-500 to-orange-500'
    },
    { 
      name: 'B&W', 
      settings: { brightness: 0, contrast: 30, saturation: -100, blur: 0, sharpen: 1 },
      gradient: 'from-gray-500 to-gray-700'
    },
    { 
      name: 'Vibrant', 
      settings: { brightness: 15, contrast: 25, saturation: 50, vibrance: 30, blur: 0 },
      gradient: 'from-pink-500 to-purple-500'
    },
    { 
      name: 'Soft', 
      settings: { brightness: 20, contrast: -10, saturation: 10, blur: 1, highlights: -20 },
      gradient: 'from-blue-400 to-cyan-400'
    },
    { 
      name: 'Dramatic', 
      settings: { brightness: -10, contrast: 40, saturation: 20, shadows: -30, highlights: -20, vignette: 30 },
      gradient: 'from-red-500 to-black'
    },
    { 
      name: 'Film', 
      settings: { brightness: 5, contrast: 15, saturation: -10, grain: 15, warmth: 20, vignette: 15 },
      gradient: 'from-yellow-600 to-red-600'
    },
  ];

  const SliderGroup = ({ title, sliders, icon: Icon }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className="w-5 h-5 text-purple-400" />
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {sliders.map((slider) => {
        const SliderIcon = slider.icon;
        return (
          <div key={slider.key}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <SliderIcon className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-300">
                  {slider.label}
                </label>
              </div>
              <span className="text-xs text-gray-400 font-mono bg-white/10 px-2 py-1 rounded">
                {typeof settings[slider.key] === 'number' ? settings[slider.key].toFixed(1) : 0}
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={settings[slider.key] || 0}
                onChange={(e) => handleSliderChange(slider.key, parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{slider.min}</span>
                <span>{slider.max}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-96 bg-black/30 backdrop-blur-xl border-l border-white/10 flex flex-col max-h-screen">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sliders className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Adjustments</h2>
            <p className="text-xs text-gray-400">Fine-tune your image</p>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="p-6 border-b border-white/10">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
          Quick Presets
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onSettingsChange(prev => ({ ...prev, ...preset.settings }))}
              className={`
                relative px-4 py-3 bg-gradient-to-r ${preset.gradient} text-white text-sm font-medium rounded-xl 
                transition-all duration-200 hover:scale-105 hover:shadow-lg overflow-hidden group
              `}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-200" />
              <span className="relative z-10">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Adjustment Sliders */}
      <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
        <SliderGroup title="Basic" sliders={basicSliders} icon={Sliders} />
        <SliderGroup title="Advanced" sliders={advancedSliders} icon={Settings} />
        <SliderGroup title="Effects" sliders={effectSliders} icon={Sparkles} />
        <SliderGroup title="Transform" sliders={transformSliders} icon={Settings} />
      </div>

      {/* Image Info Panel */}
      <div className="p-6 border-t border-white/10 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <div className="bg-white/5 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-white">Image Info</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="text-white">RGB</span>
              </div>
              <div className="flex justify-between">
                <span>Depth:</span>
                <span className="text-white">8-bit</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Profile:</span>
                <span className="text-white">sRGB</span>
              </div>
              <div className="flex justify-between">
                <span>Quality:</span>
                <span className="text-green-400">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;