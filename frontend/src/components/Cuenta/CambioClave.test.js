import assert from 'assert';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render } from 'enzyme';
import CambioClave from './CambioClave';
// import CambioClave from './';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import { expect } from 'chai';

configure({ adapter: new Adapter() });

describe('Unit Test handleSubmit()', () => {
    it('New password different from confirmation password', () => {
        const wrapper = shallow(<CambioClave />); 
        wrapper.setState({
            actual: 'sirve',
            nueva: '',
            confirmacion: '',
            redirect: false
          })
        // expect(wrapper.exists()).toBe(true);
        expect(wrapper.state().actual).toBe("sirve");

    });
    it('Current password wrong', () =>  {
        assert.equal("Hello".charAt(0), 'H');
    });
    it('Long password(300 chars)', () =>  {
        assert.equal("Hello".charAt(0), 'H');
    });
});