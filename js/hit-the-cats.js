var puntaje = 0;
var nivel = 1;
var meow = document.getElementById("cats_audio"); 
var meow_i = 0; 
var posicion = [900,1100,1200]; // Sprites sonoros
var clima; // Llueven gatos
var lista = []; // Orden de nacimiento gatuno
var efectoMau = []; 
var tiempo;
var hasta;
var llovio;
var marginFirst = 100;
var gacriVivos;
var penalidad = 1;
var pueblo = 0;
var maximo = 5; // Máxímo de gatos a capturar

$("#empezar").on( "click" , empezar );
$(".btnJugar").on( "click" , jugar );
$(".carrio").on( "click" , carrioHit );
cargarSonidos();


function disableselect(e){
return false
}
function reEnable(){
return true
}
document.onselectstart=new Function ("return false")
if (window.sidebar){
document.onmousedown=disableselect
document.onclick=reEnable
}

    musica = document.getElementById("loop8bits");
    musica.volume = 0.5;

function empezar(){
    maullador.play("sqek");
    $("#home").css("display","none");
    $("#nivel1").css("display","block");
    $("#pantalla").css("display","block");
}
function jugar(){
    maullador.play("sqek");
    musica.play();
    
    gatera();
    $("#jugar").addClass("bye");
    $("html").css("background-color","#ffcd00");
    
    gacriVivos = hasta;
    $("#nivel").html("Nivel " + nivel);
    
    // Llueven los macris
    llovio = 0;
    clima = setInterval(lluevenMacris,1000);
    
    // NIVEL 1
    if (nivel == 1){
    $("#nivel").css("display","block");
    }
    
    // NIVEL 3
    if (nivel == 3){
    $("#efectos").css("display","block");
    }
    
    // CADA 4 NIVELES
    if(nivel % 4 == 0){
        $("#carrioUna").css("display","block");
        setTimeout(mostrarCarrios,1000);
    } else {
        $("#carrioUna").css("left","100%");
    }
    // Nivel 6: Viene durán
    if(nivel == 6){
        setTimeout(vieneDuran,2000);
    }
    // CADA 8 NIVELES
    if(nivel % 8 == 0){
        $("#carrioDos").css("left","calc(50% - 194px)");
    } else {
        $("#carrioDos").css("left","calc(0% - 395px)");
    }
    
}

function mostrarCarrios(){
     $("#carrioUna").css("left","calc(50% - 194px)");
}

function pantalla(){
    musica.pause();
    $("#bolsadegatos").html("");
    $("#carrioUna").css("display","none");
    $("#carrioDos").css("display","none");
    
    for (i=0; i<hasta;i++){
        $("#floor"+i).css("display","none");
    }
    if(nivel == 7){
        $("#puntaje1").html($("#pueblo p:nth-of-type(1) span").html())
        $("#puntaje2").html($("#pueblo p:nth-of-type(2) span").html())
        $(".btnJugar").remove();
        
    }
    $("#jugar").removeClass("bye");
    $("#nivel"+(nivel-1)).css("display","none");
    $("#nivel"+nivel).css("display","block");
    
    
}

function macriHit(elemento){

    // Se saca una vida
   
    var vidas = $("#cat"+elemento).data("vidas");
    
    vidas--;
    $("#cat"+elemento).data("vidas",vidas);
    
    // Si es un gato de verdad
    if($("#cat"+elemento).hasClass("real")){
        
        if (vidas == 0){
            $("#cat"+elemento).addClass("bye");
            // Maullido
            if (meow_i == 3){meow_i = 0;}
            maullador.play("mau"+meow_i);

            clearInterval(efectoMau[meow_i]);

            puntaje++;
            meow_i++;
            gacriVivos--;
            
             // ¿Terminó el nivel?
            if(gacriVivos == 0){
                
                nivel++;
                for(i=0;i<nivel,i++){
                    clearInterval(efectoMau[i]);
                }
                
                setTimeout(pantalla,1500);
            }

            
        }else {
            maullador.play("sqek");
        }
    
    }else {
        
        maullador.play("sqek");
        if (vidas == 0){
            $("#nivel"+nivel+" .fa-check").css("display","block");
        }
            
    }
    
}

function carrioHit(){

    maullador.play("sqek");
}

function vieneDuran(){
    $("#duran").css("bottom","0px");
        
    var contenido = "";   
    for(i=1;i<10;i++){
        contenido += "<div class='globo x"+i+" click' onMouseUp='globoHit("+i+")'></div>";
    }
    
    $("#globos").html(contenido);
    setInterval(seVaDuran,3000);
}

function seVaDuran(){
    $("#duran").css("bottom","-206px");
}

function globoHit(elemento){
    maullador.play("pop");
    $(".x"+elemento).remove();
}
function randomizar(){
    
    for(i=0; i < hasta; i++){
    
        lista[i] = i;
    }

    var listTemp = lista.slice();
    var n = lista.length;
    lista = [];
    var j;
    
    while (n) {
        // Elije un macri por nacer...
        j = Math.floor(Math.random() * n--);

        // Y la agrega a la nueva posicion
        lista.push(listTemp.splice(j, 1)[0]);
    }
}
    
function gatera(){
    var contenido = "";
    // Por cada gato...

    if (nivel < maximo){
        hasta = nivel;    
    } else {
        hasta = maximo;
    }
    
    for(i=0; i < hasta; i++){
        contenido += "<div id='cat"+i+"' class='gato real'>";
        contenido += "<div class='dance-container'>";
        contenido += "<div class='avatar-container'>";
        contenido += "<div class='avatar flip click' onMouseUp='macriHit("+i+")'></div>";
        contenido += "</div>";
        contenido += "<div class='shadow'></div>";
        contenido += "</div>";
        contenido += "</div>";
        contenido += "<div id='floor"+i+"' class='floor'></div>";
    }
    
    $("#bolsadegatos").html(contenido);
    
    for(i=0; i < hasta; i++){
        var cuantas = cuantasVidas();
        $("#cat"+i).data("vidas",cuantas);
        if (cuantas == 2){
            $("#cat"+i).addClass("dosVidas");
        }
        efectoMau[i] = setInterval(catBounce(i),1000);
    }
    
    var ancho = 84;
    randomizar();
    for(i=0; i < nivel; i++){
        $("#cat"+i).css("left", "calc(50% - "+((-(ancho/2)*(hasta))+(ancho*(lista[i]+1)))+"px)");
        
        var ranT = Math.random();
        $("#cat"+i+" .avatar-container").css("animation-delay", ""+ranT+"s");
        $("#cat"+i+" .shadow").css("animation-delay", ""+ranT+"s");
        $("#cat"+i+" .avatar").css("animation-delay", ""+ranT+"s");
        
    }
    
}
function cuantasVidas(){
    var cuantas;
    if (nivel < 5){
        cuantas = 1;
    } else {
        // 50% de que nazca doble
        if(Math.random()< 0.5){
            cuantas = 2;
        }else{
            cuantas = 1;
        }
    }
    return cuantas;
    
}
function lluevenMacris(){
    
    if (llovio < hasta){
        var posicionY = 50-Math.random(5)*10;
        $("#cat"+llovio).css("top", posicionY + "%");
        $("#floor"+llovio).css("top", posicionY + "%");
        $("#floor"+llovio).css("display", "block");
        $("#floor"+llovio).css("left", $("#cat"+llovio).css("left"));
        
        llovio++;
    } else {
        clearInterval(clima);
    }
       
    
}

function catBounce(elemento){
    marginFirst -= penalidad;
    $("#efectos .efecto:nth-of-type(3)").css("margin-left",marginFirst + "%");
    pueblo++;
        $("#pueblo p:nth-of-type(1) span").html(pueblo);
        var despidos = pueblo * 643;
        $("#pueblo p:nth-of-type(2) span").html(despidos);
    
        if ($("#efectos .efecto:nth-of-type(3)").offset().left < pueblo*200){
        
    }
}

function cargarSonidos(){
maullador = new Howl({
  urls: ['audio/sound-sprites.mp3'],
  sprite: {
    'mau0': [1000, 900],
    'mau1': [0965, 1000],
    'mau2': [2077, 1000],
    'sqek': [4244, 500],
    'pop': [4877, 250]
  }
});
    
}
    