import { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Privacy Policy | Advanced News Platform',
  description: 'Our privacy policy explains how we collect, use, and protect your personal information.',
  keywords: ['privacy', 'policy', 'data protection', 'GDPR'],
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p className="lead">
            This Privacy Policy describes how Advanced News Platform collects, uses, and protects your personal information.
          </p>
          
          <h2>Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us.
          </p>
          
          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, communicate with you, and comply with legal obligations.
          </p>
          
          <h2>Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties without your consent, except as described in this policy.
          </p>
          
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          
          <h2>Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@newsplatform.com.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}