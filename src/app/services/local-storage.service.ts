import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MlaProfile } from '../models/mla.interface';
import { Work } from '../models/work.interface';
import { Event } from '../models/event.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly MLA_KEY = 'mla_profile';
  private readonly WORKS_KEY = 'works';
  private readonly EVENTS_KEY = 'events';
  private isBrowser: boolean;
  private mockData: { [key: string]: string } = {};

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeData();
  }

  // MLA Profile
  getMlaProfile(): MlaProfile | null {
    const data = this.getItem(this.MLA_KEY);
    return data ? JSON.parse(data) : null;
  }

  setMlaProfile(profile: MlaProfile): void {
    this.setItem(this.MLA_KEY, JSON.stringify(profile));
  }

  // Works
  getWorks(): Work[] {
    const data = this.getItem(this.WORKS_KEY);
    return data ? JSON.parse(data) : [];
  }

  addWork(work: Work): void {
    const works = this.getWorks();
    works.push(work);
    this.setItem(this.WORKS_KEY, JSON.stringify(works));
  }

  updateWork(id: string, work: Work): void {
    const works = this.getWorks();
    const index = works.findIndex(w => w.id === id);
    if (index !== -1) {
      works[index] = work;
      this.setItem(this.WORKS_KEY, JSON.stringify(works));
    }
  }

  deleteWork(id: string): void {
    const works = this.getWorks().filter(w => w.id !== id);
    this.setItem(this.WORKS_KEY, JSON.stringify(works));
  }

  // Events
  getEvents(): Event[] {
    const data = this.getItem(this.EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  addEvent(event: Event): void {
    const events = this.getEvents();
    events.push(event);
    this.setItem(this.EVENTS_KEY, JSON.stringify(events));
  }

  updateEvent(id: string, event: Event): void {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events[index] = event;
      this.setItem(this.EVENTS_KEY, JSON.stringify(events));
    }
  }

  deleteEvent(id: string): void {
    const events = this.getEvents().filter(e => e.id !== id);
    this.setItem(this.EVENTS_KEY, JSON.stringify(events));
  }

  private getItem(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return this.mockData[key] || null;
  }

  private setItem(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    } else {
      this.mockData[key] = value;
    }
  }

  private initializeData(): void {
    // Initialize MLA Profile if not exists
    if (!this.getMlaProfile()) {
      const defaultProfile: MlaProfile = {
        id: '1',
        name: 'Shri. Ram Kumar Singh',
        constituency: 'Laxmipuram',
        email: 'ram.singh@mla.gov.in',
        phone: '+91-9876543210',
        bio: 'Dedicated public servant with 15 years of experience in legislative affairs. Passionate about education, healthcare, and infrastructure development.',
        profileImage: 'https://via.placeholder.com/200',
        education: [
          'Bachelor of Arts, Delhi University',
          'Master of Law, National Law School'
        ],
        experience: [
          'MLA Laxmipuram (2018-Present)',
          'Social Worker (2003-2018)',
          'Community Development Officer (2000-2003)'
        ],
        achievements: [
          'Best MLA Award (2021)',
          'Infrastructure Development Initiative',
          'Education for All Campaign'
        ],
        address: 'Laxmipuram, Delhi, India',
        socialLinks: {
          twitter: 'https://twitter.com/ramsingh',
          facebook: 'https://facebook.com/ramsingh',
          linkedin: 'https://linkedin.com/in/ramsingh'
        }
      };
      this.setMlaProfile(defaultProfile);
    }

    // Initialize sample works if not exists
    if (this.getWorks().length === 0) {
      const sampleWorks: Work[] = [
        {
          id: '1',
          title: 'Education Infrastructure Project',
          description: 'Established 10 new schools in rural areas',
          category: 'Education',
          date: new Date('2023-06-01'),
          impact: 'Benefited 5000+ students',
          details: 'A comprehensive initiative to improve educational infrastructure in underserved rural areas of the constituency.'
        },
        {
          id: '2',
          title: 'Healthcare Initiative',
          description: 'Set up 5 primary health centers',
          category: 'Healthcare',
          date: new Date('2023-04-15'),
          impact: 'Served 10000+ citizens',
          details: 'Launched a healthcare program providing basic medical facilities to remote villages.'
        },
        {
          id: '3',
          title: 'Road Infrastructure Enhancement',
          description: 'Constructed 50 km of new roads',
          category: 'Infrastructure',
          date: new Date('2023-03-10'),
          impact: 'Connected 20+ villages',
          details: 'Improved connectivity between villages through road construction and maintenance.'
        },
        {
          id: '4',
          title: 'Water Supply System',
          description: 'Installed water treatment plants in 15 villages',
          category: 'Infrastructure',
          date: new Date('2023-02-20'),
          impact: 'Provided clean water to 8000+ families',
          details: 'Established sustainable water supply systems ensuring safe drinking water for rural communities.'
        }
      ];
      sampleWorks.forEach(work => this.addWork(work));
    }

    // Initialize sample events if not exists
    if (this.getEvents().length === 0) {
      const sampleEvents: Event[] = [
        {
          id: '1',
          title: 'Community Health Camp',
          description: 'Free health checkup and medical consultation',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          location: 'Ram Nagar Community Center, Laxmipuram',
          type: 'upcoming',
          image: 'https://via.placeholder.com/300x200?text=Health+Camp'
        },
        {
          id: '2',
          title: 'Educational Awareness Workshop',
          description: 'Workshop on skill development and career guidance',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          location: 'Delhi Public School, Laxmipuram',
          type: 'upcoming',
          image: 'https://via.placeholder.com/300x200?text=Workshop'
        },
        {
          id: '3',
          title: 'Public Grievance Hearing',
          description: 'Direct interaction with citizens to address concerns',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          location: 'MLA Office, Laxmipuram',
          type: 'past',
          image: 'https://via.placeholder.com/300x200?text=Grievance+Hearing'
        },
        {
          id: '4',
          title: 'Independence Day Celebration',
          description: 'Community gathering and flag hoisting ceremony',
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
          location: 'Government School Ground, Laxmipuram',
          type: 'past',
          image: 'https://via.placeholder.com/300x200?text=Independence+Day'
        }
      ];
      sampleEvents.forEach(event => this.addEvent(event));
    }
  }
}
