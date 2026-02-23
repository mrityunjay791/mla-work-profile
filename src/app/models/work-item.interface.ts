export interface WorkItem {
  id: number;
  vidhansabhaId: number;
  panchayatId: number;
  wardId: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string; // ISO format
  location: string;
}
