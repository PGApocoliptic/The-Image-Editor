import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, File, Sparkles, Sliders, Download } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onFileUpload(imageFile);
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const supportedFormats = ['JPEG', 'PNG', 'GIF', 'WebP', 'SVG', 'BMP'];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300
            ${isDragOver 
              ? 'border-purple-400 bg-purple-500/10 scale-105' 
              : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
            }
          `}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl" />
          <div className="absolute inset-0 backdrop-blur-sm rounded-3xl" />
          
          <div className="relative z-10">
            {/* Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25 mb-6">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <div className="flex justify-center space-x-4">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <File className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Drop your image here
              </h3>
              <p className="text-gray-300 text-lg mb-2">
                or click to browse from your device
              </p>
              <p className="text-gray-400 text-sm">
                Maximum file size: 50MB
              </p>
            </div>

            {/* Upload Button */}
            <div className="mb-8">
              <label className="inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-2xl cursor-pointer transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105">
                  Select Image
                </div>
              </label>
            </div>

            {/* Supported Formats */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-3">Supported formats:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {supportedFormats.map((format) => (
                  <span 
                    key={format}
                    className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full border border-white/20"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Drag Overlay */}
          {isDragOver && (
            <div className="absolute inset-0 bg-purple-500/20 rounded-3xl flex items-center justify-center z-20">
              <div className="text-white text-2xl font-bold">Drop to upload!</div>
            </div>
          )}
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sliders className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Advanced Adjustments</h4>
            <p className="text-gray-400 text-sm">Fine-tune brightness, contrast, saturation and more</p>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Smart Filters</h4>
            <p className="text-gray-400 text-sm">Apply professional filters with one click</p>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">High Quality Export</h4>
            <p className="text-gray-400 text-sm">Export in multiple formats without quality loss</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;