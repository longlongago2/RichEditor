import React, { PropTypes } from 'react';
import ToggleButton from '../UI/ToggleButton';

const BlockStyleControl = ({ buttons, editorState, onToggle }) => {
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
            {buttons.map(type =>
                <ToggleButton
                    key={type.label}
                    isActive={type.style === blockType}
                    prefixIcon={type.label}
                    style={type.style}
                    onToggle={onToggle}
                    title={type.title}
                />
            )}
        </div>
    );
};
BlockStyleControl.propTypes = {
    buttons: PropTypes.array.isRequired,
    editorState: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default BlockStyleControl;
