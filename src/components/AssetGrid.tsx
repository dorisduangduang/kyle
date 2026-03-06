import React from 'react';
import type { Asset } from '../data/mockData';
import { AssetCard } from './AssetCard';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface AssetGridProps {
  assets: Asset[];
  selectedAssets: string[];
  onAssetSelect: (id: string, multi: boolean) => void;
  onToggleSelection: (id: string) => void;
  onImport: () => void;
  viewMode?: 'grid' | 'list';
}

export const AssetGrid: React.FC<AssetGridProps> = ({ 
  assets, 
  selectedAssets, 
  onAssetSelect, 
  onToggleSelection, 
  onImport,
  viewMode = 'grid'
}) => {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-ue-text-muted">
        <p className="mb-4 text-lg">暂无资产，点击导入添加</p>
        <button 
          onClick={onImport}
          className="flex items-center px-4 py-2 bg-ue-primary text-white rounded hover:bg-ue-primary-hover transition-colors"
        >
          <Upload size={18} className="mr-2" />
          导入资产
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 h-full overflow-y-auto content-start ${viewMode === 'grid' 
      ? "grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4"
      : "flex flex-col gap-1"
    }`}>
      {assets.map((asset) => (
        <motion.div 
          key={asset.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'grid' ? (
            <AssetCard 
              asset={asset}
              selected={selectedAssets.includes(asset.id)}
              onSelect={(multi) => onAssetSelect(asset.id, multi)}
              onToggleSelection={() => onToggleSelection(asset.id)}
            />
          ) : (
            // List View Item
            <div 
              className={`flex items-center p-2 rounded cursor-pointer transition-colors ${selectedAssets.includes(asset.id) ? 'bg-ue-primary text-white' : 'hover:bg-[#383838] text-[#E0E0E0]'}`}
              onClick={(e) => {
                 if (e.ctrlKey) onToggleSelection(asset.id);
                 else onAssetSelect(asset.id, e.shiftKey);
              }}
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center bg-[#2D2D2D] rounded">
                 {/* Reuse logic? Or simple icon */}
                 {/* For now simple box */}
                 <div className="w-3 h-3 bg-gray-500 rounded-full" />
              </div>
              <span className="flex-1 truncate text-sm">{asset.name}</span>
              <span className="w-24 text-xs text-right opacity-60">{asset.type}</span>
              <span className="w-20 text-xs text-right opacity-60">{asset.size}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
