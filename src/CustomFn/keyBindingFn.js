import { KeyBindingUtil, getDefaultKeyBinding } from 'draft-js';

export default function myKeyBindingFn(e) {
    if (e.keyCode === 76 && KeyBindingUtil.hasCommandModifier(e)) {
        return 'command-readonly'; // 自定义行为名称
    }
    if (e.keyCode === 68 && KeyBindingUtil.hasCommandModifier(e)) {
        return 'command-darkTheme';
    }
    return getDefaultKeyBinding(e);
}
