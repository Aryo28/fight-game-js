class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0} }){  
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()  //Crear nuevos objetos 
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 15
        this.offset = offset

    }

    draw() {

        //Ajustar imagenes de acuerdo a su tamaño y el padding que tengan por defecto
        c.drawImage(
            this.image,
            this.frameCurrent  * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, //width/framesMax permite obtener un sprite de la spritesheet * escala para tamaño
            this.image.height * this.scale
            )
    }

    //Ejecuta las animaciones cambiando los frames de las imagenes cada 10 frames
    animateFrame(){
        this.framesElapsed++

        //FramesElapsed cuenta hasta 10 y ejecuta una vez el loop de animacion para que no vaya tan rapido
        //disminuir el FE hace la animacion mas rapida
        if(this.framesElapsed % this.framesHold === 0){
            if(this.frameCurrent < this.framesMax - 1){
                this.frameCurrent++
            } else {
                this.frameCurrent = 0
            }
        }   
    }

    update() {
        this.draw()
        this.animateFrame() 
    }
}


// Clase para definir posicion y dibujar al personaje 
// los brackest convierten en objeto a los valores lo que permite enviarlos en el orden que sea 
// y sin necesidad de tener que pasar todos los parametros

//Extendes permite heredar atributos de otra clase
class Fighter extends Sprite{
    constructor({
        position, 
        velocity, 
        color = 'red', 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        offset = {x: 0, y: 0},
        sprites,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined
        }
        
    }){  
        super({ //Con super haces referencia a la clase de la cual heredas (clase padre)
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

        //Propiedades de la clase Fighter
        this.velocity = velocity 
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        },
        this.isAttacking = false,
        this.color = color
        this.health = 100
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 15
        this.sprites = sprites
        this.dead = false

        //Crea nueva instancia de cada imagen y permite acceder a sus propiedades
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

    }


    update() {

        this.draw()
        if(!this.dead){
            this.animateFrame()
        }
   

        //Ajustar posicion del hitbox de acuerdo al jugador
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        //Draw Attackbox - Dibuja el hitbox del personaje en caso de ser necesario ajustarlo
       /* c.fillRect(
            this.attackBox.position.x, 
            this.attackBox.position.y, 
            this.attackBox.width, 
            this.attackBox.height
        )*/
    

        //Agrega movimiento al jugador al 
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //Ajusta posicion del jugador dentro del canvas utilizando gravedad hasta el limite inferior de Y
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;  
            this.position.y = 330  
        } else this.velocity.y += gravity

    }

    //Inicia ataque del jugador y el hitbox solo es efectivo por 0.1 segundos (100)
    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true;
    }

    takeHit(){
        this.health -=20

        if(this.health <= 0){
            this.switchSprite('death')
        }else this.switchSprite('takeHit')
    }

    //Switch para ejecutar animaciones de acuerdo a la accion
    switchSprite(sprite){
        
        //override animations with attack animation - cancela toda las animaciones y ejecuta animacion de ataque
        if(
            this.image === this.sprites.attack1.image &&
            this.frameCurrent < this.sprites.attack1.framesMax -1
        ) 
            return
        
        //override animations with tacking a hit animation - cancela toda las animaciones y ejecuta animacion de recibir golpe
        if(
            this.image === this.sprites.takeHit.image &&
            this.frameCurrent < this.sprites.takeHit.framesMax -1
        ) 
            return

        //override animations with tacking a death animation - cancela toda las animaciones y ejecuta animacion de derrota del personaje
        if(this.image === this.sprites.death.image){
            if(this.frameCurrent === this.sprites.death.framesMax -1)
                this.dead = true
            return
        } 
            


        switch (sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image //Ninguna tecla presionada = mostrar animacion idle
                    this.framesMax = this.sprites.idle.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'run':
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image 
                    this.framesMax = this.sprites.run.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.frameCurrent = 0
                }
                break  
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.frameCurrent = 0
                }
                break  
            case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.frameCurrent = 0
                }
                break    
            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.frameCurrent = 0
                }
                break   
            case 'death':
                if(this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.frameCurrent = 0
                }
                break    
            
        }
    }
}