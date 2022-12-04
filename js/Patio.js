$('.gclass').click(function() {
  if ($(this).val() === 'place')
    placing = 1;
  else if ($(this).val() === 'move')
    placing = 2;
  else if ($(this).val() === 'delete')
    placing = 3;
  else if ($(this).val() === 'rotate')
    placing = 4;
});

$('.oclass').click(function() {
  if ($(this).val() === 'table')
    object = 1;
  else if ($(this).val() === 'chair')
    object = 2;
  else if ($(this).val() === 'bench')
    object = 3;
});

$('#save').click( function() {

  // pucks --> puckRecs
  console.log(pucks.length);
  var recs = [];
  for (let i = 0; i < pucks.length; i++) {
	  
    var rec = {};
    rec.name = pucks[i].name;
	rec.rotation = pucks[i].rotation;
    rec.x = Number(pucks[i].position.x).toFixed(2);
    rec.z = Number(pucks[i].position.z).toFixed(2);
    recs.push(rec);
  }

  // puckRecs --> JSON.stringify --> localStorage
  var recLog = JSON.stringify(recs);
  localStorage.setItem('puckLog', recLog);

});

$('#clear').click( function() {

  pucks.forEach( function(puck) {
    puck.removeFromParent();
  })

  pucks = [];
});

$('#restore').click(function() {

  // localStorage --> JSON.parse --> puckRecs
  pucks.forEach( function(puck) {
    puck.removeFromParent();
  })
  pucks = [];
  var parseLog = JSON.parse(localStorage.getItem('puckLog'));
  for (let i = 0; i < parseLog.length; i++) {
	var newPuck = buildBench();
	if(parseLog[i].name === '1'){
		newPuck = buildTable();
		newPuck.name = '1';
	}else if(parseLog[i].name === '2'){
		newPuck = buildChair();
		newPuck.name = '2';
	}else if(parseLog[i].name === '3'){
		newPuck = buildBench();
		newPuck.name = '3';
	}
	newPuck.setRotationFromEuler(parseLog[i].rotation);
    newPuck.position.set(parseLog[i].x, 0, parseLog[i].z);
    scene.add(newPuck);
    pucks.push (newPuck);
  }
  
});

var scene, renderer, camera;
var plane;
var puck;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var placing = 1;
var pucks = [];
var thePuck;
var controls; // move to global, for changing controls
var object = 1;
var rotate_angle = 0;

init();
animate();

function init() {

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  var ww = $('#container').innerWidth();
  var hh = $('#container').innerHeight();
  renderer.setSize(ww, hh);
  renderer.setClearColor(0x555555);
  $('#container').append(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, ww / hh, 1, 10000);
  camera.position.set(0, 80, 200);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  
  var ambientLight = new THREE.AmbientLight('white', 0.2);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.castShadow = true;
  pointLight.position.set(0, 100, 0);
  scene.add(ambientLight, pointLight);

  var cyl_geom = new THREE.CylinderGeometry(10, 10, 6, 32);
  var cyl_mat = new THREE.MeshNormalMaterial();
  //puck = new THREE.Mesh(cyl_geom, cyl_mat);
  
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  var gridXZ = new THREE.GridHelper(200, 20, 'red', 'white');
  //scene.add(gridXZ);
  // build an invisible plane, overlapping the grid
  
  
  var texture = new THREE.TextureLoader().load("https://i.imgur.com/DI9liW9.jpg");
  //texture.repeat.set(15, 15);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  
  var grassAlpha = new THREE.TextureLoader().load('https://i.imgur.com/CXf5AjC.png');
  
  plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(200, 200, 8, 8),
    new THREE.MeshLambertMaterial({
	  map: texture,
      transparent: true,
	  alphaMap: grassAlpha
    }));
  plane.rotation.x = -Math.PI / 2;
  plane.material.visible = true; // invisible, for picking only
  scene.add(plane);
  
  var stone_texture = new THREE.TextureLoader().load("https://i.imgur.com/WklOSfh.jpg");
  //texture.repeat.set(15, 15);
  stone_texture.wrapS = THREE.RepeatWrapping;
  stone_texture.wrapT = THREE.RepeatWrapping;
  
  var stoneAlpha = new THREE.TextureLoader().load('https://i.imgur.com/8HC7G8G.png');
  
  stone_plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(200, 200, 8, 8),
    new THREE.MeshLambertMaterial({
	  map: stone_texture,
      transparent: true,
	  alphaMap: stoneAlpha
    }));
  stone_plane.rotation.x = -Math.PI / 2;
  stone_plane.material.visible = true; // invisible, for picking only
  scene.add(stone_plane);
  
  
  
  window.addEventListener('resize', onWindowResize, false);
  $('#container').on("pointerdown", onMouseDown);
  $('#container').on("pointermove", onMouseMove);
  $('#container').on("pointerup", onMouseUp);

  thePuck = null;
}

function onWindowResize() {
  var ww = $('#container').innerWidth();
  var hh = $('#container').innerHeight();
  camera.aspect = ww / hh;
  camera.updateProjectionMatrix();
  renderer.setSize(ww, hh);
}

function onMouseDown(event) {

  var viewportPos = $('#container').get(0).getBoundingClientRect();
  mouse.x = ((event.clientX - viewportPos.left) / $('#container').innerWidth()) * 2 - 1;
  mouse.y = -((event.clientY - viewportPos.top) / $('#container').innerHeight()) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  
  if(object === 1){
	puck = buildTable();
	puck.name = '1';
  }
  else if(object === 2){
	puck = buildChair();
	puck.name = '2';
  }
  else if(object === 3){
	puck = buildBench();
	puck.name = '3';
  }
  if (placing === 1) { // place
    var intersects = raycaster.intersectObject(plane);
    if (intersects.length > 0) {
      var newPuck = puck.clone(); //makePuck();
      newPuck.position.copy(intersects[0].point);
      scene.add(newPuck);
      pucks.push(newPuck);
    }
  } else if (placing === 2){ // move
    var intersects = raycaster.intersectObjects(pucks);
    if (intersects.length > 0) {
      thePuck = intersects[0].object.parent; //group
    }

  }	else if (placing === 3){ // delete
    var intersects = raycaster.intersectObjects(pucks);
    if (intersects.length > 0) {
      thePuck = intersects[0].object.parent;

      //scene.remove(thePuck);
      thePuck.removeFromParent();

      // remove thePuck from pucks
      for (let i = 0; i < pucks.length; i++) {
        if (pucks[i] === thePuck) {
          pucks.splice(i, 1);
          break;
        }
      }

    }

  } else if (placing === 4){ // rotate
    var intersects = raycaster.intersectObjects(pucks);
    if (intersects.length > 0) {
      intersects[0].object.parent.rotateY(rotate_angle*Math.PI/180);
    }
  }
}

document.querySelector('#rotate_ang').oninput = function() {
  rotate_angle = (this.value);
  document.querySelector('#rotate_n').value = rotate_angle;
};

document.querySelector('#rotate_n').oninput = function() {
  rotate_angle = (this.value);
  document.querySelector('#rotate_ang').value = rotate_angle;
};

function onMouseUp(event) {
  thePuck = null;
  controls.enabled = true;
}


function onMouseMove(event) {
  event.preventDefault();
  if (thePuck === null) return;

  var viewportPos = $('#container').get(0).getBoundingClientRect();
  mouse.x = ((event.clientX - viewportPos.left) / $('#container').innerWidth()) * 2 - 1;
  mouse.y = -((event.clientY - viewportPos.top) / $('#container').innerHeight()) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObject(plane);
  if (intersects.length > 0) {
    controls.enabled = false;  // to disable camera movement
    thePuck.position.copy(intersects[0].point);
  }

}



function animate() {

  requestAnimationFrame(animate);
  render();

  $('#debugMsg').text(pucks.length + ' pucks on plane');

}

function render() {
  renderer.render(scene, camera);
}

function buildTable() {
  var group = new THREE.Group();
  var table = new THREE.Mesh(new THREE.BoxGeometry(52, 2, 26), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var table1 = new THREE.Mesh(new THREE.BoxGeometry(2, 15, 2), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var table2 = new THREE.Mesh(new THREE.BoxGeometry(2, 15, 2), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var table3 = new THREE.Mesh(new THREE.BoxGeometry(2, 15, 2), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var table4 = new THREE.Mesh(new THREE.BoxGeometry(2, 15, 2), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  table.position.set(0, 16, 0);
  table1.position.set(-24, 7.5, 11.5);
  table2.position.set(24, 7.5, 11.5);
  table3.position.set(-24, 7.5, -11.5);
  table4.position.set(24, 7.5, -11.5);
  group.add(table, table1, table2, table3, table4);
  return group;
}

function buildChair() {
  var group = new THREE.Group();
  var bench = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 10), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var benchLeg1 = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var benchLeg2 = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var benchLeg3 = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var benchLeg4 = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var benchBack = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 2), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  bench.position.set(0, 8, 0);
  benchLeg1.position.set(-4, 4, 4);
  benchLeg2.position.set(4, 4, 4);
  benchLeg3.position.set(-4, 4, -4);
  benchLeg4.position.set(4, 4, -4);
  benchBack.position.set(0, 13, -4);
  group.add(bench, benchLeg1, benchLeg2, benchLeg3, benchLeg4, benchBack);
  return group;
}

function buildBench() {
  var group = new THREE.Group();
  var bench = new THREE.Mesh(new THREE.BoxGeometry(40, 2, 15), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var benchLeg1 = new THREE.Mesh(new THREE.BoxGeometry(2, 10, 15), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var benchLeg2 = new THREE.Mesh(new THREE.BoxGeometry(2, 10, 15), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  var benchBack = new THREE.Mesh(new THREE.BoxGeometry(40, 10, 2), new THREE.MeshLambertMaterial({color:'#4d2600'}));
  bench.position.set(0, 11, 0);
  benchLeg1.position.set(-19, 5, 0);
  benchLeg2.position.set(19, 5, 0);
  benchBack.position.set(0, 15, -6.5);
  group.add(bench, benchLeg1, benchLeg2, benchBack);
  return group;
}
