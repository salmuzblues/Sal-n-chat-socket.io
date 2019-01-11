// retrieve some params from web 

var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');
// referencias JQuery de la clase chat.html en el tag <ul> 
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
// Funciones para renderizar usuarios.
function renderizarUsuarios(personas) { // [{}, {}, {}] asi se ve la lista en la console of inspection
    console.log(personas); // para poder ver la lista de personas 

    var html = '';
    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + ' </span></a>';
    html += '</li>';
    // this list <li> we are going to generate all the users by one for 

    for (var i = 0; i < personas.length; i++) {

        html += '<li>';
        html += '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';

    }
    // ahora vamos por medio de Jquery, que realice los cambios en el html. 
    divUsuarios.html(html);
}

function renderizarMensaje(mensaje, yo) {
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    var adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        html += ' <li class="reverse">';
        html += ' <div class="chat-content">';
        html += '      <h5>' + mensaje.nombre + '</h5>';
        html += '     <div class="box bg-light-inverse">' + mensaje.message + '</div>';
        html += '     </div>';
        html += '     <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += ' <div class="chat-time">' + hora + '</div>';
        html += '  </li>';
    } else {
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user"/></div>';
        }
        html += '<div class="chat-content">';
        html += '    <h5>' + mensaje.nombre + '</h5>';
        html += '    <div class="box bg-light-' + adminClass + '">' + mensaje.message + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}
// this is for scrolling the window when a message appears. 
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}
// Listeners, here if someone to click some users, you can send a private message
// but first we are generating by id. 
// 'a' == is the tag link // ancordata 
divUsuarios.on('click', 'a', function() {
    // retrieve id 
    var id = $(this).data('id');
    // this for fixing click on whatever position
    if (id) {
        console.log(id);
    }

});
// create listerner for making  changes to submit. 
formEnviar.on('submit', function(e) {
    e.preventDefault();
    // esto es para evitar que se mande mensajes vacios. 
    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    // Enviar información this is yo 
    socket.emit('crearMensaje', {
        nombre: nombre,
        message: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderizarMensaje(mensaje, true);
        scrollBottom();
    });

    // console.log(txtMensaje.val());
});