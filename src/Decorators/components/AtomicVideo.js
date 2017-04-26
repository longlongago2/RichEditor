import React, { Component, PropTypes } from 'react';

export default class AtomicVideo extends Component {
    static propTypes = {
        src: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const styles = {
            media: {
                margin: 0,
                padding: 0,
                overflow: 'auto',
                textAlign: 'center',
                userSelect: 'none',
            }
        };
        const { src } = this.props;
        return (
            <div style={styles.media}>
                <video controls src={src} width="100%" />
            </div>
        );
    }
}
