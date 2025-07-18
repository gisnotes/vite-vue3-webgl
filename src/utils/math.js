/**
 * 返回一个按一定位数保留小数位数后的数字。
 * @param {number} n 输入的数字
 * @param {number} decimals 小数的最大位数。
 * @return {number} 输入数字按一定位数保留小数位数后的数字。
 */
export function toFixed(n, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}
