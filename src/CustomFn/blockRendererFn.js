import React, { PropTypes } from 'react';
import Image from '../Decorators/components/AtomicImage';
import Audio from '../Decorators/components/AtomicAudio';
import Video from '../Decorators/components/AtomicVideo';

const MediaComponent = (props) => {
    const { block, contentState, blockProps } = props;
    const entity = contentState.getEntity(block.getEntityAt(0));
    const data = entity.getData();
    const type = entity.getType();
    if (type === 'image') {
        return <Image {...data} {...blockProps} />;
    }
    if (type === 'audio') {
        return <Audio {...data} {...blockProps} />;
    }
    if (type === 'video') {
        return <Video {...data} {...blockProps} />;
    }
    return <figure>未识别类型</figure>;
};
MediaComponent.propTypes = {
    block: PropTypes.object,
    contentState: PropTypes.object,
    blockProps: PropTypes.object.isRequired,
};

export default function myBlockRenderer(contentBlock, readOnly, onEdit) {
    const type = contentBlock.getType();
    switch (type) {
        case 'atomic':
            return {
                component: MediaComponent,
                editable: false,
                props: {
                    readOnly,
                    onEdit,
                }
            };
        default:
            return null;
    }
}

