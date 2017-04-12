import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from '../index.less';

const classModule = classNames.bind(styles); // using CSS Module should import 'classnames/bind'

export default class ToggleButton extends Component {
    static propTypes = {
        prefixIcon: PropTypes.string,
        text: PropTypes.string,
        title: PropTypes.string,
        isActive: PropTypes.bool,
        style: PropTypes.string.isRequired,
        onToggle: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            isActive: props.isActive
        };
        this.toggleClick = this._toggleClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const newState =
            nextProps.isActive !== this.props.isActive ? { isActive: nextProps.isActive } : {};
        this.setState(newState);
    }

    _toggleClick(e) {
        e.preventDefault(); // 禁止获取焦点
        const { onToggle, style } = this.props;
        onToggle(style);    // 回调
        const { isActive } = this.state;
        this.setState({ isActive: !isActive });
    }

    render() {
        const { text, prefixIcon, title } = this.props;
        const { isActive } = this.state;
        const className = classModule('toggleButton', 'button', {
            active: isActive,
        });
        return (
            <span className={className} title={title} onMouseDown={this.toggleClick}>
                <i className={`fa fa-${prefixIcon}`} aria-hidden="true">
                    {text ? <span>{text}</span> : null}
                </i>
            </span>
        );
    }
}
