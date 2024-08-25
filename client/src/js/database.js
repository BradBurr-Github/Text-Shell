import { openDB } from 'idb';

const initdb = async () => {
  try {
    openDB('jate', 1, {
      upgrade(db) {
        if (db.objectStoreNames.contains('jate')) {
          console.log('jate database already exists');
          return;
        }
        db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
        console.log('jate database created');
      },
    });
  } catch (err) {
      console.log(err)
  }
}

// Method that accepts some content and adds it to the database
export const putDb = async (dbIndex,content) => {
  console.log('PUT to the database');
  const jateDb = await openDB('jate', 1);
  const tx = jateDb.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  const request = store.put({ id: dbIndex, content: content });
  const result = await request;
  console.log('Data saved to the database', result);
};

// Method to get the record(s) from the IndexedDB database
export const getDb = async () => {
  console.log('GET all from the database');
  const jateDb = await openDB('jate', 1);
  const tx = jateDb.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  const request = store.getAll();
  const result = await request;
  console.log('result.value', result);
  return result;
};

// Method to add a new record to the IndexedDB database, if it doesn't exist
export const postDb = async (content) => {
  console.log('Post to the database');
  const jateDb = await openDB('jate', 1);
  const tx = jateDb.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  const request = store.add({ content: content });
  const result = await request;
  console.log('Data saved to the database', result);
};

initdb();
