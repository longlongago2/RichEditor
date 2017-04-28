import React, { Component, PropTypes } from 'react';
import InputLayout from '../UI/InputLayout';
import request from '../Utils/request';

export default class AtomicLayoutCtrl extends Component {
    static propTypes = {
        insertAtomic: PropTypes.func.isRequired,
        sniffer: PropTypes.object.isRequired,
        // snifferApi:接口返回值{ vaild:true/false,response:'responseInfo' }有效true,无效false
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

    async _handleEnsure() {
        const { insertAtomic, sniffer } = this.props;
        const { url } = this.state;
        let atomicType;
        const imageRegExp = new RegExp('[^\s]+\.(jpg|png|gif)');
        const audioRegExp = new RegExp('[^\s]+\.(mp3|wav|ogg)');
        const videoRegExp = new RegExp('[^\s]+\.(ogg|mp4|mkv)');
        if (sniffer.check) {
            // 探测 url 是否有效
            const { data, err } = await request(`${sniffer.url}?${sniffer.param}=${url}`);
            if (err) {
                throw new Error(err);
            }
            if (data && data.vaild) {
                if (imageRegExp.test(url)) {
                    atomicType = 'image';
                }
                if (audioRegExp.test(url)) {
                    atomicType = 'audio';
                }
                if (videoRegExp.test(url)) {
                    atomicType = 'video';
                }
                insertAtomic(url, atomicType);
            } else {
                throw new Error(data.info);
            }
        } else {
            if (imageRegExp.test(url)) {
                atomicType = 'image';
            }
            if (audioRegExp.test(url)) {
                atomicType = 'audio';
            }
            if (videoRegExp.test(url)) {
                atomicType = 'video';
            }
            insertAtomic(url, atomicType);
        }
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
                background: '#ffffff',
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
                    style={{ textAlign: 'left', font: '12px/25px "Microsoft YaHei",sans-serif', width: '420px' }}
                >
                    1.目前我们只保证支持 <b>才丰软件服务平台</b> 上传的 <b>音频</b>、<b>视频</b>、<b>图片</b> 等多媒体文件服务！<br />
                    2.图片支持外网的范围较广，可以尝试百度图片的地址链接<br />
                    3.使用外网的图片时，请注意版权问题，相关规则以网站规则为依据！
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
