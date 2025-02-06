import { useCallback, useEffect, useState } from "react"

const dbConfig = {
  name: "drawboard-db",
  version: 3,
  objectStoreNames: ["notes", "settings", "notePositions"]
}

export const useIndexedDB = (databaseName: string, tableNames: string[]) => {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const initDB = () => {
      const request = indexedDB.open(databaseName, dbConfig.version)

      // handle database upgrade
      request.onupgradeneeded = () => {
        const database = request.result;
        tableNames.forEach(tableName => {
          if(!database.objectStoreNames.contains(tableName)) {
            database.createObjectStore(tableName, {keyPath: "id" });
          }
        })
      }

      // success
      request.onsuccess = () => {
        setDb(request.result);
        setIsConnected(true);
      };

      // errors
      request.onerror = () => {
        console.log("error with indexedeDB", request.error);
        setIsConnected(false);
      }
    }
    if(!db) {
      initDB();
    }
  }, [databaseName, tableNames, db]);

  const getTransaction = (tableName: string, mode: IDBTransactionMode) => {
    if(!db) throw new Error("IndexedDb is not initialized");
    return db.transaction(tableName, mode).objectStore(tableName);
  }
  const putEntry = (tableName: string, value: Object): Promise<IDBValidKey | null> => {
    return new Promise((resolve, reject) => {
      try {
        const store = getTransaction(tableName, "readwrite");
        const request = store.put(value);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (err) {
        console.log("error updating the item (INDEXEDDB)", err);
        reject(err);
      }
    });
  }

  const deleteEntry = (tableName: string, key: number): number | null => {
      try {
        const store = getTransaction(tableName, "readwrite");
        store.delete(key);
        return key;
      } catch (err) {
        console.log("error deleting the item (INDEXEDDB)", err);
        return null;
      }
  }

  const getEntry = useCallback((tableName: string, key: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        const store = getTransaction(tableName, "readwrite");
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (err) {
        console.log("error updating the item (INDEXEDDB)", err);
        reject(err);
      }
    });
  },[db])

  const getEntries = () => {

  }

  return {isConnected, getEntry, putEntry, deleteEntry, getTransaction};
}