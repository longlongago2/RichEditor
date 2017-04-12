import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from '../index.less';

const classModule = classNames.bind(styles);

export default class Option extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        style: PropTypes.string.isRequired,
        isActive: PropTypes.bool.isRequired,
        colorButton: PropTypes.bool,
        title: PropTypes.string,
        onToggle: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        afterToggle: PropTypes.func,
        // 传入两个参数：参数1：currentOptionActiveState：option的当前选中状态；参数2：optionText：选项名称
        afterLoaded: PropTypes.func,
        // 传入两个参数：参数1：initialActiveState：option默认选中状态；参数2：optionText：选项名称
    };

    constructor(props) {
        super(props);
        this.state = {
            isActive: props.isActive,
        };
        this.toggleClick = this._toggleClick.bind(this);
    }

    componentDidMount() {
        const { afterLoaded, title } = this.props;
        const { isActive } = this.state;
        if (typeof afterLoaded === 'function') {
            afterLoaded(isActive, title);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isActive !== this.props.isActive) {
            this.setState({ isActive: nextProps.isActive });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // 防止循环更新造成死循环，只有isActive变化才可以更新
        return nextState.isActive !== this.state.isActive;
    }

    componentDidUpdate() {
        const { onChange, title } = this.props;
        const { isActive } = this.state;
        onChange(isActive, title);
    }

    _toggleClick(e) {
        e.preventDefault();  // 禁止获取焦点
        e.stopPropagation(); // 阻止click事件冒泡
        const { onToggle, style, afterToggle, title } = this.props;
        onToggle(style);     // 回调
        const { isActive } = this.state;
        this.setState({ isActive: !isActive }); // option选中状态
        if (typeof afterToggle === 'function') {
            afterToggle(!isActive, title);
        }
    }

    render() {
        const { text, title, colorButton } = this.props;
        const { isActive } = this.state;
        const className = classModule('option', {
            active: isActive,
            activeArrow: isActive && colorButton,
        });
        const setInnerHTML = (html) => {
            return {
                __html: html,
            };
        };
        return (
            <li
                className={className}
                onMouseDown={this.toggleClick}
                title={title}
                dangerouslySetInnerHTML={setInnerHTML(text)}
            />
        );
    }
}
