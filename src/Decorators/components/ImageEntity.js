import React, { PropTypes } from 'react';

const Image = (props) => {
    const entity = props.contentState.getEntity(props.entityKey);
    const { src } = entity.getData();
    return (
        <figure style={{ textAlign: 'center', margin: '15px 50px' }}>
            <img src={src} width="80%" title={`图片：${src}`} />
            { props.children }
        </figure>
    );
};
Image.propTypes = {
    contentState: PropTypes.object.isRequired,
    entityKey: PropTypes.string.isRequired,
    children: PropTypes.array
};

export default Image;
