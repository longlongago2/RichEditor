import React, { PropTypes } from 'react';

const MediaComponent = (props) => {
    const { block, contentState } = this.props;
    const data = contentState.getEntity(block.getEntityAt(0)).getData();
    // Return a <figure> or some other content using this data.
    return (
        <figure>1</figure>
    );
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

