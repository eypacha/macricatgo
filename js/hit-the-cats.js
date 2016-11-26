var puntaje = 0;
var nivel = 1;
var meow_i = 0; 
var musica;
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
var barraVida = 100;
var danio = 4;
var bonificacion = 10;
var eliNum = 0;
var monedas = 0;
var sopX, sopY;
$("#empezar").on( "click" , empezar );
$(".sqek").on( "mousedown" , sonido1 );
$(".sqek").on( "mouseup" , sonido2 );
$("#btnJugar").on( "click" , jugar );
$(".carrio").on( "click" , carrioHit );
$("#jugarOtraVez").on( "click" , juegoNuevo );


function sonido1(){
    maullador.play("sqek");
}
function sonido2(){
    maullador.play("sqak");
}

// No permitir seleccionar
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

$(document).mousemove(function(event){
    sopX = event.pageX;
    sopY = event.pageY;
  });

function juegoNuevo(){
   location.reload();
}
function empezar(){
    $("#home").css("display","none");
    $("#nivel1").css("display","block");
    $("#pantalla").css("display","block");
}
function jugar(){
    musica.play();
    
    $("#jugar").addClass("bye");
    $("html").css("background-color","#ffcd00");
    
    gatera();
  
    // NIVEL 1
    if (nivel == 1){
    $("#nivel").css("display","block");
    $("#barraVida").css("display","block");
    }
    
    // NIVEL 3
    if (nivel == 3){
    $("#efectos").css("display","block");
    marginFirst = 50;
    $("#efectos .efecto:nth-of-type(3)").css("margin-left", marginFirst + "%");
    }
    
    // CADA 4 NIVELES
    if(nivel % 4 == 0){
        $("#carrioUna").css("display","block");
        setTimeout(mostrarCarrios,1000);
    } else {
        $("#carrioUna").css("left","100%");
    }
    // Nivel 7: Viene durán
    if(nivel == 7){
        setTimeout(vieneDuran,2000);
    }
    
    // CADA 8 NIVELES
    if(nivel % 8 == 0){
        $("#carrioDos").css("display","block");
    } else {
        $("#carrioDos").css("left","calc(0% - 395px)");
    }
    
}

function mostrarCarrios(){
     $("#carrioUna").css("left","calc(50% - 194px)");
     $("#carrioDos").css("left","calc(50% - 194px)")
}

function pantalla(){
    musica.pause();
    
    $("#globos").html("");
    $("#carrioUna").css("display","none");
    $("#carrioDos").css("display","none");
    $("#bolsadegatos").html("");
    
    for (i=0; i<hasta;i++){
        $("#floor"+i).css("display","none");
    }
    
    $("#jugar").removeClass("bye");
    $("#nivel"+(nivel-1)).css("display","none");
    $("#nivel"+nivel).css("display","block");
    
    // NIVEL 9: No hay más por ahora...
    if(nivel == 9 || barraVida <= 0) {
        $("#nivel"+nivel).css("display","none");
        $("#nivel"+9).css("display","block");
        $("#puntaje1").html($("#pueblo p:nth-of-type(1) span").html())
        $("#puntaje2").html($("#pueblo p:nth-of-type(2) span").html())
        $("#btnJugar").remove();
        $("#btnTienda").remove();
        
    }else{
        barraVida = 100;
        $("#barraVida .valor").css("width",barraVida+"%");
    }
    
}

function macriHit(elemento){

    // Se saca una vida
   
    var vidas = $("#cat"+elemento).data("vidas");
    
    vidas--;
    $("#cat"+elemento).data("vidas",vidas);
    
    // Si es un gato de verdad
    if($("#cat"+elemento).hasClass("real")){
        
        if (vidas == 0){
            // Libera monedas
            dropCoins(sopX,sopY);
                        
            $("#cat"+elemento).addClass("bye");
            
            // Maullido
            if (meow_i == 3){meow_i = 0;}
            maullador.play("mau"+meow_i);

            puntaje++;
            meow_i++;
            
            barraVida+= bonificacion;
            if (barraVida >= 100){barraVida = 100;}
            $("#barraVida .valor").css("width",barraVida+"%");
            
            var revive = $("#cat"+elemento).data("revive");
            
            
            if(revive > 0){
                revive--;
                $("#cat"+elemento).data("revive",revive);
                setTimeout(naceUnCat,1000,elemento);
            }else{
                gacriVivos--;
                clearInterval(efectoMau[elemento]);
                
             // ¿Terminó el nivel?
                if(gacriVivos == 0){
                    //gatera();
                    nivel++;
                    setTimeout(pantalla,1500);
                }
            }
            
        }else {
            //
        }
    
    }else {
        
        //
        if (vidas == 0){
            $("#nivel"+nivel+" .fa-check").css("display","block");
        }
            
    }
    
}
function naceUnCat(e){
    var cuantas = cuantasVidas();
    $("#cat"+e).data("vidas",cuantas);
    if (cuantas == 2){
            $("#cat"+e).addClass("dosVidas");
    }
    $("#cat"+e).removeClass("bye");
    
}
function carrioHit(){

    maullador.play("elisa"+eliNum);
    eliNum++;
    if(eliNum == 3){eliNum = 0};
    
}

function vieneDuran(){
    $("#duran").css("bottom","0px");
        
    var contenido = "";   
    for(i=1;i<10;i++){
        contenido += "<div class='globo x"+i+" click sqek' onMouseUp='globoHit("+i+")'></div>";
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
        contenido += "<div class='avatar flip click sqek' onMouseUp='macriHit("+i+")'></div>";
        contenido += "</div>";
        contenido += "<div class='shadow'></div>";
        contenido += "</div>";
        contenido += "</div>";
        contenido += "<div id='floor"+i+"' class='floor'></div>";
    }
    
    $("#bolsadegatos").html(contenido);
    
    for(i=0; i < hasta; i++){
        
        naceUnCat(i);
        var revive = cuantasRevive();
        $("#cat"+i).data("revive",revive);
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
    
    gacriVivos = hasta;
    llovio = 0;
    clima = setInterval(lluevenMacris,1000);
    
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

function cuantasRevive(){
    var cuantas;
    if (nivel < 6){
        cuantas = 0;
    } else {
        // 50% de que reviva
        var num = Math.random();
        if(num < 0.666){
            cuantas = 2;
        }else{
            if(num < 0.333){
                cuantas = 1;
            }else {
                cuantas = 0;
            }
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
        
        efectoMau[llovio] = setInterval(catBounce,1000);
        llovio++;
    } else {
        clearInterval(clima);
    }
    
}

function dropCoins(a,b){
    var coinId = Math.round(Math.random()*100000);
    $("#bolsadegatos").append('<div id="coin'+coinId+'" class="coin blinker"></div>');
    $("#coin"+coinId).css("left",a+"px");
    $("#coin"+coinId).css("top",b+"px");
    
    setTimeout(function(){$("#coin"+coinId).remove()},1000);
    monedas++;
    $("#cant").html(monedas);
    
}
function catBounce(){
    marginFirst -= penalidad;
    $("#efectos .efecto:nth-of-type(3)").css("margin-left",marginFirst + "%");
    pueblo++;
        $("#pueblo p:nth-of-type(1) span").html(pueblo);
        var despidos = pueblo * 643;
        $("#pueblo p:nth-of-type(2) span").html(despidos);
    barraVida-= danio;
    $("#barraVida .valor").css("width",barraVida+"%");
    
    if(barraVida <= 0){
        gacriVivos == 0;
        for(i=0;i<hasta;i++){
            clearInterval(efectoMau[i]);
        }
        pantalla();
    }
//      if ($("#efectos .efecto:nth-of-type(3)").offset().left < pueblo*200){
//        
//      }
    
}
function cargarMusica(){
    
    $("#infoLoader div").html("CARGANDO MÚSICA...");
    
    musica = new Howl({
        urls: ['audio/loop80kbps.mp3'],
        loop: true,
        volume: 0.5,
        onload: cargarSonidos,
        onrate: function(){
          console.debug("cambiooooo" + musica.rate)
      } 
    })
}


function cargarSonidos(){

    $("#infoLoader div").html("CARGANDO FX...");

    maullador = new Howl({
      urls: ['audio/sound-sprites.mp3'],
      sprite: {
        'mau0': [1000, 900],
        'mau1': [0965, 1000],
        'mau2': [2077, 1000],
        'sqek': [4244, 250],
        'sqak': [4500, 250],
        'pop': [4877, 250],
        'elisa0': [5200, 1900],
        'elisa1': [7300, 1450],
        'elisa2': [8900, 1650]
      },
      onload: function() {
        $("#infoLoader").css("display","none");
        $("#caja").css("display","block");
      }
    });
    
}
  
cargarMusica();