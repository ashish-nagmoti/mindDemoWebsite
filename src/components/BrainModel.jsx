// BrainModel.jsx - 3D Brain visualization component
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Default brain model with fallback to a sphere if no GLTF model is available
export function BrainModel({ 
  position = [0, 0, 0],
  scale = [1, 1, 1],
  modelPath = null,
  pulsating = true,
  rotation = 0.001,
  color = "#9c6ade",
  activationLevel = 0.5, // 0-1 value representing brain activity level
  animationPath = false, // Whether to animate along a path
}) {
  const meshRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // For pulsating animation
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const pulseSpeed = 1.5;
  
  // For neuron activity represented as distortion
  const [distortStrength, setDistortStrength] = useState(0.1);
  
  // For wave animation - optimize by using a fixed array instead of a state
  const wavesRef = useRef([null, null, null]); // Preallocate 3 wave slots
  const neuronRefs = useRef([]); // Store neuron references
  
  // Reduce the number of neurons for better performance
  const neuronCount = 8; 
  
  const mounted = useRef(true); // Track if component is mounted

  // If a GLTF model path is provided, attempt to load it
  let brainGLTF = null;
  if (modelPath) {
    try {
      brainGLTF = useGLTF(modelPath, true); // Add true for preloading
    } catch (error) {
      console.warn("Failed to load brain model, using fallback sphere", error);
    }
  }
  
  // Cleanup function
  useEffect(() => {
    return () => {
      mounted.current = false;
      
      // Clear any references that might cause memory leaks
      if (neuronRefs.current) {
        neuronRefs.current = [];
      }
      
      // Clear wave references
      if (wavesRef.current) {
        wavesRef.current.fill(null);
      }
    };
  }, []);
  
  // Initialize neurons with random positions and animated parameters - only once
  useEffect(() => {
    // Generate neuron data
    neuronRefs.current = Array(neuronCount).fill().map(() => ({
      position: [
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 2.5
      ],
      scale: 0.05 + Math.random() * 0.08,
      speed: 0.5 + Math.random(),
      offset: Math.random() * Math.PI * 2,
      direction: new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize().multiplyScalar(0.003) // Reduced movement speed
    }));
  }, []); // Empty dependency array means this only runs once
  
  // Optimize wave creation by using a timer with cleanup
  useEffect(() => {
    let waveIndex = 0;
    let timerId = null;
    
    if (activationLevel > 0.2) {
      timerId = setInterval(() => {
        if (!mounted.current) return;
        
        // Rotate through the preallocated wave slots
        waveIndex = (waveIndex + 1) % 3;
        
        wavesRef.current[waveIndex] = {
          scale: 0.1,
          opacity: 0.6,
          timestamp: Date.now()
        };
      }, 2000 / (0.5 + activationLevel));
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [activationLevel]);
  
  // Animation frame logic - optimized
  useFrame((state, delta) => {
    if (!mounted.current || !meshRef.current) return;
    
    // Optimize by using a more efficient rotation
    meshRef.current.rotation.y += rotation * delta;
    
    // Pulsating effect
    if (pulsating) {
      // More efficient calculation - no need to call Math.sin on every property
      const pulse = Math.sin(state.clock.getElapsedTime() * pulseSpeed) * 0.05;
      setPulseIntensity(pulse);
      
      const scaleFactor = 1 + pulse * activationLevel * 1.2;
      meshRef.current.scale.set(
        scale[0] * scaleFactor,
        scale[1] * scaleFactor,
        scale[2] * scaleFactor
      );
    }
    
    // Neural activity simulation - simplified calculation
    setDistortStrength(0.1 + Math.sin(state.clock.getElapsedTime()) * 0.04 * activationLevel);
    
    // Animate neuron particles - more efficiently
    if (groupRef.current) {
      const neuronMeshes = groupRef.current.children.filter(child => 
        child.userData && child.userData.isNeuron
      );
      
      neuronRefs.current.forEach((neuron, i) => {
        if (i >= neuronMeshes.length) return;
        
        const neuronMesh = neuronMeshes[i];
        
        // Pulsating animation - simplified
        const pulseFreq = neuron.speed;
        const pulseAmp = 0.2 * activationLevel;
        const elapsedTime = state.clock.getElapsedTime();
        const pulseFactor = 1 + Math.sin(elapsedTime * pulseFreq + neuron.offset) * pulseAmp;
        
        neuronMesh.scale.setScalar(neuron.scale * pulseFactor);
        
        // Drift animation - more optimized
        neuronMesh.position.x += neuron.direction.x * (0.5 + activationLevel * 0.5);
        neuronMesh.position.y += neuron.direction.y * (0.5 + activationLevel * 0.5);
        neuronMesh.position.z += neuron.direction.z * (0.5 + activationLevel * 0.5);
        
        // Keep neurons within brain bounds
        const distFromCenter = neuronMesh.position.lengthSq();
        
        if (distFromCenter > 2.25) { // Using squared distance for efficiency (1.5^2)
          neuronMesh.position.multiplyScalar(0.95);
          
          // Less frequent direction changes
          if (Math.random() < 0.01) {
            neuron.direction.set(
              Math.random() - 0.5,
              Math.random() - 0.5,
              Math.random() - 0.5
            ).normalize().multiplyScalar(0.003);
          }
        }
        
        // Simplified opacity calculation
        neuronMesh.material.opacity = 0.4 + 
          (Math.sin(elapsedTime + neuron.offset) * 0.2 + 0.2) * 
          activationLevel;
      });
    }
    
    // Animate wave rings - more efficient approach
    wavesRef.current.forEach((wave, index) => {
      if (!wave) return;
      
      const age = (Date.now() - wave.timestamp) / 1000; // age in seconds
      if (age > 2) {
        wavesRef.current[index] = null;
        return;
      }
      
      // Update wave properties - these will be used during render
      wave.scale = 0.1 + age * 1.1;
      wave.opacity = 0.6 * (1 - age / 2);
    });
  });
  
  // Effects when interaction state changes
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  // Initialize colors
  const baseColor = new THREE.Color(color);
  const hoverColor = new THREE.Color(color).addScalar(0.2);
  const clickColor = new THREE.Color(color).addScalar(0.4);
  
  // Color based on interaction state
  const currentColor = clicked ? clickColor : (hovered ? hoverColor : baseColor);
  
  // Float component for gentle hovering movement - reduced complexity
  return (
    <Float 
      speed={1.0}
      rotationIntensity={0.2} 
      floatIntensity={0.4}
    >
      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          position={position}
          scale={scale}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={() => setClicked(!clicked)}
        >
          {/* Use the GLTF model if available, otherwise use a sphere as fallback */}
          {brainGLTF ? (
            <primitive 
              object={brainGLTF.scene.clone()} // Clone to avoid shared state issues
              scale={scale} 
            />
          ) : (
            // Fallback shape if no model provided
            <>
              <sphereGeometry args={[1, 32, 32]} /> {/* Reduced geometry complexity */}
              <MeshDistortMaterial
                color={currentColor}
                emissive={currentColor}
                emissiveIntensity={0.2 + activationLevel * 0.3}
                distort={distortStrength}
                speed={2}
                roughness={0.4}
                metalness={0.2}
                opacity={0.9}
                transparent={true}
              />
            </>
          )}
        </mesh>
        
        {/* Neuron activity particles with enhanced animations */}
        {neuronRefs.current.map((neuron, index) => (
          <mesh
            key={`neuron-${index}`}
            userData={{ isNeuron: true, index }}
            position={neuron.position}
            scale={neuron.scale}
          >
            <sphereGeometry args={[1, 8, 8]} /> {/* Reduced geometry complexity */}
            <meshBasicMaterial
              color={currentColor}
              transparent
              opacity={0.6}
              toneMapped={false}
            />
          </mesh>
        ))}
        
        {/* Wave animation rings */}
        {wavesRef.current.map((wave, index) => (
          wave && (
            <mesh key={`wave-${index}`} position={[0, 0, 0]}>
              <ringGeometry args={[wave.scale, wave.scale + 0.08, 16]} /> {/* Reduced segments */}
              <meshBasicMaterial 
                color={currentColor} 
                transparent 
                opacity={wave.opacity}
                side={THREE.DoubleSide}
                depthWrite={false} // Improved performance
              />
            </mesh>
          )
        ))}
      </group>
      
      {/* Simplified lighting - only one point light */}
      <pointLight
        position={[0, 0, 0]}
        distance={2.5}
        intensity={1 + pulseIntensity * 5}
        color={currentColor}
      />
    </Float>
  );
}

export default BrainModel;