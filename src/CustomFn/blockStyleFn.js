export default function getBlockStyle(contentBlock) {
    switch (contentBlock.getType()) {
        case 'blockquote':
            return 'cf-richEditor-blockquote';
        case 'code-block':
            return 'cf-richEditor-code-block';
        case 'indent':
            return 'cf-richEditor-indent';
        default:
            return null;
    }
}
