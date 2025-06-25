import { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactInfo } from '@/components/contact/contact-info';
import { Navbar } from '@/components/layout/navbar/navbar';
import { Footer } from '@/components/layout/footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Contact Us | Advanced News Platform',
  description: "Get in touch with our team. We'd love to hear from you.",
  keywords: ['contact', 'support', 'help', 'feedback'],
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground">
              We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Suspense fallback={<LoadingSpinner />}>
              <ContactForm />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <ContactInfo />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
