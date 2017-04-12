import React, { PropTypes } from 'react';
import InlineSelectButton from '../UI/InlineSelectButton';

const InlineStyleSelectCtrl = ({
                                   prefixIcon,
                                   colorButton,
                                   options,
                                   title,
                                   editorState,
                                   onToggle,
                                   styleMap
                               }) => {
    const styles = {
        richEditorControls: {
            userSelect: 'none',
            display: 'inline',
        }
    };
    const currentStyle = editorState.getCurrentInlineStyle();
    return (
        <div style={styles.richEditorControls}>
            <InlineSelectButton
                prefixIcon={prefixIcon}
                colorButton={colorButton}
                options={options}
                onToggle={onToggle}
                currentStyle={currentStyle}
                defaultTitle={title}
                styleMap={styleMap}
            />
        </div>
    );
};
InlineStyleSelectCtrl.propTypes = {
    prefixIcon: PropTypes.string.isRequired,
    colorButton: PropTypes.bool,
    options: PropTypes.array.isRequired,
    title: PropTypes.string,
    editorState: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired,
    styleMap: PropTypes.array.isRequired,
};
export default InlineStyleSelectCtrl;
