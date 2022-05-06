const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

        // X  Y  Ancho        Alto       : Dibuja desde 0,0 todo el ancho y alto del canvas
c.fillRect(0, 0, canvas.width, canvas.height )

const gravity = 0.7


//Nuevas instancais de la clase Sprite y Fighter
const background = new Sprite({

    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png' //Sprite del background 

})

const shopSprite = new Sprite({

    position: {
        x: 650,
        y: 160 
    },
    imageSrc: './img/shop.png', //Sprite de la tienda con escala y cantidad de frames (en la imagen original son 6 frames)
    scale: 2.5,
    framesMax: 6

})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset:{
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png', //Imagen del peleador 1
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157, 
    },
    sprites: {  //La propiedad sprites permite agregar varias imagenes con sus propiedades y crear animaciones de idle y movimiento
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }

    },
    attackBox:{
        offset: {
            x:-100,
            y:50,
        },
        width: 150,
        height: 50
    }
})


const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: './img/Kenji/Idle.png', //Imagen del peleador 1
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167, 
    },
    sprites: {  //La propiedad sprites permite agregar varias imagenes con sus propiedades y crear animaciones de idle y movimiento
        idle: {
            imageSrc: './img/Kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/Kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/Kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/Kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/Kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './img/Kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/Kenji/Death.png',
            framesMax: 7
        }

    },
    attackBox:{
        offset: {
            x:170,
            y:50,
        },
        width: 170,
        height: 50
    }
})



//Switch para teclas de movimiento
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    }
}


decreaseTimer()

//funcion que actua como loop autollamandose para hacer animaciones
function animate(){
    window.requestAnimationFrame(animate)

    //Llenado del canvas en color negro
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    //Ejecucion de funciones para mostrar jugadores con sus atributos (posicion, mov, imagenes, etc)
    background.update()
    shopSprite.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.2)'
    c.fillRect(0,0, canvas.width, canvas.height),

    player.update()
    enemy.update()
   
    //Velocidad inicial de los jugadores a 0
    player.velocity.x = 0
    enemy.velocity.x = 0

    //Player 
    if (keys.a.pressed && player.lastKey == 'a') {  //Presionar tecla a = avanza a la izquierda (vel -5) y ejecuta animacion run
       
        player.velocity.x = -5  
        player.switchSprite('run')

    }else if (keys.d.pressed && player.lastKey == 'd') { //Presionar tecla a = avanza a la derecha (vel +5) y ejecuta animacion run
        
        player.velocity.x = 5
        player.switchSprite('run')

    }else{
        player.switchSprite('idle')
    }

    //Jumping & falling animation
    if(player.velocity.y < 0){

        player.switchSprite('jump')

    }else if(player.velocity.y > 0) {

        player.switchSprite('fall')
    }

    //Enemy 
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') { //Presionar tecla a = avanza a la izquierda (vel -5) y ejecuta animacion run

        enemy.velocity.x = -5
        enemy.switchSprite('run')

    }else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') { //Presionar tecla a = avanza a la izquierda (vel -5) y ejecuta animacion run
        
        enemy.velocity.x = 5
        enemy.switchSprite('run')

    }else{
        enemy.switchSprite('idle')
    }

    //Jumping & falling animation
    if(enemy.velocity.y < 0){

        enemy.switchSprite('jump')

    }else if(enemy.velocity.y > 0) {

        enemy.switchSprite('fall')
    }

    //collision - player (enemy gets hit)
    if ( 
        spritesCollision({ rect1: player, rect2: enemy}) 
        && player.isAttacking
        && player.frameCurrent === 4
    ){
        enemy.takeHit()
        player.isAttacking = false;

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })

    }

    //missing attack
    if(player.isAttacking && player.frameCurrent === 4){
        player.isAttacking = false
    }


    //collision - enemy (player gets hit)
       if ( 
        spritesCollision({ rect1: player, rect2: enemy}) 
        && enemy.isAttacking
        && enemy.frameCurrent === 2
    ){
        player.takeHit()
        enemy.isAttacking = false;
        
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })

    }

    //missing attack
    if(enemy.isAttacking && enemy.frameCurrent === 2){
        enemy.isAttacking = false
    }


    //Determinar ganador con base en la salud de jugadores
    if(enemy.health <=0 || player.health <= 0){
        winner({player,enemy, timerId}) //Llamar a funcion winner que determina quien gana con base a IF statements
    }

}

animate()

//Usando switch case se asigna movimiento a teclas al presionarlas y dejarlas de presionar
window.addEventListener('keydown', (evento) => {
    if( !player.dead){
        switch (evento.key) { //Cada tecla, se presiona (d.pressed = true y lastKey = tecla presionada)
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                keys.w.pressed = true; //Salto del jugador - vel en Y -20 y la const gravedad que actua siempre lo regresa al suelo
                player.velocity.y = -20;
                break;
            case 's':
                player.attack(); //Ejecuta ataque
                break;  
        }
    }
    
    if(!enemy.dead){
        switch (evento.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                keys.ArrowUp.pressed = true;
                enemy.velocity.y = -20;
                break;
            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }
    

})

window.addEventListener('keyup', (evento) => {
    switch (evento.key) {
        case 'd':
            keys.d.pressed = false;
            break
        case 'a':
            keys.a.pressed = false;
            break
        case 'w':
            keys.w.pressed = false;
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
        
    }
})