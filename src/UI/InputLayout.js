import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from '../index.less';

const classModules = classNames.bind(styles);

export default class InputLayout extends Component {
    static propTypes = {
        isActive: PropTypes.bool,
        prefixIcon: PropTypes.string.isRequired,
        text: PropTypes.string,
        title: PropTypes.string.isRequired,
        body: PropTypes.element.isRequired,
        ensure: PropTypes.func.isRequired,
        cancel: PropTypes.func,
        onClick: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            showLayout: false,
            errMsg: '',
            prefixIcon: props.prefixIcon,
            isActive: props.isActive,
            title: props.title,
            relativeX: null,   // 当前鼠标位置到面板边界的距离
            relativeY: null,
            isDragging: false, // 是否处于drag状态
        };
        this.showLayout = () => this.setState({ showLayout: true });
        this.hideLayout = () => this.setState({ showLayout: false, errMsg: '' });
        this.handleClick = this._handleClick.bind(this);
        this.handleEnsure = this._handleEnsure.bind(this);
        this.handleCancel = this._handleCancel.bind(this);
        this.handleMouseDown = this._handleMouseDown.bind(this);
        this.handleMouseMove = this._handleMouseMove.bind(this);
        this.invalidDrag = this._invalidDrag.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const newState = {};
        if (nextProps.isActive !== this.props.isActive) {
            newState.isActive = nextProps.isActive;
        }
        if (nextProps.title !== this.props.title) {
            newState.title = nextProps.title;
        }
        if (nextProps.prefixIcon !== this.props.prefixIcon) {
            newState.prefixIcon = nextProps.prefixIcon;
        }
        this.setState(newState);
    }

    _handleClick(e, isActive) {
        const { onClick } = this.props;
        if (onClick && typeof onClick === 'function') {
            try {
                onClick(e, isActive);
            } catch (err) {
                this.setState({ errMsg: `错误：${err.message}` });
                return;
            }
        }
        if (!isActive) {
            this.showLayout();
        }
    }

    _handleCancel(e) {
        e.preventDefault();
        e.stopPropagation(); // 禁止冒泡
        const { cancel } = this.props;
        try {
            if (cancel && typeof cancel === 'function') {
                cancel();
            }
        } catch (err) {
            this.setState({ errMsg: `错误：${err.message}` });
            return;
        }
        this.hideLayout();
    }

    _handleEnsure(e) {
        e.preventDefault();
        e.stopPropagation(); // 禁止冒泡
        const { ensure } = this.props;
        // ensure 是异步函数
        try {
            ensure().then(() => this.hideLayout()).catch((err) => {
                this.setState({ errMsg: `错误：${err.message}` });
            });
        } catch (err) {
            this.setState({ errMsg: `错误：${err.message}` });
        }
    }

    _handleMouseDown(e) {
        e.preventDefault();
        e.stopPropagation(); // 禁止冒泡
        const popup = document.getElementById('popup');
        const popupLocationX = popup.offsetLeft;
        const popupLocationY = popup.offsetTop;
        this.setState({
            relativeX: e.pageX - popupLocationX,
            relativeY: e.pageY - popupLocationY,
            isDragging: true
        });
    }

    _handleMouseMove(e) {
        e.preventDefault();
        e.stopPropagation(); // 禁止冒泡
        const popup = document.getElementById('popup');
        const { relativeX, relativeY, isDragging } = this.state;
        if (isDragging === true) {
            const currentX = e.pageX - relativeX >= 0 ? e.pageX - relativeX : 0;
            const currentY = e.pageY - relativeY >= 0 ? e.pageY - relativeY : 0;
            popup.style.left = `${currentX}px`;
            popup.style.top = `${currentY}px`;
        }
    }

    _invalidDrag(e) {
        e.preventDefault();
        e.stopPropagation(); // 禁止冒泡
        this.setState({ isDragging: false });
    }

    render() {
        const { text, body } = this.props;
        const { isActive, showLayout, title, prefixIcon, errMsg } = this.state;
        const btnClass = classModules('toggleButton', 'button', {
            active: isActive,
        });
        return (
            <span
                tabIndex="0"
                className={btnClass}
                onMouseDown={e => this.handleClick(e, isActive)}
                title={title}
            >
                <i className={`fa fa-${prefixIcon}`} aria-hidden="true">
                    {text ? <span>{text}</span> : null}
                </i>
                {
                    showLayout ?
                        <div className={styles.modal}>
                            <div className={styles.modalLayout} title="" id="popup">
                                <div className={styles.content}>
                                    <div
                                        className={styles.modalHeader}
                                        onMouseDown={this.handleMouseDown}
                                        onMouseMove={this.handleMouseMove}
                                        onMouseUp={this.invalidDrag}
                                        onMouseLeave={this.invalidDrag}
                                    >
                                        <div className={styles.modalTitle}>{title}</div>
                                        <div className={styles.modalClose}>
                                            <i
                                                onClick={this.hideLayout}
                                                className="fa fa-times"
                                                aria-hidden="true"
                                                title="关闭"
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.modalBody}>
                                        {body}
                                        {
                                            errMsg !== '' ?
                                                <div
                                                    style={{
                                                        textAlign: 'center',
                                                        font: '12px/25px "Microsoft YaHei"',
                                                        color: 'red'
                                                    }}
                                                >
                                                    {errMsg}
                                                </div> :
                                                null
                                        }
                                    </div>
                                    <div className={styles.modalFooter}>
                                        <button
                                            className={styles.btnCancel}
                                            onClick={this.handleCancel}
                                        >
                                            取消
                                        </button>
                                        <button
                                            className={styles.btnEnsure}
                                            onClick={this.handleEnsure}
                                        >
                                            确定
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null
                }
            </span>
        );
    }
}
