import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import Option from './SelectOption';
import styles from '../index.less';

const classModules = classNames.bind(styles);

export default class BlockSelectButton extends Component {
    static propTypes = {
        prefixIcon: PropTypes.string.isRequired, // 前置图标
        text: PropTypes.string,                  // 文字
        defaultTitle: PropTypes.string,          // 标题提示
        isActive: PropTypes.bool,                // 是否选中
        options: PropTypes.array.isRequired,     // 选项
        onToggle: PropTypes.func.isRequired,     // 操作事件
        blockType: PropTypes.string.isRequired,  // 类型名称：选中块的类型
        typeClass: PropTypes.string.isRequired,  // 类型名称的公共部分：主要作用是通过这个标志来判断是否为此组件所控制的type
    };

    constructor(props) {
        super(props);
        this.state = {
            showOption: false,
            isActive: props.isActive,
            blockType: props.blockType,
            title: props.defaultTitle,
        };
        this.showOption = () => this.setState({ showOption: true });
        this.hideOption = () => this.setState({ showOption: false });
        this.handleAfterToggle = this._handleAfterToggle.bind(this);
        this.handleAfterLoaded = this._handleAfterLoaded.bind(this);
        this.handleChange = this._handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const newState = {};
        if (nextProps.isActive !== this.props.isActive) {
            newState.isActive = nextProps.isActive;
        }
        if (nextProps.blockType !== this.props.blockType) {
            newState.blockType = nextProps.blockType;
        }
        this.setState(newState);
    }

    _handleChange(currentActiveState, optionText) {
        const { blockType } = this.state;
        const { typeClass, defaultTitle } = this.props;
        if (currentActiveState) {
            this.setState({
                isActive: currentActiveState,
                title: optionText,
            });
        }
        // 非此组件所控制的块：去掉button高亮isActive和title
        if (blockType.indexOf(typeClass) === -1) {
            this.setState({
                isActive: false,
                title: defaultTitle,
            });
        }
    }

    _handleAfterToggle(currentOptionActiveState, optionText) {
        this.hideOption(); // 隐藏选项菜单
        const { defaultTitle } = this.props;
        this.setState({
            isActive: currentOptionActiveState,
            title: currentOptionActiveState ? optionText : defaultTitle,
        });  // 取消选中后，title设置为原始值
    }

    _handleAfterLoaded(initialActiveState, optionText) {
        if (initialActiveState) {
            this.setState({
                isActive: initialActiveState,
                title: optionText,
            });
        }
    }

    render() {
        const { prefixIcon, text, options, defaultTitle, onToggle } = this.props;
        const { showOption, isActive, title, blockType } = this.state;
        const btnClass = classModules('selectButton', 'button', {
            active: isActive,
        });
        return (
            <span
                tabIndex="0"
                className={btnClass}
                onMouseDown={this.showOption}
                onBlur={this.hideOption}
                title={title}
            >
                <i className={`fa fa-${prefixIcon}`} aria-hidden="true">
                    {text ? <span>{text}</span> : null}
                </i>
                <ul className={styles.optionLayout} style={!showOption ? { display: 'none' } : null}>
                    <em className={styles.arrow}><em /></em>
                    <span className={styles.headline}>{defaultTitle}</span>
                    {options.map(type =>
                        <Option
                            key={type.label}
                            text={type.label}
                            style={type.style}
                            title={type.title}
                            isActive={blockType === type.style}
                            onToggle={onToggle}
                            onChange={this.handleChange}
                            afterToggle={this.handleAfterToggle}
                            afterLoaded={this.handleAfterLoaded}
                        />
                    )}
                </ul>
            </span>
        );
    }
}
