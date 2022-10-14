import { OrbitControls } from '../OrbitControls.js'
import * as THREE from '../three.module.js'

const canvas = document.querySelector('canvas.scene');


const scene = new THREE.Scene();



const sizes = {
    width: window.innerWidth * 0.55,
    height: window.innerHeight * 0.5
};





const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

renderer.setClearColor(0x000000);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000 );
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set(0,2,20);
controls.update();
camera.lookAt(0,0,0);
scene.add(camera);



const animate = () =>
{

    window.requestAnimationFrame(animate);
   

   
    controls.update();

    renderer.render(scene, camera);
    
    
};



export {scene, animate, renderer, camera};


