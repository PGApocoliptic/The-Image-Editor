import React, { useState } from 'react';
import { Layers, Eye, EyeOff, Plus, Trash2, Copy, Move, Lock, Unlock, X } from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: string;
  locked?: boolean;
}

interface LayersPanelProps {
  layers: Layer[];
  activeLayer: string;
  onLayerChange: (layerId: string) => void;
  onLayersUpdate: (layers: Layer[]) => void;
  onClose: () => void;
}

const blendModes = [
  'normal', 'multiply', 'screen', 'overlay', 'soft-light', 
  'hard-light', 'color-dodge', 'color-burn', 'darken', 'lighten'
];

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  activeLayer,
  onLayerChange,
  onLayersUpdate,
  onClose
}) => {
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null);

  const updateLayer = (layerId: string, updates: Partial<Layer>) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, ...updates } : layer
    );
    onLayersUpdate(updatedLayers);
  };

  const addLayer = () => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      locked: false
    };
    onLayersUpdate([...layers, newLayer]);
    onLayerChange(newLayer.id);
  };

  const duplicateLayer = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      const duplicatedLayer: Layer = {
        ...layer,
        id: `layer-${Date.now()}`,
        name: `${layer.name} Copy`
      };
      const layerIndex = layers.findIndex(l => l.id === layerId);
      const newLayers = [...layers];
      newLayers.splice(layerIndex + 1, 0, duplicatedLayer);
      onLayersUpdate(newLayers);
    }
  };

  const deleteLayer = (layerId: string) => {
    if (layers.length > 1) {
      const newLayers = layers.filter(l => l.id !== layerId);
      onLayersUpdate(newLayers);
      if (activeLayer === layerId) {
        onLayerChange(newLayers[0]?.id || '');
      }
    }
  };

  const handleDragStart = (layerId: string) => {
    setDraggedLayer(layerId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault();
    if (draggedLayer && draggedLayer !== targetLayerId) {
      const draggedIndex = layers.findIndex(l => l.id === draggedLayer);
      const targetIndex = layers.findIndex(l => l.id === targetLayerId);
      
      const newLayers = [...layers];
      const [draggedLayerObj] = newLayers.splice(draggedIndex, 1);
      newLayers.splice(targetIndex, 0, draggedLayerObj);
      
      onLayersUpdate(newLayers);
    }
    setDraggedLayer(null);
  };

  return (
    <div className="w-80 bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Layers</h3>
              <p className="text-xs text-gray-400">Manage image layers</p>
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

      {/* Layer Controls */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <button
            onClick={addLayer}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add Layer</span>
          </button>
          <button
            onClick={() => activeLayer && duplicateLayer(activeLayer)}
            disabled={!activeLayer}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Duplicate Layer"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => activeLayer && deleteLayer(activeLayer)}
            disabled={!activeLayer || layers.length <= 1}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Layer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            draggable
            onDragStart={() => handleDragStart(layer.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, layer.id)}
            className={`
              p-3 rounded-xl border transition-all duration-200 cursor-pointer
              ${activeLayer === layer.id 
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }
              ${draggedLayer === layer.id ? 'opacity-50' : ''}
            `}
            onClick={() => onLayerChange(layer.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Move className="w-3 h-3 text-gray-500 cursor-grab" />
                <input
                  type="text"
                  value={layer.name}
                  onChange={(e) => updateLayer(layer.id, { name: e.target.value })}
                  className="bg-transparent text-white text-sm font-medium border-none outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateLayer(layer.id, { locked: !layer.locked });
                  }}
                  className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                >
                  {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateLayer(layer.id, { visible: !layer.visible });
                  }}
                  className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                >
                  {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {/* Opacity Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-gray-400">Opacity</label>
                  <span className="text-xs text-gray-400">{layer.opacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={layer.opacity}
                  onChange={(e) => updateLayer(layer.id, { opacity: parseInt(e.target.value) })}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider-small"
                />
              </div>

              {/* Blend Mode */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Blend Mode</label>
                <select
                  value={layer.blendMode}
                  onChange={(e) => updateLayer(layer.id, { blendMode: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-white/10 text-white text-xs rounded px-2 py-1 border border-white/20 focus:border-purple-500 outline-none"
                >
                  {blendModes.map(mode => (
                    <option key={mode} value={mode} className="bg-gray-800">
                      {mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Layer Preview */}
            <div className="mt-2 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded border border-white/20 flex items-center justify-center">
              <span className="text-xs text-gray-300">Layer {index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Layer Stats */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Total Layers:</span>
            <span className="text-white">{layers.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Visible Layers:</span>
            <span className="text-white">{layers.filter(l => l.visible).length}</span>
          </div>
          <div className="flex justify-between">
            <span>Active Layer:</span>
            <span className="text-purple-400">{layers.find(l => l.id === activeLayer)?.name || 'None'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayersPanel;