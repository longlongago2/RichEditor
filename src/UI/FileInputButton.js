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
        onChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            uploadSuccess: props.uploadSuccess,
            loading: false,
        };
        this.handleOpenFileDialog = this._handleOpenFileDialog.bind(this);
        this.handleChange = (e) => {
            e.preventDefault();
            this.setState({ loading: true });
            props.onChange(e).then(() => this.setState({ loading: false }));
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.uploadSuccess !== this.props.uploadSuccess) {
            this.setState({
                uploadSuccess: nextProps.uploadSuccess
            });
        }
    }

    _handleOpenFileDialog() {
        this.refs.fileInput.click();
    }

    render() {
        const { prefixIcon, title, text } = this.props;
        const { uploadSuccess, loading } = this.state;
        const className = classModule('selectButton', 'button');
        return (
            <span className={className} title={title} onMouseDown={this.handleOpenFileDialog}>
                <i className={loading ? 'fa fa-spinner fa-pulse' : `fa fa-${prefixIcon}`} aria-hidden="true">
                    {text ? <span>{text}</span> : null}
                </i>
                <ul className={styles.optionLayout} style={uploadSuccess ? { display: 'none' } : null}>
                    <em className={styles.arrow}><em /></em>
                    <div style={{ font: '12px/30px "Microsoft YaHei"', padding: '5px', width: '110px' }}>
                        <div style={{ color: 'red', fontSize: '20px' }}>
                            <i className="fa fa-exclamation-triangle" aria-hidden="true" />
                        </div>
                        图片上传失败！
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
