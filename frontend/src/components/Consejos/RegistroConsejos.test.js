import assert from 'assert';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import RegistroConsejos from "./RegistroConsejos";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import axios from "axios";
import { getTodaysDate } from '../../helpers/dates';

configure({ adapter: new Adapter() });


// jest.mock('axios', () => {
//     return {
//         post: jest.fn(),
//     };
// });

describe('Testing RegistroConsejos.js', () => {
    it('Scenary when the consecutive value is not given', () => {
        const component = shallow(<RegistroConsejos />),
        dummyState = {
            cedula: '123456',
            consecutivo : null,
            id_estado_punto: 1,
            puntos : ['Organizacion de actividades semana siguiente']
        };

        const getSpy  = jest.spyOn(axios, 'get'), postSpy = jest.spyOn(axios, 'post');

        component.setState(dummyState)
        component.instance().handleSubmit(new MouseEvent("click", {}));

        expect(getSpy).toHaveBeenCalledWith(`/consejo/${dummyState.consecutivo}`);
        expect(postSpy).toHaveBeenCalledTimes(0);
    });

    it('Scenary where the council date is before the final date', () => {
        const component = shallow(<RegistroConsejos />), dummyState = {
            cedula: '123456',
            consecutivo : 1,
            id_estado_punto: 1,
            fecha : getTodaysDate(),
            puntos : ['Organizacion de actividades semana siguiente']
        };

        const getSpy  = jest.spyOn(axios, 'get'), postSpy = jest.spyOn(axios, 'post');

        component.setState(dummyState)
        component.instance().handleSubmit(new MouseEvent("click", {}));

        expect(getSpy).toHaveBeenCalledWith(`/consejo/${dummyState.consecutivo}`);
        expect(postSpy).toHaveBeenCalled();
    });

    it('Scenary where the council points are not given', () => {
        const component = shallow(<RegistroConsejos />), dummyState = {
            cedula: '123456',
            consecutivo : 1,
            id_estado_punto: 1,
            fecha : getTodaysDate(),
            puntos : []
        };

        const getSpy  = jest.spyOn(axios, 'get'), postSpy = jest.spyOn(axios, 'post');

        component.setState(dummyState)
        component.instance().handleSubmit(new MouseEvent("click", {}));

        expect(getSpy).toHaveBeenCalledWith(`/consejo/${dummyState.consecutivo}`);
        expect(postSpy).toHaveBeenCalled();
    });
});