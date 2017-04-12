import React, { PropTypes } from 'react';

const Image = (props) => {
    const { src } = props.contentState.getEntity(props.entityKey).getData();
    return (
        <figure style={{ textAlign: 'center', margin: '15px 50px' }}>
            <img src={src} width="80%" title={`图片：${src}`} />
        </figure>
    );
};
Image.propTypes = {
    contentState: PropTypes.object.isRequired,
    entityKey: PropTypes.string.isRequired,
};

export default Image;
