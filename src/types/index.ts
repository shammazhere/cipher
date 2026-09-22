/**
 * CIPHER SJEC Portal - Type Definitions
 * 
 * Non-technical note:
 * These definitions describe the structure of the data used on the site.
 * For example, what information a Leader or an Event must have.
 */

export interface Leader {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  email?: string;
}

export interface EventItem {
  id: string;
  tag: string;
  date: string;
  fullDate?: string;
  venue?: string;
  title: string;
  subtitle?: string;
  cardSummary: string;
  detailedReport: string[];
  galleryCount: string;
  images: string[];
}

export interface ArchiveItem {
  id: string;
  title: string;
  href?: string;
}

export interface DomainItem {
  id: string;
  title: string;
  desc: string;
  sessions: number;
  icon: string;
}

export interface MemberApplication {
  id: string;
  name: string;
  usn?: string;
  email: string;
  semester?: string;
  domain?: string;
  message: string;
  submittedAt: string;
}

export interface SiteConfig {
  name: string;
  fullName: string;
  college: string;
  department: string;
  tagline: string;
  aboutText: string;
  joinSubtitle: string;
  copyrightYear: number;
  socialLinks: {
    email: string;
    linkedin: string;
    github: string;
    instagram: string;
  };
  trailImages: string[];
}
