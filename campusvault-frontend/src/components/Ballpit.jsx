import { useEffect, useRef } from 'react';

export default function Ballpit() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('Ballpit mounted');

    // Dynamic import Three.js
    import('three').then((THREE) => {
      console.log('Three.js imported successfully');

      const container = containerRef.current;
      if (!container) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Create scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      camera.position.z = 50;

      container.appendChild(renderer.domElement);
      console.log('Canvas added to DOM');

      // Create multiple balls
      const balls = [];
      const colors = [0xa855f7, 0xec4899, 0x06b6d4];
      const geometry = new THREE.SphereGeometry(1.5, 32, 32);

      for (let i = 0; i < 80; i++) {
        const material = new THREE.MeshPhongMaterial({
          color: colors[i % colors.length],
          emissive: colors[i % colors.length],
          emissiveIntensity: 0.3,
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(
          Math.random() * 100 - 50,
          Math.random() * 100 - 50,
          Math.random() * 60 - 30
        );
        sphere.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        );
        scene.add(sphere);
        balls.push(sphere);
      }

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xa855f7, 100);
      pointLight.position.set(30, 30, 30);
      scene.add(pointLight);

      console.log('Created ' + balls.length + ' balls');

      // Mouse tracking
      let mouseX = 0;
      let mouseY = 0;

      const handleMouseMove = (e) => {
        mouseX = (e.clientX / width) * 2 - 1;
        mouseY = -(e.clientY / height) * 2 + 1;
      };

      document.addEventListener('mousemove', handleMouseMove);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        balls.forEach((ball) => {
          // Gravity
          ball.velocity.y -= 0.0015;

          // Friction
          ball.velocity.multiplyScalar(0.995);

          // Update position
          ball.position.add(ball.velocity);

          // Boundary checks
          const bounds = 60;
          if (Math.abs(ball.position.x) > bounds) {
            ball.position.x = Math.sign(ball.position.x) * bounds;
            ball.velocity.x *= -0.85;
          }
          if (ball.position.y < -bounds) {
            ball.position.y = -bounds;
            ball.velocity.y *= -0.85;
          }
          if (Math.abs(ball.position.z) > bounds) {
            ball.position.z = Math.sign(ball.position.z) * bounds;
            ball.velocity.z *= -0.85;
          }

          // Cursor interaction
          const cursorPos = new THREE.Vector3(mouseX * 50, mouseY * 50, 0);
          const dist = ball.position.distanceTo(cursorPos);

          if (dist < 20) {
            const force = new THREE.Vector3()
              .subVectors(ball.position, cursorPos)
              .normalize()
              .multiplyScalar(0.06);
            ball.velocity.add(force);
          }

          // Rotation
          ball.rotation.x += ball.velocity.x * 0.1;
          ball.rotation.y += ball.velocity.y * 0.1;
        });

        renderer.render(scene, camera);
      };

      animate();
      console.log('Animation started');

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousemove', handleMouseMove);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
        geometry.dispose();
      };
    }).catch((err) => {
      console.error('Failed to load Three.js:', err);
    });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -20,
      }}
    />
  );
}