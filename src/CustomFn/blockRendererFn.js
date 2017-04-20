import React, { PropTypes } from 'react';

const MediaComponent = (props) => {
    const { block, contentState } = props;
    const entity = contentState.getEntity(block.getEntityAt(0));
    const data = entity.getData();
    const type = entity.getType();
    console.log(data, type);
    return (
        <figure>
            <img src={data.src} />
        </figure>
    );
};
MediaComponent.propTypes = {
    block: PropTypes.object,
    contentState: PropTypes.object,
};

export default function myBlockRenderer(contentBlock) {
    const type = contentBlock.getType();
    switch (type) {
        case 'atomic':
            return {
                component: MediaComponent,
                editable: false,
            };
        default:
            return null;
    }
}

