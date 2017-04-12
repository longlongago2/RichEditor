import { findWithRegex, findWithEntityKey } from './verification';

const HANDLE_REGEX = /\@[\w]+/g;

export function findHandleRegex(contentBlock, callback, contentState) {
    findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

export function findLinkEntities(contentBlock, callback, contentState) {
    findWithEntityKey('LINK', contentBlock, contentState, callback);
}

export function findImgEntities(contentBlock, callback, contentState) {
    findWithEntityKey('IMAGE', contentBlock, contentState, callback);
}
