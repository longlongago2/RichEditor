import React, { Component, PropTypes } from 'react';
import InputLayout from '../UI/InputLayout';

export default class LinkLayoutCtrl extends Component {
    static propTypes = {
        addLink: PropTypes.func.isRequired,
        defaultURL: PropTypes.string,
        removeLink: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            url: props.defaultURL ? props.defaultURL : '',
        };
        this.handleChange = this._handleChange.bind(this);
        this.handleEnsure = this._handleEnsure.bind(this);
        this.handleFocus = this._handleFocus.bind(this);
        this.handleClick = this._handleClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultURL !== this.props.defaultURL) {
            this.setState({ url: nextProps.defaultURL });
        }
    }

    _handleChange(e, key) {
        const newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    _handleEnsure() {
        const { addLink } = this.props;
        const { url } = this.state;
        addLink(url);
        this.setState({ url: '' }); // 清除input框
    }

    _handleFocus() {
        const { url } = this.state;
        const regExp = new RegExp('^((https|http|ftp)?://)');
        if (!regExp.test(url)) {
            this.setState({ url: 'http://' });
        }
    }

    _handleClick(e, isActive) {
        const { removeLink } = this.props;
        if (isActive) {
            e.preventDefault();
            removeLink();
        }
    }

    render() {
        const { defaultURL } = this.props;
        const { url } = this.state;
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
                padding: '0 5px',
                fontSize: '15px',
                lineHeight: '20px',
            }
        };
        const body = (
            <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'block', margin: '20px 0' }}>
                    <input
                        style={styles.input}
                        type="text" placeholder="网址"
                        value={url}
                        onFocus={this.handleFocus}
                        onChange={e => this.handleChange(e, 'url')}
                    />
                </div>
                <section style={{ textAlign: 'left', font: '12px/25px "Microsoft YaHei",sans-serif' }}>
                    请在网络地址前面使用 http(s)://，例如：http://www.baidu.com。<br />
                    保证网址能有效！
                </section>
            </div>
        );
        return (
            <div style={styles.richEditorControls}>
                <InputLayout
                    title={defaultURL.trim() !== '' ? '解除链接' : '插入链接'}
                    isActive={defaultURL.trim() !== ''}
                    prefixIcon={defaultURL.trim() !== '' ? 'chain-broken' : 'link'}
                    body={body}
                    ensure={this.handleEnsure}
                    onClick={this.handleClick}
                />
            </div>
        );
    }
}
