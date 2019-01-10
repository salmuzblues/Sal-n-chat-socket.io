var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre' || 'sala')) {
    window.location = 'index.html'; // redireccionando si sale el error
    throw new Error('El nombre y sala son necesario');
}
// vamos a recolectar la información de params
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};


socket.on('connect', function() {
    console.log('Conectado al servidor');
    // para emitir un mensaje de que se conecto el usuario
    /** FRONT emits to SERVER **/
    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados', resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

/*
// Enviar información
socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});
*/
// Escuchar información del administrador de quien abandono el chat 
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
});

// escuchar cambios de usuarios. 
// cuando un usuario entra o sale del chat.
socket.on('listaPersona', (personas) => {
    console.log(personas);
});
// mensajes privados 
socket.on('mensajePrivado', (mensaje) => {
    console.log('Mensaje Privado', mensaje);
});