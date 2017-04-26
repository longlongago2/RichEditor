import React, { Component, PropTypes } from 'react';

export default class AtomicImage extends Component {
    static propTypes = {
        src: PropTypes.string.isRequired,
        width: PropTypes.number,
        height: PropTypes.number,
        uuid: PropTypes.string.isRequired,
        readOnly: PropTypes.bool.isRequired,
        onEdit: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            showToolBar: false,
            imgWidth: '',
            imgHeight: '',
            ratioLock: true,
        };
        this.handleClick = this._handleClick.bind(this);
        this.handleInputChange = this._handleInputChange.bind(this);
        this.handleEnsure = this._handleEnsure.bind(this);
        this.handleLock = this._handleLock.bind(this);
        this.preventDefault = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.target.focus();
        };
    }

    _handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const { readOnly, onEdit, src, uuid } = this.props;
        const { showToolBar } = this.state;
        if (!readOnly) {
            this.setState({
                showToolBar: !showToolBar,
                imgWidth: e.target.width,
                imgHeight: e.target.height
            });
            onEdit(uuid, src, e.target.width, e.target.height, !showToolBar);
        }
    }

    _handleInputChange(e, name) {
        const { imgWidth, imgHeight, ratioLock } = this.state;
        const newState = {};
        if (isNaN(e.target.value)) {
            return;
        }
        if (ratioLock) {
            if (name === 'imgWidth') {
                newState[name] = parseFloat(e.target.value);
                newState.imgHeight = parseFloat(e.target.value * imgHeight) / parseFloat(imgWidth);
            }
            if (name === 'imgHeight') {
                newState.imgWidth = parseFloat(e.target.value * imgWidth) / parseFloat(imgHeight);
                newState[name] = parseFloat(e.target.value);
            }
        } else {
            newState[name] = e.target.value;
        }
        this.setState(newState);
    }

    _handleEnsure(e) {
        e.preventDefault();
        e.stopPropagation();
        const { imgWidth, imgHeight, showToolBar } = this.state;
        const { src, onEdit, uuid } = this.props;
        onEdit(uuid, src, imgWidth, imgHeight, !showToolBar);
        this.setState({ showToolBar: false });
    }

    _handleLock() {
        const { ratioLock } = this.state;
        this.setState({ ratioLock: !ratioLock });
    }

    render() {
        const { src, width, height, readOnly } = this.props;
        const { showToolBar, imgWidth, imgHeight, ratioLock } = this.state;
        const styles = {
            media: {
                margin: 0,
                padding: 0,
                textAlign: 'center',
                position: 'relative',
                userSelect: 'none',
            },
            toolbarLayout: {
                position: 'absolute',
                bottom: '-160px',
                left: '50%',
                width: '225px',
                height: '170px',
                zIndex: '9999',
            },
            toolbar: {
                position: 'absolute',
                bottom: 0,
                left: '-50%',
                border: '1px solid #cccccc',
                width: '225px',
                height: '170px',
                background: '#ffffff',
                borderRadius: '5px',
                padding: '10px',
                boxSizing: 'border-box',
                overflow: 'hidden',
            },
            input: {
                boxSizing: 'border-box',
                width: '80%',
                border: 0,
                borderBottom: '1px solid #1E90FF',
                outline: 0,
                padding: '0 5px',
                fontSize: '15px',
                lineHeight: '20px',
                background: '#ffffff',
            },
            button: {
                border: '1px solid #1E90FF',
                background: 'inherit',
                borderRadius: '5px',
                color: '#1E90FF',
                width: '60px',
                height: 'auto',
                font: '12px/25px sans-serif',
                outline: 'none',
            },
            img: {
                boxShadow: '0 0 5px #000',
                cursor: readOnly ? 'default' : 'pointer',
            }
        };
        return (
            <div style={styles.media}>
                <div style={{ overflow: 'hidden' }}>
                    <img
                        style={styles.img}
                        src={src}
                        width={width}
                        height={height}
                        title={src}
                        onMouseDown={this.handleClick}
                    />
                </div>
                {
                    showToolBar ?
                        <div style={styles.toolbarLayout} onMouseDown={this.preventDefault}>
                            <div style={styles.toolbar}>
                                <div>
                                    <span>设置图片大小</span>
                                    <span
                                        style={{ float: 'right', cursor: 'pointer' }}
                                        title={ratioLock ? '解除纵横比' : '锁定纵横比'}
                                    >
                                        <i
                                            className={`fa fa-${ratioLock ? 'retweet' : 'level-up'}`}
                                            aria-hidden="true"
                                            onClick={this.handleLock}
                                        />
                                    </span>
                                </div>
                                <div style={{ padding: '5px 0' }}>
                                    <span style={{ font: '12px/20px "Microsoft YaHei"' }}>宽度：</span>
                                    <input
                                        style={styles.input} value={imgWidth} type="text"
                                        onChange={e => this.handleInputChange(e, 'imgWidth')}
                                    />
                                </div>
                                <div style={{ padding: '5px 0' }}>
                                    <span style={{ font: '12px/20px "Microsoft YaHei"' }}>高度：</span>
                                    <input
                                        style={styles.input} value={imgHeight} type="text"
                                        onChange={e => this.handleInputChange(e, 'imgHeight')}
                                    />
                                </div>
                                <div style={{ padding: '5px 0' }}>
                                    <button
                                        style={styles.button}
                                        onClick={this.handleEnsure}
                                    >
                                        确定
                                    </button>
                                </div>
                            </div>
                        </div>
                        : null
                }
            </div>
        );
    }
}
