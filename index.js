import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Demo from './demo/RichEditor';

const renderApp = (Component) => {
    render(
        <AppContainer>
            <Component />
        </AppContainer>,
        document.getElementById('root')
    );
};

renderApp(Demo);

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./demo/RichEditor.js', () => {
        renderApp(require('./demo/RichEditor'));
    });
}

