const { io } = require('../server');
const { crearMensaje } = require('../utils/utils');
const { Usuarios } = require('../classes/Usuarios');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                message: 'El nombre y la sala son necesarios'
            });
        }
        // vamos a unir  a personas en una sala. 
        client.join(data.sala);
        // guardar en el array
        usuarios.addingUsers(client.id, data.nombre, data.sala);
        //vamos a emit un evento para que todos puedan ver las lista de las personas.
        // cuando una persona in or out of the room chat.  
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${ data.nombre } se unió`));
        callback(usuarios.getPersonasPorSala(data.sala));
    });
    // escuchar el mensaje emitido por el cliente para todos 
    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.message);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });

    // con esta función nos salvamos de la duplicación cuando refrescan la Web. 
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersonaChat(client.id);
        //vamos a emitir a todos los usuarios la persona que salio. para que lo escuche 
        // los clientes.  
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', {
            nombre: 'Administrador',
            message: `${ personaBorrada.nombre } abandono el chat`,
            fecha: new Date().getTime()
        });

        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    // listner a private message. 
    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.idUser).emit('mensajePrivado', crearMensaje(persona.nombre, data.message));
    });
});