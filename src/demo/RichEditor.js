import React, { Component } from 'react';
import { RichEditor, EditorRecur } from '../index'; // development
// import { RichEditor, EditorRecur } from '../../lib/index'; // production
// import '../../dist/CFRichEditor.min.css'; // production
import styles from './RichEditor.less';
import request from '../Utils/request';

export default class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rawContentState: {},
        };
        this.handleChange = this._handleChange.bind(this);
        this.handleImageUpload = (file) => {
            const fileData = new FormData();
            fileData.append('fileDataFileName', file); // 后台接收的参数名（模拟 form 下 input[type='file'] 的 name）
            return request('http://192.168.1.245:8080/CFSP/workorders/uploadPicByFile', {
                method: 'POST',
                body: fileData
            });
            // 数据返回格式如下：
            // {
            //     success: 'true',
            //     file_path: 'http://cf953000.f3322.org:10101/CFSP/media/images/20170105/c9e09ec1-f582-413f-94f4-6c65a5d57ea6.jpg'
            // };
        };
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
            onImageUpload: this.handleImageUpload,
            importHtml: false,
            initialRawContent: JSON.parse(rowContentStorage),
            sniffer: { check: true, url: 'http://192.168.1.245:8080/CFSP/web/checkUrl', param: 'urlStr' }
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
