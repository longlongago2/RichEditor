import React, { PropTypes } from 'react';

const styles = {
    media: {
        margin: 0,
        padding: 0,
        width: '100%',
        overflow: 'auto'
    }
};

const Audio = (props) => {
    return (
        <figure>
            <audio controls src={props.src} />
        </figure>
    );
};
Audio.propTypes = {
    src: PropTypes.string.isRequired,
};

const Image = (props) => {
    return (
        <div style={styles.media}>
            <img src={props.src} />
        </div>
    );
};
Image.propTypes = {
    src: PropTypes.string.isRequired,
};

const Video = (props) => {
    return (
        <figure>
            <video controls src={props.src} />
        </figure>
    );
};
Video.propTypes = {
    src: PropTypes.string.isRequired,
};

const MediaComponent = (props) => {
    const { block, contentState } = props;
    const entity = contentState.getEntity(block.getEntityAt(0));
    const data = entity.getData();
    const type = entity.getType();
    console.log(type);
    if (type === 'image') {
        return <Image {...data} />;
    }
    if (type === 'audio') {
        return <Audio {...data} />;
    }
    if (type === 'video') {
        return <Video {...data} />;
    }
    return <figure>未识别类型</figure>;
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
                editable: true,
            };
        default:
            return null;
    }
}

