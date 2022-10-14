'use strict'
import * as THREE from '/three.module.js'
import {scene} from '/scene.js'
import { animate } from '/scene.js';

const data = [];
let points;
let geometry;
let pointMaterial;

const bounds = {};

function Legend(color, {
    title,
    tickSize = 6,
    width = 320, 
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 10,
    marginBottom = 16 + tickSize,
    marginLeft = 10,
    ticks = width / 64,
    tickFormat,
    tickValues
  } = {}) {
  
    function ramp(color, n = 256) {
      const canvas = document.createElement("canvas");
      canvas.width = n;
      canvas.height = 1;
      const context = canvas.getContext("2d");
      for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
      }
      return canvas;
    }
  
    const svg_const = d3.select("#scale")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");
  
    let tick_Adj = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    let x;
  

    if (color.interpolate) {
      const n = Math.min(color.domain().length, color.range().length);
  
      x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));
  
      svg_const.append("image")
          .attr("x", marginLeft)
          .attr("y", marginTop)
          .attr("width", width - marginLeft - marginRight)
          .attr("height", height - marginTop - marginBottom)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
    }
  

    else if (color.interpolator) {
      x = Object.assign(color.copy()
          .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
          {range() { return [marginLeft, width - marginRight]; }});
  
      svg_const.append("image")
          .attr("x", marginLeft)
          .attr("y", marginTop)
          .attr("width", width - marginLeft - marginRight)
          .attr("height", height - marginTop - marginBottom)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", ramp(color.interpolator()).toDataURL());
  
      
      if (!x.ticks) {
        if (tickValues === undefined) {
          const n = Math.round(ticks + 1);
          tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
        }
        if (typeof tickFormat !== "function") {
          tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
        }
      }
    }
  

    else if (color.invertExtent) {
      const thresholds
          = color.thresholds ? color.thresholds() 
          : color.quantiles ? color.quantiles() 
          : color.domain(); 
  
      const thresholdFormat
          = tickFormat === undefined ? d => d
          : typeof tickFormat === "string" ? d3.format(tickFormat)
          : tickFormat;
  
      x = d3.scaleLinear()
          .domain([-1, color.range().length - 1])
          .rangeRound([marginLeft, width - marginRight]);
  
      svg_const.append("g")
        .selectAll("rect")
        .data(color.range())
        .join("rect")
          .attr("x", (d, i) => x(i - 1))
          .attr("y", marginTop)
          .attr("width", (d, i) => x(i) - x(i - 1))
          .attr("height", height - marginTop - marginBottom)
          .attr("fill", d => d);
  
      tickValues = d3.range(thresholds.length);
      tickFormat = i => thresholdFormat(thresholds[i], i);
    }
  

    else {
      x = d3.scaleBand()
          .domain(color.domain())
          .rangeRound([marginLeft, width - marginRight]);
  
      svg_const.append("g")
        .selectAll("rect")
        .data(color.domain())
        .join("rect")
          .attr("x", x)
          .attr("y", marginTop)
          .attr("width", Math.max(0, x.bandwidth() - 1))
          .attr("height", height - marginTop - marginBottom)
          .attr("fill", color);
  
      tick_Adj = () => {};
    }
  
    svg_const.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x)
          .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
          .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
          .tickSize(tickSize)
          .tickValues(tickValues))
        .call(tick_Adj)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
          .attr("x", marginLeft)
          .attr("y", marginTop + marginBottom - height - 6)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .attr("class", "title")
          .text(title));
  
    return svg_const.node();
  }


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


self.colorCylinder = function(z_val){

    const myColor = d3.scaleSequential().interpolator(d3.interpolateSinebow).domain([0,50])
    const bwScale = d3.scaleSequential(d3.interpolateGreys).domain([0, 30])
    const pcolors = points.geometry.attributes.color.array;
    points.geometry.attributes.color.needsUpdate = true
    var index = 0
    var newColors = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].Z <= z_val + 0.1 && data[i].Z >= z_val - 0.1){
                var newColor = new THREE.Color(myColor(data[i].concentration))
                newColors.push(newColor.r)
                newColors.push(newColor.g)
                newColors.push(newColor.b)
               

            }
                
            else{
                var newColor1 = new THREE.Color(bwScale(data[i].concentration))
                newColors.push(newColor1.r)
                newColors.push(newColor1.g)
                newColors.push(newColor1.b)
              
            }
                
        }
        
        var pobject = scene.getObjectByName( "points" );
       scene.remove(pobject)
        geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(newColors),3));
       points = new THREE.Points( geometry, pointMaterial );
    scene.add(points)

    
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



