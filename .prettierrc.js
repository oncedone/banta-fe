module.exports = {
    printWidth: 100, // 一行的字符数，如果超过会进行换行，默认为80
    tabWidth: 4, // 一个tab代表几个空格数，默认为80
    useTabs: false, // 是否使用tab进行缩进，默认为false，表示用空格进行缩减
    singleQuote: true, // 字符串是否使用单引号，默认为false，使用双引号
    semi: true, // 行位是否使用分号，默认为true
    trailingComma: 'es5', // 是否使用尾逗号，有三个可选值"<none|es5|all>", 默认none
    bracketSpacing: true, // 对象大括号直接是否有空格，默认为true，效果 { foo: bar }
    jsxBracketSameLine: false, // 将多行JSX元素的 > 放在最后一行的末尾，而不是单独放在下一行（不适用于自闭元素）。
    arrowParens: 'avoid', // avoid - 尽可能省略括号 Example： x => x
    // requirePragma: true, // 默认false,  如果为true将会格式化具有以下第一个注释的文件， 顶部有@prettier @format
    // parser: "babylon" // 代码的解析引擎，默认为babylon，与babel相同。
};
