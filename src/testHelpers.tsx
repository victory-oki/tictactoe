
import React from "react";
import TestRenderer from 'react-test-renderer';
import * as ShallowRenderer from 'react-test-renderer/shallow';

import { BrowserRouter as Router } from 'react-router-dom';
import { store } from "./store";
import { Provider } from "react-redux";

export const testSnapshot = (component: JSX.Element, shallow = false) => {
    const tree = shallow ?
      ShallowRenderer.createRenderer().render(component) :
      TestRenderer.create(component).toJSON()
    ;
    expect(tree).toMatchSnapshot();
};


export const wrapContext = (ui: JSX.Element) => (
    <Router>
        <Provider store={store}>
            {ui}
        </Provider>
    </Router>
)
