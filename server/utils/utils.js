// constrir una función para poder mandar mensajes a un persona.

const crearMensaje = (nombre, message) => {
    return {
        nombre,
        message,
        fecha: new Date().getTime()
    };
};

module.exports = {
    crearMensaje
};