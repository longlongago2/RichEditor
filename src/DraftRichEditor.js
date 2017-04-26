import React, { Component, PropTypes } from 'react';
import Draft from 'draft-js';
import 'draft-js/dist/Draft.css';
import { stateToHTML } from 'draft-js-export-html';
import classNames from 'classnames/bind';
import uuid from 'uuid/v4';
import {
    findHandleRegex,
    findLinkEntities,
    findImgEntities,
} from './Decorators/strategies/strategies';
import HandleBlock from './Decorators/components/HandleBlock';
import LinkBlock from './Decorators/components/LinkEntity';
import ImageBlock from './Decorators/components/ImageEntity';
import InlineStyleControl from './ToolBar/InlineStyleControls';
import BlockStyleControl from './ToolBar/BlockStyleControls';
import BlockStyleSelectCtrl from './ToolBar/BlockStyleSelectCtrls';
import InlineStyleSelectCtrl from './ToolBar/InlineStyleSelectCtrls';
import LinkLayoutCtrl from './ToolBar/LinkLayoutCtrls';
import AtomicLayoutCtrl from './ToolBar/AtomicLayoutCtrl';
import ImageUploadCtrl from './ToolBar/ImageUploadCtrl';
import myBlockStyleFn from './CustomFn/blockStyleFn';
import './CustomFn/blockStyle.css';
import myKeyBindingFn from './CustomFn/keyBindingFn';
import myBlockRendererFn from './CustomFn/blockRendererFn';
import myStyleMap from './CustomFn/inlineStyleMap';
import myBlockRenderMap from './CustomFn/blockRenderMap';
import styles from './index.less';

const classModules = classNames.bind(styles);
const {
    EditorState,
    Editor,
    Entity,
    RichUtils,
    CompositeDecorator,
    ContentState,
    Modifier,
    DefaultDraftBlockRenderMap,
    AtomicBlockUtils,
    convertToRaw,
    convertFromRaw,
    convertFromHTML,
} = Draft;

export default class DraftRichEditor extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,           // onChange 一个回调函数，作用：接收当前html值并处理
        initialHtml: PropTypes.string,                 // 初始数据html
        initialRawContent: PropTypes.object,           // 初始数据rowContent
        importHtml: PropTypes.bool.isRequired,         // 是否导入html
        snifferApi: PropTypes.object,                  // 地址嗅探接口：{ url:'', param:'参数名称' }
    };

    static defaultProps = {
        importHtml: false,
        initialHtml: '',
        initialRawContent: {
            blocks: [{
                text: '',
                type: 'unstyled',
            }],
            entityMap: {}
        }
    };

    constructor(props) {
        super(props);
        // 混合装饰器：装饰器只是在编辑器里辅助设置实体的系统，如果装饰器操作不改变实体的内联样式，最后输出的还是原本的样式
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
        // 加载初始数据
        let initialState;
        if (props.importHtml) {
            // console.log('go initialHtml');
            const blocksFromHTML = convertFromHTML(props.initialHtml);
            initialState = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            );
        } else {
            // console.log('go initialRawContent');
            const rawContent =
                props.initialRawContent || {
                    blocks: [{
                        text: '',
                        type: 'unstyled',
                    }],
                    entityMap: {}
                };
            initialState = convertFromRaw(rawContent);
        }
        this.state = {
            editorState: EditorState.createWithContent(initialState, compositeDecorator),
            readOnly: false,
            darkTheme: false,
        };
        this.onChange = (editorState, callback) => {
            /**
             * todo: setState 第一个参数是要改变的state对象，第二个参数是 state 导致的页面变化完成后的回调，等价于componentDidUpdate
             */
            this.setState({ editorState }, callback);
            // 调用属性方法onChange：将属性方法onChange作为回调函数并输出html作为回调函数的值
            const contentState = editorState.getCurrentContent();
            const rawDraftContentState = convertToRaw(contentState);
            const currentHtml = stateToHTML(contentState); // draft-js contentState 转换为 HTML
            // 当前编辑器数据：html:string,rawDraftContentState:object
            props.onChange(currentHtml, rawDraftContentState);
            // 存储本地
            const sessionKey = window.location.href.split('?')[0]; // session名称
            sessionStorage.setItem(sessionKey, JSON.stringify(rawDraftContentState));
        };
        this.onFocus = () => this.refs.editor.focus();
        this.onTab = e => this._onTab(e);
        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.handleProps = this._handleProps.bind(this);
        this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
        this.toggleBlockType = this._toggleBlockType.bind(this);
        this.toggleCustomInlineStyle = this._toggleCustomInlineStyle.bind(this);
        this.handleRemoveLink = this._handleRemoveLink.bind(this);
        this.handleAddLink = this._handleAddLink.bind(this);
        this.handleInsertAtomic = this._handleInsertAtomic.bind(this);
        this.handleFileInput = this._handleFileInput.bind(this);
        this.handleEditImage = this._handleEditImage.bind(this);
    }

    _handleKeyCommand(command) {
        const { editorState, readOnly, darkTheme } = this.state;
        if (command === 'command-readonly') {
            this.setState({ readOnly: !readOnly });
            return 'handled'; // return 'handled' 阻止默认事件，涉及到更改editorState，此处就不能return，让程序继续执行下面代码
        }
        if (command === 'command-darkTheme') {
            this.setState({ darkTheme: !darkTheme });
            return 'handled';
        }
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    _handleProps(key, value) {
        const newState = {};
        newState[key] = value;
        this.setState(newState);
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            ), () =>
                setTimeout(() => this.refs.editor.focus(), 0)
        );
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            ), () =>
                setTimeout(() => this.refs.editor.focus(), 0)
        );
    }

    _toggleCustomInlineStyle(inlineStyle, keyWord) {
        const { editorState } = this.state;
        const selection = editorState.getSelection();
        const currentStyle = editorState.getCurrentInlineStyle();

        // 根据条件（keyWord）筛选 customStyleMap(myStyleMap)
        const filterStyles = Object.keys(myStyleMap).filter((item) => {
            return item.indexOf(keyWord) > -1;
        });

        // Let's just allow one inlineStyle at a time in customStyleMap.
        // 1.Turn off all active inlineStyle.
        const nextContentState = filterStyles
            .reduce((contentState, style) => {
                return Modifier.removeInlineStyle(contentState, selection, style);
            }, editorState.getCurrentContent());

        let nextEditorState = EditorState.push(
            editorState,
            nextContentState,
            'change-inline-style'
        );

        // 2.Unset style override for current inlineStyle.
        if (selection.isCollapsed()) {
            nextEditorState = currentStyle.reduce((state, style) => {
                return RichUtils.toggleInlineStyle(state, style);
            }, nextEditorState);
        }

        // 3.If the inlineStyle is being toggled on, apply it.
        if (!currentStyle.has(inlineStyle)) {
            nextEditorState = RichUtils.toggleInlineStyle(
                nextEditorState,
                inlineStyle
            );
        }

        this.onChange(nextEditorState, () =>
            setTimeout(() => this.refs.editor.focus(), 0));
    }

    _onTab(e) {
        // 只对 type = unordered-list-item' || 'ordered-list-item' 有效，即 UL、OL
        const maxDepth = 4; // 最大层次
        const newEditorState = RichUtils.onTab(e, this.state.editorState, maxDepth);
        this.onChange(newEditorState);
    }

    _handleRemoveLink() {
        const { editorState } = this.state;
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            this.setState({
                editorState: RichUtils.toggleLink(editorState, selection, null),
            });
        }
    }

    _handleAddLink(url) {
        if (url.trim() === '') {
            throw new Error('网址栏为空！');
        }
        const { editorState } = this.state;
        const selection = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        // 创建实体 IMMUTABLE:一旦更改内容会删除整个entity
        const contentStateWithEntity = contentState.createEntity(
            'LINK', 'MUTABLE', { url }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
            editorState, { currentContent: contentStateWithEntity }
        );
        if (!selection.isCollapsed()) {
            this.onChange(RichUtils.toggleLink(
                newEditorState, newEditorState.getSelection(), entityKey
                ), () =>
                    setTimeout(() => this.refs.editor.focus(), 0)
            );
        } else {
            throw new Error('没有选中任何内容！');
        }
    }

    _handleInsertAtomic(url, atomicType) {
        if (url.trim() === '') {
            throw new Error('地址栏为空，请正确填写！');
        }
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            atomicType,
            'IMMUTABLE',
            { src: url, uuid: uuid() }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
            editorState,
            { currentContent: contentStateWithEntity }
        );

        this.setState({
            editorState: AtomicBlockUtils.insertAtomicBlock(
                newEditorState, entityKey, ' '
            ),
        }, () => {
            setTimeout(() => this.refs.editor.focus(), 0);
        });
    }

    _handleFileInput(e) {
        const { editorState } = this.state;
        const fileList = e.target.files;
        const file = fileList[0];
        const entityKey = Entity.create('image', 'IMMUTABLE', { src: URL.createObjectURL(file), uuid: uuid() });
        this.onChange(AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' '
        ));
    }

    _handleEditImage(key, src, width, height, edit) {
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();
        this.setState({ readOnly: edit });
        if (!edit) {
            const rawContentState = convertToRaw(contentState);
            const rawEntityMap = rawContentState.entityMap;
            const entityKeyStr = Object.keys(rawEntityMap).filter(
                item => rawEntityMap[item].data.uuid === key
            )[0];
            rawContentState.entityMap[entityKeyStr].data.width = width;
            rawContentState.entityMap[entityKeyStr].data.height = height;
            const nextContentState = convertFromRaw(rawContentState);
            const nextEditorState = EditorState.push(
                editorState,
                nextContentState,
                'change-atomic-image'
            );
            this.onChange(nextEditorState, () => {
                setTimeout(() => {
                    this.refs.editor.focus();
                    this.refs.editor.blur();
                    this.refs.editor.focus();
                    // 刷新富文本编辑器
                }, 0);
            });
        }
    }

    render() {
        const { editorState, readOnly, darkTheme } = this.state;
        const { snifferApi } = this.props;
        const contentState = editorState.getCurrentContent();
        const editorTheme = {
            cursor: readOnly ? 'default' : null,
            color: darkTheme ? '#ffffff' : null
        };
        const layoutClass = classModules('layout', 'border');
        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let hidePlaceholder = false;
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                hidePlaceholder = true;
            }
        }
        const bodyClass = classModules('body', {
            richEditorHidePlaceholder: hidePlaceholder,
        });
        // 标题选项
        const SELECT_BLOCK_TYPES_HEADER = [
            { label: `<h1 class="${styles.headerOptionText}">标题一</h1>`, style: 'header-one', title: '标题一' },
            { label: `<h2 class="${styles.headerOptionText}">标题二</h2>`, style: 'header-two', title: '标题二' },
            { label: `<h3 class="${styles.headerOptionText}">标题三</h3>`, style: 'header-three', title: '标题三' },
            { label: `<h4 class="${styles.headerOptionText}">标题四</h4>`, style: 'header-four', title: '标题四' },
            { label: `<h5 class="${styles.headerOptionText}">标题五</h5>`, style: 'header-five', title: '标题五' },
        ];
        const SELECT_INLINE_TYPES_FONT = [
            {
                label: '<span style="font:16px Microsoft YaHei;">微软雅黑</span>',
                style: 'FONT_FAMILY_YAHEI',
                title: '微软雅黑'
            },
            {
                label: '<span style="font:16px SIMSUN;">宋体</span>',
                style: 'FONT_FAMILY_SIMSUN',
                title: '宋体'
            },
            {
                label: '<span style="font:16px KaiTi;">楷体</span>',
                style: 'FONT_FAMILY_KAITI',
                title: '楷体'
            },
            {
                label: '<span style="font:16px SimHei;">黑体</span>',
                style: 'FONT_FAMILY_SIMHEI',
                title: '黑体'
            },
        ];
        const SELECT_INLINE_TYPES_COLOR = [
            {
                label: `<div class="${styles.colorOption}"><em class="${styles.color}" style="background:red;"/></div>`,
                style: 'COLOR_RED',
                title: '红色'
            },
            {
                label: `<div class="${styles.colorOption}"><em class="${styles.color}" style="background:orange;"/></div>`,
                style: 'COLOR_ORANGE',
                title: '橘黄色'
            },
            {
                label: `<div class="${styles.colorOption}"><em class="${styles.color}" style="background:yellow;"/></div>`,
                style: 'COLOR_YELLOW',
                title: '黄色'
            },
            {
                label: `<div class="${styles.colorOption}"><em class="${styles.color}" style="background:green;"/></div>`,
                style: 'COLOR_GREEN',
                title: '绿色'
            },
            {
                label: `<div class="${styles.colorOption}"><em class="${styles.color}" style="background:blue;"/></div>`,
                style: 'COLOR_BLUE',
                title: '蓝色'
            },
            {
                label: `<div class="${styles.colorOption}"><em class="${styles.color}" style="background:indigo;"/></div>`,
                style: 'COLOR_INDIGO',
                title: '靛蓝色'
            },
            {
                label: `<div class="${styles.colorOption}"><em class="${styles.color}" style="background:violet;"/></div>`,
                style: 'COLOR_VIOLET',
                title: '紫色'
            },
        ];
        // 内联按钮
        const INLINE_STYLES = [
            { label: 'bold', style: 'BOLD', title: '加粗(Ctrl + B)' },
            { label: 'italic', style: 'ITALIC', title: '斜体(Ctrl + I)' },
            { label: 'underline', style: 'UNDERLINE', title: '下划线(Ctrl + U)' },
            { label: 'strikethrough', style: 'STRIKETHROUGH', title: '删除线' },
        ];
        // 块级按钮
        const BLOCK_TYPES = [
            { label: 'quote-left', style: 'blockquote', title: '引用' },
            { label: 'code', style: 'code-block', title: '代码块' },
            { label: 'list-ul', style: 'unordered-list-item', title: '无序列表' },
            { label: 'list-ol', style: 'ordered-list-item', title: '有序列表' },
            { label: 'indent', style: 'indent', title: '段落首行缩进' },
        ];
        // 筛选StyleMap
        const fontStyleMap = Object.keys(myStyleMap).filter((item) => {
            return item.indexOf('FONT_FAMILY') > -1;
        });
        const colorStyleMap = Object.keys(myStyleMap).filter((item) => {
            return item.indexOf('COLOR') > -1;
        });
        // 扩展默认块类型
        const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(myBlockRenderMap);
        // 选中部分有默认网址链接
        const defaultLink = () => {
            let url = '';
            const selection = editorState.getSelection();
            if (!selection.isCollapsed()) {
                const startKey = editorState.getSelection().getStartKey();
                const startOffset = editorState.getSelection().getStartOffset();
                const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
                const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
                if (linkKey) {
                    const linkInstance = contentState.getEntity(linkKey);
                    const type = linkInstance.getType();
                    if (type === 'LINK') {
                        url = linkInstance.getData().url;
                    }
                }
            }
            return url;
        };
        return (
            <div className={layoutClass} style={darkTheme ? { background: '#333333' } : null}>
                <div className={styles.header}>
                    <BlockStyleSelectCtrl
                        prefixIcon="header"
                        options={SELECT_BLOCK_TYPES_HEADER}
                        typeClass="header-"
                        title="标题"
                        editorState={editorState}
                        onToggle={this.toggleBlockType}
                    />
                    <InlineStyleSelectCtrl
                        prefixIcon="font"
                        options={SELECT_INLINE_TYPES_FONT}
                        editorState={editorState}
                        onToggle={inlineStyle => this.toggleCustomInlineStyle(inlineStyle, 'FONT_FAMILY')}
                        title="字体类型"
                        styleMap={fontStyleMap}
                    />
                    <InlineStyleControl
                        buttons={INLINE_STYLES}
                        editorState={editorState}
                        onToggle={this.toggleInlineStyle}
                    />
                    <InlineStyleSelectCtrl
                        prefixIcon="font"
                        colorButton
                        options={SELECT_INLINE_TYPES_COLOR}
                        editorState={editorState}
                        onToggle={inlineStyle => this.toggleCustomInlineStyle(inlineStyle, 'COLOR')}
                        title="字体颜色"
                        styleMap={colorStyleMap}
                    />
                    <BlockStyleControl
                        buttons={BLOCK_TYPES}
                        editorState={editorState}
                        onToggle={this.toggleBlockType}
                    />
                    <LinkLayoutCtrl
                        defaultURL={defaultLink()}
                        removeLink={this.handleRemoveLink}
                        addLink={this.handleAddLink}
                        snifferApi={snifferApi}
                    />
                    <AtomicLayoutCtrl
                        insertAtomic={this.handleInsertAtomic}
                        snifferApi={snifferApi}
                    />
                    <ImageUploadCtrl
                        title="添加图片"
                        onChange={this.handleFileInput}
                    />
                </div>
                <div
                    className={bodyClass}
                    style={editorTheme}
                    onClick={this.onFocus}
                >
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        onTab={this.onTab}
                        placeholder="请输入正文..."
                        readOnly={readOnly}
                        ref="editor"
                        spellCheck
                        blockStyleFn={myBlockStyleFn}
                        blockRendererFn={contentBlock =>
                            myBlockRendererFn(contentBlock, false, this.handleEditImage)
                        }
                        keyBindingFn={myKeyBindingFn}
                        customStyleMap={myStyleMap}
                        blockRenderMap={extendedBlockRenderMap}
                        handleKeyCommand={this.handleKeyCommand}
                    />
                </div>
                <div className={styles.footer}>
                    <span className={styles.panel}>
                        {
                            contentState.hasText() ?
                                <a>
                                    {
                                        contentState.getPlainText().length > 300 ?
                                            '注意：文本长度已超过 300 个字符' :
                                            `文本长度：${contentState.getPlainText().length}`
                                    }
                                </a>
                                : '没有内容'
                        }
                    </span>
                    <span className={styles.panel}>
                        {
                            darkTheme ?
                                <i
                                    className="fa fa-toggle-on"
                                    onClick={() => this.handleProps('darkTheme', false)}
                                    title="点击切换到浅色主题(Ctrl + D)"
                                >&nbsp;浅色主题</i> :
                                <i
                                    className="fa fa-toggle-off"
                                    onClick={() => this.handleProps('darkTheme', true)}
                                    title="点击切换到深色主题(Ctrl + D)"
                                >&nbsp;深色主题</i>
                        }
                    </span>
                    <span className={styles.panel}>
                        {
                            readOnly ?
                                <i
                                    className="fa fa-lock"
                                    onClick={() => this.handleProps('readOnly', false)}
                                    title="点击解锁"
                                >&nbsp;解锁</i> :
                                <i
                                    className="fa fa-unlock-alt"
                                    onClick={() => this.handleProps('readOnly', true)}
                                    title="点击锁定(Ctrl + L)"
                                >&nbsp;锁定</i>
                        }
                    </span>
                </div>
            </div>
        );
    }
}
