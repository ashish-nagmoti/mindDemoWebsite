import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'
import Brain3DScene from './components/Brain3DScene'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

function App() {
  // Add loading state to control initial animations
  const [isLoaded, setIsLoaded] = useState(false);
  const [brainActivity, setBrainActivity] = useState(0.2); // Adjusted initial state
  
  // References for animated elements
  const headerRef = useRef(null)
  const brainRef = useRef(null)
  const brain3dRef = useRef(null)
  const factsSectionRef = useRef(null)
  const therapySectionRef = useRef(null)
  const resourcesSectionRef = useRef(null)
  const selfCareSectionRef = useRef(null)
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
  const heroBgDeco1Ref = useRef(null)
  const heroBgDeco2Ref = useRef(null)
  
  useEffect(() => {
    // Set loaded state after a short delay to trigger animations
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(loadTimer);
  }, []);
  
  // Function to create neural activity particles
  const createNeuronParticles = () => {
    const brainElement = brainRef.current;
    if (!brainElement) return;
    
    // Create multiple neuron particles
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'neuron-particle';
      
      // Random positioning within the brain element
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;
      
      particle.style.left = `${randomX}%`;
      particle.style.top = `${randomY}%`;
      
      // Random animation delay for varied effect
      // particle.style.animationDelay = `${Math.random() * 3}s`; // Removed, GSAP will handle
      
      brainElement.appendChild(particle);

      // GSAP animation for each particle
      gsap.set(particle, { scale: 0, opacity: 0 }); // Initial state for GSAP animation
      gsap.to(particle, {
        x: () => Math.random() * 30 - 15, // Random drift x
        y: () => Math.random() * 30 - 15, // Random drift y
        opacity: () => Math.random() * 0.5 + 0.5, // Fade in to a random opacity
        scale: () => Math.random() * 0.5 + 0.5,   // Pulse to a random scale
        duration: () => Math.random() * 1.5 + 1,  // Random duration
        repeat: -1, // Loop indefinitely
        yoyo: true, // Animate back and forth
        ease: "power1.inOut",
        delay: Math.random() * 1.5, // Random initial delay
      });
    }
    
    // Add wave animation - This will be handled by the waveInterval logic later
    // const wave = document.createElement('div');
    // wave.className = 'brain-wave';
    // wave.style.animationDelay = '1s';
    // brainElement.appendChild(wave);
  };
  
  useEffect(() => {
    if (!isLoaded) return;
    
    // Kill any existing ScrollTriggers to prevent duplicates
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Initial page appearance animations
    let masterTl = gsap.timeline();
    
    // Fade out page overlay
    masterTl.fromTo(".page-overlay", {
      opacity: 1,
    }, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut"
    });
    
    // Fade in page wrapper
    masterTl.fromTo(pageWrapperRef.current, {
      opacity: 0,
      scale: 1.05
    }, {
      opacity: 1, 
      scale: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.7");
    
    // Animate header
    masterTl.fromTo(headerRef.current, {
      y: -100,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "expo.out"
    }, "-=0.5");
    
    // Initial brain appearance
    if (brainRef.current) {
      masterTl.fromTo(brainRef.current, {
        opacity: 0,
        scale: 0.7,
        rotation: -10
      }, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: "back.out(1.2)",
        onComplete: createNeuronParticles
      }, "-=0.8");
      
      // Set initial position at top right - positioning higher
      gsap.set(brainRef.current, {
        position: "fixed",
        top: "5%",  // Changed from 10% to 5% to position it higher
        right: "5%",
        left: "auto",
        zIndex: 50,
      });
      
      // Define zigzag path coordinates - adjusted first position to be higher
      const zigzagPath = [
        { top: "5%", left: "auto", right: "5%" },   // Start: top right (higher position)
        { top: "30%", left: "10%", right: "auto" }, // Point 1: left
        { top: "50%", left: "auto", right: "15%" }, // Point 2: right
        { top: "70%", left: "15%", right: "auto" }, // Point 3: left
        { top: "90%", left: "auto", right: "10%" }  // End: bottom right
      ];
      
      // Create a sequence of animations for the zigzag path
      const brainZigzag = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrubbing tied to scroll position
          markers: false, // Change to true for debugging
          id: "brain-zigzag",
        }
      });
      
      // Add animations for each path point
      zigzagPath.forEach((position, index) => {
        if (index === 0) return; // Skip the first point as it's the initial position
        
        // Calculate rotation (alternate between positive and negative)
        const rotation = index % 2 === 0 ? 5 : -5;
        
        // Calculate scale (gradually decrease as it moves down)
        const scale = 1 - (index * 0.05);
        
        // Add to timeline
        brainZigzag.to(brainRef.current, {
          top: position.top,
          left: position.left,
          right: position.right,
          rotation: rotation + (Math.random() * 10 - 5), // Add random rotation wobble
          scale: scale,
          xPercent: Math.random() * 10 - 5, // Add random x wobble
          yPercent: Math.random() * 10 - 5, // Add random y wobble
          ease: "power2.inOut", // Smoother easing
          duration: 0.35, // Slightly longer duration for smoother effect
        });
      });
      
      // Add a final tween to reset wobble at the end of the scroll
      brainZigzag.to(brainRef.current, {
        xPercent: 0,
        yPercent: 0,
        rotation: zigzagPath[zigzagPath.length -1].rotation || 0, // Assuming last point might have a target rotation
        ease: "power2.inOut",
        duration: 0.35
      });
    }
    
    // Animate hero content
    
    // Parallax for hero background elements
    if (heroBgDeco1Ref.current && heroBgDeco2Ref.current) {
      gsap.to(heroBgDeco1Ref.current, {
        y: -100, // Move up
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(heroBgDeco2Ref.current, {
        y: 100, // Move down
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
    
    // Animate hero title character by character
    if (heroTitleRef.current) {
      const titleText = heroTitleRef.current.innerText;
      heroTitleRef.current.innerHTML = titleText
        .split("")
        .map((char) => `<span class="char inline-block">${char === " " ? "&nbsp;" : char}</span>`)
        .join("");
      
      masterTl.fromTo(heroTitleRef.current.querySelectorAll(".char"), {
        y: 50,
        opacity: 0,
        rotationZ: 10,
      }, {
        y: 0,
        opacity: 1,
        rotationZ: 0,
        stagger: 0.03,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.7");
    }
    
    // Animate hero text word by word
    if (heroTextRef.current) {
      const textContent = heroTextRef.current.innerText;
      heroTextRef.current.innerHTML = textContent
        .split(" ")
        .map((word) => `<span class="word inline-block">${word}&nbsp;</span>`)
        .join("");
      
      masterTl.fromTo(heroTextRef.current.querySelectorAll(".word"), {
        y: 30,
        opacity: 0,
        skewX: -10,
        rotationZ: 5
      }, {
        y: 0,
        opacity: 1,
        skewX: 0,
        rotationZ: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.9");
    }
    
    masterTl.fromTo(heroButtonsRef.current.children, {
      scale: 0.8,
      y: 30,
      opacity: 0,
      rotationZ: -10 // Added rotation
    }, {
      scale: 1,
      y: 0,
      opacity: 1,
      rotationZ: 0, // End rotation at 0
      stagger: 0.15,
      duration: 1, // Slightly longer duration for elastic ease
      ease: "elastic.out(1, 0.5)" // Playful elastic easing
    }, "-=0.8");
    
    masterTl.fromTo(scrollCtaRef.current, {
      y: 20,
      opacity: 0
    }, {
      y: 0,
      opacity: 0.7,
      duration: 1,
      ease: "power3.out"
    }, "-=0.5");
    
    // 3D Brain animation
    if (brain3dRef.current) {
      masterTl.fromTo(brain3dRef.current, {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.5");
    }
    
    // Create brain waves at interval
    const waveInterval = setInterval(() => {
      if (brainRef.current) {
        const wave = document.createElement('div');
        wave.className = 'brain-wave';
        brainRef.current.appendChild(wave);
        
        gsap.fromTo(wave, 
          { scale: 0.1, opacity: 0.7 }, 
          { 
            scale: 1.5, 
            opacity: 0, 
            duration: 3, // Duration of the wave effect
            ease: "power1.out",
            onComplete: () => {
              if (wave && wave.parentNode) {
                wave.parentNode.removeChild(wave);
              }
            }
          }
        );
      }
    }, 3000);
    
    // Control 3D brain activity based on overall page scroll position
    if (brain3dRef.current) { // Keep check for brain3dRef if activity is only for it
      ScrollTrigger.create({
        trigger: document.body, // Use document.body for overall page scroll
        start: "top top",
        end: "bottom bottom",
        scrub: true, // Add scrub for smoother updates, can be true or a number
        onUpdate: (self) => {
          // Map overall scroll progress to brainActivity (0.2 to 1.0)
          setBrainActivity(0.2 + self.progress * 0.8);
        },
        id: "brainActivityScroll" // Add an ID for easier debugging if needed
      });
    }
    
    // Animate fact items using ScrollTrigger.batch()
    if (factsContainerRef.current) {
      const factsItems = factsContainerRef.current.querySelectorAll('.fact-item');
      ScrollTrigger.batch(factsItems, {
        start: "top 90%",
        end: "center 70%",
        toggleActions: "play none none none",
        onEnter: batch => gsap.to(batch, {
          opacity: 1,
          x: 0,
          rotation: 0,
          scale: 1,
          stagger: {
            each: 0.1,
            from: "start" // Or "edges", "center"
          },
          duration: 1,
          ease: "expo.out",
          overwrite: true // Important for re-runs if ScrollTriggers are not killed properly before
        }),
        onLeaveBack: batch => gsap.set(batch, { // Reset if scrolling back up past start
          opacity: 0, 
          x: (i) => i % 2 === 0 ? -100 : 100,
          rotation: (i) => i % 2 === 0 ? -5 : 5,
          scale: 0.9,
          overwrite: true
        }),
        // Set initial state for batch elements before animation
        onRefresh: self => self.targets.forEach((target, i) => gsap.set(target, {
          opacity: 0,
          x: i % 2 === 0 ? -100 : 100,
          rotation: i % 2 === 0 ? -5 : 5,
          scale: 0.9
        }))
      });
    }
    
    // Therapy section animation
    if (therapySectionRef.current) {
      const therapyAnimateInElements = therapySectionRef.current.querySelectorAll('.animate-in');
      ScrollTrigger.batch(therapyAnimateInElements, {
        start: "top 85%",
        toggleActions: "play none none none",
        onEnter: batch => {
          batch.forEach((el, idx) => {
            if (el.tagName === 'H2' || el.tagName === 'P') {
              const textContent = el.innerText;
              el.innerHTML = textContent
                .split(" ")
                .map((word) => `<span class="word inline-block opacity-0" style="transform: translateY(20px) skewX(-10deg);">${word}&nbsp;</span>`)
                .join("");
              gsap.set(el, { opacity: 1 }); // Make container visible
              gsap.to(el.querySelectorAll(".word"), {
                opacity: 1,
                y: 0,
                skewX: 0,
                stagger: 0.05,
                duration: 0.5,
                ease: "power3.out",
                delay: idx * 0.1 // Stagger between .animate-in elements
              });
            } else {
              gsap.to(el, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out", delay: idx * 0.1 });
            }
          });
        },
        onLeaveBack: batch => {
          batch.forEach(el => {
            if (el.tagName === 'H2' || el.tagName === 'P') {
              // Reset words if necessary, or just the container
              gsap.set(el.querySelectorAll(".word"), { opacity: 0, y: 20, skewX: -10 });
            } else {
              gsap.set(el, { y: 50, opacity: 0, scale: 0.95 });
            }
          });
        },
        onRefresh: self => self.targets.forEach(el => {
          if (el.tagName === 'H2' || el.tagName === 'P') {
            // Initial state for words is set via inline style above
             gsap.set(el, { opacity: 0 }); // Keep container hidden initially
          } else {
            gsap.set(el, { y: 50, opacity: 0, scale: 0.95 });
          }
        })
      });

      const therapyCards = therapySectionRef.current.querySelectorAll('.therapy-card');
      ScrollTrigger.batch(therapyCards, {
        start: "top 85%",
        toggleActions: "play none none none",
        onEnter: batch => gsap.to(batch, {
          opacity: 1,
          rotationY: 0,
          scale: 1,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          overwrite: true
        }),
        onLeaveBack: batch => gsap.set(batch, {
          opacity: 0,
          rotationY: -90,
          scale: 0.8,
          overwrite: true
        }),
        onRefresh: self => self.targets.forEach(target => gsap.set(target, {
          opacity: 0,
          rotationY: -90,
          scale: 0.8,
          transformOrigin: "left center"
        }))
      });
    }
    
    // Self-care section animation
    if (selfCareSectionRef.current) {
      const selfCareCards = selfCareSectionRef.current.querySelectorAll('.self-care-card');
      ScrollTrigger.batch(selfCareCards, {
        start: "top 90%",
        toggleActions: "play none none none",
        onEnter: batch => gsap.to(batch, {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "circ.out",
          overwrite: true
        }),
        onLeaveBack: batch => gsap.set(batch, {
          opacity: 0,
          scale: 0.5,
          overwrite: true
        }),
        onRefresh: self => self.targets.forEach(target => gsap.set(target, {
          opacity: 0,
          scale: 0.5,
          transformOrigin: "center center"
        }))
      });
    }
    
    // Resources section animation
    if (resourcesSectionRef.current) {
      const resourceCards = resourcesSectionRef.current.querySelectorAll('.resource-card');
      ScrollTrigger.batch(resourceCards, {
        start: "top 95%",
        end: "center 75%",
        toggleActions: "play none none none",
        onEnter: batch => gsap.to(batch, {
          opacity: 1,
          x: 0,
          rotationY: 0,
          scale: 1,
          stagger: {
            each: 0.1,
            from: "start"
          },
          duration: 1.3,
          ease: "sine.out",
          overwrite: true
        }),
        onLeaveBack: batch => gsap.set(batch, {
          opacity: 0,
          x: (i) => i % 2 === 0 ? -100 : 100,
          rotationY: (i) => i % 2 === 0 ? 60 : -60,
          scale: 0.8,
          overwrite: true
        }),
        onRefresh: self => self.targets.forEach((target, i) => gsap.set(target, {
          opacity: 0,
          x: i % 2 === 0 ? -100 : 100,
          rotationY: i % 2 === 0 ? 60 : -60,
          scale: 0.8,
          transformOrigin: "center center"
        }))
      });
    }
    
    // Footer elements animation
    if (footerRef.current) {
      const footerElements = footerRef.current.querySelectorAll(".container-custom > .grid > div"); // Target direct children of grid
      if (footerElements.length > 0) {
        gsap.fromTo(footerElements,
          { opacity: 0, y: 30 },
          {
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 85%", // Start when footer is 85% in view
              end: "bottom bottom",
              toggleActions: "play none none none",
            },
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power2.out"
          }
        );
      }
    }

    // Navigation bar background change on scroll
    if (headerRef.current) {
      ScrollTrigger.create({
        trigger: "#hero", // Hero section as the trigger
        start: "bottom top", // When the bottom of the hero section hits the top of the viewport
        end: "bottom top-=1", // A very small scroll distance to ensure it triggers correctly
        toggleClass: { targets: headerRef.current, className: "scrolled-nav" },
        // markers: true, // Uncomment for debugging
        id: "navScroll"
      });
    }
    
    // Fix scroll issues by refreshing ScrollTrigger
    ScrollTrigger.refresh(true);
    
    // Handle resize events
    const handleResize = () => {
      ScrollTrigger.refresh(true);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(waveInterval);
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (masterTl) {
        masterTl.kill(); // Kill the master timeline on cleanup
      }
    };
  }, [isLoaded]);

  return (
    <>
      {/* Initial page overlay for smooth entrance */}
      <div className="page-overlay"></div>
      
      <div ref={pageWrapperRef} className="main-wrapper">
        <div ref={mainContentRef} className="main-content">
          {/* Navigation bar */}
          <nav ref={headerRef} className="fixed top-0 left-0 right-0 bg-warm-amber shadow-md z-50 py-4">
            <div className="container-custom flex justify-between items-center px-4">
              <div className="text-2xl font-bold gradient-text">MindWell</div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#hero" className="text-dark font-medium hover:text-primary transition-colors">Home</a>
                <a href="#facts" className="text-dark font-medium hover:text-primary transition-colors">Facts</a>
                <a href="#therapy" className="text-dark font-medium hover:text-primary transition-colors">Therapy</a>
                <a href="#self-care" className="text-dark font-medium hover:text-primary transition-colors">Self-Care</a>
                <a href="#resources" className="text-dark font-medium hover:text-primary transition-colors">Resources</a>
                <a href="#brain-3d" className="text-dark font-medium hover:text-primary transition-colors">Interactive Brain</a>
              </div>
              <button className="btn bg-secondary text-dark font-medium shadow-lg hover:bg-serene-green transition-colors">Get Help</button>
            </div>
          </nav>
          
          {/* Hero section with 2D brain visualization */}
          <section id="hero" className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-warm-amber/30 to-warm-amber/10 z-0"></div>
            <div ref={heroBgDeco1Ref} className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-300/20 rounded-full blur-3xl"></div>
            <div ref={heroBgDeco2Ref} className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-teal-300/20 rounded-full blur-3xl"></div>
            
            <div className="container-custom grid md:grid-cols-2 gap-10 items-center relative z-10 px-4">
              <div ref={heroContentRef} className="flex flex-col items-start space-y-6 max-w-xl">
                <h1 ref={heroTitleRef} className="text-5xl md:text-6xl font-bold gradient-text leading-tight">
                  Mental Health Matters
                </h1>
                <p ref={heroTextRef} className="text-lg md:text-xl text-dark/80 leading-relaxed">
                  Understanding your mind is the first step to wellness. Explore resources, 
                  therapy options, and self-care techniques to improve your mental well-being.
                </p>
                <div ref={heroButtonsRef} className="flex flex-wrap gap-4">
                  <button className="btn bg-primary text-light shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all">
                    Get Started
                  </button>
                  <button className="btn bg-light text-primary border border-primary/20 hover:bg-primary/10 transition-all">
                    Learn More
                  </button>
                </div>
              </div>
              
              <div className="relative min-h-[300px] md:min-h-[400px] flex items-center justify-center">
                {/* This div is a placeholder - the brain is positioned fixed */}
              </div>
            </div>
            
            {/* Floating brain element - positioned with GSAP */}
            <div ref={brainRef} className="brain-element">
              <img src="/mind.svg" alt="Abstract brain illustration" className="w-full h-full object-contain" />
            </div>
            
            {/* Scroll indicator */}
            <div ref={scrollCtaRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 scroll-indicator">
              <div className="w-8 h-14 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
                <div className="w-1 h-3 bg-primary rounded-full animate-scroll-dot"></div>
              </div>
              <p className="text-xs text-center mt-2 text-dark/70">Scroll to explore</p>
            </div>
          </section>
          
          {/* 3D Brain Interactive Section */}
          <section id="brain-3d" className="relative py-20 bg-gradient-to-b from-light to-primary/5">
            <div className="container-custom px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 gradient-text">
                Interactive Brain Model
              </h2>
              
              <div className="max-w-5xl mx-auto">
                <p className="text-center text-dark/80 mb-8">
                  Explore the human brain in 3D. The visualization represents neural activity with pulsing neurons
                  and wave animations. This activity level changes as you navigate through different sections of the site.
                </p>
                
                <div 
                  ref={brain3dRef} 
                  className="brain-3d-container w-full h-[550px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-warm-amber/10 to-calm-blue/20"
                >
                  <Brain3DScene 
                    activationLevel={brainActivity}
                    interactive={true}
                    autoRotate={true}
                  />
                </div>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="brain-info-card p-6 bg-white rounded-xl shadow-lg border-l-4 border-primary transform transition-all hover:scale-105">
                    <h3 className="font-bold text-xl mb-3 text-primary">Interactive Visualization</h3>
                    <p>Explore the 3D brain model that simulates neural activity. Click and drag to rotate, scroll to zoom in and out for a closer look.</p>
                  </div>
                  
                  <div className="brain-info-card p-6 bg-white rounded-xl shadow-lg border-l-4 border-secondary transform transition-all hover:scale-105">
                    <h3 className="font-bold text-xl mb-3 text-secondary">Neural Activity</h3>
                    <p>The pulsing neurons and wave animations illustrate brain activity patterns. Notice how the intensity changes as you navigate through different sections.</p>
                  </div>
                  
                  <div className="brain-info-card p-6 bg-white rounded-xl shadow-lg border-l-4 border-calm-blue transform transition-all hover:scale-105">
                    <h3 className="font-bold text-xl mb-3 text-calm-blue">Mind-Body Connection</h3>
                    <p>Understanding brain function helps us better comprehend mental health conditions and the effectiveness of various therapeutic approaches.</p>
                  </div>
                </div>
                
                <div className="mt-10 p-6 bg-warm-amber/30 rounded-xl">
                  <h3 className="font-bold text-xl mb-3 text-center">Activity Pattern Visualization</h3>
                  <p className="text-center">
                    The brain model's activity level increases when you explore the Mental Health Facts section, 
                    representing how knowledge and awareness activate different parts of our brain.
                  </p>
                  <div className="w-full bg-white/50 h-2 mt-4 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                      style={{ width: `${brainActivity * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-dark/70">
                    <span>Low Activity</span>
                    <span>High Activity</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Mental Health Facts Section */}
          <section id="facts" ref={factsSectionRef} className="relative py-20 bg-light">
            <div className="container-custom px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
                Mental Health Facts
              </h2>
              
              <div ref={factsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="fact-item p-6 bg-white rounded-xl shadow-lg border-l-4 border-primary">
                  <h3 className="font-bold text-xl mb-3">1 in 5 Adults</h3>
                  <p>Experience mental illness each year, making it one of the most common health conditions in the world.</p>
                </div>
                
                <div className="fact-item p-6 bg-white rounded-xl shadow-lg border-l-4 border-secondary">
                  <h3 className="font-bold text-xl mb-3">50% Begin by Age 14</h3>
                  <p>Half of all mental health conditions start by age 14, with 75% developing by age 24.</p>
                </div>
                
                <div className="fact-item p-6 bg-white rounded-xl shadow-lg border-l-4 border-accent">
                  <h3 className="font-bold text-xl mb-3">Treatment Success</h3>
                  <p>Between 70-90% of individuals report reduced symptoms and improved quality of life after receiving treatment.</p>
                </div>
                
                <div className="fact-item p-6 bg-white rounded-xl shadow-lg border-l-4 border-purple-400">
                  <h3 className="font-bold text-xl mb-3">Depression Impact</h3>
                  <p>Depression is the leading cause of disability worldwide, affecting more than 264 million people globally.</p>
                </div>
                
                <div className="fact-item p-6 bg-white rounded-xl shadow-lg border-l-4 border-teal-400">
                  <h3 className="font-bold text-xl mb-3">Anxiety Disorders</h3>
                  <p>Affect 18.1% of adults in a given year, making them the most common mental health conditions.</p>
                </div>
                
                <div className="fact-item p-6 bg-white rounded-xl shadow-lg border-l-4 border-amber-400">
                  <h3 className="font-bold text-xl mb-3">Mind-Body Connection</h3>
                  <p>People with mental health conditions are at higher risk for physical health problems and vice versa.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Therapy Options Section */}
          <section id="therapy" ref={therapySectionRef} className="relative py-20 bg-gradient-to-b from-white to-warm-amber/10">
            <div className="container-custom px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 gradient-text animate-in">
                Therapy Options
              </h2>
              <p className="text-center text-dark/80 mb-12 max-w-2xl mx-auto animate-in">
                Different therapy approaches work best for different people and conditions.
                Explore these common therapy types to learn which might be right for you.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="therapy-card animate-in">
                  <div className="h-40 bg-blue-100 rounded-t-xl flex items-center justify-center">
                    <div className="therapy-icon cbt-icon"></div>
                  </div>
                  <div className="p-6 bg-white rounded-b-xl shadow-lg">
                    <h3 className="font-bold text-xl mb-3">Cognitive Behavioral Therapy</h3>
                    <p className="mb-4">Focuses on identifying and changing negative thought patterns to improve emotional regulation and develop coping strategies.</p>
                    <a href="#" className="text-primary font-medium hover:underline">Learn more →</a>
                  </div>
                </div>
                
                <div className="therapy-card animate-in">
                  <div className="h-40 bg-purple-100 rounded-t-xl flex items-center justify-center">
                    <div className="therapy-icon psychodynamic-icon"></div>
                  </div>
                  <div className="p-6 bg-white rounded-b-xl shadow-lg">
                    <h3 className="font-bold text-xl mb-3">Psychodynamic Therapy</h3>
                    <p className="mb-4">Explores unconscious patterns of behavior and emotions that may be rooted in past experiences and relationships.</p>
                    <a href="#" className="text-primary font-medium hover:underline">Learn more →</a>
                  </div>
                </div>
                
                <div className="therapy-card animate-in">
                  <div className="h-40 bg-green-100 rounded-t-xl flex items-center justify-center">
                    <div className="therapy-icon mindfulness-icon"></div>
                  </div>
                  <div className="p-6 bg-white rounded-b-xl shadow-lg">
                    <h3 className="font-bold text-xl mb-3">Mindfulness-Based Therapy</h3>
                    <p className="mb-4">Incorporates meditation and awareness techniques to help individuals stay present and reduce stress and anxiety.</p>
                    <a href="#" className="text-primary font-medium hover:underline">Learn more →</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Self-Care Section */}
          <section id="self-care" ref={selfCareSectionRef} className="relative py-20 bg-light">
            <div className="container-custom px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 gradient-text">
                Daily Self-Care Practices
              </h2>
              <p className="text-center text-dark/80 mb-12 max-w-2xl mx-auto">
                Small but consistent self-care habits can significantly improve your mental well-being over time.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="self-care-card bg-white p-6 rounded-xl shadow-lg border-t-4 border-primary">
                  <h3 className="font-bold text-xl mb-3">Mindful Meditation</h3>
                  <p>Practice 5-10 minutes daily to reduce stress and improve focus.</p>
                </div>
                
                <div className="self-care-card bg-white p-6 rounded-xl shadow-lg border-t-4 border-secondary">
                  <h3 className="font-bold text-xl mb-3">Physical Activity</h3>
                  <p>Regular exercise releases endorphins that improve mood and reduce anxiety.</p>
                </div>
                
                <div className="self-care-card bg-white p-6 rounded-xl shadow-lg border-t-4 border-accent">
                  <h3 className="font-bold text-xl mb-3">Healthy Sleep</h3>
                  <p>Maintain consistent sleep schedules to improve cognitive function and emotional regulation.</p>
                </div>
                
                <div className="self-care-card bg-white p-6 rounded-xl shadow-lg border-t-4 border-amber-400">
                  <h3 className="font-bold text-xl mb-3">Social Connection</h3>
                  <p>Regular interaction with supportive people can buffer against stress and loneliness.</p>
                </div>
                
                <div className="self-care-card bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-400">
                  <h3 className="font-bold text-xl mb-3">Journaling</h3>
                  <p>Writing down thoughts and feelings helps process emotions and gain perspective.</p>
                </div>
                
                <div className="self-care-card bg-white p-6 rounded-xl shadow-lg border-t-4 border-teal-400">
                  <h3 className="font-bold text-xl mb-3">Nature Time</h3>
                  <p>Spending time outdoors reduces stress and improves mood and cognitive function.</p>
                </div>
                
                <div className="self-care-card bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-400">
                  <h3 className="font-bold text-xl mb-3">Creative Expression</h3>
                  <p>Activities like art, music, or writing can provide emotional release and fulfillment.</p>
                </div>
                
                <div className="self-care-card bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-400">
                  <h3 className="font-bold text-xl mb-3">Healthy Boundaries</h3>
                  <p>Learning to say no and setting limits protects your mental energy and relationships.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Resources Section */}
          <section id="resources" ref={resourcesSectionRef} className="relative py-20 bg-gradient-to-b from-white to-warm-amber/20">
            <div className="container-custom px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 gradient-text">
                Mental Health Resources
              </h2>
              <p className="text-center text-dark/80 mb-12 max-w-2xl mx-auto">
                Access these valuable resources to learn more about mental health or get help when needed.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="resource-card bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3">Crisis Support Lines</h3>
                    <p className="mb-4">Immediate support for those experiencing mental health crises.</p>
                    <a href="#" className="btn inline-block bg-primary text-white hover:bg-primary-dark transition-colors">Find Support</a>
                  </div>
                </div>
                
                <div className="resource-card bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3">Mental Health Apps</h3>
                    <p className="mb-4">Mobile applications for meditation, mood tracking, and therapy.</p>
                    <a href="#" className="btn inline-block bg-secondary text-dark hover:bg-secondary-dark transition-colors">Explore Apps</a>
                  </div>
                </div>
                
                <div className="resource-card bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3">Find a Therapist</h3>
                    <p className="mb-4">Directory to help you find mental health professionals in your area.</p>
                    <a href="#" className="btn inline-block bg-accent text-white hover:bg-accent-dark transition-colors">Search Directory</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Footer */}
          <footer ref={footerRef} className="bg-dark text-light py-10">
            <div className="container-custom px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">MindWell</h3>
                  <p className="text-light/70">
                    Supporting mental health awareness, education, and resources for everyone.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-light/70 hover:text-light transition-colors">Home</a></li>
                    <li><a href="#" className="text-light/70 hover:text-light transition-colors">About Us</a></li>
                    <li><a href="#" className="text-light/70 hover:text-light transition-colors">Resources</a></li>
                    <li><a href="#" className="text-light/70 hover:text-light transition-colors">Contact</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold mb-4">Resources</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-light/70 hover:text-light transition-colors">Crisis Hotlines</a></li>
                    <li><a href="#" className="text-light/70 hover:text-light transition-colors">Find Therapy</a></li>
                    <li><a href="#" className="text-light/70 hover:text-light transition-colors">Support Groups</a></li>
                    <li><a href="#" className="text-light/70 hover:text-light transition-colors">Educational Materials</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold mb-4">Connect With Us</h4>
                  <div className="flex space-x-4 mb-4">
                    <a href="#" className="text-light hover:text-primary transition-colors">
                      <span className="social-icon facebook-icon"></span>
                    </a>
                    <a href="#" className="text-light hover:text-primary transition-colors">
                      <span className="social-icon twitter-icon"></span>
                    </a>
                    <a href="#" className="text-light hover:text-primary transition-colors">
                      <span className="social-icon instagram-icon"></span>
                    </a>
                  </div>
                  <p className="text-light/70">
                    Subscribe to our newsletter for updates on mental health resources.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-light/20 mt-8 pt-6 text-center text-light/50 text-sm">
                <p>© 2025 MindWell. All rights reserved. This site is for educational purposes only.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
