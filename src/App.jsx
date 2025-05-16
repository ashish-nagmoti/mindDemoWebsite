import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

function App() {
  // Add loading state to control initial animations
  const [isLoaded, setIsLoaded] = useState(false);
  
  // References for animated elements
  const headerRef = useRef(null)
  const brainRef = useRef(null)
  const factsSectionRef = useRef(null)
  const therapySectionRef = useRef(null)
  const resourcesSectionRef = useRef(null)
  const factsContainerRef = useRef(null)
  const mainContentRef = useRef(null)
  const footerRef = useRef(null)
  
  // References for initial page appearance animations
  const heroContentRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroTextRef = useRef(null)
  const heroButtonsRef = useRef(null)
  const pageWrapperRef = useRef(null)
  const scrollCtaRef = useRef(null)
  
  useEffect(() => {
    // Set loaded state after a short delay to trigger animations
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(loadTimer);
  }, []);
  
  useEffect(() => {
    // Initial page appearance animations with enhanced sequence
    if (isLoaded) {
      // Create a master timeline for initial page load animations
      let masterTl = gsap.timeline();
      
      // Start with an overlay fade out effect
      masterTl.fromTo(".page-overlay", {
        opacity: 1,
      }, {
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut"
      });
      
      // Fade in the page wrapper with a slight scale effect
      masterTl.fromTo(pageWrapperRef.current, {
        opacity: 0,
        scale: 1.05
      }, {
        opacity: 1, 
        scale: 1,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.7");
      
      // Header animation with a slide down reveal
      masterTl.fromTo(headerRef.current, {
        y: -100,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out"
      }, "-=0.5");
      
      // Title animation with a clip-path reveal
      masterTl.fromTo(heroTitleRef.current, {
        clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
        opacity: 0
      }, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        opacity: 1,
        duration: 1.2,
        ease: "power4.out"
      }, "-=0.7");
      
      // Text paragraph reveal with a fade up
      masterTl.fromTo(heroTextRef.current, {
        y: 40,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.9");
      
      // Buttons reveal with a staggered pop effect
      masterTl.fromTo(heroButtonsRef.current.children, {
        scale: 0.8,
        y: 30,
        opacity: 0
      }, {
        scale: 1,
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.7,
        ease: "back.out(1.7)"
      }, "-=0.8");
      
      // Scroll indicator fade in and bounce
      masterTl.fromTo(scrollCtaRef.current, {
        y: 20,
        opacity: 0
      }, {
        y: 0,
        opacity: 0.7,
        duration: 1,
        ease: "power3.out"
      }, "-=0.5");
    }
    
    // Clear any existing ScrollTriggers to avoid conflicts
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    // BRAIN SETUP AND SCROLL ANIMATION
    
    // Position the brain at absolute top left of the page
    gsap.set(brainRef.current, {
      xPercent: 0,
      yPercent: 0,
      left: '5%',    // Absolute position from left edge
      top: '10%',    // Adjusted to be a bit lower than navbar
      x: 0,
      y: 0,
      rotation: 0,
      scale: 0.9,
      opacity: 1,
      transformOrigin: "center center"
    });
    
    // Create a timeline for scroll animations with start trigger at very top
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body", // Use body as trigger to start immediately
        start: "top top", // Start as soon as page starts scrolling
        end: () => `+=${document.body.scrollHeight - window.innerHeight - 100}`, // Calculate proper end point
        scrub: 0.5,    // Smoother scrubbing effect
        pin: false,
        onUpdate: self => {
          // console.log("scroll progress:", self.progress.toFixed(3));
        },
      }
    });
    
    // Brain animation with more precise positions based on percentage of viewport
    // Start animation immediately when scrolling begins
    
    // First movement - start immediately
    tl.to(brainRef.current, {
      left: '15%',
      top: '15%',
      rotation: 5,
      scale: 0.95,
      opacity: 1,
      duration: 0.15,
      ease: "none"
    }, 0);
    
    // Second movement
    tl.to(brainRef.current, {
      left: '30%',
      top: '30%',
      rotation: 10,
      scale: 0.92,
      opacity: 1,
      duration: 0.2,
      ease: "none"
    }, 0.15);
    
    // Third movement
    tl.to(brainRef.current, {
      left: '50%',
      top: '45%',
      rotation: -5,
      scale: 0.9,
      opacity: 1,
      duration: 0.2,
      ease: "none"
    }, 0.35);
    
    // Fourth movement
    tl.to(brainRef.current, {
      left: '70%',
      top: '65%',
      rotation: 15,
      scale: 0.85,
      opacity: 1,
      duration: 0.2,
      ease: "none"
    }, 0.55);
    
    // Final movement
    tl.to(brainRef.current, {
      left: '85%',
      top: '95%',
      rotation: 25,
      scale: 0.8,
      opacity: 0,
      duration: 0.15,
      ease: "none"
    }, 0.75);
    
    // Brain glow effect during scrolling
    gsap.fromTo(brainRef.current, 
      { filter: "drop-shadow(0 0 15px rgba(79, 70, 229, 0.5))" },
      { 
        filter: "drop-shadow(0 0 25px rgba(79, 70, 229, 0.9))",
        scrollTrigger: {
          trigger: factsSectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
    
    // Facts section animations
    const factsItems = factsContainerRef.current.querySelectorAll('.fact-item');
    
    gsap.fromTo(factsItems, 
      { 
        y: 70, 
        opacity: 0,
        scale: 0.9
      },
      {
        scrollTrigger: {
          trigger: factsSectionRef.current,
          start: "top 80%",
          end: "center center",
          scrub: false,
          toggleActions: "play none none none"
        },
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.5)"
      }
    );
    
    // Therapy section animation
    gsap.fromTo(therapySectionRef.current.querySelectorAll('.animate-in'), 
      {
        y: 70,
        opacity: 0,
        scale: 0.95
      },
      {
        scrollTrigger: {
          trigger: therapySectionRef.current,
          start: "top 70%",
          end: "center center",
          scrub: false,
          toggleActions: "play none none none"
        },
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.2,
        duration: 1,
        ease: "back.out(1.5)"
      }
    );
    
    // Resources section animation
    gsap.fromTo(resourcesSectionRef.current.querySelectorAll('.resource-card'), 
      {
        y: 50,
        opacity: 0,
        scale: 0.9,
        rotationY: 15
      },
      {
        scrollTrigger: {
          trigger: resourcesSectionRef.current,
          start: "top 80%",
          end: "center center",
          scrub: false,
          toggleActions: "play none none none"
        },
        y: 0,
        rotationY: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out"
      }
    );
    
    // Fix scroll issues by setting up ScrollTrigger refresh
    ScrollTrigger.refresh(true);
    
    // Handle resize events
    const handleResize = () => {
      ScrollTrigger.refresh(true);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [isLoaded]);

  return (
    <>
      {/* Initial page overlay for smooth entrance */}
      <div className="page-overlay"></div>
      
      <div ref={pageWrapperRef} className="main-wrapper">
        <div ref={mainContentRef} className="main-content">
          {/* Navigation bar */}
          <nav ref={headerRef} className="fixed top-0 left-0 right-0 bg-mindful-yellow shadow-md z-50 py-4">
            <div className="container-custom flex justify-between items-center px-4">
              <div className="text-2xl font-bold text-primary">MindWell</div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#hero" className="text-dark font-medium hover:text-primary transition-colors">Home</a>
                <a href="#facts" className="text-dark font-medium hover:text-primary transition-colors">Facts</a>
                <a href="#therapy" className="text-dark font-medium hover:text-primary transition-colors">Therapy</a>
                <a href="#resources" className="text-dark font-medium hover:text-primary transition-colors">Resources</a>
              </div>
              <button className="btn btn-primary shadow-lg">Get Help</button>
            </div>
          </nav>
          
          {/* Brain element positioned absolutely */}
          <div ref={brainRef} className="brain-element w-48 h-48 md:w-56 md:h-56 bg-transparent flex items-center justify-center z-50 pointer-events-none">
            {/* Using the mind.svg from the public directory */}
            <img 
              src="/mind.svg" 
              alt="3D brain visualization" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Hero section */}
          <section id="hero" className="section flex items-center justify-center bg-mindful-yellow min-h-screen pt-16">
            <div ref={heroContentRef} className="container-custom grid md:grid-cols-5 gap-4 items-center">
              {/* Empty space for brain visibility (1 col) */}
              <div className="md:col-span-2"></div>
              
              {/* Content on the right (3 cols) */}
              <div className="z-10 md:col-span-3">
                <h1 ref={heroTitleRef} className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-dark">Your Mental Health Matters</h1>
                <p ref={heroTextRef} className="text-lg md:text-xl mb-8 text-dark">
                  Understanding and caring for your mental wellbeing is just as important as physical health.
                  Let's explore how to nurture a healthier mind together.
                </p>
                <div ref={heroButtonsRef} className="flex flex-wrap gap-4">
                  <button className="btn btn-primary shadow-lg">Learn More</button>
                  <button className="btn border-2 border-primary text-primary hover:bg-primary/10 shadow-lg">Take Assessment</button>
                </div>
              </div>
            </div>
            <div ref={scrollCtaRef} className="scroll-cta absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center opacity-60">
              <p className="text-sm">Scroll Down</p>
              <svg className="mx-auto w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </section>
          
          {/* Mental health facts section */}
          <section id="facts" ref={factsSectionRef} className="section bg-warm-amber py-16">
            <div className="container-custom">
              <h2 className="text-4xl font-bold mb-12 text-center text-dark">Mental Health Facts</h2>
              <div ref={factsContainerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="fact-item bg-white p-8 rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-primary mb-2">1 in 5</div>
                  <p className="text-gray-800">U.S. adults experience mental illness each year.</p>
                </div>
                <div className="fact-item bg-white p-8 rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-primary mb-2">50%</div>
                  <p className="text-gray-800">Of all lifetime mental illness begins by age 14, and 75% by age 24.</p>
                </div>
                <div className="fact-item bg-white p-8 rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-primary mb-2">16.5%</div>
                  <p className="text-gray-800">Of U.S. youth aged 6-17 experienced a mental health disorder in 2019.</p>
                </div>
                <div className="fact-item bg-white p-8 rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-secondary mb-2">65%</div>
                  <p className="text-gray-800">Of adults with mental illness receive no treatment.</p>
                </div>
                <div className="fact-item bg-white p-8 rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-secondary mb-2">300 million</div>
                  <p className="text-gray-800">People of all ages suffer from depression globally.</p>
                </div>
                <div className="fact-item bg-white p-8 rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-secondary mb-2">90%</div>
                  <p className="text-gray-800">Of people who die by suicide have an underlying mental illness.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Therapy section */}
          <section id="therapy" ref={therapySectionRef} className="section bg-mindful-yellow py-16">
            <div className="container-custom grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 animate-in text-dark">Types of Therapy</h2>
                <p className="text-lg mb-8 text-gray-800 animate-in">
                  There are many approaches to therapy, each designed to address different needs and conditions.
                  Finding the right type of therapy and therapist is an important step in your mental health journey.
                </p>
                <div className="space-y-6">
                  <div className="animate-in bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2 text-primary">Cognitive Behavioral Therapy (CBT)</h3>
                    <p className="text-gray-800">Focuses on identifying and changing negative thought patterns that influence behavior and emotions.</p>
                  </div>
                  <div className="animate-in bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2 text-primary">Mindfulness-Based Therapy</h3>
                    <p className="text-gray-800">Incorporates mindfulness practices to help individuals stay present and develop coping strategies.</p>
                  </div>
                  <div className="animate-in bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2 text-primary">Psychodynamic Therapy</h3>
                    <p className="text-gray-800">Explores how past experiences influence current behaviors and relationships.</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block relative">
                <div className="animate-in absolute -right-10 top-10 w-64 h-64 bg-primary/20 rounded-full"></div>
                <div className="animate-in absolute -left-10 bottom-10 w-40 h-40 bg-secondary/20 rounded-full"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522424427542-1cb34d1d7ae2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Therapy session" 
                  className="animate-in rounded-lg shadow-lg relative z-10 w-full"
                />
              </div>
            </div>
          </section>
          
          {/* Resources section */}
          <section id="resources" ref={resourcesSectionRef} className="section bg-warm-amber py-16 mb-0">
            <div className="container-custom">
              <h2 className="text-4xl font-bold mb-4 text-center text-dark">Mental Health Resources</h2>
              <p className="text-lg text-center mb-12 max-w-3xl mx-auto text-gray-800">
                Finding the right resources is an important step in maintaining good mental health.
                Here are some helpful resources to support your journey.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="resource-card bg-white p-6 rounded-xl shadow-md">
                  <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-dark">Crisis Hotlines</h3>
                  <p className="text-gray-800 mb-4">Immediate support for those in crisis or having thoughts of suicide.</p>
                  <a href="#" className="text-primary font-medium hover:underline">Learn More →</a>
                </div>
                
                <div className="resource-card bg-white p-6 rounded-xl shadow-md">
                  <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h.01M15 10h.01M12 16v-1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-dark">Support Groups</h3>
                  <p className="text-gray-800 mb-4">Connect with others facing similar challenges for mutual support.</p>
                  <a href="#" className="text-primary font-medium hover:underline">Find Groups →</a>
                </div>
                
                <div className="resource-card bg-white p-6 rounded-xl shadow-md">
                  <div className="bg-secondary/10 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-dark">Recommended Reading</h3>
                  <p className="text-gray-800 mb-4">Books and articles about mental health awareness and self-care.</p>
                  <a href="#" className="text-secondary font-medium hover:underline">View List →</a>
                </div>
                
                <div className="resource-card bg-white p-6 rounded-xl shadow-md">
                  <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-dark">Self-Assessment Tools</h3>
                  <p className="text-gray-800 mb-4">Online tools to help you assess your mental health status.</p>
                  <a href="#" className="text-primary font-medium hover:underline">Take Assessment →</a>
                </div>
                
                <div className="resource-card bg-white p-6 rounded-xl shadow-md">
                  <div className="bg-secondary/10 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-dark">Helpful Apps</h3>
                  <p className="text-gray-800 mb-4">Mobile applications for meditation, mood tracking, and mental wellness.</p>
                  <a href="#" className="text-secondary font-medium hover:underline">Explore Apps →</a>
                </div>
                
                <div className="resource-card bg-white p-6 rounded-xl shadow-md">
                  <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-dark">Find a Therapist</h3>
                  <p className="text-gray-800 mb-4">Search for qualified mental health professionals in your area.</p>
                  <a href="#" className="text-primary font-medium hover:underline">Search Now →</a>
                </div>
              </div>
            </div>
          </section>
          
          {/* Footer */}
          <footer ref={footerRef} className="bg-dark text-white py-12">
            <div className="container-custom px-4">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">MindWell</h3>
                  <p className="text-gray-300">
                    Supporting your mental health journey with reliable information and resources.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
                    <li><a href="#facts" className="hover:text-white transition-colors">Facts</a></li>
                    <li><a href="#therapy" className="hover:text-white transition-colors">Therapy</a></li>
                    <li><a href="#resources" className="hover:text-white transition-colors">Resources</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Emergency Contacts</h4>
                  <div className="text-gray-300">
                    <p className="mb-2">National Suicide Prevention Lifeline</p>
                    <p className="font-semibold text-white mb-4">1-800-273-8255</p>
                    <p className="mb-2">Crisis Text Line</p>
                    <p className="font-semibold text-white">Text HOME to 741741</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>© 2025 MindWell. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}

export default App
