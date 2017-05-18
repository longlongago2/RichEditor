import React, { PropTypes } from 'react';
import FileInputButton from '../UI/FileInputButton';

const ImageUploadCtrl = ({ onChange, title, text, uploadSuccess, uploadFailedText }) => {
    return (
        <div style={{ userSelect: 'none', display: 'inline' }}>
            <FileInputButton
                uploadSuccess={uploadSuccess}
                uploadFailedText={uploadFailedText}
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
    uploadSuccess: PropTypes.bool.isRequired,
    uploadFailedText: PropTypes.string.isRequired,
};

export default ImageUploadCtrl;
