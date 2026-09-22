import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * SecurityMeshScene — Real 3D Three.js Visualization
 *
 * Renders an interactive 3D constellation of interconnected security nodes:
 * - Spherical distribution of 200 nodes using THREE.Points & BufferGeometry
 * - Static line connections computed once on init with additive blending glow
 * - Parallax camera response bounded to hero mouse coordinates
 * - Full cleanup on unmount for WebGL context & memory protection
 * - Respects prefers-reduced-motion with static single-frame fallback
 */
export function SecurityMeshScene({ className = 'absolute inset-0 w-full h-full pointer-events-none z-0' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const parent = container.parentElement || container;
    let width = parent.clientWidth || window.innerWidth;
    let height = parent.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 48;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Security Nodes Group (Sphere / Constellation)
    const group = new THREE.Group();
    scene.add(group);

    const NODE_COUNT = 200;
    const SPHERE_RADIUS = 18;
    const positions = new Float32Array(NODE_COUNT * 3);
    const colors = new Float32Array(NODE_COUNT * 3);

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    const colorSky = new THREE.Color(0x38bdf8); // Sky blue
    const colorIndigo = new THREE.Color(0x818cf8); // Indigo
    const colorCyan = new THREE.Color(0x06b6d4); // Cyan
    const colorPalette = [colorSky, colorIndigo, colorCyan];

    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      // Subtle radial perturbation for natural organic dispersion
      const r = SPHERE_RADIUS * (0.82 + Math.random() * 0.36);
      const x = Math.cos(theta) * radiusAtY * r;
      const z = Math.sin(theta) * radiusAtY * r;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y * r;
      positions[i * 3 + 2] = z;

      // Color assignment
      const col = colorPalette[i % colorPalette.length];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    // Points Geometry & Material
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(points);

    // 3. Precomputed Connecting Lines (Calculated once on init)
    const lineIndices = [];
    const maxDistance = 6.2;
    const maxDistSq = maxDistance * maxDistance;

    for (let i = 0; i < NODE_COUNT; i++) {
      const ix = positions[i * 3];
      const iy = positions[i * 3 + 1];
      const iz = positions[i * 3 + 2];

      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = ix - positions[j * 3];
        const dy = iy - positions[j * 3 + 1];
        const dz = iz - positions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < maxDistSq) {
          lineIndices.push(i, j);
        }
      }
    }

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', pointsGeometry.getAttribute('position'));
    linesGeometry.setIndex(lineIndices);

    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    group.add(lines);

    // 4. Parallax Mouse Tracking (Bounded to parent container)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = parent.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 10;
      targetY = -y * 8;
    };

    parent.addEventListener('mousemove', handleMouseMove);

    // 5. Responsive Resize Observer
    const handleResize = () => {
      if (!parent || !container) return;
      width = parent.clientWidth || window.innerWidth;
      height = parent.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(parent);

    // 6. Reduced Motion Check
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = mediaQuery.matches;

    // 7. Animation Loop
    let animationFrameId = null;
    let clock = new THREE.Clock();

    const handleReducedMotionChange = (e) => {
      isReducedMotion = e.matches;
      if (isReducedMotion && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        renderer.render(scene, camera);
      } else if (!isReducedMotion) {
        animate();
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleReducedMotionChange);
    }

    const animate = () => {
      if (isReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      // Continuous smooth auto-rotation
      group.rotation.y += delta * 0.12;
      group.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;

      // Smooth camera parallax interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX;
      camera.position.y = mouseY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    if (isReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    // 8. Strict Cleanup on Unmount
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      parent.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleReducedMotionChange);
      }

      pointsGeometry.dispose();
      pointsMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
