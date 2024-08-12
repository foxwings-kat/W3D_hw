$('.button').click( function() {
	isStart = !isStart;
	console.log("isStart = "+isStart);
});

$('.checkbox').click( function() {
	isSoundOn = !isSoundOn;
	console.log("isSoundOn = "+isSoundOn);
});

document.querySelector('#radius').onchange = function() {
  radius = (this.value);
  circle.removeFromParent ();
  circle = new THREE.Mesh(new THREE.CircleGeometry(radius, 20, 20), new THREE.MeshBasicMaterial({
    color: 'yellow'
  }));
  scene.add(circle);
  console.log("radius = "+radius);
};

var isStart = true;
var isSoundOn = true;
var radius = 10;
var camera, scene, renderer;
var circle, pos, vel;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();

$('#container').on("pointermove", onMouseMove);

init();
animate();

function init() {

  scene = new THREE.Scene();
  
  
  renderer = new THREE.WebGLRenderer();
  
  var ww = $('#container').innerWidth();
  var hh = $('#container').innerHeight();
  renderer.setSize(ww, hh);
  
  renderer.setClearColor(0x888888);
  //document.body.appendChild(renderer.domElement);
  
  $('#container').append(renderer.domElement);
  
  camera = new THREE.OrthographicCamera(-100, 100, 100, -100, -10, 100);
  camera.position.z = 50;

  ////////////////////////////////////////////////////////
  var gridXZ = new THREE.GridHelper(200, 20, 'red', 'white');
  gridXZ.rotation.x = Math.PI / 2;
  scene.add(gridXZ);

  let geometry = new THREE.BufferGeometry();
  let points = [];
  points.push(
    new THREE.Vector3(-80, -80, 0),
    new THREE.Vector3(80, -80, 0),
    new THREE.Vector3(80, 80, 0),
    new THREE.Vector3(-80, 80, 0),
    new THREE.Vector3(-80, -80, 0));
  geometry.setFromPoints(points);
  var border = new THREE.Line(geometry, new THREE.LineBasicMaterial({
    color: 'blue'
  }));
  scene.add(border);

  circle = new THREE.Mesh(new THREE.CircleGeometry(radius, 20, 20), new THREE.MeshBasicMaterial({
    color: 'yellow'
  }));
  scene.add(circle);
  
  plane = new THREE.Mesh(new THREE.PlaneGeometry( 20, 20 ), new THREE.MeshBasicMaterial({color: 'green'}));
  scene.add(plane);

  pos = new THREE.Vector3();
  vel = new THREE.Vector3(10, 20);
}

function animate() {
  
	var dt = 0.05;
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	if (isStart == true){
	  pos.add(vel.clone().multiplyScalar(dt));
	  if (pos.x > 70 || pos.x < -70)
		vel.x *= -1;
	  if (pos.y > 70 || pos.y < -70)
		vel.y *= -1;

	  

	  circle.position.copy(pos);
  }
  
}

function onMouseMove(event) {
  event.preventDefault();
  

  var viewportPos = $('#container').get(0).getBoundingClientRect();
  mouse.x = ((event.clientX - viewportPos.left) / $('#container').innerWidth()) * 2 - 1;
  mouse.y = -((event.clientY - viewportPos.top) / $('#container').innerHeight()) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  //console.log("mouse.x = " + mouse.x + " mouse.y" + mouse.y);
  //console.log("plane.position.x = " + plane.position.x);
  //console.log("plane.position.y = " + plane.position.y);
  plane.position.x = mouse.x * 100;
  plane.position.y = mouse.y * 100;
  
  $.get( "http://127.0.0.1:1337/api?argv="+ circle.position.x + " " + circle.position.y
  + " " + radius + ((mouse.x * 100)+20) + " " + ((mouse.y * 100)+20) + " " + ((mouse.x * 100)-20) + " " + ((mouse.y * 100)-20)
  , function( data ) {
		if(data && data.output){
			console.log(data.output);
			
		}
	});

}