document.createElement('header');
document.createElement('main');
document.createElement('footer');
$(document).ready(function(){
    $('input, textarea').placeholder();
    var width = $(window).width();
    if (width <= 736){
        $('.contact, .feedback, .phone, .navFlex, .liMain').remove();
    }
    if (width <= 414){
        $('.textMain .insulation').remove();
        $('.lorem h2').after('<div class="insulation"></div>');
    }
});
