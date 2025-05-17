// Brain3DScene.jsx - 3D scene container for brain visualization
import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import BrainModel from './BrainModel';

export function Brain3DScene({
  position = [0, 0, 0],
  modelPath = null,
  interactive = true,
  autoRotate = true,
  activationLevel = 0.5,
  onBrainClick = () => {},
  className = "",
  style = {},
  animationPath = false,
}) {
  const canvasRef = useRef();
  const controlsRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(true);
  
  // Track component mounted state for cleanup
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  useEffect(() => {
    // Intersection observer to load the 3D scene only when it's in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (mounted) {
          setIsVisible(entry.isIntersecting);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );
    
    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }
    
    return () => {
      if (canvasRef.current) {
        observer.unobserve(canvasRef.current);
      }
    };
  }, [mounted]);

  // Configuration for WebGL renderer to prevent context loss
  const glConfig = {
    alpha: true,
    antialias: false,
    stencil: false,
    depth: false,
    powerPreference: 'default',
    failIfMajorPerformanceCaveat: true,
  };

  return (
    <div 
      ref={canvasRef}
      className={`brain-3d-scene relative ${className}`} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        ...style 
      }}
    >
      {isVisible && mounted && (
        <Canvas 
          dpr={[1, 1.5]} // Lower DPR to improve performance
          shadows={false} // Disable shadows for better performance
          gl={glConfig}
          style={{ background: 'transparent' }}
          frameloop="demand"
          resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} near={0.1} far={100} />
          
          {/* Simplified lighting for better performance */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow={false} />
          
          <Suspense fallback={null}>
            <BrainModel 
              position={position}
              modelPath={modelPath}
              scale={[1.2, 1.2, 1.2]}
              pulsating={true}
              rotation={autoRotate ? 0.0005 : 0} // Reduced rotation speed
              activationLevel={activationLevel}
              animationPath={animationPath}
            />
          </Suspense>
          
          {interactive && (
            <OrbitControls 
              ref={controlsRef}
              enableZoom={true} 
              enablePan={false} 
              autoRotate={autoRotate}
              autoRotateSpeed={0.3} // Reduced speed
              minDistance={3}
              maxDistance={10}
              dampingFactor={0.05}
              rotateSpeed={0.3}
              makeDefault
            />
          )}
          
          <Environment preset="sunset" background={false} />
        </Canvas>
      )}
      
      {/* Enhanced loading indicator */}
      {!isVisible && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="brain-loading-spinner animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-3"></div>
          <p className="text-primary text-sm font-medium">Loading 3D Brain...</p>
        </div>
      )}
    </div>
  );
}

export default Brain3DScene;