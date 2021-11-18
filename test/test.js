// let chai = require('chai');
// let chaiHttp = require('chai-http');
// var assert = require('assert');

const expect = require('chai').expect;
const nock = require('nock');
let should = chai.should();
require('dotenv').config();

// chai.use(chaiHttp);

const db = require('../database/models');

const body_1 = {
    "cedula": "44444",
    "nombre": "Luis", 
    "apellido": "Fuentes", 
    "segundo_apellido": "Gonzalez", 
    "clave": "1234", 
    "id_tipo_convocado": 1
}

const body_2 = {
    "cedula": "44444",
    "nombre": "Luis Mariano", 
    "apellido": "Fuentes", 
    "segundo_apellido": "Gonzalez", 
    "clave": "1234", 
    "id_tipo_convocado": 1
}

const body_3 = {
    "cedula": "144444",
    "nombre": "Luis Mariano", 
    "apellido": "Fontanera", 
    "segundo_apellido": "Gonzalez", 
    "clave": "1234", 
    "id_tipo_convocado": 1
}

describe('Modificar usuario',  () => {
    const ced = 44444;

    it('Escenario 1: Cambio de nombre', async () => {
        request
        .put(`/usuario/${ced}`)
        .send(body_1)
        .expect(200)
        .end(done);
    });
    it('Escenario 2: Cambio de apellido', async () => {
        request
        .put(`/usuario/${ced}`)
        .send(body_2)
        .expect(200)
        .end(done);
    });

    it('Escenario 3: Cambio de cedula', async () => {
        request
        .put(`/usuario/${ced}`)
        .send(body_3)
        .expect(200)
        .end(done);
    });
    
});
