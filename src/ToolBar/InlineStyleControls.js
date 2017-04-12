import React, { PropTypes } from 'react';
import ToggleButton from '../UI/ToggleButton';

const styles = {
    richEditorControls: {
        userSelect: 'none',
        display: 'inline',
    }
};
const InlineStyleControls = ({ buttons, editorState, onToggle }) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return (
        <div style={styles.richEditorControls}>
            {buttons.map(type =>
                <ToggleButton
                    key={type.label}
                    isActive={currentStyle.has(type.style)}
                    prefixIcon={type.label}
                    style={type.style}
                    onToggle={onToggle}
                    title={type.title}
                />
            )}
        </div>
    );
};

InlineStyleControls.propTypes = {
    editorState: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired,
    buttons: PropTypes.array.isRequired,
};

export default InlineStyleControls;
