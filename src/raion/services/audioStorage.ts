// IndexedDB storage for large local audio files (MP3, WAV, MP4, M4A, OGG, FLAC)
const DB_NAME = 'RaionAudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'audio_files';

export interface StoredAudioMeta {
  songId: string;
  blob: Blob;
  fileName: string;
  size: number;
  mimeType: string;
  updatedAt: string;
}

let dbPromise: Promise<IDBDatabase> | null = null;
const objectUrlCache = new Map<string, string>();

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'songId' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

export async function saveAudioBlob(
  songId: string, 
  blobOrFile: Blob | File, 
  fileName?: string
): Promise<string> {
  const db = await getDB();
  const name = fileName || (blobOrFile instanceof File ? blobOrFile.name : `audio_${songId}`);
  const mimeType = blobOrFile.type || 'audio/mpeg';
  const size = blobOrFile.size;

  const record: StoredAudioMeta = {
    songId,
    blob: blobOrFile,
    fileName: name,
    size,
    mimeType,
    updatedAt: new Date().toISOString()
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  // Revoke old object URL if exists
  const existingUrl = objectUrlCache.get(songId);
  if (existingUrl) {
    URL.revokeObjectURL(existingUrl);
  }

  const newUrl = URL.createObjectURL(blobOrFile);
  objectUrlCache.set(songId, newUrl);
  return newUrl;
}

export async function getAudioBlob(songId: string): Promise<Blob | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(songId);
      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          resolve(req.result.blob);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not retrieve audio blob from IndexedDB:', err);
    return null;
  }
}

export async function getAudioMetadata(songId: string): Promise<{ fileName: string; size: number; mimeType: string } | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(songId);
      req.onsuccess = () => {
        if (req.result) {
          resolve({
            fileName: req.result.fileName,
            size: req.result.size,
            mimeType: req.result.mimeType
          });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function getAudioUrl(songId: string): Promise<string | null> {
  if (objectUrlCache.has(songId)) {
    return objectUrlCache.get(songId)!;
  }

  const blob = await getAudioBlob(songId);
  if (blob) {
    const url = URL.createObjectURL(blob);
    objectUrlCache.set(songId, url);
    return url;
  }

  return null;
}

export async function deleteAudioBlob(songId: string): Promise<void> {
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(songId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    const existingUrl = objectUrlCache.get(songId);
    if (existingUrl) {
      URL.revokeObjectURL(existingUrl);
      objectUrlCache.delete(songId);
    }
  } catch (err) {
    console.warn('Could not delete audio blob:', err);
  }
}

export async function hasCustomAudio(songId: string): Promise<boolean> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.count(IDBKeyRange.only(songId));
      req.onsuccess = () => resolve(req.result > 0);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return false;
  }
}
