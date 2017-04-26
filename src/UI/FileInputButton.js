import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from '../index.less';

const classModule = classNames.bind(styles); // using CSS Module should import 'classnames/bind'

export default class FileInputButton extends Component {
    static propTypes = {
        prefixIcon: PropTypes.string.isRequired,
        title: PropTypes.string,
        text: PropTypes.string,
        onChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.handleOpenFileDialog = this._handleOpenFileDialog.bind(this);
        this.handleChange = (e) => {
            e.preventDefault();
            props.onChange(e);
        };
    }

    _handleOpenFileDialog() {
        this.refs.fileInput.click();
    }

    render() {
        const { prefixIcon, title, text } = this.props;
        const className = classModule('toggleButton', 'button');
        return (
            <span className={className} title={title} onMouseDown={this.handleOpenFileDialog}>
                <i className={`fa fa-${prefixIcon}`} aria-hidden="true">
                    {text ? <span>{text}</span> : null}
                </i>
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
