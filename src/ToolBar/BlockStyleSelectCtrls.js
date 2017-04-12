import React, { PropTypes } from 'react';
import BlockSelectButton from '../UI/BlockSelectButton';

const BlockStyleSelectCtrl = ({
                                  prefixIcon,
                                  options,
                                  typeClass,
                                  title,
                                  editorState,
                                  onToggle
                              }) => {
    const styles = {
        richEditorControls: {
            userSelect: 'none',
            display: 'inline',
        }
    };
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <div style={styles.richEditorControls}>
            <BlockSelectButton
                prefixIcon={prefixIcon}
                options={options}
                onToggle={onToggle}
                blockType={blockType}
                typeClass={typeClass}
                defaultTitle={title}
            />
        </div>
    );
};
BlockStyleSelectCtrl.propTypes = {
    prefixIcon: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    typeClass: PropTypes.string.isRequired,
    title: PropTypes.string,
    editorState: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default BlockStyleSelectCtrl;
