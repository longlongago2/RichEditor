import React, { PropTypes } from 'react';
import FileInputButton from '../UI/FileInputButton';

const ImageUploadCtrl = ({ onChange, title, text }) => {
    return (
        <div style={{ userSelect: 'none', display: 'inline' }}>
            <FileInputButton
                title={title}
                text={text}
                prefixIcon="image"
                onChange={onChange}
            />
        </div>
    );
};
ImageUploadCtrl.propTypes = {
    onChange: PropTypes.func.isRequired,
    title: PropTypes.string,
    text: PropTypes.string,
};

export default ImageUploadCtrl;
