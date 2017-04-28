import React, { Component } from 'react';
import { RichEditor, EditorRecur } from '../index'; // development
// import { RichEditor, EditorRecur } from '../../lib/index'; // production
// import '../../dist/CFRichEditor.css'; // production
import styles from './RichEditor.less';

export default class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rawContentState: {},
        };
        this.handleChange = this._handleChange.bind(this);
    }

    _handleChange(html, rawContentState) {
        // console.log(rawContentState);
        // console.log(html);
        this.setState({ rawContentState });
    }

    render() {
        const { rawContentState } = this.state;
        const sessionKey = window.location.href.split('?')[0]; // session名称
        const rowContentStorage = sessionStorage.getItem(sessionKey);
        const richEditorProps = {
            onChange: this.handleChange,
            importHtml: false,
            initialRawContent: JSON.parse(rowContentStorage),
            sniffer: { check: true, url: 'http://192.168.1.49:8080/CFSP/web/checkUrl', param: 'urlStr' }
        };
        const editorRecurProps = {
            rawContentState,
        };
        return (
            <div className={styles.container}>
                <h2>RichEditor base on draft.js! ——Flex布局</h2>
                <RichEditor {...richEditorProps} />
                <h2>实时预览</h2>
                <EditorRecur {...editorRecurProps} />
            </div>
        );
    }
}
