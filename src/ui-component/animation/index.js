import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { PlayArrow, Pause, Stop } from '@mui/icons-material';
import { Button, Card, Stack } from '@mui/material';

const ModelViewer = ({
  characterPath = `/assets/fbx/character/avatar.fbx`,
  animationPath = '/assets/fbx/animation/',
  animationName = 'gsentadilla' // Default to 'Idle'
}) => {
  const mountRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const mixerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const actionRef = useRef(null);
  const sceneRef = useRef(null);
  const characterRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, controls;
    let animationFrame;

    const init = () => {
      try {
        const width = mountRef.current.clientWidth;
        const height = width * 1.5; // 4:3 aspect ratio for responsiveness

        scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.background = new THREE.Color(0xd3d3d3);

        camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);
        camera.position.set(0, 1.5, 2); // Adjusted initial camera position 0, 1.5, 2

        renderer = new THREE.WebGLRenderer({
          antialias: true,
          powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        mountRef.current.appendChild(renderer.domElement);

        const sunLight = new THREE.DirectionalLight(0xffffff, 5);
        sunLight.position.set(2, 4, 3);
        sunLight.castShadow = true;
        scene.add(sunLight);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        scene.add(hemiLight);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 1, 0); // Adjusted target
        controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below ground
        controls.minDistance = 1; // Minimum zoom distance
        controls.maxDistance = 10; // Maximum zoom distance
        controls.update();
        controlsRef.current = controls;

        return { scene, camera, renderer, controls };
      } catch (e) {
        console.log(`Initialization error: ${e.message}`);
        return null;
      }
    };

    const loadModelAndAnimation = async (sceneSetup) => {
      if (!sceneSetup || !animationName) return;

      const { scene } = sceneSetup;
      const loader = new FBXLoader();

      try {
        // Load character
        const character = await new Promise((resolve, reject) => {
          loader.load(
            characterPath,
            (fbx) => {
              fbx.scale.setScalar(0.02);
              fbx.position.set(0, -1.5, 0);

              fbx.traverse((child) => {
                if (child.isMesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                }
              });
              resolve(fbx);
            },
            undefined,
            reject
          );
        });

        characterRef.current = character;
        scene.add(character);

        // Create mixer
        mixerRef.current = new THREE.AnimationMixer(character);

        // Load specific animation
        const animationData = await new Promise((resolve, reject) => {
          loader.load(`${animationPath}${animationName}.fbx`, (fbx) => resolve(fbx.animations[0]), undefined, reject);
        });

        // Create action and play immediately
        actionRef.current = mixerRef.current.clipAction(animationData);
        actionRef.current.reset();
        actionRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log(`Loading error: ${error.message || 'Unknown error'}`);
      }
    };

    const animate = (sceneSetup) => {
      if (!sceneSetup) return;

      const { controls, renderer, scene, camera } = sceneSetup;

      animationFrame = requestAnimationFrame(() => animate(sceneSetup));

      if (mixerRef.current && isPlaying) {
        const delta = clockRef.current.getDelta();
        mixerRef.current.update(delta);
      }

      controls.update();
      renderer.render(scene, camera);

      return animationFrame;
    };

    const sceneSetup = init();

    if (sceneSetup) {
      loadModelAndAnimation(sceneSetup);
      animationFrame = animate(sceneSetup);
    }

    // Responsive resize
    const handleResize = () => {
      if (!sceneSetup) return;

      const { camera, renderer } = sceneSetup;
      const width = mountRef.current.clientWidth;
      const height = width * 0.75;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (sceneSetup?.renderer && mountRef.current) {
        mountRef.current.removeChild(sceneSetup.renderer.domElement);
        sceneSetup.renderer.dispose();
      }
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [characterPath, animationPath, animationName]);

  const handlePlayPause = () => {
    if (!actionRef.current) return;

    if (!isPlaying) {
      // First play or resume
      if (!actionRef.current.isRunning()) {
        actionRef.current.reset();
        actionRef.current.play();
      } else {
        actionRef.current.paused = false;
      }
      setIsPlaying(true);
    } else {
      // Pause
      actionRef.current.paused = true;
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    if (actionRef.current) {
      actionRef.current.reset();
      actionRef.current.paused = true;
      setIsPlaying(false);
    }
  };

  useState(() => {
    handleReset();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="relative w-full" ref={mountRef} style={{ aspectRatio: '4/3' }}></div>
      <Stack flexDirection={'row'} gap={2} justifyContent={'center'} alignItems={'center'}>
        <Button onClick={handlePlayPause} variant="contained" color="secondary" disabled={isPlaying}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </Button>
        <Button onClick={handleReset} variant="contained" color="secondary" disabled={!isPlaying}>
          <Stop />
        </Button>
      </Stack>
    </Card>
  );
};

export default ModelViewer;
