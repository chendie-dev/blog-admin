/*
 * @Author: chendie chendie
 * @Date: 2023-05-07 09:28:33
 * @LastEditors: chendie chendie
 * @LastEditTime: 2023-05-07 09:36:19
 * @FilePath: /blog-admin/src/hooks/validate.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export  const validatevalue = (value: string,strLength:number): ValidateReturn=> {
    if (value.replace(/\s*/g, '').length <= strLength) {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: `长度最长为${strLength}`,
    };
  };