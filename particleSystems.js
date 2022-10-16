'use strict'
import * as THREE from '/three.module.js'
import {scene} from '/scene.js'
import { animate } from '/scene.js';

const data = [];
let points;
let geometry;
let pointMaterial;

const bounds = {};




self.createParticleSystem = function (data) {
    const vertices = [];
    const colors = []
    const myColor = d3.scaleSequential().interpolator(d3.interpolateSinebow).domain([0,50])

    data.forEach((data =>{

        vertices.push( data.X, data.Z, data.Y );
        let particleColor = new THREE.Color(myColor(data.concentration))
        colors.push(particleColor.r,particleColor.g, particleColor.b)

    })) 


    const disc = new THREE.TextureLoader().load('disc.png')


    pointMaterial = new THREE.PointsMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        map: disc,
        transparent: true,
        size: 0.1,
    })
   
    geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(colors),3));
    
    points = new THREE.Points( geometry, pointMaterial );
    points.name = "points";
    console.log(geometry)
    scene.add( points );
    
    
}





self.createPlane = function(z_val){
    const width = bounds.maxX - bounds.minX + 2
    const height = bounds.maxZ - bounds.minZ + 2
    const material = new THREE.MeshBasicMaterial({
        color: 0x7a7a7a,
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 1,
    })
    let geometryp = new THREE.PlaneGeometry(width, height, 5)
    geometryp.rotateX(-Math.PI * 0.5);
    let plane = new THREE.Mesh(geometryp, material)
    plane.position.y = z_val
    plane.name = "plane";
    let object = scene.getObjectByName( "plane" );
    scene.remove(object)
    scene.add(plane)
    
    createParticleSystem(data)    
}


self.scatterPlot = function (z_val) {

    const d3Data = data.filter(
        (d) => d.Z <= z_val + 0.01 && d.Z >= z_val - 0.01
    )
   
    let xExtent = d3.extent(data.map((d) => d.X))
    let yExtent = d3.extent(data.map((d) => d.Y))
    let zExtent = d3.extent(data.map((d) => d.Z))
    console.log(zExtent)

    let xAxis = d3.scaleLinear().domain(xExtent).range([0, 565])
    let yAxis = d3.scaleLinear().domain(yExtent).range([0, 565])

    const myColor = d3.scaleSequential().interpolator(d3.interpolateSinebow).domain([0,50])

    d3.selectAll('circle').remove()
    let svg_const = d3.select("#chart")

    svg_const.append("g")
   .selectAll("circle")
   .data(d3Data)
   .join("circle")
   .attr("cx",(d) => {
    return xAxis(d.X)
   })
  .attr("cy",(d) => {
    return yAxis(d.Y)
   })
  .attr("r",2)
  .attr("fill",(d) => {
    return myColor(d.concentration)
  });
}



self.loadData = async function (file) {
   
    const loadedFile = await d3.csv(file)

    loadedFile.forEach((d) => {
        bounds.minX = Math.min(bounds.minX || Infinity, d.Points0)
        bounds.minY = Math.min(bounds.minY || Infinity, d.Points1)
        bounds.minZ = Math.min(bounds.minZ || Infinity, d.Points2)
        bounds.minC = Math.min(bounds.minC || Infinity, d.concentration)

       
        bounds.maxX = Math.max(bounds.maxX || -Infinity, d.Points0)
        bounds.maxY = Math.max(bounds.maxY || -Infinity, d.Points1)
        bounds.maxZ = Math.max(bounds.maxY || -Infinity, d.Points2)
        bounds.maxC = Math.max(bounds.maxC || -Infinity, d.concentration)

  
        data.push({

            concentration: Number(d.concentration),

            X: Number(d.Points0),
            Y: Number(d.Points1),
            Z: Number(d.Points2),

            U: Number(d.velocity0),
            V: Number(d.velocity1),
            W: Number(d.velocity2),
        })
    })

    console.log(d3.extent(data.map((d) => d.concentration)))
    createParticleSystem(data)
    self.scatterPlot(1)
    self.createPlane(1)
     

    Button.onclick = function () {
        const options = document.querySelectorAll('input[name="z_val"]')
        const text1 = parseInt(options[0].value)
        self.scatterPlot(text1)
        self.createPlane(text1)
  
    }


    const myColor = d3.scaleSequential().interpolator(d3.interpolateSinebow).domain([0,350])

    Legend(d3.scaleSequential([0, 350], d3.interpolateSinebow), {
        title: "Color legends for fluid mappings"
      })
      
}


loadData('058.csv')
animate()



