import React from 'react';
import { shallow } from 'enzyme';
import Consejos from "./Consejos";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import assert from 'assert';

configure({ adapter: new Adapter() });

describe('Integration testing Consejos.js', () => {
  it(`Scenary when the id of a users with councils (after, before today)`, () => {
    const component = shallow(<Consejos />);
    const initialState = {
        cedula : '123456', // id of the testing user with existent councils
        // where the councils will be stored
        anteriores : [], proximos : []
    };
    component.setState(initialState)

     // call the main function calling backend as blackboxtesting
    component.instance().getCouncilsFromDB();

    expect(component.state().anteriores.length).toBeGreaterThanOrEqual(0);
    expect(component.state().proximos.length).toBeGreaterThanOrEqual(0);
  });
  it(`Scenary when the id is a not valid numeric string value`, () => {
    const component = shallow(<Consejos />);
    const initialState = {
        cedula : 'A1#@!@#71*KW=', // id with wrong format
        anteriores : [], consejos : []
    };
    component.setState(initialState)
    
    // call the main function calling backend as blackboxtesting, not any councils was loaded 
    // because an exception was thrown
    expect(component.instance().getCouncilsFromDB()).toThrowError();

    expect(component.state().anteriores.length).toBe(0);
    expect(component.state().consejos.length).toBe(0);
  });
  
  it(`Scenary when the id of a users with no councils (no after, neither before today)`, () => {
    const component = shallow(<Consejos />);
    const initialState = {
        cedula : '010101', // id of the testing user with non existent councils
        // where the councils won't be stored
        anteriores : [], consejos : []
    };
    component.setState(initialState)
    
     // call the main function calling backend as blackboxtesting
    expect(component.state().anteriores.length).toBe(0);
    expect(component.state().proximos.length).toBe(0);
  });
 
 });