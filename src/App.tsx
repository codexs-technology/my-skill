import { LazyMotion, domAnimation } from 'framer-motion';
import About from './components/About';
import BackToTop from './components/BackToTop';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import Services from './components/Services';
import Skills from './components/Skills';

export default function App() {
  return (
    // domAnimation loads only the features this site uses (no drag/layout/gestures),
    // which keeps the animation payload small. `strict` enforces `m` over `motion`.
    <LazyMotion features={domAnimation} strict>
      <div className="relative min-h-screen overflow-x-hidden">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <Navbar />

        <main id="main">
          <Hero />
          <About />
          <Skills />
          <Services />
          <Projects />
          <Experience />
          <Contact />
        </main>

        <Footer />
        <BackToTop />
      </div>
    </LazyMotion>
  );
}
