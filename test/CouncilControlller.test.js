const { update } = require("../server/controllers/CouncilController");
const app = require("../server/server.js");

var chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Integration testing Consejos.js', () => {
    var counselInfo, counselId;
    beforeAll(() => {

        counselId = "123";

        counselInfo = {
            id_tiposesion: 1,
            fecha: "2021-11-10",
            hora: "08:00AM",
            limite_solicitud: "2021-11-9",
            lugar: "Zoom",
            finalizado: false
        };
    });

    it(`Integration Test with Wrong Counsel Id`, () => {

        chai.request(app)
            .put(`/consejo/${counselId}`)
            .send(counselInfo)
            .end((err, res) => {
                expect(err).toBe(null);
                res.should.have.status(500);
            });

    });

    it(`Integration Test with Invalid Date`, () => {
        counselInfo.fecha = "2021-11-31";

        chai.request(app)
            .put(`/consejo/${counselId}`)
            .send(counselInfo)
            .end((err, res) => {
                expect(err).toBe(null);
                res.should.have.status(500);
            });
    });

});