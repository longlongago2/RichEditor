import React, { PropTypes } from 'react';

const Link = (props) => {
    const { url } = props.contentState.getEntity(props.entityKey).getData(); // 获取实体实例的值
    return (
        <a href={url} title={url}>
            {props.children}
        </a>
    );
};
Link.propTypes = {
    contentState: PropTypes.object.isRequired,
    children: PropTypes.array.isRequired,
    entityKey: PropTypes.string.isRequired,
};

export default Link;
