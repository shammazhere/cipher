import React from 'react';
import { HeroSection } from '../components/Sections/HeroSection';
import { AboutSection } from '../components/Sections/AboutSection';
import { LeadershipSection } from '../components/Sections/LeadershipSection';
import { EventsSection } from '../components/Sections/EventsSection';
import { ArchiveGrid } from '../components/Sections/ArchiveGrid';
import { JoinSection } from '../components/Sections/JoinSection';

/**
 * HomePage Component (Page 1 of 5)
 * 
 * Non-technical explanation:
 * The main portal landing page featuring the hero ASCII banner,
 * about overview, leadership deck, flagship events, and the join CTA.
 */

interface HomePageProps {
  onOpenJoin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenJoin }) => {
  return (
    <div>
      <HeroSection onOpenJoin={onOpenJoin} />
      <AboutSection />
      <LeadershipSection />
      <EventsSection />
      <ArchiveGrid />
      <JoinSection onOpenJoin={onOpenJoin} />
    </div>
  );
};
