import React, { useState } from 'react';
import type { Folder } from '../data/mockData';
import { ChevronRight, ChevronDown, Folder as FolderIcon, Star, Plus, Search, ChevronLeft, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  folders: Folder[];
  favorites: { id: string; name: string; path: string }[];
  selectedFolderId: string | null;
  onFolderSelect: (id: string) => void;
  onSearchPath?: (query: string) => void;
}

const FolderItem = ({ folder, selectedId, onSelect, level = 0, isVisible = true, searchQuery = '' }: { folder: Folder, selectedId: string | null, onSelect: (id: string) => void, level?: number, isVisible?: boolean, searchQuery?: string }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = folder.id === selectedId;

  // Auto-expand if searching and visible
  // Only expand if we have children that might be visible
  React.useEffect(() => {
    if (searchQuery && isVisible && folder.children.length > 0) {
      setIsOpen(true);
    }
  }, [searchQuery, isVisible, folder.children.length]);
  
  if (!isVisible) return null;

  return (
    <div>
      <div 
        className={clsx(
          "flex items-center py-1 px-2 cursor-pointer transition-colors group relative",
          isSelected ? "bg-ue-primary text-white" : "hover:bg-[#383838] text-[#B0B0B0]"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onSelect(folder.id)}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
          className="p-0.5 hover:bg-white/10 rounded mr-1"
        >
          {folder.children.length > 0 ? (
            isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          ) : <div className="w-3" />}
        </button>
        
        <FolderIcon size={14} className={clsx("mr-2", isSelected ? "text-white" : "text-ue-text-muted group-hover:text-[#E0E0E0]")} fill={isSelected ? "currentColor" : "none"} />
        <span className={clsx("text-sm truncate", folder.parentId === null ? "font-bold" : "")}>{folder.name}</span>
      </div>

      <AnimatePresence>
        {isOpen && folder.children.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {folder.children.map(child => {
              const lowerQuery = searchQuery.toLowerCase();
              // Show child if:
              // 1. No search query
              // 2. Child itself matches
              // 3. Child has a matching descendant (so we can drill down)
              // 4. PARENT matches (so we show all children of a matched folder? Requirement ambiguous, but usually yes in file explorers)
              
              const matchesSelf = !searchQuery || child.name.toLowerCase().includes(lowerQuery);
              
              const hasMatchingDescendant = (f: Folder): boolean => {
                  if (!searchQuery) return true;
                  return f.children.some(c => 
                      c.name.toLowerCase().includes(lowerQuery) || hasMatchingDescendant(c)
                  );
              };
              
              // If parent (this folder) matches, do we show all children?
              // The `folder` prop is the parent here.
              // const parentMatches = folder.name.toLowerCase().includes(lowerQuery);
              
              // If parent matches, show all children? 
              // Standard behavior: Search usually filters tree. If "Content" matches, we show Content. 
              // Expanding Content should probably show all children if they are not filtered out.
              // But if we are filtering, we only show matching paths.
              // Let's stick to: Show if self matches OR descendant matches.
              
              const isChildVisible = matchesSelf || hasMatchingDescendant(child);

              // Force open if searching and child is visible
              // Actually, isOpen state is local to Child. We can pass a prop 'forceOpen' or rely on 'searchQuery' prop in child to auto-open.

              return (
                <FolderItem 
                  key={child.id} 
                  folder={child} 
                  selectedId={selectedId} 
                  onSelect={onSelect} 
                  level={level + 1} 
                  isVisible={isChildVisible}
                  searchQuery={searchQuery}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ folders, favorites, selectedFolderId, onFolderSelect, onSearchPath }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearchPath) onSearchPath(val);
  };

  // Check if any child matches, show parent
  const checkRecursive = (f: Folder): boolean => {
      // Show folder if it matches OR any descendant matches
      const matchesSelf = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDescendant = f.children.some(c => checkRecursive(c));
      return matchesSelf || matchesDescendant;
  };

  const checkVisibility = (folder: Folder): boolean => {
    if (!searchQuery) return true;
    // Always show if it matches recursively
    return checkRecursive(folder);
  };

  return (
    <div className="w-64 bg-[#1E1E1E] border-r border-[#2D2D2D] flex flex-col h-full text-sm">
      {/* Top Header with Nav, Refresh, Search */}
      <div className="p-2 border-b border-[#2D2D2D] space-y-2">
        <div className="flex items-center space-x-1">
            <button className="p-1 text-[#B0B0B0] hover:text-white hover:bg-[#383838] rounded">
                <ChevronLeft size={16} />
            </button>
            <button className="p-1 text-[#B0B0B0] hover:text-white hover:bg-[#383838] rounded">
                <ChevronRight size={16} />
            </button>
            <button className="p-1 text-[#B0B0B0] hover:text-white hover:bg-[#383838] rounded">
                <RefreshCw size={14} />
            </button>
            
            <div className="flex-1 relative group ml-2">
                <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearch}
                placeholder="搜索内容"
                className="w-full bg-[#2D2D2D] border border-transparent focus:border-ue-primary rounded text-xs py-1 pl-2 pr-6 text-[#E0E0E0] placeholder-[#808080] outline-none transition-all"
                />
                <div className="absolute inset-y-0 right-1.5 flex items-center pointer-events-none">
                    <Search size={12} className="text-[#808080] group-focus-within:text-ue-primary" />
                </div>
            </div>
        </div>
      </div>

      {/* Favorites Section */}
      <div className="p-2 border-b border-[#2D2D2D]">
        <div className="flex items-center text-ue-primary font-bold mb-2 px-2">
          <Star size={14} className="mr-2 fill-current" />
          <span>收藏夹</span>
        </div>
        <ul>
          {favorites.map(fav => (
            <li 
              key={fav.id}
              className="flex items-center py-1.5 px-2 rounded hover:bg-[#383838] cursor-pointer text-[#B0B0B0] group transition-colors"
            >
              <FolderIcon size={14} className="mr-2 text-ue-text-muted group-hover:text-ue-primary" />
              <span className="group-hover:text-white">{fav.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* File Tree Section */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4 mb-2 text-[#808080] text-xs font-bold uppercase tracking-wider flex justify-between items-center">
          <span>Assets</span>
          <Plus size={14} className="cursor-pointer hover:text-white" />
        </div>
        {folders.map(folder => (
          <FolderItem 
            key={folder.id} 
            folder={folder} 
            selectedId={selectedFolderId} 
            onSelect={onFolderSelect} 
            isVisible={checkVisibility(folder)}
            searchQuery={searchQuery}
          />
        ))}
      </div>
      
      {/* Bottom Action */}
      <div className="p-2 border-t border-[#2D2D2D]">
        <button className="w-full flex items-center justify-center py-1.5 text-[#B0B0B0] hover:text-white hover:bg-[#383838] rounded transition-colors">
            <Plus size={16} className="mr-2" />
            <span>添加根目录</span>
        </button>
      </div>
    </div>
  );
};
