import { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';
//import CanvasLoader from '../Loader';


const Globes = () => {


	const computer = useGLTF('./earth/outscene.gltf');
	
	

	return (
		<mesh>
			<hemisphereLight intensity={0.65} groundColor="black"/>
			<pointLight intensity={1}/>
			<primitive 
				object={computer.scene}
				scale={0.03}
				position={[0,0,0]}
				rotation={[-0.01, -0.2, -0.1]}
			/>

		</mesh>
	);
};

const GlobesCanvas = () =>{
	return (
		<Canvas
			frameloop="demand"
			shadows 
			camera={{ position: [20, 3, 5], fov: 25 }}
			gl={{ preserveDrawingBuffer: true }}
			>
			<Suspense>
				<OrbitControls 
					enableZoom={false}
					maxPolarAngle={Math.PI / 2}
					minPolarAngle={Math.PI / 2}
				/>
				<Globes/>
			</Suspense>
			<Preload all/>
			
		</Canvas>
	)
}

export default GlobesCanvas;
