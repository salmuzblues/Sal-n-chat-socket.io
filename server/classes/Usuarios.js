/**
 *  A user has id, name and room chat
 * Note: id comes from Socket IO client.id
 * **/


class Usuarios {

    constructor() {
            this.personas = [];
        }
        // make methods

    addingUsers(id, nombre, sala) {
        let persona = { id, nombre, sala };
        this.personas.push(persona);

        // por el momento regresaremos todas personas.
        return this.personas.sala;
    }

    // get just one User

    getPersona(id) {
        // se le pone [0] para que solo sea un unico registro.
        let persona = this.personas.filter(user => user.id === id)[0];
        return persona;
    }

    // Aquí regresamos todas las personas
    getObtainAllPersonas() {
        return this.personas;
    }

    // conseguir los grupos de personas por sala
    getPersonasPorSala(sala) {
        let personaSala = this.personas.filter(persona => {
            return persona.sala === sala;
        });
        return personaSala;
    }

    borrarPersonaChat(id) {
        let personaBorrada = this.getPersona(id); // consigue a la persona que va a borrar
        this.personas = this.personas.filter(pers => pers.id !== id); // retira la persona que lo va a borrar.
        return personaBorrada;
    }
}




module.exports = {

    Usuarios
};