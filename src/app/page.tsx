import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedMerch from './components/FeaturedMerch';
import MusicReleaseMerch from './components/MusicReleaseMerch';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedMerch />
      <MusicReleaseMerch />
      <Footer />
    </main>
  );
}
