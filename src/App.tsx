import { MotionConfig } from 'motion/react';
import { useContent } from './i18n';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import Hero from './sections/Hero';
import Profile from './sections/Profile';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Education from './sections/Education';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

export default function App() {
  const { ui } = useContent();
  return (
    // reducedMotion="user" : animations coupées si le visiteur l'a demandé dans son système
    <MotionConfig reducedMotion="user">
      <a href="#profil" className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-lg bg-ink px-4 py-2 text-paper focus-visible:translate-y-0">
        {ui.skip}
      </a>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Profile />
        <Projects />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
