import { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { AssetGrid } from './components/AssetGrid';
import { TopBar } from './components/TopBar';
import { assets as initialAssets, folders, favorites, type AssetType } from './data/mockData';
import { LayoutGrid, List } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [searchPathQuery, setSearchPathQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTypes, setFilterTypes] = useState<AssetType[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name'>('date');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Helper to find all descendant folder IDs (recursive)
  const getAllDescendantIds = useMemo(() => (rootId: string, allFolders: typeof folders): string[] => {
    let ids: string[] = [];
    
    const collect = (nodes: typeof folders, targetId: string, collecting: boolean) => {
      for (const node of nodes) {
        // If we found the target folder, start collecting
        let isMatch = collecting || node.id === targetId;
        
        if (isMatch) {
          ids.push(node.id);
        }
        
        if (node.children && node.children.length > 0) {
           // If we matched this node, we collect all its children recursively
           // If we haven't matched yet, we keep searching down
           collect(node.children, targetId, isMatch);
        }
      }
    };
    
    collect(allFolders, rootId, false);
    return ids;
  }, []);

  // Filter Assets
  const filteredAssets = useMemo(() => {
    // 1. Get all valid folder IDs (current + subfolders)
    const validFolderIds = getAllDescendantIds(currentFolderId, folders);

    let result = initialAssets.filter(a => {
      // Global Search takes precedence
      if (searchQuery) {
         return a.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      
      // Folder Logic: Must be in valid folder IDs
      if (!validFolderIds.includes(a.parentId)) return false;

      // Type Filter
      if (filterTypes.length > 0 && !filterTypes.includes(a.type)) return false;

      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      if (sortBy === 'size') return parseFloat(b.size) - parseFloat(a.size);
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [currentFolderId, searchQuery, filterTypes, sortBy, getAllDescendantIds, searchPathQuery]); // searchPathQuery affects UI only via Sidebar

  const handleAssetSelect = (id: string, multi: boolean) => {
    if (multi) {
      // Simple shift select logic (range) could be complex, for now just toggle or add
      // Actually requirement says Ctrl+Click (single add/remove), Shift+Click (range)
      // My AssetCard calls onSelect(e.shiftKey)
      // Let's implement simple multi-select for now
      setSelectedAssetIds(prev => {
        if (prev.includes(id)) return prev.filter(i => i !== id);
        return [...prev, id];
      });
    } else {
      setSelectedAssetIds([id]);
    }
  };

  const handleToggleSelection = (id: string) => {
    setSelectedAssetIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      return [...prev, id];
    });
  };

  return (
    <div className="flex h-screen w-screen bg-[#1E1E1E] text-[#E0E0E0] overflow-hidden font-sans">
      {/* Sidebar - Full Height on Left */}
      <Sidebar 
        folders={folders} 
        favorites={favorites} 
        selectedFolderId={currentFolderId} 
        onFolderSelect={setCurrentFolderId} 
        onSearchPath={setSearchPathQuery}
      />

      {/* Main Content Area - Right Side */}
      <div className="flex-1 flex flex-col h-full bg-[#242424] overflow-hidden border-l border-[#2D2D2D]">
        
        {/* Top Bar - Now inside Right Content Area */}
        <TopBar 
          onSearch={setSearchQuery}
          onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
          isFilterOpen={isFilterOpen}
          selectedTypes={filterTypes}
          sortBy={sortBy}
          onTypeToggle={(type) => {
            setFilterTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
          }}
          onSortChange={setSortBy}
          onResetFilter={() => { setFilterTypes([]); setSortBy('date'); }}
        />

        {/* View Toggle Bar (Optional: Can be merged into TopBar or kept below) */}
        {/* Keeping it below TopBar as a sub-header */}
        <div className="h-8 bg-[#1E1E1E] border-b border-[#2D2D2D] flex items-center justify-end px-4 space-x-2">
          <span className="text-xs text-[#808080] mr-auto">
            {filteredAssets.length} items ({selectedAssetIds.length} selected)
          </span>
          <button 
            onClick={() => setViewMode('list')}
            className={clsx("p-1 rounded hover:bg-[#383838]", viewMode === 'list' ? "text-ue-primary bg-[#2D2D2D]" : "text-[#B0B0B0]")}
          >
            <List size={16} />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={clsx("p-1 rounded hover:bg-[#383838]", viewMode === 'grid' ? "text-ue-primary bg-[#2D2D2D]" : "text-[#B0B0B0]")}
          >
            <LayoutGrid size={16} />
          </button>
        </div>

        {/* Asset Grid */}
          <div className="flex-1 overflow-hidden relative">
             <AssetGrid 
               assets={filteredAssets} 
               selectedAssets={selectedAssetIds} 
               onAssetSelect={handleAssetSelect}
               onToggleSelection={handleToggleSelection}
               onImport={() => console.log('Import clicked')}
               viewMode={viewMode}
             />
          </div>
      </div>
    </div>
  );
}

export default App;
