import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import DemoApp from './src/demo/RichEditor';

const renderApp = (Component) => {
    render(
        <AppContainer>
            <Component />
        </AppContainer>,
        document.getElementById('root')
    );
};

renderApp(DemoApp);

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./src/demo/RichEditor', () => {
        renderApp(DemoApp);
    });
}

