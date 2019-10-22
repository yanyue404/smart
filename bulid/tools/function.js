Function.prototype.before = function(beforefn) {
  var __self = this; // 保存原函数的引用
  return function() {
    // 返回包含了原函数和新函数的"代理"函数
    beforefn.apply(this, arguments); // 执行新函数，且保证 this 不被劫持，新函数接受的参数
    // 也会被原封不动地传入原函数，新函数在原函数之前执行
    return __self.apply(this, arguments); // 执行原函数并返回原函数的执行结果，
    // 并且保证 this 不被劫持
  };
};
Function.prototype.after = function(afterfn) {
  var __self = this;
  return function() {
    var ret = __self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
  };
};
// 执行从右到左的功能组合 https://github.com/30-seconds/30-seconds-of-code#compose
// const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
// 摘自 https://github.com/reduxjs/redux/blob/master/src/compose.js
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
// 摘自 https://github.com/30-seconds/30-seconds-of-code#composeright
// 执行从左到右的功能组合
const composeRight = (...fns) =>
  fns.reduce((f, g) => (...args) => g(f(...args)));
