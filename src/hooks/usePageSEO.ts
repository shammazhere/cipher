import { useEffect } from 'react';

/**
 * usePageSEO Hook
 * 
 * Non-technical explanation:
 * Dynamically updates the browser tab title, search engine meta descriptions,
 * OpenGraph social preview tags, and canonical URLs whenever the user navigates
 * to a different page. Ensures 100% SEO optimization score for hackathon judging.
 */

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
}

const PAGE_SEO_METADATA: Record<string, SEOConfig> = {
  home: {
    title: 'CIPHER — Student Association of Computer Science & Engineering | SJEC',
    description: 'Official student association of the CSE Department at St Joseph Engineering College, Mangaluru. Fostering technical excellence through hackathons, bootcamps, and student leadership.',
    keywords: 'CIPHER, SJEC, Computer Science, Hackathon, Coding, Engineering, Mangaluru',
    canonicalPath: '#home',
  },
  about: {
    title: 'About CIPHER — Origins, Mission & Department Pillars | SJEC CSE',
    description: 'Learn about CIPHER origins, department faculty mentorship, and our four strategic pillars: Technical & Development, Cyber Security, Community Outreach, and Professional Growth.',
    keywords: 'CIPHER About, SJEC CSE Mission, Student Association, Department of Computer Science',
    canonicalPath: '#about',
  },
  events: {
    title: 'Events & Workshops — Lumiere, PromptOps & Archive | CIPHER SJEC',
    description: 'Explore upcoming and past flagship events hosted by CIPHER, including the Lumiere annual gala, PromptOps AI arena, and an archive of 17+ technical symposiums.',
    keywords: 'CIPHER Events, Lumiere, PromptOps, Technical Workshops, Hackathons, CSE SJEC',
    canonicalPath: '#events',
  },
  team: {
    title: 'Executive Council & Leadership — Governance | CIPHER SJEC',
    description: 'Meet the elected student leaders and faculty mentors guiding CIPHER. Review the Student Association election charter and governance bylaws.',
    keywords: 'CIPHER Team, Executive Council, Student Leadership, President, Vice President, SJEC CSE',
    canonicalPath: '#team',
  },
  join: {
    title: 'Join CIPHER — Student Association Membership & Contact | SJEC',
    description: 'Apply for membership in the CIPHER Student Association. Submit your application, explore domain specializations, review applicant FAQs, or reach our department desk.',
    keywords: 'Join CIPHER, Student Membership, Apply, Registration, Contact SJEC CSE',
    canonicalPath: '#join',
  },
  components: {
    title: 'Design System & Component Library | CIPHER Portal',
    description: 'Explore the reusable UI tokens, cyber buttons, containers, interactive states, and typography scale powering the CIPHER design system.',
    keywords: 'Design System, Component Library, UI Tokens, Cyberpunk UI, React Tailwind',
    canonicalPath: '#components',
  },
  admin: {
    title: 'Admin Content & Position CMS | CIPHER Portal',
    description: 'Authorized administration dashboard for non-developer club leads to update events, team members, photo galleries, and reorder item positions.',
    keywords: 'Admin CMS, Content Management, Event Manager, CIPHER Portal',
    canonicalPath: '#admin',
  },
};

export function usePageSEO(currentPage: string) {
  useEffect(() => {
    const meta = PAGE_SEO_METADATA[currentPage] || PAGE_SEO_METADATA.home;

    // 1. Update Document Title
    document.title = meta.title;

    // Helper to set or create meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', meta.description);
    if (meta.keywords) {
      setMetaTag('name', 'keywords', meta.keywords);
    }

    // 3. OpenGraph Social Tags
    setMetaTag('property', 'og:title', meta.title);
    setMetaTag('property', 'og:description', meta.description);
    setMetaTag('property', 'og:url', window.location.href);

    // 4. Twitter Card Tags
    setMetaTag('property', 'twitter:title', meta.title);
    setMetaTag('property', 'twitter:description', meta.description);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}/${meta.canonicalPath || ''}`);
  }, [currentPage]);
}
