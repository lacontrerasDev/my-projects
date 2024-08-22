let db: IDBDatabase | null = null;

const initDb = (dbName: string, storeNames: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve();
      return;
    }
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      storeNames.forEach((storeName) => {
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, {
            keyPath:
              storeName.includes("user") || storeName.includes("User")
                ? "username"
                : "id",
            autoIncrement: false,
          });
        }
      });
      db = database;
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve();
    };

    request.onerror = (event) => {
      console.error(
        "Error opening database",
        (event.target as IDBOpenDBRequest).error
      );
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

function addData<T>(storeName: string, data: T) {
  if (!db) return;

  const transaction = db.transaction([storeName], "readwrite");
  const objectStore = transaction.objectStore(storeName);
  const request = objectStore.add(data);

  request.onsuccess = () => {
    console.log("Data added successfully");
  };

  request.onerror = (event) => {
    console.error(
      "Error adding data",
      (event.target as IDBOpenDBRequest).error
    );
  };
}

// function getData<T>(storeName: string): Promise<T | null>;
// function getData<T>(storeName: string): Promise<T[]>;
function getData<T>(storeName: string): Promise<T[]>;
function getData<T>(storeName: string, key: string): Promise<T | null>;
function getData<T>(storeName: string, key?: string): Promise<T | T[] | null> {
  if (!db) return Promise.reject("Data base not available");
  // let request: IDBRequest;
  const transaction = db.transaction([storeName], "readonly");
  const objectStore = transaction.objectStore(storeName);
  // if (key) {
  //   request = objectStore.get(key);
  // } else {
  //   request = objectStore.getAll();
  // }

  const request = key ? objectStore.get(key) : objectStore.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as T | T[] | null);
    };

    request.onerror = (event) => {
      console.error(
        `Error getting ${key}`,
        (event.target as IDBOpenDBRequest).error
      );
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

function clearStore(storeName: string) {
  if (!db) return;

  const transaction = db.transaction([storeName], "readwrite");
  const objectStore = transaction.objectStore(storeName);
  const request = objectStore.clear();

  request.onsuccess = () => {
    console.log("Store cleared successfully");
  };

  request.onerror = (event) => {
    console.error(
      "Error clearing store",
      (event.target as IDBOpenDBRequest).error
    );
  };
}

export { initDb, addData, getData, clearStore };
// export default useIndexedDB;
