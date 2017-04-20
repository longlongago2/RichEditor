import React, { Component, PropTypes } from 'react';
import InputLayout from '../UI/InputLayout';

export default class AtomicLayoutCtrl extends Component {
    static propTypes = {
        insertAtomic: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            url: '',
        };
        this.handleChange = this._handleChange.bind(this);
        this.handleEnsure = this._handleEnsure.bind(this);
    }

    _handleChange(e, url) {
        const newState = {};
        newState[url] = e.target.value;
        this.setState(newState);
    }

    _handleEnsure() {
        const { insertAtomic } = this.props;
        const { url } = this.state;
        const atomicType = 'image';
        insertAtomic(url, atomicType);
        this.setState({ url: '' }); // 清除input框
    }

    render() {
        const styles = {
            richEditorControls: {
                userSelect: 'none',
                display: 'inline',
            },
            input: {
                boxSizing: 'border-box',
                width: '100%',
                border: 0,
                borderBottom: '2px solid #1E90FF',
                outline: 0,
                padding: '5px',
                fontSize: '15px',
                lineHeight: '20px',
            }
        };
        const body = (
            <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'block', margin: '20px 0' }}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="地址"
                        onChange={e => this.handleChange(e, 'url')}
                    />
                </div>
                <section
                    style={{ textAlign: 'left', font: '12px/25px "Microsoft YaHei",sans-serif', maxWidth: '420px' }}
                >
                    我们支持 MP3、MP4、JPEG 格式的文件地址服务，请保证多媒体文件地址真实有效，否则无法正常显示！<br />
                    请注意版权问题，相关规则以网站规则为依据！
                </section>
            </div>
        );
        return (
            <div style={styles.richEditorControls}>
                <InputLayout
                    isActive={false}
                    prefixIcon="film"
                    title={'添加多媒体'}
                    body={body}
                    ensure={this.handleEnsure}
                />
            </div>
        );
    }
}
