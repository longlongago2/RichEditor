import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import inlineStyleMap from '../CustomFn/inlineStyleMap';
import Option from './SelectOption';
import styles from '../index.less';

const classModules = classNames.bind(styles);

export default class InlineSelectButton extends Component {
    static propTypes = {
        prefixIcon: PropTypes.string.isRequired,
        colorButton: PropTypes.bool,
        text: PropTypes.string,
        defaultTitle: PropTypes.string,
        isActive: PropTypes.bool,
        options: PropTypes.array.isRequired,
        onToggle: PropTypes.func.isRequired,
        currentStyle: PropTypes.object.isRequired,
        styleMap: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            isActive: props.isActive,
            showOption: false,
            title: props.defaultTitle,
        };
        this.showOption = () => this.setState({ showOption: true });
        this.hideOption = () => this.setState({ showOption: false });
        this.handleChange = this._handleChange.bind(this);
        this.handleAfterToggle = this._handleAfterToggle.bind(this);
        this.handleAfterLoaded = this._handleAfterLoaded.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const newState = {};
        if (nextProps.isActive !== this.props.isActive) {
            newState.isActive = nextProps.isActive;
        }
        this.setState(newState);
    }

    _handleChange(currentActiveState, optionText) {
        if (currentActiveState) {
            this.setState({
                isActive: currentActiveState,
                title: optionText,
            });
        }
        const { currentStyle, styleMap, defaultTitle } = this.props;
        let hasStyle = false;
        styleMap.forEach((item) => {
            if (currentStyle.has(item)) {
                hasStyle = true;
            }
        });
        // 清除样式
        if (!hasStyle) {
            this.setState({
                isActive: false,
                title: defaultTitle,
            });
        }
    }

    _handleAfterToggle(currentOptionActiveState, optionText) {
        this.hideOption();
        const { defaultTitle } = this.props;
        this.setState({
            isActive: currentOptionActiveState,
            title: currentOptionActiveState ? optionText : defaultTitle
        });
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
        const {
            prefixIcon, colorButton, text, options, defaultTitle, currentStyle, styleMap, onToggle
        } = this.props;
        const { isActive, title, showOption } = this.state;
        const btnClass = classModules('selectButton', 'button', {
            active: isActive,
        });
        return (
            <span
                tabIndex="0"
                className={btnClass}
                title={title}
                onMouseDown={this.showOption}
                onBlur={this.hideOption}
            >
                <i
                    className={`fa fa-${prefixIcon}`}
                    style={colorButton ? { position: 'relative', top: '-2px', transform: 'scale(1,0.8)' } : null}
                    aria-hidden="true"
                >
                    {text ? <span>{text}</span> : null}
                </i>
                {
                    colorButton ?
                        <em
                            className={styles.colorButton}
                            style={(() => {
                                let colorStyle = '';
                                styleMap.forEach((item) => {
                                    if (currentStyle.has(item)) {
                                        colorStyle = item;
                                    }
                                });
                                if (colorStyle.trim() === '') {
                                    return { background: '#B3B3B3' };
                                }
                                return { background: inlineStyleMap[colorStyle].color };
                            })()}
                        /> : null
                }
                <ul className={styles.optionLayout} style={!showOption ? { display: 'none' } : null}>
                    <em className={styles.arrow}><em /></em>
                    <span className={styles.headline}>{defaultTitle}</span>
                    {options.map(type =>
                        <Option
                            key={type.label}
                            text={type.label}
                            style={type.style}
                            title={type.title}
                            isActive={currentStyle.has(type.style)}
                            colorButton={colorButton}
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
