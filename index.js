import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Demo from './demo/demo';

const domRender = (Component) => {
    render(
        <AppContainer>
            <Component />
        </AppContainer>,
        document.getElementById('root')
    );
};

domRender(Demo);

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./demo/demo.js', () => {
        domRender(Demo);
    });
}

