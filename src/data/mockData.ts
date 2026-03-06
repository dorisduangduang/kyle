export type AssetType = 'Anim' | 'Model' | 'Audio' | 'Effect' | 'Material';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  path: string;
  size: string;
  format: string;
  lastModified: string;
  parentId: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  children: Folder[];
}

export const folders: Folder[] = [
  {
    id: 'root',
    name: 'Content',
    parentId: null,
    children: [
      {
        id: 'chars',
        name: 'Characters',
        parentId: 'root',
        children: [
          {
            id: 'warrior',
            name: 'Warrior',
            parentId: 'chars',
            children: []
          },
          {
            id: 'mage',
            name: 'Mage',
            parentId: 'chars',
            children: []
          }
        ]
      },
      {
        id: 'env',
        name: 'Environment',
        parentId: 'root',
        children: [
          {
            id: 'trees',
            name: 'Trees',
            parentId: 'env',
            children: []
          },
          {
            id: 'rocks',
            name: 'Rocks',
            parentId: 'env',
            children: []
          }
        ]
      },
      {
        id: 'audio',
        name: 'Audio',
        parentId: 'root',
        children: []
      },
      {
        id: 'vfx',
        name: 'VFX',
        parentId: 'root',
        children: []
      }
    ]
  }
];

export const assets: Asset[] = [
  // Warrior Animations
  { id: 'a1', name: 'Warrior_Idle', type: 'Anim', path: '/Content/Characters/Warrior', size: '2.4 MB', format: 'FBX', lastModified: '2023-10-25', parentId: 'warrior' },
  { id: 'a2', name: 'Warrior_Run', type: 'Anim', path: '/Content/Characters/Warrior', size: '3.1 MB', format: 'FBX', lastModified: '2023-10-26', parentId: 'warrior' },
  { id: 'a3', name: 'Warrior_Attack', type: 'Anim', path: '/Content/Characters/Warrior', size: '4.5 MB', format: 'FBX', lastModified: '2023-10-27', parentId: 'warrior' },
  
  // Warrior Model
  { id: 'm1', name: 'SK_Warrior', type: 'Model', path: '/Content/Characters/Warrior', size: '45.2 MB', format: 'FBX', lastModified: '2023-10-20', parentId: 'warrior' },
  
  // Mage Model
  { id: 'm2', name: 'SK_Mage', type: 'Model', path: '/Content/Characters/Mage', size: '38.7 MB', format: 'FBX', lastModified: '2023-10-22', parentId: 'mage' },

  // Audio
  { id: 's1', name: 'BGM_MainTheme', type: 'Audio', path: '/Content/Audio', size: '12.4 MB', format: 'WAV', lastModified: '2023-09-15', parentId: 'audio' },
  { id: 's2', name: 'SFX_SwordHit', type: 'Audio', path: '/Content/Audio', size: '0.5 MB', format: 'WAV', lastModified: '2023-09-16', parentId: 'audio' },

  // VFX
  { id: 'e1', name: 'P_Fireball', type: 'Effect', path: '/Content/VFX', size: '1.2 MB', format: 'UASSET', lastModified: '2023-11-01', parentId: 'vfx' },
  { id: 'e2', name: 'P_Explosion', type: 'Effect', path: '/Content/VFX', size: '5.6 MB', format: 'UASSET', lastModified: '2023-11-02', parentId: 'vfx' },

  // Environment Materials
  { id: 'mat1', name: 'M_Grass', type: 'Material', path: '/Content/Environment', size: '8.2 MB', format: 'UASSET', lastModified: '2023-08-10', parentId: 'env' },
  { id: 'mat2', name: 'M_Rock', type: 'Material', path: '/Content/Environment', size: '15.4 MB', format: 'UASSET', lastModified: '2023-08-12', parentId: 'env' },
];

export const favorites = [
  { id: 'fav1', name: 'Characters', path: '/Content/Characters' },
  { id: 'fav2', name: 'VFX', path: '/Content/VFX' },
];
