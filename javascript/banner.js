
/* ================================================================================== */
/* == VARIABLES ===================================================================== */
/* ================================================================================== */

$ = jQuery;
var self = this;

/* ================================================================================== */
/* == READY ========================================================================= */
/* ================================================================================== */

$(document).ready(init);

// Cambia el banner si es necesario
function init() {
    var hidden = $('.change_banner');
    var a = $('a', hidden);
    var banner = a.text().toLowerCase().trim();
    if (banner == '') {
        banner = 'banner01';
    }

    //cambio de clase para que la imagen pueda ser cambiada.
    var className = 'header__sitio-' + banner;
    $('.header__sitio').removeClass('header__sitio-banner01').addClass(className).fadeTo('fast', 1.0);
    hidden.remove();

    var languageElements = $('.language-list a');

    //Script para limitar a 3 los caracteres de cambio de lenguaje dentro del banner
    if( languageElements.length ){
        languageElements.each( function(){
			$( this ).attr("title",$( this ).text());
            $( this ).text( $( this ).text().substring(0,3) );
        });
    }
    
}