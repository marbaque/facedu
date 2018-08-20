
/* ================================================================================== */
/* == VARIABLES ===================================================================== */
/* ================================================================================== */

$ = jQuery;
var self = this;

/* ================================================================================== */
/* == READY ========================================================================= */
/* ================================================================================== */

$(document).ready(init);
// Inicializa lo que se encuentre en la página actual
function init() {
  
  //Facebook share code 
	var addFacebookShare = function(){
		(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.5";
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	};
	
	var timeOut = 0;	
	if( !$('.fb-share-button').length ){
		timeOut = 500;
	}
	
	setTimeout( function(){
		addFacebookShare();
	}, timeOut );
	
  
  //Twitter share code
	var addTwitterShare = function(){
		!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
	};
	
	timeOut = 0;	
	if( $('.twitter-share-button').length ){
		timeOut = 500;
	}
	
	setTimeout( function(){
		addTwitterShare();
	}, timeOut );
  
  initTooltip();
  
  if ( $('.galeria-albumes__item-youtube a').length > 0) {
    initYoutubePlayers();
  }
  
  if( $('.masonry-grid').length > 0) {
    initMasonry();
  }

  if( $('.n-galeria-album__galleria').length > 0 ){
 		initGalleriaAlbum($('.n-galeria-album__id')[0].textContent);
  }  

  if( $('#calendario').length > 0 ){
 		initCalendar();
  }
  
  //Cambiar de posicion una lista de noticias dentro de una pagina basica
  var noticiasRef = $('.n-pagina__referencias .noticias');
  if( noticiasRef.length > 0 ){
    noticiasRef.insertBefore( $( '.n-pagina__body' ) );
  }  
}

/* ================================================================================== */
/* == YOUTUBE THUMBNAILS ============================================================ */
/* ================================================================================== */

var x;

// Función que empotra los reproductores de Youtube
function initYoutubePlayers() {
  
  // Por cada link de Youtube
  $('.galeria-albumes__item-youtube a').each(function(index, value){
    
    // Padre del link
    var parent = $(this).parent();
    
    // Elemento a con el link a Youtube
    var link = $(this);
    
    // Link de Youtube
    var url = link[0].href;
    
    // Se obtiene el id de Youtube
    var regex = /v=(.+)(&|\n|\s|$)/i;
    var results = regex.exec(url);
    var youtubeId = results[1];

    var player = $('<iframe class="galeria-albumes__item-player" src = http://www.youtube.com/embed/' + youtubeId + ' type="text/html" frameborder="0"/>');
    parent.append(player);
    $(this).addClass('sr-only');
  });
}

/* ================================================================================== */
/* == TOOLTIPS ====================================================================== */
/* ================================================================================== */

// Inicializa los tooltips del Call to Action
function initTooltip() {
  $('.menu__cta-tooltip').tooltip(); 
}

/* ================================================================================== */
/* == MASONRY ======================================================================= */
/* ================================================================================== */

function initMasonry(){

  // Se pone el link del título también en la imagen
  // Esto no se puede hacer directamente en Drupal
  // por la configuración actual de las imágenes.
  if($('.galeria-albumes__item-img').length > 0) {
    $('.galeria-albumes__item').each(function() {
      var imgLink = $('.galeria-albumes__item-img', this)[0];
      var titleLink = $('.galeria-albumes__item-titulo a', this)[0];
      imgLink.href = titleLink.href;
    });
  }
  
  // Se inicializa Masonry
  var $grid = $('.masonry-grid').masonry({
    itemSelector: '.masonry-grid-item',
    percentPosition: true,
    gutter: 10
  });
  
  // Cuando cargan todas las imágenes, 
  // se le pide a Masonry que reorganice todo
  $grid.imagesLoaded().progress( function() {
    $grid.masonry('layout');
  });
}

/* ================================================================================== */
/* == CALENDAR ====================================================================== */
/* ================================================================================== */

// TODO Documentar y probar el calendario.

function initCalendar(){
  $('#calendario').text('');

	$.ajax({
	  url: Drupal.url('rest/calendario/'),
	}).done(function( data ) {
    for(var i = 0; i < data.length; ++i) {
      // TODO Mostrar la hora en un formato más amigable
      data[i].allDay = true; // Para que cada evento no muestre la hora, porque se ve rara.
      
    }
		$('#calendario').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,basicWeek,basicDay',
			},
      lang: 'es',
			editable: true,
			fixedWeekCount: false,
			eventLimit: true, // allow "more" link when too many events
			events: data
		});
		var left = $('#calendario .fc-toolbar .fc-left');
		$('#calendario .fc-toolbar .fc-right').after( left );
	});
}

/* ================================================================================== */
/* == GALLERIA ====================================================================== */
/* ================================================================================== */

var title;
var description;

//Esta función se encarga de realizar la llamada al web service y hacer un preprocesado
//de datos antes de llamar al plugin de galleria.
function initGalleriaAlbum(nodeReference){
  title = $('.n-galeria-album__title');
  description = $('.n-galeria-album__description');
  //Llama al Web Service
  $.ajax({
	  url: Drupal.url('rest/imagenes/' + nodeReference)
	}).done(function(json) {
    // Se crea el array que se le va a pasar a Galleria
    var galleriaData = new Array();
  
    // Se pone la información en un Array que se le pasará a Galleria
    for(var i in json) {
      var e = new Object();
      e.image = /\"(.*)\"/.exec(json[i].imagen)[1];
      e.titulo = json[i].titulo;
      e.descripcion = json[i].descripcion;
      galleriaData.push(e);
    }
    
    initGalleriaAlbumCallback('.n-galeria-album__galleria', galleriaData);
  });
}


//Función que se encarga de inicializar el plugin de Galleria con el dato que llega en galleriaData.
function initGalleriaAlbumCallback(selector, galleriaData) {
  // Se crea la galería
  Galleria.run(selector, {

    debug: false, // Debugging
    dataSource: galleriaData, // Origen de las imágenes
    imageCrop: false, // No permite cortar imágenes, solo rescale
    maxScaleRatio: 2, // Límite de upscale
    transition: 'fadeslide', // Tipo de transición
    swipe: 'auto', // Permite swipe de acuerdo a dispositivo
    preload: 0, // Cantidad de imágenes a precargar
    carouselSteps: 1, // Cantidad de imágenes por avanzar
    carouselSpeed: 500, // Duración de la animación
    autoplay: 3000, // Cambio cada 3 segundos
    layerFollow: false, // Se mantiene el mismo tamaño de la galería
    thumbnails: 'lazy', // Se cargan los thumbnails poco a poco

    // Extenciones al funcionamiento de Galleria
    extend: function(options) {

      var gallery = this; // instancia de Galleria

      // Funciones del teclado
      this.attachKeyboard({
        left: function(){
          gallery.prev();
        },
        right:function(){
          gallery.next();
        }
      });
      
      // Botón de play
      var pausePlayButton = 
        $( '<div class="pause_play_btn"><span class="glyphicon glyphicon-pause"></span></div>' );
      
      // Botón de fullscreen
      var fullscreenButton = 
        $( '<div class="fullscreen_btn"><span class="glyphicon glyphicon-fullscreen"></span></div>' );
        
      // Click Listener del botón de play
      pausePlayButton.click( function(){
        if( $( 'span', pausePlayButton ).hasClass( 'glyphicon-pause' ) ){
          gallery.pause();
          $( 'span', pausePlayButton ).removeClass( 'glyphicon-pause' ).addClass( 'glyphicon-play' );
        }
        else{
          gallery.play();
          $( 'span', pausePlayButton ).removeClass( 'glyphicon-play' ).addClass( 'glyphicon-pause' );
        }
      });
      
      // Click Listener de fullscreen
      fullscreenButton.click( function(){
        gallery.toggleFullscreen();
      });
      
      // Se añaden los botones
      $( '.galleria-container' ).append( pausePlayButton );
      $( '.galleria-container' ).append( fullscreenButton );
      
      // Cuando se detiene el auto play 
      $( '.galleria-image-nav-right,.galleria-image-nav-left' ).click( function(){
        $( 'span', pausePlayButton ).removeClass( 'glyphicon-pause' ).addClass( 'glyphicon-play' );
      } );
      $('.galleria-stage').on('touchstart', function( e ){
        $( 'span', pausePlayButton ).removeClass( 'glyphicon-pause' ).addClass( 'glyphicon-play' );
      });
      
      // 
      gallery.bind( 'loadstart', function(e){
        title.fadeOut('fast', function() {
          title.text(e.galleriaData.titulo);
          title.fadeIn('fast');
        });
        description.fadeOut('fast', function() {
          description.text(e.galleriaData.descripcion);
          description.fadeIn('fast');
        });    
      });
      
      // Cuando se entra a fullscreen
      gallery.bind('fullscreen_enter', function( e ){
        $( '#galleria' ).addClass( 'fullscreen' );
      });
      
      // Cuando se sale de fullscreen
      gallery.bind('fullscreen_exit', function( e ){
        $( '#galleria' ).removeClass( 'fullscreen' );
      });
        
     }
		});
    
    // Cuando Galleria está cargado
    Galleria.ready(function(){
        this.lazyLoadChunks(3); // Carga thumbnails de 3 en 3
    });
}

