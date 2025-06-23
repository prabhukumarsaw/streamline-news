import { Metadata } from 'next';
import { Suspense } from 'react';
import { CareerHero } from '@/components/careers/career-hero';
import { JobListings } from '@/components/careers/job-listings';
import { CompanyBenefits } from '@/components/careers/company-benefits';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Careers | Advanced News Platform',
  description: 'Join our team and help shape the future of digital journalism. Explore exciting career opportunities.',
  keywords: ['careers', 'jobs', 'journalism', 'media', 'hiring'],
});

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <CareerHero />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <JobListings />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <CompanyBenefits />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}