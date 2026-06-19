export type BookstoreCategory = 'bookstore' | 'library';
export type MoodEmoji = 'coffee' | 'rain' | 'music' | 'quiet' | 'sun';

export interface Bookstore {
  id: string;
  name: string;
  category: BookstoreCategory;
  address: string;
  dong: string;
  lat: number;
  lng: number;
  phone?: string;
  specialtyTags: string[];
  photos: string[];
}

// 책방 데이터는 카카오 Local 검색(RemoteBookstore) 또는 Firestore 방문/북마크 스냅샷에서 온다.
// 하드코딩 시드는 사용하지 않는다.
