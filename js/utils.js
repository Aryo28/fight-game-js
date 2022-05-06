//Condiciones de colision, determina que casos son una colision
function spritesCollision({rect1, rect2}){
    return (
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x
        && rect1.attackBox.position.x <= rect2.position.x + rect2.width 
        && rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y
        && rect1.attackBox.position.y <= rect2.position.y + rect2.height
    )
}

//Condiciones con base a la salud para determinar personaje ganador

function winner({player,enemy, timerId}){

    clearTimeout(timerId); //detener timer
    
    document.querySelector('#tieScreen').style.display = 'flex' //mostrar leyenda de ganador
    document.querySelector('#reload').style.display = 'flex'
    
    if(player.health === enemy.health){ //empate
        document.querySelector('#tieScreen').innerHTML = 'Tie'
    }
    else if(player.health > enemy.health){
        document.querySelector('#tieScreen').innerHTML = 'Player 1 Wins!'
    }
    else if(player.health < enemy.health){
        document.querySelector('#tieScreen').innerHTML = 'Player 2 Wins!'
    }

}




//Contador de tiempo, setTimeout ejecuta una accion cada determinado tiempo 
//(1 seg = 1000) requiere 2 parametros
//par 1 - accion  y par 2 - tiempo
let timer = 60
let timerId
function decreaseTimer(){

    if(timer>0){
       timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if(timer==0){
        //si se acaba el tiempo deteminar ganador o empate al llamar funcion
        winner({player,enemy, timerId})
    }
    
}
