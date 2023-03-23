export const getIndianNumber = (
    val,
    noDecimal = false,
    noDecimalIfLengthGt = -1,
    decimalLength = 2,
  ) => {
    if (!Number.isFinite(parseFloat(val))) {
      return '—';
    }
  
    let value = val || 0;
    let negative = false;
    if (value < 0) {
      negative = true;
      value = Math.abs(value);
    }
    value = (Math.round(value * (10 ** decimalLength)) / (10 ** decimalLength))
      .toFixed(decimalLength).toString();
    let afterPoint = '';
    if (value.indexOf('.') > 0) afterPoint = value.substring(value.indexOf('.'), value.length);
  
    value = Math.floor(value);
    value = value.toString();
    let lastThree = value.substring(value.length - 3);
    const otherNumbers = value.substring(0, value.length - 3);
    if (otherNumbers !== '') lastThree = `,${lastThree}`;
    let result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    const boolIfLengthGt = (noDecimalIfLengthGt > 0) && (result.length > noDecimalIfLengthGt);
    if (!(noDecimal || boolIfLengthGt)) result += afterPoint;
    if (negative) {
      result = `-${result}`;
    }
    return result;
  }

  export const getIndianCompactNumber = (num) => {
    let val: number | string = Math.abs(num);
    if (val >= 10000000) {
      val = `${(val / 10000000).toFixed(2)}Cr`;
    } else if (val >= 100000) {
      val = `${(val / 100000).toFixed(2)}L`;
    } else if (val >= 1000) {
      val = `${(val / 1000).toFixed(2)}K`;
    } else {
      val = val.toFixed(2);
    }
    if (num < 0) {
      return `-${val}`;
    }
    return val;
  };