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
    it('New password different from confirmation password', () => {
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
    it('Current password wrong', () =>  {
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
    it('Long password(300 chars)', () =>  {
        const component = shallow(<CambioClave />); 
        component.setState({
            actual: '123456',
            nueva: 'ryewT6Yzb8bI3T7i0clmeQjegRGXUtULkH99xiXgLq6aFggsGXL25oi562TRRtRynf029kV8PwL9PWM1FWtFNC4bDXfrPGBd1LGbaGz8yWzgw6rDUztWrvTBp4VHYev19w00DZkW9YTtEWhdnonMRxm00PibZ3Y5d5k4w1oEFdxMkxWcAT7v5QFMH4IaZTzD1Y6HApKXbZhktsi8npHJAGt5bZdQUsMGByDHW0NF7ZumaN6vp3j4GJYKUYbYIYZzOFkpceLjuOH5T6cwCW8UYb62n3g0aWetRwc3wataO3Si',
            confirmacion: 'ryewT6Yzb8bI3T7i0clmeQjegRGXUtULkH99xiXgLq6aFggsGXL25oi562TRRtRynf029kV8PwL9PWM1FWtFNC4bDXfrPGBd1LGbaGz8yWzgw6rDUztWrvTBp4VHYev19w00DZkW9YTtEWhdnonMRxm00PibZ3Y5d5k4w1oEFdxMkxWcAT7v5QFMH4IaZTzD1Y6HApKXbZhktsi8npHJAGt5bZdQUsMGByDHW0NF7ZumaN6vp3j4GJYKUYbYIYZzOFkpceLjuOH5T6cwCW8UYb62n3g0aWetRwc3wataO3Si',
            redirect: false
        })
        component.find('.btn').simulate('click',mockedMouseEvent);
        expect(axios.post).not.toBeCalledWith('/usuario/cambiar_clave');
    });
});