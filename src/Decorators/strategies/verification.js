/**
 * 根据正则表达式检索contentBlock
 * @param regex
 * @param contentBlock
 * @param callback
 */
export function findWithRegex(regex, contentBlock, callback) {
    const text = contentBlock.getText();
    let matchArr;
    let start;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
}

/**
 * 修饰器的查找方法 通过实体类型的名称进行查找
 * @param type          :[string] 实体类型
 * @param contentBlock  :[object]
 * @param contentState  :[object]
 * @param callback      :[func]
 */
export function findWithEntityKey(type, contentBlock, contentState, callback) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === type
            );
        },
        callback
    );
}

