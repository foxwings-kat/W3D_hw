var camera, scene, renderer;
//單位 100

function init() {
	
	scene = new THREE.Scene();
	
	renderer = new THREE.WebGLRenderer({
	  antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x888888);
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100000);
	camera.position.set(2000, 2500, 2500);
	camera.lookAt(new THREE.Vector3(0, 0, 0));


	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	
	//var gridXZ = new THREE.GridHelper(4000, 40, 'red', 'white');
	//gridXZ.position.set(0, 0.5, 0);
	//scene.add(gridXZ);
	
	
	//Light
	let ambientLight = new THREE.AmbientLight('#fcfaf0');
	ambientLight.intensity = 0.4;
	scene.add(ambientLight);
	/*
	var pointLight = new THREE.PointLight('#fff6de')
	pointLight.position.set(0, 3000, 0)
	pointLight.intensity = 0.7;
	pointLight.castShadow = true
	//scene.add(pointLight)

	var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
	scene.add(directionalLight)
	*/
	
	//Floor
	var texture = new THREE.TextureLoader().load("https://i.imgur.com/uqi8eCB.jpg");
	texture.repeat.set(15, 15);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	var woodFloor = new THREE.Mesh(new THREE.PlaneGeometry(3000, 4000), new THREE.MeshLambertMaterial({map: texture}));
	woodFloor.rotation.x = -Math.PI / 2;
	woodFloor.position.set(0, 0, 0);
	scene.add(woodFloor);
	
	//Out Wall
	var wall = new THREE.Mesh(new THREE.PlaneGeometry(3000, 1000), new THREE.MeshLambertMaterial());
	var out_wall_up = wall.clone();
	var out_wall_down = wall.clone();
	var wall = new THREE.Mesh(new THREE.PlaneGeometry(4000, 1000), new THREE.MeshLambertMaterial());
	var out_wall_left = wall.clone();
	var out_wall_right = wall.clone();
	
	var ceiling = new THREE.Mesh(new THREE.PlaneGeometry(3000, 4000), new THREE.MeshLambertMaterial());
    ceiling.position.set(0, 1000, 0);
    ceiling.rotation.x = Math.PI / 2;
	
	out_wall_up.position.set(0, 500, -2000); 
	out_wall_down.position.set(0, 500, 2000);
	out_wall_down.rotation.y = Math.PI;
	out_wall_left.position.set(-1500, 500, 0);
	out_wall_left.rotation.y = Math.PI / 2;
	out_wall_right.position.set(1500, 500, 0);
	out_wall_right.rotation.y = -Math.PI / 2;
	scene.add(out_wall_up,out_wall_down,out_wall_left,out_wall_right,ceiling);
	
	//Walls
	wallBlock1 = new THREE.Mesh(new THREE.BoxGeometry (100,600,500),new THREE.MeshLambertMaterial());
	wallBlock1.position.set(0, 300, -1750);
	wallBlock2 = new THREE.Mesh(new THREE.BoxGeometry (100,600,2000),new THREE.MeshLambertMaterial());
	wallBlock2.position.set(0, 300, 0);
	wallBlock3 = new THREE.Mesh(new THREE.BoxGeometry (1000,600,100),new THREE.MeshLambertMaterial());
	wallBlock3.position.set(0, 300, -500);
	wallBlock4 = new THREE.Mesh(new THREE.BoxGeometry (1000,600,100),new THREE.MeshLambertMaterial());
	wallBlock4.position.set(0, 300, 1000);
	wallBlock5 = new THREE.Mesh(new THREE.BoxGeometry (500,600,100),new THREE.MeshLambertMaterial());
	wallBlock5.position.set(-1250, 300, 1000);
	wallBlock6 = new THREE.Mesh(new THREE.BoxGeometry (500,600,100),new THREE.MeshLambertMaterial());
	wallBlock6.position.set(1250, 300, 1000);
	wallBlock7 = new THREE.Mesh(new THREE.BoxGeometry (500,600,100),new THREE.MeshLambertMaterial());
	wallBlock7.position.set(-1250, 300, -500);
	wallBlock8 = new THREE.Mesh(new THREE.BoxGeometry (500,600,100),new THREE.MeshLambertMaterial());
	wallBlock8.position.set(1250, 300, -500);
	scene.add(wallBlock1,wallBlock2,wallBlock3,wallBlock4,wallBlock5,wallBlock6,wallBlock7,wallBlock8);
	
	wallBlock9 = new THREE.Mesh(new THREE.BoxGeometry (3000,400,100),new THREE.MeshLambertMaterial());
	wallBlock9.position.set(0, 800, -500);
	wallBlock10 = new THREE.Mesh(new THREE.BoxGeometry (3000,400,100),new THREE.MeshLambertMaterial());
	wallBlock10.position.set(0, 800, 1000);
	wallBlock11 = new THREE.Mesh(new THREE.BoxGeometry (100,399,3000),new THREE.MeshLambertMaterial());
	wallBlock11.position.set(0, 799.5, -500);
	scene.add(wallBlock9,wallBlock10,wallBlock11);
	
	//bench
	var bench = buildBench();
	var bench1 = buildBench();
	var bench2 = buildBench();
	bench.position.set(0, 0, 1150);
	bench1.position.set(1000, 0, 1900);
	bench2.position.set(-1000, 0, 1900);
	
	scene.add(bench,bench1,bench2);
	
	var art1 = buildArt1();
	art1.position.set(380, 0, 1250);
	var art2 = buildArt1();
	art2.position.set(-380, 0, 1250);
	
	var art3 = buildArt2();
	art3.position.set(-750, 0, 160);
	
	var art4 = new THREE.Mesh(new THREE.TorusKnotGeometry( 100, 15, 100, 160 , 4, 7), new THREE.MeshLambertMaterial({color:'#fff30a'}));
	art4.position.set(750, 300, 250);
	art4.rotation.y = Math.PI / 2;
	
	var art5 = buildArt3();
	art5.position.set(750, 170, -1200);
	let textureLoader = new THREE.TextureLoader();
	var art6 =	new THREE.Mesh(new THREE.BoxGeometry (300,300,300),[
        new THREE.MeshLambertMaterial({
            map: textureLoader.load('https://i.imgur.com/F7aA7LE.png')
        }),
        new THREE.MeshLambertMaterial({
            map: textureLoader.load('https://i.imgur.com/YzGrtXB.png')
        }),
        new THREE.MeshLambertMaterial({
            map: textureLoader.load('https://i.imgur.com/vCy1fYp.png')
        }),
        new THREE.MeshLambertMaterial({
            map: textureLoader.load('https://i.imgur.com/1WY5vFP.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: textureLoader.load('https://i.imgur.com/lx9ghgy.png')
        }),
        new THREE.MeshLambertMaterial({
            map: textureLoader.load('https://i.imgur.com/k5NbsUb.png')
        }),
    ]);
	
	art6.position.set(-750, 170, -1250);
	scene.add(art1,art2,art3,art4,art5,art6);
	
	

    scene.background = textureLoader.load( 'https://i.imgur.com/Nn5NKiX.png' );
	
	//paint
	var paint1 = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/zaOui0X.png")
	}));
	var paint1b = new THREE.Mesh(new THREE.PlaneGeometry(510, 510), new THREE.MeshLambertMaterial({color:'#000000'}));
	paint1.position.set(0,400,1060);
	paint1b.position.set(0,400,1055);
	createLight(new THREE.Vector3(0,990,1900), paint1);
	
	var paint2 = new THREE.Mesh(new THREE.PlaneGeometry(400, 265), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/YZlbYsD.png")
	}));
	paint2.position.set(1250,400,1055);
	createLight(new THREE.Vector3(1250,990,1900), paint2);
	
	var paint3 = new THREE.Mesh(new THREE.PlaneGeometry(450, 270), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/UlNTbiy.jpg")
	}));
	paint3.position.set(-1250,400,1055);
	createLight(new THREE.Vector3(-1250,990,1900), paint3);
	
	var paint4 = new THREE.Mesh(new THREE.PlaneGeometry(1200, 800), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/t1jSNhp.png")
	}));
	paint4.position.set(0,500,1995);
	createLight(new THREE.Vector3(0,990,1500), paint4);
	paint4.rotation.y = Math.PI;
	
	var paint5 = new THREE.Mesh(new THREE.PlaneGeometry(600, 500), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/NiK921s.jpg")
	}));
	paint5.position.set(-1495,400,1550);
	createLight(new THREE.Vector3(-1000,990,1550), paint5);
	paint5.rotation.y = Math.PI/2;
	
	var paint6 = new THREE.Mesh(new THREE.PlaneGeometry(630, 850), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/iQnO3Ey.png")
	}));
	paint6.position.set(1495,450,1550);
	createLight(new THREE.Vector3(1000,990,1550), paint6);
	paint6.rotation.y = -Math.PI/2;
	
	var paint7 = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/GD231PU.jpg")
	}));
	paint7.position.set(1495,450,250);
	paint7.rotation.y = -Math.PI/2;
	createLight(new THREE.Vector3(750,990,250), paint7);
	
	var paint8 = new THREE.Mesh(new THREE.PlaneGeometry(1200, 700), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/JFNwDm2.jpg")
	}));
	paint8.position.set(55,450,250);
	paint8.rotation.y = Math.PI/2;
	createLight(new THREE.Vector3(750,990,250), paint8);
	createLight(new THREE.Vector3(750,990,250), art4);
	
	var paint9 = new THREE.Mesh(new THREE.PlaneGeometry(1200, 800), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/aUKQ5qA.jpg")
	}));
	paint9.position.set(-1495,450,250);
	paint9.rotation.y = Math.PI/2;
	createLight(new THREE.Vector3(-750,990,250), paint9);
	
	var paint10 = new THREE.Mesh(new THREE.PlaneGeometry(640, 800), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/aSTLNJX.jpg")
	}));
	paint10.position.set(-55,450,250);
	paint10.rotation.y = -Math.PI/2;
	createLight(new THREE.Vector3(-750,990,250), paint10);
	
	createLight(new THREE.Vector3(-750,990,250), art3);
	
	var paint11 = new THREE.Mesh(new THREE.PlaneGeometry(750, 750), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/ilh1LCi.jpg")
	}));
	paint11.position.set(1495,450,-1250);
	paint11.rotation.y = -Math.PI/2;
	createLight(new THREE.Vector3(750,990,-1250), paint11);
	
	createLight(new THREE.Vector3(750,990,-1250), art5);
	
	var paint12 = new THREE.Mesh(new THREE.PlaneGeometry(1280, 720), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/GF8tEgW.jpg")
	}));
	paint12.position.set(-1495,450,-1250);
	paint12.rotation.y = Math.PI/2;
	createLight(new THREE.Vector3(-750,990,-1250), paint12);
	
	createLight(new THREE.Vector3(-750,990,-1250), art6);
	
	var paint13 = new THREE.Mesh(new THREE.PlaneGeometry(500, 900), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/6QFNxf4.jpg")
	}));
	paint13.position.set(-750,500,-1995);
	createLight(new THREE.Vector3(-750,990,-1250), paint13);
	
	var paint14 = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("https://i.imgur.com/nHuWdyb.jpg")
	}));
	paint14.position.set(750,500,-1995);
	createLight(new THREE.Vector3(750,990,-1250), paint14);
	
	
	scene.add(paint1, paint1b, paint2, paint3, paint4, paint5, paint6, paint7, paint8, paint9, paint10
	, paint11, paint12, paint13, paint14);
	//gltf
	//gltf_loader();
	
}

function buildBench() {
  var group = new THREE.Group();
  var bench = new THREE.Mesh(new THREE.BoxGeometry(400, 20, 150), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var benchLeg1 = new THREE.Mesh(new THREE.BoxGeometry(20, 100, 150), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var benchLeg2 = new THREE.Mesh(new THREE.BoxGeometry(20, 100, 150), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  bench.position.set(0, 110, 0);
  benchLeg1.position.set(-190, 50, 0);
  benchLeg2.position.set(190, 50, 0);
  group.add(bench, benchLeg1, benchLeg2);
  return group;
}

function buildArt1() {
  var group = new THREE.Group();
  
  var art1 = new THREE.Mesh(new THREE.OctahedronGeometry(150,0), new THREE.MeshLambertMaterial({color:'#389413'}));
  var art2 = new THREE.Mesh(new THREE.OctahedronGeometry(100,0), new THREE.MeshLambertMaterial({color:'#47bf17'}));
  var art3 = new THREE.Mesh(new THREE.OctahedronGeometry(50,0), new THREE.MeshLambertMaterial({color:'#58f21b'}));
  var art4 = new THREE.Mesh(new THREE.DodecahedronGeometry(100,0), new THREE.MeshLambertMaterial({color:'#544101'}));
  
  
  art1.position.set(0, 250, 0);
  art2.position.set(0, 360, 0);
  art3.position.set(0, 450, 0);
  art4.position.set(0, 100, 0);
  group.add(art1, art2, art3, art4);
  return group;
}

function buildArt2() {
  var group = new THREE.Group();
  
  var art1 = new THREE.Mesh(new THREE.SphereGeometry( 100, 32, 16 ), new THREE.MeshLambertMaterial({color:'#77117a'}));
  var art2 = new THREE.Mesh(new THREE.SphereGeometry( 100, 32, 16 ), new THREE.MeshLambertMaterial({color:'#77117a'}));
  var art3 = new THREE.Mesh(new THREE.SphereGeometry( 100, 32, 16 ), new THREE.MeshLambertMaterial({color:'#77117a'}));
  var art4 = new THREE.Mesh(new THREE.CylinderGeometry( 100, 100, 500, 32 ), new THREE.MeshLambertMaterial({color:'#c71fcc'}));
  var art5 = new THREE.Mesh(new THREE.SphereGeometry( 100, 32, 16 ), new THREE.MeshLambertMaterial({color:'#c71fcc'}));
  var art6 = new THREE.Mesh(new THREE.SphereGeometry( 100, 32, 16 ), new THREE.MeshLambertMaterial({color:'#c71fcc'}));
  
  art1.position.set(0, 100, 0);
  art2.position.set(100, 100, 173);
  art3.position.set(-100, 100, 173);
  art4.position.set(0, 300, 100);
  art5.position.set(0, 550, 100);
  art6.position.set(0, 100, 100);
  group.add(art1, art2, art3, art4, art5, art6);
  return group;
}

function buildArt3() {
  var group = new THREE.Group();
  
  var art1 = new THREE.Mesh(new THREE.TorusGeometry( 100, 30, 16, 100 ), new THREE.MeshLambertMaterial({color:'#ff0000'}));
  var art2 = new THREE.Mesh(new THREE.TorusGeometry( 100, 30, 16, 100 ), new THREE.MeshLambertMaterial({color:'#e60760'}));
  
  art1.position.set(-50, 150, 0);
  art1.rotation.x = Math.PI / 6;
  art2.position.set(50, 150, 0);
  art2.rotation.x = -Math.PI / 6;
  
  group.add(art1,art2);
  return group;
}

var load_flag = false
function gltf_loader(){
    // 載入 loader
    const loader = new THREE.GLTFLoader();
    // Load a glTF resource
    loader.load(
        './stuff/banana_peel_mario_kart.glb',
		
  // called when the resource is loaded
    function ( gltf ) {
        gltf = gltf
        let Obj = gltf.scene
        Obj.rotation.y = Math.PI / 8;
        Obj.position.y = 0;

       Obj.scale.set(10, 10, 10);

        // 設定陰影
        Obj.traverse(function(object) {
            if (object instanceof THREE.Mesh) {
              object.castShadow = true
              object.receiveShadow = true
            }
          })

        scene.add(Obj);
        load_flag = true
        console.log(gltf)
  },
  // called while loading is progressing
  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },
  // called when loading has errors
  function ( error ) {
    console.log( 'An error happened:'+error );
  }
)}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
} 

class spotlights {
	constructor(position, target) {
	this.distance = 3000;
    this.myStatus = true;
    this.brightness = 50;
    this.spotLight = new THREE.SpotLight(0xffffff, this.brightness / 50, 1500, Math.PI / 6, 0.98, 0.5);
    this.spotLight.position.set(position.x, position.y, position.z);
    this.spotLight.target = target;
	this.spotLightHelper = new THREE.SpotLightHelper( this.spotLight );
	this.spotLight.intensity = this.brightness/50;
	//scene.add( this.spotLightHelper );
    scene.add(this.spotLight);
	
	
	this.sphereSize = 30;
	this.pointLightHelper = new THREE.PointLightHelper(this.spotLight, this.sphereSize);
	
	scene.add(this.pointLightHelper);
	
  }
  changeBrightness(brightness) {
    if (brightness <= 0) {
      this.myStatus = false;
      document.querySelector('#lightBrightness').value = 0;
      this.spotLight.intensity = 0;
    } else {
      this.myStatus = true;
      this.brightness = brightness;
      this.spotLight.intensity = this.brightness / 20;
      document.querySelector('#lightBrightness').value = this.brightness;
    }
  }
  toggle() {
    this.myStatus = !this.myStatus;
    if (this.myStatus === true) {

	  this.changeBrightness(this.brightness);
	  console.log(this.brightness);
	  
    } else {
      this.changeBrightness(0);
    }
  }
}

function createLight(position, target) {
  let newlight = new spotlights(position, target);
  lightArray.push(newlight);
}

function switchAllLight() {
  lightArray.forEach((item) => {
    item.toggle();
  });
}

function changeAllBrightness(brightness) {
  lightArray.forEach((item) => {
    item.changeBrightness(brightness);
  });
}

var lightArray = [];

function clickLightSwitch(){
	switchAllLight();
}

function vp(x,y,z,xx,yy,zz){
	camera.position.set(x,y,z);
	camera.lookAt(new THREE.Vector3(xx,yy,zz));
}


document.querySelector('#lightBrightness').oninput = function() {
  changeAllBrightness(this.value);
};

init();
animate();