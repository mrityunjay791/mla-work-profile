export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: 'upcoming' | 'past';
  image?: string;
}
