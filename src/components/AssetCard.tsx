import React, { useState, useEffect } from 'react';
import type { Asset } from '../data/mockData';
import clsx from 'clsx';
import { Box, FileAudio, FileVideo, Layers, Image as ImageIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AssetCardProps {
  asset: Asset;
  selected: boolean;
  onSelect: (multi: boolean) => void;
  onToggleSelection: () => void;
}

const getAssetIcon = (type: string, size: number = 16) => {
  switch (type) {
    case 'Anim': return <FileVideo size={size} />;
    case 'Model': return <Box size={size} />;
    case 'Audio': return <FileAudio size={size} />;
    case 'Effect': return <Layers size={size} />;
    case 'Material': return <ImageIcon size={size} />;
    default: return <Box size={size} />;
  }
};

const getAssetColorHex = (type: string) => {
  switch (type) {
    case 'Anim': return '#F2994A';
    case 'Model': return '#2D9CDB';
    case 'Audio': return '#9B59B6';
    case 'Effect': return '#EB5757';
    case 'Material': return '#6FCF97';
    default: return '#808080';
  }
};

export const AssetCard: React.FC<AssetCardProps> = ({ asset, selected, onSelect, onToggleSelection }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const colorHex = getAssetColorHex(asset.type);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isHovered) {
      timer = setTimeout(() => setShowTooltip(true), 200);
    } else {
      setShowTooltip(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered]);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        // e.stopPropagation();
        
        // If clicking the checkmark specifically?
        // Let's implement robust toggle logic.
        
        if (e.ctrlKey) {
           onToggleSelection();
           return;
        }
        
        // If shift key, range select
        if (e.shiftKey) {
           onSelect(true);
           return;
        }

        // Standard click behavior:
        // If unselected -> Select (and deselect others)
        // If selected -> Deselect? Or keep selected?
        // The user complained about "cannot cancel selection".
        // This implies clicking a selected item should deselect it, OR clicking outside should deselect.
        // Let's try to make clicking a selected item toggle it off if it's the only one selected?
        // Or just always toggle?
        
        // If we want "Click to Toggle" behavior (like mobile or some casual file managers):
        if (selected) {
           onToggleSelection(); // Toggle off
        } else {
           onSelect(false); // Select (and clear others)
        }
      }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-50 left-full ml-2 top-0 w-64 bg-[#121212]/95 border border-ue-primary rounded text-sm p-3 shadow-xl pointer-events-none"
            style={{ borderColor: '#23478F' }}
          >
            <div className="font-bold text-white mb-1 truncate">{asset.name}</div>
            <div className="text-ue-text-secondary text-xs grid grid-cols-[80px_1fr] gap-y-1">
              <span>Type:</span> <span className="text-white">{asset.type}</span>
              <span>Path:</span> <span className="truncate" title={asset.path}>{asset.path}</span>
              <span>Size:</span> <span>{asset.size} ({asset.format})</span>
              <span>Modified:</span> <span>{asset.lastModified}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Content */}
      <div 
        className={clsx(
          "w-[120px] flex flex-col gap-2 transition-all duration-200 p-1 rounded-md border",
          selected 
            ? "bg-opacity-10" 
            : "border-transparent hover:border-current"
        )}
        style={{ 
          borderColor: selected || isHovered ? colorHex : 'transparent',
          backgroundColor: selected ? `${colorHex}1A` : 'transparent' // 10% opacity hex
        }}
      >
        {/* Thumbnail Area */}
        <div 
          className="w-full h-[120px] bg-[#2D2D2D] rounded relative flex items-center justify-center overflow-hidden border border-[#383838]"
        >
          {/* Top Left Tag */}
          <div 
            className="absolute top-0 left-0 p-1 rounded-br text-white z-10"
            style={{ backgroundColor: colorHex }}
          >
            {getAssetIcon(asset.type)}
          </div>

          {/* Selection Checkmark - Explicit Click Handler */}
          {selected && (
            <div 
              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center z-10 cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: colorHex }}
              onClick={(e) => {
                 e.stopPropagation(); // Stop card click
                 onToggleSelection(); // Toggle off
              }}
            >
              <Check size={12} className="text-white" />
            </div>
          )}

          {/* Placeholder Content (Icon + Color) */}
          <div className="text-white opacity-20">
             {/* Simulating asset preview with larger icon */}
             {getAssetIcon(asset.type, 48)}
          </div>

          {/* Bottom Right Label */}
          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/50 rounded text-[10px] text-white backdrop-blur-sm">
            {asset.type} | {asset.format}
          </div>
        </div>

        {/* Info Area */}
        <div className="text-center w-full">
          <div className="text-[#E0E0E0] text-xs truncate w-full" title={asset.name}>{asset.name}</div>
          <div className="flex justify-between text-[10px] text-[#B0B0B0] mt-0.5">
            <span>{asset.type}</span>
            <span>{asset.size}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
