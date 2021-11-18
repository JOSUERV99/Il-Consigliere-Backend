import assert from 'assert';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render } from 'enzyme';
import CambioClave from './CambioClave';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import axios from 'axios';

jest.mock('axios', () => {
    return {
        post: jest.fn()
    };
});

configure({ adapter: new Adapter() });

describe('Unit Test handleSubmit()', () => {
    const mockedMouseEvent = {
        preventDefault: jest.fn()
    };
    it('Contraseña actual incorrecta', () =>  {
        const component = shallow(<CambioClave />); 
        component.setState({
            actual: '123456',
            nueva: 'new_password123456',
            confirmacion: 'new_password123456',
            redirect: false
        })
        component.find('.btn').simulate('click',mockedMouseEvent);
        expect(axios.post).not.toBeCalledWith('/usuario/cambiar_clave');
    });
    it('Nueva Contraseña difiere en la primer casilla', () => {
        const component = shallow(<CambioClave />); 
        component.setState({
            actual: '123456',
            nueva: '1111111111111',
            confirmacion: '222222222222222',
            redirect: false
        })
        component.find('.btn').simulate('click',mockedMouseEvent);
        expect(axios.post).not.toBeCalledWith('/usuario/verificar_clave');
    });
    it('Nueva Contraseña difiere en la segunda casilla', () =>  {
        const component = shallow(<CambioClave />); 
        component.setState({
            actual: '123456',
            nueva: '222222222222222',
            confirmacion: '1111111111111',
            redirect: false
        })
        component.find('.btn').simulate('click',mockedMouseEvent);
        expect(axios.post).not.toBeCalledWith('/usuario/cambiar_clave');
    });
});