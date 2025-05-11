import { Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedMerch from './components/FeaturedMerch';
import MusicReleaseMerch from './components/MusicReleaseMerch';
import Footer from './components/Footer';
import { Loader2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }>
        <Hero />
        <FeaturedMerch />
        <MusicReleaseMerch />
      </Suspense>
      <Footer />
    </main>
  );
}
