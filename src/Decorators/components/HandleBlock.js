import React, { PropTypes } from 'react';

const styles = {
    handle: {
        color: 'rgba(98, 177, 254, 1.0)',
        direction: 'ltr',
        borderLeft: '3px solid rgba(98, 177, 254, 1.0)',
        padding: '5px',
        margin: '0 3px',
        background: '#EAEAEA',
        borderRadius: '3px',
        unicodeBidi: 'bidi-override',
    },
};
const HandleSpan = (props) => {
    return (
        <span style={styles.handle}>
            {props.children}
        </span>
    );
};
HandleSpan.propTypes = {
    children: PropTypes.array.isRequired,
};

export default HandleSpan;
