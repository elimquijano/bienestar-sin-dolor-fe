import { Pause, PlayArrow, Rotate90DegreesCcw, Shuffle } from '@mui/icons-material';
import { Button, Card } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const CHARACTER_PATH = '/assets/fbx/character/Y Bot.fbx';
const ANIMATION_PATH = '/assets/fbx/animation/';
const ANIMATIONS = ['Waving'];

const ModelViewer = () => {
  const mountRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const mixerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const actionsRef = useRef([]);
  const [error, setError] = useState(null);
  const sceneRef = useRef(null);
  const characterRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, controls;

    const init = () => {
      try {
        console.log('Configurando escena...');
        const width = mountRef.current.clientWidth;
        const height = 600;

        scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.background = new THREE.Color(0x001020);

        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(1, 2, 7);

        renderer = new THREE.WebGLRenderer({
          antialias: true,
          powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mountRef.current.appendChild(renderer.domElement);

        // Mejorada la iluminación basada en el ejemplo
        const sunLight = new THREE.DirectionalLight(0xffffff, 5);
        sunLight.position.set(2, 4, 3);
        sunLight.castShadow = true;
        scene.add(sunLight);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        scene.add(hemiLight);

        // Añadir plano base
        const radius = 10;
        const geometry = new THREE.CircleGeometry(radius, 32);
        const material = new THREE.MeshStandardMaterial({
          color: 0x001020
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = Math.PI * -0.5;
        plane.receiveShadow = true;
        plane.position.y = -1.5;
        scene.add(plane);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 0, 0);
        controls.update();

        return { scene, camera, renderer, controls };
      } catch (e) {
        console.error('Error en init:', e);
        setError(`Error de inicialización: ${e.message}`);
        return null;
      }
    };

    const loadModelAndAnimations = async (sceneSetup) => {
      if (!sceneSetup) return;

      const { scene } = sceneSetup;
      const loader = new FBXLoader();

      try {
        // Cargar el personaje
        console.log('Cargando personaje...');
        const character = await new Promise((resolve, reject) => {
          loader.load(
            CHARACTER_PATH,
            (fbx) => {
              fbx.scale.setScalar(0.02); // Escala como en el ejemplo
              fbx.position.set(0, -1.5, 0);

              fbx.traverse((child) => {
                if (child.isMesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;

                  // Opcionalmente, aplicar material personalizado como en el ejemplo
                  // if (child.material.name === "Alpha_Body_MAT") {
                  //   child.material = new THREE.MeshMatcapMaterial({
                  //     matcap: textureLoader.load("/assets/textures/matcap.jpg")
                  //   });
                  // }
                }
              });
              resolve(fbx);
            },
            (progress) => {
              if (progress.total > 0) {
                const percentComplete = (progress.loaded / progress.total) * 100;
                console.log(`Cargando personaje: ${Math.round(percentComplete)}%`);
              }
            },
            reject
          );
        });

        characterRef.current = character;
        scene.add(character);

        // Crear mixer
        mixerRef.current = new THREE.AnimationMixer(character);

        // Cargar todas las animaciones
        console.log('Cargando animaciones...');
        const loadedAnimations = await Promise.all(
          ANIMATIONS.map(async (animName) => {
            try {
              const animData = await new Promise((resolve, reject) => {
                loader.load(`${ANIMATION_PATH}${animName}.fbx`, (fbx) => resolve(fbx.animations[0]), undefined, reject);
              });
              animData.name = animName;
              return animData;
            } catch (err) {
              console.warn(`Error loading animation ${animName}:`, err);
              return null;
            }
          })
        );

        // Filtrar animaciones que se cargaron correctamente y crear actions
        const validAnimations = loadedAnimations.filter((anim) => anim !== null);
        actionsRef.current = validAnimations.map((anim) => {
          const action = mixerRef.current.clipAction(anim);
          return action;
        });

        if (actionsRef.current.length > 0) {
          // Iniciar con la primera animación
          playAnimation(0);
        }

        console.log('');
      } catch (error) {
        console.error('Error al cargar:', error);
        setError(`Error al cargar: ${error.message || 'Error desconocido'}`);
        console.log('');
      }
    };

    const animate = (sceneSetup) => {
      if (!sceneSetup) return;

      const { controls, renderer, scene, camera } = sceneSetup;

      const animationFrame = requestAnimationFrame(() => animate(sceneSetup));

      if (mixerRef.current && isPlaying) {
        const delta = clockRef.current.getDelta();
        mixerRef.current.update(delta);
      }

      controls.update();
      renderer.render(scene, camera);

      return animationFrame;
    };

    const sceneSetup = init();
    let animationFrame;

    if (sceneSetup) {
      loadModelAndAnimations(sceneSetup);
      animationFrame = animate(sceneSetup);
    }

    const handleResize = () => {
      if (!sceneSetup) return;

      const { camera, renderer } = sceneSetup;
      const width = mountRef.current.clientWidth;
      const height = 600;

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
  }, [isPlaying]);

  const playAnimation = (index) => {
    if (!actionsRef.current[index]) return;

    // Hacer fade out de la animación anterior
    if (actionsRef.current[currentAnimationIndex]) {
      actionsRef.current[currentAnimationIndex].fadeOut(0.5);
    }

    // Iniciar nueva animación con fade in
    const newAction = actionsRef.current[index];
    newAction.reset();
    newAction.fadeIn(0.5);
    newAction.play();

    setCurrentAnimationIndex(index);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (mixerRef.current) {
      mixerRef.current.timeScale = isPlaying ? 0 : 1;
    }
  };

  const handleReset = () => {
    if (mixerRef.current) {
      playAnimation(currentAnimationIndex);
      setIsPlaying(false);
    }
  };

  const handleRandomAnimation = () => {
    const newIndex = Math.floor(Math.random() * actionsRef.current.length);
    playAnimation(newIndex);
  };

  return (
    <Card className="p-4 w-full max-w-6xl mx-auto">
      <div className="h-[600px] relative" ref={mountRef}>
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-90 bg-white">
            <p className={`text-center ${error ? 'text-red-600' : 'text-blue-600'}`}>{error}</p>
          </div>
        )}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 p-2 rounded-lg">
          <Button onClick={handlePlayPause} variant="default" disabled={!!error} size="sm">
            {isPlaying ? <Pause className="h-4 w-4" /> : <PlayArrow className="h-4 w-4" />}
          </Button>
          <Button onClick={handleReset} variant="default" disabled={!!error} size="sm">
            <Rotate90DegreesCcw className="h-4 w-4" />
          </Button>
          <Button onClick={handleRandomAnimation} variant="default" disabled={!!error} size="sm">
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ModelViewer;
