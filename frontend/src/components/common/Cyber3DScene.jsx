import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Cyber3DScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06090e, 0.025);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 22;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 1. Central Geodesic Defense Core (Outer Shield)
    const coreGeo = new THREE.IcosahedronGeometry(4.2, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 2.5;
    scene.add(coreMesh);

    // 2. Inner Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(2.8, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.position.y = 2.5;
    scene.add(innerMesh);

    // 3. Concentric Orbital Rings (Security Perimeters)
    const ringGeo1 = new THREE.TorusGeometry(6.2, 0.035, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.position.y = 2.5;
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(7.6, 0.025, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.position.y = 2.5;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 4. Data Particle Field (Telemetry nodes)
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x38bdf8);
    const color2 = new THREE.Color(0x818cf8);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 36;
      positions[i + 1] = (Math.random() - 0.5) * 36 + 2;
      positions[i + 2] = (Math.random() - 0.5) * 26;

      const mixedColor = Math.random() > 0.5 ? color1 : color2;
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - width / 2) * 0.0008;
      mouseY = (event.clientY - height / 2) * 0.0008;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Window Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Gentle pulsating breathe
      const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.03;
      coreMesh.scale.set(scale, scale, scale);
      innerMesh.scale.set(scale * 0.98, scale * 0.98, scale * 0.98);

      coreMesh.rotation.y += 0.0035;
      coreMesh.rotation.x += 0.0018;

      innerMesh.rotation.y -= 0.005;
      innerMesh.rotation.z += 0.0025;

      ring1.rotation.z += 0.004;
      ring2.rotation.x += 0.0035;

      particleSystem.rotation.y += 0.0006;

      camera.position.x = targetX * 10;
      camera.position.y = 1 - targetY * 8;
      camera.lookAt(0, 2.5, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute top-0 left-0 w-full h-[850px] pointer-events-none z-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center_40%,black_40%,transparent_85%)]"
    />
  );
}
