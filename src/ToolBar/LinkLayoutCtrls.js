import React, { PropTypes } from 'react';
import InputLayout from '../UI/InputLayout';

const LinkLayoutCtrl = ({ prefixIcon }) => {
    const styles = {
        richEditorControls: {
            userSelect: 'none',
            display: 'inline',
        },
        input: {
            boxSizing: 'border-box',
            width: '100%',
            border: 0,
            borderBottom: '2px solid #1E90FF',
            outline: 0,
            padding: '5px',
            fontSize: '15px'
        }
    };
    const body = (
        <div style={{ textAlign: 'center' }}>
            <p>
                <input style={styles.input} type="text" placeholder="网址" />
            </p>
            <section style={{ textAlign: 'left', font: '12px/25px "Microsoft YaHei",sans-serif' }}>
                请在网络地址前面使用 http(s)://，例如：http://www.baidu.com。<br />
                保证网址能有效！
            </section>
        </div>
    );
    return (
        <div style={styles.richEditorControls}>
            <InputLayout
                title="插入链接"
                isActive={false}
                prefixIcon={prefixIcon}
                body={body}
            />
        </div>
    );
};
LinkLayoutCtrl.propTypes = {
    prefixIcon: PropTypes.string.isRequired,
};

export default LinkLayoutCtrl;
