import { useEffect, useState } from "react";
import { UserType } from "../reducer/authReducer";

const useIndexedDB = (dbName: string, storeName: string) => {
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      setDb((event.target as IDBOpenDBRequest).result);

      (event.target as IDBOpenDBRequest).result.createObjectStore(storeName, {
        keyPath: "username",
        autoIncrement: true,
      });
    };

    request.onsuccess = (event) => {
      setDb((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      console.error(
        "Error opening database",
        (event.target as IDBOpenDBRequest).result
      );
    };
  }, [dbName, storeName, db]);

  function addData<T>(data: T) {
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

  function getData(key: string): Promise<UserType | null> {
    if (!db) return Promise.reject("Data base not available");

    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(key);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result as UserType | null);
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

  return { addData, getData };
};

export default useIndexedDB;
//TODO: create connections on a module
// TODO: use indexedDB instead of localStorage
