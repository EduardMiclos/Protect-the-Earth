/* ---------------------------------------
    PROJECT MADE BY: MICLOS EDUARD-PAVEL
    PROGRAMS/FRAMEWORKS: HTML, JAVASCRIPT, TAILWIND CSS
   --------------------------------------- */






// ---------- IMPORTS ---------- 

import {Asteroid} from './Asteroid.js'
import {Particle} from './Particle.js'

// ----------------------------- 






// ---------- DEFINING CANVAS AND CONTEXT. GETTING BACKGROUND IMAGES ---------- 

const canvas = document.querySelector('canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var ctx = canvas.getContext('2d');

// Getting the image of Earth.
var earth = document.getElementById("earth");

// Getting the images of stars.
var stars = document.getElementById('stars');

// Getting time, level and progress.
var time = document.getElementById('time');
var level = document.getElementById('level');
var progress = document.getElementById('progress');

// Getting the play button.
var play_btn = document.getElementById("play");

// Getting the menu.
var menu = document.getElementById("menu");

// ------------------------------------------------ 






// ---------- GLOBAL VARIABLES ---------- 

var EarthRadius = 200;
var Asteroids = [];
var Particles = [];
var CURR_LEVEL = 1;
var MAX_LEVEL = 5;
var TIME;
var timeout;

// -------------------------------------- 






// ---------- SECONDARY FUNCTIONS ---------- 

function calcAngle(x1, y1, x2, y2){
    return Math.atan2(y1 - y2, x1 - x2)
}

function samePosition(asteroid, pointer){
    return (
        pointer.x >= asteroid.x - asteroid.radius &&
        pointer.x <= asteroid.x + asteroid.radius &&
        pointer.y >= asteroid.y - asteroid.radius &&
        pointer.y <= asteroid.y + asteroid.radius
      )
}

function hit(asteroid){
    return Math.abs(asteroid.x + asteroid.radius/2 - canvas.width/2) < EarthRadius/2 && 
           Math.abs(asteroid.y + asteroid.radius/2 - canvas.height/2) < EarthRadius/2 
}

function damage(asteroid){
    gsap.to(asteroid, {
        radius: asteroid.radius-20
    });
}

function destroy(ArrayOfObjects, object){
    let index = ArrayOfObjects.indexOf(object)
    ArrayOfObjects.splice(index, 1)
}

function decreaseTime(){
    TIME-=1/60;
}

function displayUIMenu(menuDisplay, progressDisplay){
    progress.style.display = progressDisplay;
    menu.style.display = menuDisplay;
}

function levelUp(){
    CURR_LEVEL++;
}

function displayUIProgress(){
    if(Math.floor(TIME) != Math.floor(TIME + 1/60))
        time.innerHTML = Math.floor(TIME);
    level.innerHTML = CURR_LEVEL;
}

function endGame(animationID){
    window.cancelAnimationFrame(animationID)
    CURR_LEVEL = 1;
}

// ------------------------------------ 






// ---------- PRIMARY FUNCTIONS ---------- 

function renderBackground(){
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(earth, canvas.width/2 - EarthRadius/2, canvas.height/2- EarthRadius/2, EarthRadius, EarthRadius);
    ctx.drawImage(stars, 0, 0, canvas.width, canvas.height);
}


function spawnAsteroid(){
    const x = Math.random()*canvas.width/10 + canvas.width*Math.round(Math.random());
    const y = Math.random()*canvas.height/10 + canvas.height*Math.round(Math.random());
    const color = `hsl(${Math.random()*30}, 50%, 30%)`;
    const radius = Math.random()*100 + 15;

    // Calculating the angle (yes, I made a function for that).
    const angle = calcAngle(x, y, canvas.width/2, canvas.height/2)

    // Calculating direction based on the angle.
    const velocity = {
        x: -Math.cos(angle)*3,
        y: -Math.sin(angle)*3
    };

    // Pushing new instance of asteroid.
    Asteroids.push(
        new Asteroid(x, y, color, radius, velocity)
    );

    // Callback (the function is calling itself every SPAWN_TIME seconds.)
    timeout = setTimeout(spawnAsteroid, 3000 - CURR_LEVEL*500);
}

function clearScreen(){
    Asteroids = [];
    Particles = [];
    displayUIMenu('none', 'block');
}

function resetTime(level){
    TIME = 10*level;
}

function createParticle(asteroid){
    const x = asteroid.x;
    const y = asteroid.y;
    const color = asteroid.color;
    const radius = Math.random()*asteroid.radius/15;
    const velocity = {
        x: (Math.random() - 0.5)*2,
        y: (Math.random() - 0.5)*2
    }

    Particles.push(
        new Particle(x, y, color, radius, velocity)
    );

}


let animationID;

function MAIN(){
    animationID = window.requestAnimationFrame(MAIN);

    // Drawing the image of the Earth in the center of the canvas and the image of stars.
    renderBackground();

    
    Asteroids.forEach((asteroid) =>{
        asteroid.draw(ctx);
        asteroid.update()
        
        if(TIME <= 1){
            levelUp();
            resetTime(CURR_LEVEL);
        }

        if(hit(asteroid)){
            endGame(animationID)
            displayUIMenu('flex', 'none');
            clearTimeout(timeout);
        }

        if(CURR_LEVEL == MAX_LEVEL && TIME < 15){
            clearTimeout(timeout)
        }
        
    })

    // Drawing particles.
    Particles.forEach((particle)=>{
        particle.draw(ctx);
        particle.update();

        // Check if particle opacity is less than or equal to 0. If yes, destroy particle.
        if(particle.alpha <= 0)
            destroy(Particles, particle);

    })

    displayUIProgress();
    decreaseTime();
}

function PLAY(){
    CURR_LEVEL = 1;
    resetTime(CURR_LEVEL);
    clearScreen();

    MAIN();
    spawnAsteroid();
}

// ------------------------------ 






// ---------- EVENTS ---------- 

play_btn.addEventListener('click', PLAY)

window.addEventListener('click', pointer => {
    Asteroids.forEach((asteroid)=>{
        if(samePosition(asteroid, pointer)){
            if(asteroid.radius < 40){
                destroy(Asteroids, asteroid);
            }
            else{
                damage(asteroid);
            }

             // Create and push new instances of Particle object.
             for(let i = 0; i < 3; i++){
                createParticle(asteroid);
            }
        }
    })
})

// ---------------------------- 


renderBackground();