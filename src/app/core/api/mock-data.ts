import { Vidhansabha } from '../../models/vidhansabha.interface';
import { Panchayat } from '../../models/panchayat.interface';
import { Ward } from '../../models/ward.interface';
import { WorkItem } from '../../models/work-item.interface';
import { EventItem } from '../../models/event-item.interface';

// Mock Vidhansabha Data
export const mockVidhansabhas: Vidhansabha[] = [
  { id: 1, name: 'Bangalore South', code: 'BS' },
  { id: 2, name: 'Bangalore Central', code: 'BC' },
  { id: 3, name: 'Bangalore North', code: 'BN' },
  { id: 4, name: 'Bangalore East', code: 'BE' }
];

// Mock Panchayat Data
export const mockPanchayats: Panchayat[] = [
  // For Bangalore South (id: 1)
  { id: 1, vidhansabhaId: 1, name: 'Jayanagar Panchayat', code: 'JN' },
  { id: 2, vidhansabhaId: 1, name: 'Basavanagudi Panchayat', code: 'BG' },
  { id: 3, vidhansabhaId: 1, name: 'Banashankari Panchayat', code: 'BK' },

  // For Bangalore Central (id: 2)
  { id: 4, vidhansabhaId: 2, name: 'Indiranagar Panchayat', code: 'IR' },
  { id: 5, vidhansabhaId: 2, name: 'Koramangala Panchayat', code: 'KM' },
  { id: 6, vidhansabhaId: 2, name: 'Whitefield Panchayat', code: 'WF' },

  // For Bangalore North (id: 3)
  { id: 7, vidhansabhaId: 3, name: 'Yeshwanthpur Panchayat', code: 'YP' },
  { id: 8, vidhansabhaId: 3, name: 'Sanjaynagar Panchayat', code: 'SN' },

  // For Bangalore East (id: 4)
  { id: 9, vidhansabhaId: 4, name: 'Marathahalli Panchayat', code: 'MH' },
  { id: 10, vidhansabhaId: 4, name: 'Ramamurthy Nagar Panchayat', code: 'RN' }
];

// Mock Ward Data
export const mockWards: Ward[] = [
  // For Jayanagar Panchayat (id: 1)
  { id: 1, panchayatId: 1, vidhansabhaId: 1, name: 'Ward 1 - South End', wardNumber: 1 },
  { id: 2, panchayatId: 1, vidhansabhaId: 1, name: 'Ward 2 - Jayanagar Center', wardNumber: 2 },
  { id: 3, panchayatId: 1, vidhansabhaId: 1, name: 'Ward 3 - Jayanagar North', wardNumber: 3 },

  // For Basavanagudi Panchayat (id: 2)
  { id: 4, panchayatId: 2, vidhansabhaId: 1, name: 'Ward 4 - Basavanagudi East', wardNumber: 4 },
  { id: 5, panchayatId: 2, vidhansabhaId: 1, name: 'Ward 5 - Basavanagudi West', wardNumber: 5 },

  // For Banashankari Panchayat (id: 3)
  { id: 6, panchayatId: 3, vidhansabhaId: 1, name: 'Ward 6 - Banashankari Main', wardNumber: 6 },
  { id: 7, panchayatId: 3, vidhansabhaId: 1, name: 'Ward 7 - Banashankari South', wardNumber: 7 },

  // For Indiranagar Panchayat (id: 4)
  { id: 8, panchayatId: 4, vidhansabhaId: 2, name: 'Ward 8 - Indiranagar East', wardNumber: 8 },
  { id: 9, panchayatId: 4, vidhansabhaId: 2, name: 'Ward 9 - Indiranagar West', wardNumber: 9 },

  // For Koramangala Panchayat (id: 5)
  { id: 10, panchayatId: 5, vidhansabhaId: 2, name: 'Ward 10 - Koramangala North', wardNumber: 10 },
  { id: 11, panchayatId: 5, vidhansabhaId: 2, name: 'Ward 11 - Koramangala South', wardNumber: 11 }
];

// Mock Work Items Data
export const mockWorkItems: WorkItem[] = [
  {
    id: 1,
    vidhansabhaId: 1,
    panchayatId: 1,
    wardId: 1,
    title: 'Road Reconstruction Project',
    description:
      'Complete reconstruction of main roads in South End ward with modern asphalt and proper drainage system installation.',
    imageUrl:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&h=300&fit=crop',
    date: '2024-01-15',
    location: 'South End, Jayanagar'
  },
  {
    id: 2,
    vidhansabhaId: 1,
    panchayatId: 1,
    wardId: 1,
    title: 'Community Park Development',
    description:
      'Development of green recreational space with walking tracks, seating areas, and children playground equipment.',
    imageUrl:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=300&fit=crop',
    date: '2024-02-20',
    location: 'Jayanagar Center Ward'
  },
  {
    id: 3,
    vidhansabhaId: 1,
    panchayatId: 1,
    wardId: 2,
    title: 'Street Lighting Upgrade',
    description:
      'Installation of energy-efficient LED street lights across all main streets with automatic sensor controls.',
    imageUrl:
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=300&fit=crop',
    date: '2024-03-10',
    location: 'Jayanagar Center'
  },
  {
    id: 4,
    vidhansabhaId: 1,
    panchayatId: 2,
    wardId: 4,
    title: 'Water Tank Installation',
    description:
      'Construction and installation of underground water storage tanks to ensure continuous water supply during summer.',
    imageUrl:
      'https://images.unsplash.com/photo-1580705022649-19b4f9ce1ca5?w=500&h=300&fit=crop',
    date: '2024-01-25',
    location: 'Basavanagudi East'
  },
  {
    id: 5,
    vidhansabhaId: 2,
    panchayatId: 4,
    wardId: 8,
    title: 'Drainage System Maintenance',
    description:
      'Comprehensive cleaning and maintenance of drainage systems to prevent waterlogging during monsoon.',
    imageUrl:
      'https://images.unsplash.com/photo-1587293852591-21c3f81db831?w=500&h=300&fit=crop',
    date: '2024-02-28',
    location: 'Indiranagar East'
  },
  {
    id: 6,
    vidhansabhaId: 2,
    panchayatId: 5,
    wardId: 10,
    title: 'Community Health Center',
    description:
      'Establishment of a modern community health center with free medical checkup and vaccination camps.',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&h=300&fit=crop',
    date: '2024-03-05',
    location: 'Koramangala North'
  },
  {
    id: 7,
    vidhansabhaId: 3,
    panchayatId: 7,
    wardId: 12,
    title: 'Waste Management System',
    description:
      'Implementation of modern waste segregation and management system with dedicated waste collection points.',
    imageUrl:
      'https://images.unsplash.com/photo-1559211615-cd4628902249?w=500&h=300&fit=crop',
    date: '2024-02-15',
    location: 'Yeshwanthpur'
  },
  {
    id: 8,
    vidhansabhaId: 4,
    panchayatId: 9,
    wardId: 16,
    title: 'School Building Renovation',
    description:
      'Complete renovation of government school building with new classrooms, labs, and sports facilities.',
    imageUrl:
      'https://images.unsplash.com/photo-1427504494785-cddc0c6a3217?w=500&h=300&fit=crop',
    date: '2024-03-20',
    location: 'Marathahalli'
  }
];

// Mock Events Data
export const mockEvents: EventItem[] = [
  {
    id: 1,
    title: 'Community Awareness Drive 2024',
    description:
      'A comprehensive awareness program on sanitation, health, and environmental conservation for the local community.',
    bannerUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    eventDate: '2024-03-25T10:00:00Z',
    venue: 'Jayanagar Community Center',
    createdBy: 'Admin'
  },
  {
    id: 2,
    title: 'Infrastructure Development Meeting',
    description:
      'Meet with officials and stakeholders to discuss upcoming infrastructure projects and community needs.',
    bannerUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    eventDate: '2024-04-05T14:00:00Z',
    venue: 'Administrative Building, Block 1',
    createdBy: 'Admin'
  },
  {
    id: 3,
    title: 'Youth Development Program Launch',
    description:
      'Launch of skill development and job training programs for youth in our constituency.',
    bannerUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    eventDate: '2024-04-10T09:00:00Z',
    venue: 'Convention Center, Indiranagar',
    createdBy: 'Admin'
  },
  {
    id: 4,
    title: 'Health Camp & Free Medical Check-up',
    description:
      'Free medical consultation, health screening, and vaccination drive for all community members.',
    bannerUrl:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop',
    eventDate: '2024-04-15T08:00:00Z',
    venue: 'Basavanagudi Sub-Center',
    createdBy: 'Health Ministry'
  },
  {
    id: 5,
    title: 'Women Empowerment Workshop',
    description:
      'Interactive workshop on financial literacy, skill development, and career opportunities for women.',
    bannerUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    eventDate: '2024-04-20T10:30:00Z',
    venue: 'Community Hall, Koramangala',
    createdBy: 'WSDO'
  },
  {
    id: 6,
    title: 'Environmental Conservation Drive',
    description:
      'Tree plantation and environmental awareness campaign to promote sustainable development.',
    bannerUrl:
      'https://images.unsplash.com/photo-1516559828552-8e526c74b228?w=800&h=400&fit=crop',
    eventDate: '2024-05-01T06:00:00Z',
    venue: 'Jayanagar Park & Gardens',
    createdBy: 'Environmental Office'
  },
  {
    id: 7,
    title: 'Digital Literacy Classes',
    description:
      'Free computer and digital literacy training for senior citizens and marginalized communities.',
    bannerUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    eventDate: '2024-05-05T03:00:00Z',
    venue: 'Training Center, Whitefield',
    createdBy: 'IT Department'
  },
  {
    id: 8,
    title: 'Sports Tournament 2024',
    description:
      'Inter-ward sports competition featuring cricket, badminton, athletics, and traditional games.',
    bannerUrl:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
    eventDate: '2024-05-15T07:00:00Z',
    venue: 'Sports Stadium, Bangalore',
    createdBy: 'Sports Authority'
  }
];
