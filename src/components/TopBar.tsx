import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Save, 
  X
} from 'lucide-react';
import clsx from 'clsx';
import { FilterPanel } from './FilterPanel';
import type { AssetType } from '../data/mockData';

interface TopBarProps {
  onSearch: (query: string) => void;
  onFilterToggle: () => void;
  isFilterOpen: boolean;
  selectedTypes: AssetType[];
  sortBy: 'date' | 'size' | 'name';
  onTypeToggle: (type: AssetType) => void;
  onSortChange: (sort: 'date' | 'size' | 'name') => void;
  onResetFilter: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  onSearch, 
  onFilterToggle, 
  isFilterOpen,
  selectedTypes,
  sortBy,
  onTypeToggle,
  onSortChange,
  onResetFilter
}) => {
  const [globalQuery, setGlobalQuery] = useState('');

  const handleGlobalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGlobalQuery(val);
    onSearch(val);
  };

  const getFilterButtonText = () => {
    if (selectedTypes.length === 0) return '筛选';
    if (selectedTypes.length <= 2) return selectedTypes.join(', ');
    return `${selectedTypes.slice(0, 2).join(', ')}...`;
  };

  return (
    <div className="h-12 bg-[#1E1E1E] border-b border-[#2D2D2D] flex items-center px-4 space-x-4 select-none justify-between">
      {/* Left: Save/Import */}
      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-1 px-3 py-1.5 bg-[#2D2D2D] text-[#E0E0E0] rounded hover:bg-ue-primary hover:text-white transition-colors text-sm shadow-sm active:translate-y-px">
          <Save size={14} />
          <span>保存</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-1.5 bg-[#2D2D2D] text-[#E0E0E0] rounded hover:bg-ue-primary hover:text-white transition-colors text-sm shadow-sm active:translate-y-px">
          <Download size={14} />
          <span>导入</span>
        </button>
      </div>

      {/* Right: Filter & Search */}
      <div className="flex items-center space-x-4 flex-1 justify-end max-w-[60%]">
          {/* Filter & Sort */}
          <div className="relative">
            <button 
              onClick={onFilterToggle}
              className={clsx(
                "flex items-center space-x-2 px-3 py-1.5 rounded transition-colors text-sm border",
                isFilterOpen || selectedTypes.length > 0
                  ? "bg-[#383838] border-ue-primary text-ue-primary"
                  : "bg-[#2D2D2D] border-transparent text-[#B0B0B0] hover:bg-[#383838]"
              )}
            >
              <Filter size={14} />
              <span className="truncate max-w-[100px]">{getFilterButtonText()}</span>
            </button>

            {/* Filter Panel */}
            <FilterPanel 
              isOpen={isFilterOpen} 
              selectedTypes={selectedTypes} 
              sortBy={sortBy}
              onTypeToggle={onTypeToggle}
              onSortChange={onSortChange}
              onReset={onResetFilter}
              onClose={onFilterToggle}
            />
          </div>
          
          {/* Global Search */}
          <div className="flex-1 max-w-[300px] relative group">
            <input 
              type="text" 
              value={globalQuery}
              onChange={handleGlobalSearch}
              placeholder="搜索内容"
              className="w-full bg-[#2D2D2D] border border-transparent focus:border-ue-primary rounded text-sm py-1.5 pl-4 pr-8 text-[#E0E0E0] placeholder-[#808080] outline-none transition-all"
            />
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <Search size={14} className="text-[#808080] group-focus-within:text-ue-primary" />
            </div>
             {globalQuery && (
              <button 
                onClick={() => { setGlobalQuery(''); onSearch(''); }}
                className="absolute inset-y-0 right-8 flex items-center text-[#808080] hover:text-[#E0E0E0]"
              >
                <X size={14} />
              </button>
            )}
          </div>
      </div>
    </div>
  );
};
