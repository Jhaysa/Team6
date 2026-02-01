import { db } from './config';
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  type DocumentData,
} from 'firebase/firestore';

function ensureDb() {
  if (!db) {
    throw new Error('Firestore is not initialized. Ensure Firebase env variables are set and initialization occurs on the client.');
  }
  return db;
}

export async function addDocument<T extends DocumentData = DocumentData>(
  collectionName: string,
  data: T,
  docID?: string
): Promise<string> {
  const _db = ensureDb();
  if (docID) {
    await setDoc(doc(_db, collectionName, docID), data);
    return docID;
  } else {
    const docRef = await addDoc(collection(_db, collectionName), data);
    return docRef.id;
  }
}

export async function getCollection<T extends DocumentData = DocumentData>(
  collectionName: string
): Promise<Array<T & { id: string }>> {
  const _db = ensureDb();
  const snapshot = await getDocs(collection(_db, collectionName));
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

export async function getDocument<T extends DocumentData = DocumentData>(
  collectionName: string,
  id: string
): Promise<T | null> {
  const _db = ensureDb();
  const docRef = doc(_db, collectionName, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as T;
}

export async function updateDocument(
  collectionName: string,
  id: string,
  data: Partial<DocumentData>
): Promise<void> {
  const _db = ensureDb();
  const docRef = doc(_db, collectionName, id);
  await updateDoc(docRef, data);
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const _db = ensureDb();
  await deleteDoc(doc(_db, collectionName, id));
}
