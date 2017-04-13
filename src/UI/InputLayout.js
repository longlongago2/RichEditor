import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from '../index.less';

const classModules = classNames.bind(styles);

export default class InputLayout extends Component {
    static propTypes = {
        isActive: PropTypes.bool.isRequired,
        prefixIcon: PropTypes.string.isRequired,
        text: PropTypes.string,
        title: PropTypes.string.isRequired,
        body: PropTypes.element.isRequired,
        ensure: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            showLayout: false,
            isActive: props.isActive,
        };
        this.showLayout = () => this.setState({ showLayout: true });
        this.hideLayout = () => this.setState({ showLayout: false });
        this.handleEnsure = this._handleEnsure.bind(this);
    }

    _handleEnsure() {
        const { ensure } = this.props;
        this.hideLayout();
        ensure();
    }

    render() {
        const { prefixIcon, title, text, body } = this.props;
        const { isActive, showLayout } = this.state;
        const btnClass = classModules('toggleButton', 'button', {
            active: isActive,
        });
        return (
            <span
                tabIndex="0"
                className={btnClass}
                onMouseDown={this.showLayout}
                title={title}
            >
                <i className={`fa fa-${prefixIcon}`} aria-hidden="true">
                    {text ? <span>{text}</span> : null}
                </i>
                {
                    showLayout ?
                        <div className={styles.modalLayout} title="">
                            <div className={styles.content}>
                                <div className={styles.modalHeader}>
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
                                </div>
                                <div className={styles.modalFooter}>
                                    <button
                                        className={styles.btnCancel}
                                        onClick={this.hideLayout}
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
                        : null
                }
            </span>
        );
    }
}
