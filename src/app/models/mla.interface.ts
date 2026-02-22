export interface MlaProfile {
  id: string;
  name: string;
  constituency: string;
  email: string;
  phone: string;
  bio: string;
  profileImage: string;
  education: string[];
  experience: string[];
  achievements: string[];
  address: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}
