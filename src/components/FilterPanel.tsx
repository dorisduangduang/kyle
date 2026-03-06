import React from 'react';
import type { AssetType } from '../data/mockData';
import clsx from 'clsx';
import { Check, Clock, Database } from 'lucide-react';
import { motion } from 'framer-motion';

interface FilterPanelProps {
  isOpen: boolean;
  selectedTypes: AssetType[];
  sortBy: 'date' | 'size' | 'name';
  onTypeToggle: (type: AssetType) => void;
  onSortChange: (sort: 'date' | 'size' | 'name') => void;
  onReset: () => void;
  onClose: () => void;
}

const assetTypes: { type: AssetType; label: string; color: string }[] = [
  { type: 'Anim', label: '动画 (Anim)', color: '#F2994A' },
  { type: 'Model', label: '模型 (Model)', color: '#2D9CDB' },
  { type: 'Audio', label: '音频 (Audio)', color: '#9B59B6' },
  { type: 'Effect', label: '特效 (Effect)', color: '#EB5757' },
  { type: 'Material', label: '材质 (Material)', color: '#6FCF97' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({ 
  isOpen, 
  selectedTypes, 
  sortBy, 
  onTypeToggle, 
  onSortChange, 
  onReset,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full right-0 mt-2 w-64 bg-[#1E1E1E] border border-[#2D2D2D] rounded shadow-ue-panel z-50 p-4"
    >
      <div className="space-y-4">
        {/* Asset Types */}
        <div>
          <h4 className="text-xs font-bold text-[#808080] uppercase mb-2">资产类型</h4>
          <div className="space-y-1">
            {assetTypes.map(({ type, label }) => (
              <label 
                key={type} 
                className="flex items-center space-x-2 cursor-pointer hover:bg-[#2D2D2D] p-1.5 rounded transition-colors"
              >
                <div 
                  className={clsx(
                    "w-4 h-4 border rounded flex items-center justify-center transition-colors",
                    selectedTypes.includes(type) ? "bg-ue-primary border-ue-primary" : "border-[#808080]"
                  )}
                >
                  {selectedTypes.includes(type) && <Check size={10} className="text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={selectedTypes.includes(type)} 
                  onChange={() => onTypeToggle(type)} 
                />
                <span className={clsx("text-sm", selectedTypes.includes(type) ? "text-white" : "text-[#B0B0B0]")}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <h4 className="text-xs font-bold text-[#808080] uppercase mb-2">排序方式</h4>
          <div className="space-y-1">
            {[
              { id: 'date', label: '修改时间', icon: Clock },
              { id: 'size', label: '文件大小', icon: Database },
            ].map(({ id, label, icon: Icon }) => (
              <label 
                key={id} 
                className="flex items-center space-x-2 cursor-pointer hover:bg-[#2D2D2D] p-1.5 rounded transition-colors"
              >
                <div 
                  className={clsx(
                    "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                    sortBy === id ? "border-ue-primary" : "border-[#808080]"
                  )}
                >
                  {sortBy === id && <div className="w-2 h-2 rounded-full bg-ue-primary" />}
                </div>
                <input 
                  type="radio" 
                  className="hidden" 
                  checked={sortBy === id} 
                  onChange={() => onSortChange(id as any)} 
                />
                <Icon size={14} className="text-[#808080]" />
                <span className={clsx("text-sm", sortBy === id ? "text-white" : "text-[#B0B0B0]")}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-[#2D2D2D] flex justify-between items-center">
            <button 
                onClick={onReset}
                className="text-xs text-[#808080] hover:text-white transition-colors"
            >
                重置筛选
            </button>
            <button 
                onClick={onClose}
                className="px-3 py-1 bg-ue-primary text-white text-xs rounded hover:bg-ue-primary-hover transition-colors"
            >
                应用
            </button>
        </div>
      </div>
    </motion.div>
  );
};
