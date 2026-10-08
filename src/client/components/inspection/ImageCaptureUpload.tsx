import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Camera,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  X,
} from 'lucide-react';

interface ImageCaptureUploadProps {
  onImageSelected: (file: File, previewUrl: string) => void;
  selectedFile: File | null;
  previewUrl: string | null;
  onClear: () => void;
}

// Sample hazard images for quick testing and demonstration
const SAMPLE_HAZARD_PRESETS = [
  {
    label: 'Blocked Fire Exit',
    url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80',
    type: 'SAFETY',
    description: 'Obstruction stacked across emergency exit corridor',
  },
  {
    label: 'Obstructed ADA Ramp',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=80',
    type: 'ACCESSIBILITY',
    description: 'Banners and barriers restricting wheelchair access route',
  },
  {
    label: 'Damaged Infrastructure',
    url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    type: 'INFRASTRUCTURE',
    description: 'Exposed surface tiles and electrical conduit displacement',
  },
];

/**
 * Resizes an image client-side if it exceeds 2048px on longest edge
 */
async function compressAndResizeImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 2048;
      let width = img.width;
      let height = img.height;

      if (width <= maxDim && height <= maxDim) {
        resolve(file);
        return;
      }

      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const compressed = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressed);
        },
        file.type,
        0.92
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
  });
}

export const ImageCaptureUpload: React.FC<ImageCaptureUploadProps> = ({
  onImageSelected,
  selectedFile,
  previewUrl,
  onClear,
}) => {
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream when switching away or unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access unavailable or permission denied. Please use file upload.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleCaptureSnapshot = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `campus-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      stopCamera();
      const compressed = await compressAndResizeImage(file);
      const url = URL.createObjectURL(compressed);
      onImageSelected(compressed, url);
    }, 'image/jpeg', 0.92);
  };

  const processFile = async (file: File) => {
    // Validate format
    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimes.includes(file.type)) {
      alert('Invalid file format. Please upload JPEG, PNG, or WebP images only.');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB limit. Please select a smaller photo.');
      return;
    }

    setIsProcessing(true);
    try {
      const compressed = await compressAndResizeImage(file);
      const url = URL.createObjectURL(compressed);
      onImageSelected(compressed, url);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const loadPreset = async (preset: typeof SAMPLE_HAZARD_PRESETS[0]) => {
    setIsProcessing(true);
    try {
      const res = await fetch(preset.url);
      const blob = await res.blob();
      const file = new File([blob], `${preset.label.toLowerCase().replace(/\s+/g, '-')}.jpg`, {
        type: 'image/jpeg',
      });
      const url = URL.createObjectURL(file);
      onImageSelected(file, url);
    } catch (err) {
      console.error('Failed to load preset:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('upload');
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              mode === 'upload'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            File Upload / Dropzone
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('camera');
              startCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              mode === 'camera'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            Live Device Camera
          </button>
        </div>

        {selectedFile && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear Image
          </button>
        )}
      </div>

      {/* Selected Image Preview */}
      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-teal-500/30 bg-slate-900 shadow-2xl group">
          <img
            src={previewUrl}
            alt="Inspection Preview"
            className="w-full max-h-[420px] object-contain bg-slate-950 mx-auto"
          />
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified &amp; Optimized (Max 2048px)
            </span>
            <button
              type="button"
              onClick={onClear}
              className="p-1.5 rounded-md bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-white hover:bg-rose-950/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {selectedFile && (
            <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="truncate max-w-xs text-slate-300 font-medium">{selectedFile.name}</span>
              <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}</span>
            </div>
          )}
        </div>
      ) : mode === 'camera' ? (
        /* Camera Stream Mode */
        <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-4 text-center">
          {cameraError ? (
            <div className="p-6 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="text-sm text-slate-300">{cameraError}</p>
              <button
                type="button"
                onClick={() => setMode('upload')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white"
              >
                Switch to File Upload
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-[380px] flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-teal-500/40 rounded-xl pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 border border-dashed border-teal-400/60 rounded-lg"></div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-teal-500/20"
                >
                  <Camera className="w-4 h-4" />
                  Capture Photo
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2.5 rounded-xl font-medium text-xs bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Drag-and-Drop File Upload Mode */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-teal-400 bg-teal-500/10 scale-[1.01]'
              : 'border-slate-700/80 hover:border-teal-500/50 bg-slate-900/40 hover:bg-slate-900/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto text-teal-400 shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200">
                Click to browse or drag and drop campus photo
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports JPEG, PNG, WebP up to 10MB (automatically downscaled &gt;2048px)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preset Hazard Templates */}
      <div className="pt-2">
        <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Quick Test Hazard Scenarios (One-Click Preload):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_HAZARD_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              disabled={isProcessing}
              onClick={() => loadPreset(preset)}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-teal-300">
                  {preset.label}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {preset.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-1">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
