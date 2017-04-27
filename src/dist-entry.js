// todo: webpack 打包只会生成一个自执行的js，所以当入口库文件要当做全局变量使用的时候，需要单独生成
require('whatwg-fetch');
require('babel-polyfill');
window.CFRichEditor = require('./index'); // 生成一个全局变量，在外链js时使用
