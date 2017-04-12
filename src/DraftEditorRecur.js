import React, { Component, PropTypes } from 'react';
import {
    Editor,
    EditorState,
    ContentState,
    CompositeDecorator,
    DefaultDraftBlockRenderMap,
    convertFromHTML,
    convertFromRaw
} from 'draft-js';
import {
    findHandleRegex,
    findLinkEntities,
    findImgEntities,
} from './Decorators/strategies/strategies';
import HandleBlock from './Decorators/components/HandleBlock';
import LinkBlock from './Decorators/components/LinkEntity';
import ImageBlock from './Decorators/components/ImageEntity';
import myBlockStyleFn from './CustomFn/blockStyleFn';
import myBlockRendererFn from './CustomFn/blockRendererFn';
import myStyleMap from './CustomFn/inlineStyleMap';
import myBlockRenderMap from './CustomFn/blockRenderMap';
import styles from './index.less';

const compositeDecorator = new CompositeDecorator([
    {
        strategy: findHandleRegex, // @关键字正则匹配
        component: HandleBlock,
    },
    {
        strategy: findLinkEntities, // 查找LINK类型
        component: LinkBlock,
    },
    {
        strategy: findImgEntities,  // 查找IMAGE类型
        component: ImageBlock,
    }
]);

export default class DraftEditorRecur extends Component {
    static propTypes = {
        importHtml: PropTypes.bool,
        html: PropTypes.string,
        rawContentState: PropTypes.object.isRequired,
    };
    static defaultProps = {
        importHtml: false,
        html: '',
        rawContentState: {
            blocks: [{
                text: '',
                type: 'unstyled',
            }],
            entityMap: {}
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            importHtml: props.importHtml,
            html: props.html,
            rawContentState: props.rawContentState,
            editorState: EditorState.createEmpty(),
        };
    }

    componentWillReceiveProps(nextProps) {
        const { importHtml, html, rawContentState } = nextProps;
        const newState = {
            importHtml: importHtml !== this.props.importHtml ? importHtml : null,
            html: html !== this.props.html ? html : null,
            rawContentState: rawContentState !== this.props.rawContentState ?
                rawContentState : null,
        };
        let contentState;
        if (importHtml) {
            const blocksFromHTML = convertFromHTML(html);
            contentState = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            );
        } else {
            const rawContent =
                rawContentState || {
                    blocks: [{
                        text: '',
                        type: 'unstyled',
                    }],
                    entityMap: {}
                };
            contentState = convertFromRaw(rawContent);
        }
        newState.editorState = EditorState.createWithContent(contentState, compositeDecorator);
        this.setState(newState);
    }

    render() {
        const { editorState } = this.state;
        // 扩展默认块类型
        const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(myBlockRenderMap);
        return (
            <div className={styles.layout}>
                <div className={styles.body}>
                    <Editor
                        readOnly
                        editorState={editorState}
                        blockStyleFn={myBlockStyleFn}
                        blockRendererFn={myBlockRendererFn}
                        customStyleMap={myStyleMap}
                        blockRenderMap={extendedBlockRenderMap}
                    />
                </div>
            </div>
        );
    }
}
