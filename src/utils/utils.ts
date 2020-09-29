import md5 from './md5'

export const encrypt = (param: { [key: string]: any }) => {
  let { ...params } = param;
  let paramsString = "";
  let paramArr = Object.keys(params).sort();
  paramArr.forEach(item => {
    let str = params[item]
    if (typeof params[item] === 'object' && !params[item]) {
      str = encrypt({item: params[item]})
    }
    paramsString += `${item}=${str}&`;
  });
  paramsString = paramsString.slice(0, -1);
  // console.log(paramsString);
  paramsString = md5(paramsString);
  // console.log(paramsString);
  return paramsString;
};
