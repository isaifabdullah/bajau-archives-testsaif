import { db, storage } from '../src/firebaseConfig';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Song, CommunityStory } from '../types';

export const dataService = {
  // --- FILE UPLOADS ---
  async uploadFile(file: File, folder: 'music' | 'images'): Promise<string> {
    try {
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const storageRef = ref(storage, `${folder}/${filename}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Failed to upload file to cloud');
    }
  },

  // --- SONGS ---
  async getSongs(): Promise<Song[]> {
    const querySnapshot = await getDocs(collection(db, 'songs'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
  },

  async saveSong(song: Song): Promise<void> {
    // We omit 'id' because Firestore generates it, or we use the one we created if we want
    // But better to let Firestore handle IDs or just store the object.
    // If we are passing an ID, we could use setDoc, but addDoc is easier for new.
    // However, for update vs create, we'll keep it simple: always add new for now as per previous logic.
    // Actually, to keep types consistent, we'll strip the manual ID and let Firestore assign one, 
    // OR just save the ID effectively.
    const { id, ...data } = song;
    if (id && id.length > 20) {
      // Heuristic: if ID is long (Firestore ID), it might be an update? 
      // But our app logic was "save new". Let's just create new doc.
    }
    await addDoc(collection(db, 'songs'), { ...data, createdAt: Date.now() });
  },

  async deleteSong(id: string, audioUrl?: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'songs', id));
      if (audioUrl && audioUrl.includes('firebasestorage')) {
        // Try to delete file from storage
        const fileRef = ref(storage, audioUrl);
        await deleteObject(fileRef).catch(err => console.warn('File delete failed (might verify manually):', err));
      }
    } catch (error) {
      console.error('Delete failed:', error);
      throw error;
    }
  },

  // --- STORIES ---
  async getStories(): Promise<CommunityStory[]> {
    const querySnapshot = await getDocs(collection(db, 'stories'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityStory));
  },

  async saveStory(story: CommunityStory): Promise<void> {
    const { id, ...data } = story;
    await addDoc(collection(db, 'stories'), { ...data, createdAt: Date.now() });
  },

  async deleteStory(id: string): Promise<void> {
    await deleteDoc(doc(db, 'stories', id));
  }
};
