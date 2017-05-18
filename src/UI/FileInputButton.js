import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from '../index.less';

const classModule = classNames.bind(styles); // using CSS Module should import 'classnames/bind'

export default class FileInputButton extends Component {
    static propTypes = {
        prefixIcon: PropTypes.string.isRequired,
        title: PropTypes.string,
        text: PropTypes.string,
        uploadSuccess: PropTypes.bool.isRequired,
        uploadFailedText: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            uploadSuccess: props.uploadSuccess,
            uploadFailedText: props.uploadFailedText,
            title: props.title,
            loading: false,
        };
        this.handleOpenFileDialog = this._handleOpenFileDialog.bind(this);
        this.handleChange = (e) => {
            e.preventDefault();
            // console.log(e.target.files);
            if (e.target.files.length > 0) {
                this.setState({ loading: true });
                e.persist(); // 保证异步事件e不会释放
                props.onChange(e).then(() => {
                    e.target.value = ''; // 清空input type='file'的值
                    this.setState({ loading: false });
                });
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        const newState = {};
        if (nextProps.uploadSuccess !== this.props.uploadSuccess) {
            newState.uploadSuccess = nextProps.uploadSuccess;
        }
        if (nextProps.title !== this.props.title) {
            newState.title = nextProps.title;
        }
        if (nextProps.uploadFailedText !== this.props.uploadFailedText) {
            newState.uploadFailedText = nextProps.uploadFailedText;
        }
        this.setState(newState);
    }

    _handleOpenFileDialog(e) {
        e.preventDefault();
        e.stopPropagation();
        const { loading } = this.state;
        if (!loading) {
            this.refs.fileInput.click();
        }
    }

    render() {
        const { prefixIcon, text } = this.props;
        const { uploadSuccess, uploadFailedText, title, loading } = this.state;
        const className = classModule('selectButton', 'button');
        return (
            <span className={className} title={loading ? '正在上传，请稍候...' : title} onMouseDown={this.handleOpenFileDialog}>
                <i className={loading ? 'fa fa-spinner fa-pulse' : `fa fa-${prefixIcon}`} aria-hidden="true">
                    {text ? <span>{text}</span> : null}
                </i>
                <ul className={styles.optionLayout} style={uploadSuccess ? { display: 'none' } : null}>
                    <em className={styles.arrow}><em /></em>
                    <div style={{ font: '12px/30px "Microsoft YaHei"', padding: '5px', width: '110px' }}>
                        <div style={{ color: 'red', fontSize: '20px' }}>
                            <i className="fa fa-exclamation-triangle" aria-hidden="true" />
                        </div>
                        { uploadFailedText }
                    </div>
                </ul>
                <input
                    type="file"
                    ref="fileInput"
                    style={{ display: 'none' }}
                    onChange={this.handleChange}
                />
            </span>
        );
    }
}
