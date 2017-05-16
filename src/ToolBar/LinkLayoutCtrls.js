import React, { Component, PropTypes } from 'react';
import InputLayout from '../UI/InputLayout';
import request from '../Utils/request';

if (!window.regeneratorRuntime) {
    window.regeneratorRuntime = require('regenerator-runtime'); // 兼容最新的异步函数
}

export default class LinkLayoutCtrl extends Component {
    static propTypes = {
        addLink: PropTypes.func.isRequired,
        defaultURL: PropTypes.string,
        removeLink: PropTypes.func.isRequired,
        sniffer: PropTypes.object.isRequired,
        // 接收类型：object { check:bool(是否检查网址), url:'嗅探网址接口' ,param:'传入的地址参数名称' }
        // snifferApi:接口返回值{ vaild:true/false,response:'responseInfo' }有效true,无效false
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
        const newState = {};
        if (nextProps.defaultURL !== this.props.defaultURL) {
            newState.url = nextProps.defaultURL;
        }
        this.setState(newState);
    }

    _handleChange(e, key) {
        const newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    async _handleEnsure() {
        const { addLink, sniffer } = this.props;
        const { url } = this.state;
        // 探测 url 是否有效
        if (sniffer.check) {
            const { data, err } = await request(`${sniffer.url}?${sniffer.param}=${url}`);
            if (err) {
                throw new Error(err);
            }
            if (data && data.vaild) {
                addLink(url);
            } else {
                throw new Error(data.info);
            }
        } else {
            addLink(url);
        }
        this.setState({ url: '' }); // 清除input框
    }

    _handleFocus() {
        const { url } = this.state;
        const regExp = new RegExp('[a-zA-z]+://[^\s]*');
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
                background: '#ffffff'
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
                <section style={{ textAlign: 'left', font: '12px/25px "Microsoft YaHei",sans-serif', width: '370px' }}>
                    请在网络地址前面使用 http(s)://，例如：http://www.baidu.com。<br />
                    保证网址能有效！
                </section>
            </div>
        );
        return (
            <div style={styles.richEditorControls}>
                <InputLayout
                    title={defaultURL.trim() !== '' ? '解除链接' : '添加链接'}
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
