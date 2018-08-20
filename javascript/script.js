
/* ================================================================================== */
/* == VARIABLES ===================================================================== */
/* ================================================================================== */

$ = jQuery;
var self = this;

var pageImages = [];

/* ================================================================================== */
/* == READY ========================================================================= */
/* ================================================================================== */

$(document).ready(init);

// Inicializa lo que se encuentre en la página actual
function init() {

  getPageImages();

  if ( $('.enlace-icono').length > 0) {
    addLink();
  }

  initSlick();

  sanitize();

  toggleCollapsableIcon();
}

/* ================================================================================== */
/* == Sanitize ====================================================================== */
/* ================================================================================== */

function sanitize() {
  sanitizeHref();
  sanitizeSubLevel();
}

// Esto es para el carrusel de noticias del frontpage
function sanitizeHref() {
  $('.sanitize_href').each(function() {
    var href = $(this).attr('href');
    // console.log('Before ' + href);
    href = href.replace(/<!--[\s\S]*?-->/g, '').trim(); // Elimina comentarios
    // console.log('After ' + href);
    $(this).attr('href', href);
    $(this).removeClass('sanitize_href');
  });
}

// Esto es para la lista de descargas de las sodas
function sanitizeSubLevel() {
  $('.sub-level a').each(function() {
    var text = $(this).text();
    // console.log('Before ' + text);
    text = text.replace(/~\s*/g, '').trim();
    // console.log('After ' + text);
    $(this).text(text);
  });
}

/* ================================================================================== */
/* == SLICK ========================================================================= */
/* ================================================================================== */

//Slick es el pluin que hace que las imágenes se muestren en un carrusel.
function initSlick() {
  if( $('.slick__carousel').length > 0 ){
    $('.slick__carousel').slick({
      autoplay: false, // El carrusel avanza solo
      autoplaySpeed: 4000, // El carrusel avanza cada 4 segundos
      dots: false, // Despliega los indicadores de puntos debajo del carrusel
      prevArrow: '<button type="button" class="slick__left"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"><i class="accessible_elem">Anterior</i></span></button>',
      nextArrow: '<button type="button" class="slick__right"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"><i class="accessible_elem">Siguiente</i></span></button>'
    });
    $('.slick__carousel').css('opacity', '1.0');
  }
}

function addLink(){
  var links = $( '.enlace-icono' );
  links.each( function(){
    var linkURL = $( '.hidden', this ).text();
    $( 'a', this ).attr( 'href', linkURL );
  });
}

/* ================================================================================== */
/* == Collapsable Items ============================================================= */
/* ================================================================================== */

function toggleCollapsableIcon() {

  $('.panel').on('hide.bs.collapse', function (e) {
    var elementId = '#' + $( '#' + e.target.id ).attr( 'aria-labelledby' );
    var spanIcon = $( '.button_wrapper span', elementId );
    spanIcon.removeClass( 'glyphicon-minus' ).addClass( 'glyphicon-plus' );
  })

  $('.panel').on('show.bs.collapse', function (e) {
    var elementId = '#' + $( '#' + e.target.id ).attr( 'aria-labelledby' );
    var spanIcon = $( '.button_wrapper span', elementId );
    spanIcon.removeClass( 'glyphicon-plus' ).addClass( 'glyphicon-minus' );
  })
}


/* ================================================================================== */
/* == Images Items ============================================================= */
/* ================================================================================== */

//Función que llama un web service que devuelve las imágenes usadas por el carrusel en el nodo actual
function getPageImages() {
  //Extrae el path y el lenguaje
  var baseUrl = drupalSettings.path.baseUrl;
  var currentLanguage = drupalSettings.path.currentLanguage + '/';

  //Obtiene el id del nodo para formar el query
  if( drupalSettings.ucr['global-js'].nid ){
    //Si se hace click sobre la imagen, se llama a colorbox
    $( '.pagina__imagen-contenedor img' ).on( 'click', function(){
      openColorBox();
    });

    var ajaxQueryURL = baseUrl + currentLanguage + 'rest/imagenes/nodo/' + drupalSettings.ucr['global-js'].nid;

    //Se llama al Web Service
    $.ajax( ajaxQueryURL )
      .done(function( data ) {
        //se preprocesa los datos
        pageImages = data[0].field_imagenes.split( ',' );

        //Se construye el contenedor de las imágenes de colorbox
        
        var imagesContainer = $( '<div class="cbox_image_containter">' )
        //Agregado de imágenes (elementos <a>) al contenedor
        for( var i in pageImages ){
          pageImages[i] = pageImages[i].replace(/(?:\r\n|\r|\n)/g, '');
          imagesContainer.append( pageImages[i] );
        }

        $(document).bind('cbox_complete', function(){
          $( '#cboxPrevious,#cboxNext' ).insertAfter( '#cboxMiddleLeft' );
        });

        $(window).resize(function(){
          $.colorbox.resize();
        });

        $("#cboxContent").swipe( {
            //Generic swipe handler for all directions
            swipeLeft:function(event, direction, distance, duration, fingerCount) {
               $.colorbox.prev();
            },
            swipeRight:function(event, direction, distance, duration, fingerCount) {
               $.colorbox.next();
            },
            //Default is 75px, set to 0 for demo so any distance triggers swipe
           threshold:0
        });

        //inserción del contenedor al DOM

        $( 'article' ).append( imagesContainer );

      })
      .fail(function() {
      });
  }

}

//Función que abre el colorbox 
function openColorBox() {
  //obtiene el índice actual para abrir el colorbox desde el índice correcto
  var currentSlide = $('.slick__carousel').slick('slickCurrentSlide');
  $('.cbox_image_containter a').colorbox({rel:'gal',open:true,maxWidth:'95%', maxHeight:'95%', transition:"fade", indexStart:currentSlide });

}
