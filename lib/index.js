

var scene = new THREE.Scene();// membuat scene untuk merender objek(3d world)
var cam = new THREE.PerspectiveCamera(45,innerWidth/innerHeight, 1,500);// disini untuk mempersiapkan kamera, mulai dari lebar tinggi dan jarak pandang

/*
    parameter dari cam di atas
    1. FOV. how wide is our camera
    2. Aspectratio.menyesuaikan dengan layar kita
    3. near clip (jarak terdekat yang dapat dilihat)
    4. far clip (jarak terjauh yang dapat dilihat)
*/




var renderer = new THREE.WebGLRenderer({antialias: true}); // alat yang akan menampilkan hasil dari camera ke layar
scene.background = new THREE.Color(0x000000); // mengatur




//mengatur posisi kamera
cam.position.z = 26;// posisi kamera
cam.position.x = 196;// posisi kamera
cam.position.y = 4;// posisi kamera
cam.lookAt(new THREE.Vector3(0,0,0)); // mengatur look at dari kamera saat pertama kali dirender

renderer.setSize(window.innerWidth, window.innerHeight);//untuk mengatur ukuran layar yang dapat digunakan untuk merender
renderer.shadowMap.enabled = true;// untuk mengaktifkan shadow saat dirender
renderer.shadowMap.type = THREE.PCFSoftShadowMap;// untuk membuat shadow lebih halus
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3;
document.body.appendChild(renderer.domElement);




// untuk load model =======================================
let loader;
let cacnea;
let posox = 150;
let posoz = 22;
let animation;
let mixer;
let mixerarr = [];
let locobj = ['model1', 'model2', 'model3', 'model4', 'model5', 'model6', 'model7', 'model8'];
let objj;
let isrotate = 1;
let ry = -2;// untuk mengatur posisi ketinggian objek dari panggung karena masing" objek tidak sama
// di ata semua adalah deklarasi

for (let i = 0; i<8;i++){
    loader = new THREE.GLTFLoader().load("../pokemon/"+locobj[i]+"/scene.gltf", function(result){ // disini untuk ngeload objeknya, disini aku buat dengan looping biar gak diload satu"
        animation = result.animations;
        mixer = new THREE.AnimationMixer(result.scene);
        let action = mixer.clipAction(animation[0]);
        action.play();
        // di atas untuk ngeload animasi yang ada dari file gltf dan semuanya diambil animasi dari array yang ke 0

        mixerarr.push(mixer);// semua animasi dari setiap objek ditampung ke dalam array agar nantinya dapat terus bergerak saat masih di dalam browser

        objj = result.scene.children[0];// menampung objek yang diload ke dalam let objj

        //ini untuk membuat bayangan pada objek gltf
        result.scene.traverse( function ( object ) {

            if ( object.isMesh ) {
        
                object.castShadow = true;// di sini untuk mengaktifkan objek agak dapat mencetak bayangan saat ada cahaya
            }
        
        } );

        // di seluruh if di bawah ini digunakan untuk mengatur scale dari setiap objek yang diload, karena ukuran setiap objek berbeda"
        if(i==0){
            objj.scale.set(110,110,110);
            ry=-2;
        }
        else if(i==1){
            objj.scale.set(4,4,4);
            ry=-1.5;
        }
        else if(i==2){
            objj.scale.set(0.1, 0.1, 0.1);
            ry=-2;
        }
        else if(i==3){
            objj.scale.set(0.08, 0.08, 0.08);
            ry=-2;
        }
        else if(i==4){
            objj.scale.set(0.5, 0.5, 0.5);
            ry=-2;
        }
        else if(i==5){
            objj.scale.set(0.03, 0.03, 0.03);
            ry=1;
        }
        else if(i==6){
            objj.scale.set(0.02, 0.02, 0.02);
            ry=7;
            objj.rotation.z += 3.2;
        }
        else if(i==7){
            objj.scale.set(2, 2, 2);
            ry=0;
        }


        objj.position.set(posox,ry,posoz);// ini untuk mengatur posisi dari objek sesuai dengan posisi panggung yang tersedia
        if (isrotate == 1){// di sini if else untuk merotasi posisi z dari objek agar semua objek menghadap ke bagain tengah, yang dimana panggung yang disusun dalam ruangan secara zig-zag (di bagian if ini objek akan berada di posisi kanan saat pertama kali di render)
            posoz -= 45; // posisi z dari objek akan dikurangi agar sesuai dengan posisi panggung
            isrotate = 0; 
            objj.rotation.z += 3.2; // merotasi objek agar ke tengah
        }
        else{// (objek akan berada di posisi kiri saat pertama kali dirender)
            posoz += 45;
            isrotate = 1;
        }
        scene.add(objj);// menambahkan objek ke dalam dunia 3d
        posox-=40;// mengubah posisi x dari objek
    });
    
}


// ini untuk panggung=========================================
let panggung;
let panggungarr = [];
let pospx = 150;
let pospz = 22;
let isleft = 0;
//deklarasi
for(let i = 0; i < 8; i++){//ngelooping panggung 

    loader = new THREE.GLTFLoader().load('../pokemon/panggung/brown_panggung.gltf', function(result){// ngeload panggung
        panggung = result.scene.children[0];// menampung objek ke dalam variable panggung
        //ini untuk membuat bayangan pada objek gltf
        result.scene.traverse( function ( object ) {
            if ( object.isMesh ) {
                object.receiveShadow = true;// disini untuk mengaktifkan shadow dari objek lain tercetak pada objek panggung
            }
        } );
        panggung.scale.set(7,7,5);// menetapkan scale untuk panggung
        panggung.position.set(pospx,-5,pospz); // untuk menetapkan posisi panggung di dalam ruangan
        panggungarr.push(panggung); // menampung panggung ke dalam array
        scene.add(panggungarr[i]); // menambahkan array yang ke i ke dalam dunia 3d


        //disini sama dengan saat ngeload objek yang dimana membuat objek tersusun menjadi zig-zag dengan mengupdate nilai x dan nilai z-nya
        pospx-=40;
        if (isleft == 0){
            pospz -= 45;
            isleft = 1;
        }
        else{
            pospz += 45
            isleft = 0
        }
    });
    
    
}

// untuk foto

let geo = new THREE.BoxGeometry(0.1,20,10); // disini untuk membuat box untuk menampilkan foto kami di bagian ujung ruangan dan akan ditambahkan dengan texture foto kami
let erland_texture = new THREE.TextureLoader().load('../texture/erland.jpg');// disini untuk ngeload foto saya
let materland = new THREE.MeshBasicMaterial({
    map: erland_texture
});// membuat material dari box tersebut dan tambahkan textur yang telah diload
let mesh_erland = new THREE.Mesh(geo, materland); // membuat box dengan texture foto saya
mesh_erland.position.set(-168,7,23); // mengatur posisi boxnya
scene.add(mesh_erland);// tambahkan ke 3d world

let djackie_texture = new THREE.TextureLoader().load('../texture/djackie.jpg');// disini untuk ngeload foto teman saya
let matdjackie = new THREE.MeshBasicMaterial({
    map: djackie_texture
});
let mesh_djackie = new THREE.Mesh(geo, matdjackie);
mesh_djackie.position.set(-168,7,10);
scene.add(mesh_djackie);

// ini untuk ruangan===========================================
//untuk yang ini sama dengan ngeload pokemon dan panggung di atas, tetapi ini untuk ngeload ruangannya
let room;
loader = new THREE.GLTFLoader().load('../pokemon/room/untitled.gltf', function(result){
    room = result.scene.children[0];
    //ini untuk membuat bayangan pada objek gltf
    result.scene.traverse( function ( object ) {

        if ( object.isMesh ) {
    
            // object.castShadow = true;
            object.receiveShadow = true;
    
        }
    
    } );
    room.scale.set(10,10,10);
    room.castShadow = true;
    room.reciveShadow = true;
    room.position.set(0,0,0);
    scene.add(room);
});


//pengaturan lightning=======================================
var ambient = new THREE.AmbientLight(0xffffff,1);
scene.add(ambient); // menambahkan ambient light untuk menerangi seluruh objek dengan warna putih dan saturasi 1

var dl = new THREE.DirectionalLight(0xffffff, 4);
dl.position.set(0,40,0); // set posisi directional light
dl.shadow.mapSize.width = 4596;// untuk mengatur kelembutan bayangan yang ditampilkan
dl.shadow.mapSize.height = 4596;
var side1 = 39;
var side2 = 167;
dl.shadow.camera.top = side1;
dl.shadow.camera.bottom = -side1;
dl.shadow.camera.left = side2;
dl.shadow.camera.right = -side2;
//dari batas di atas akan mengatur jangkauan directional light untuk disinari dan memberi bayangan
dl.castShadow = true;// untuk mengaktifkan lightning dapat menghasilkan bayangan
// var helper = new THREE.CameraHelper(dl.shadow.camera) // ini untuk melihat jangkauan dari directional light
scene.add(dl); // menambahkan directional light kepada seluruh objek dengan warna cahaya putih dan saturasi 4






// untuk mengubah ukuran tampilan sewaktu" browser di resize
window.addEventListener('resize', function(){
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    cam.aspect = this.window.innerWidth/this.window.innerHeight;
    cam.updateProjectionMatrix();
})

let controls = new THREE.PointerLockControls(cam, renderer.domElement);
let clock = new THREE.Clock();

let btn1 = document.querySelector("#button1");
btn1.addEventListener('click', ()=>{
    controls.lock();
});

let keyboard = [];
addEventListener('keydown', (e)=>{
    keyboard[e.key] = true;
});
addEventListener('keyup', (e)=>{
    keyboard[e.key] = false;
});


function processKeyboard(delta) {
    let speed = 40;
    let actualSpeed = speed * delta;

    if (keyboard ['w']){
        controls.moveForward(actualSpeed);
    }
    if (keyboard ['s']){
        controls.moveForward(-actualSpeed);
    }
    if (keyboard ['a']){
        controls.moveRight(-actualSpeed);
    }
    if (keyboard ['d']){
        controls.moveRight(actualSpeed);
    }


}




//untuk looping animasi
function draw(){
    let delta = clock.getDelta();// untuk mendapatkan waktu tiap detik
    processKeyboard(delta);
    
    for(let i = 0; i<mixerarr.length; i++){
        mixerarr[i].update(delta);// ini untuk membuat animasi dari seluruh pokemon agar terus bergerak
    }
    requestAnimationFrame(draw);
    renderer.render(scene, cam);// untuk mengupdate dunia 3d dan camera secara terus menerus
}

renderer.render(scene, cam);
draw();
