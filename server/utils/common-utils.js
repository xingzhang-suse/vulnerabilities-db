const groupBy = (array, key) => {
  return array.reduce(function (res, elem) {
    (res[elem[key]] = res[elem[key]] || []).push(elem);
    return res;
  }, {});
}

module.exports = {
  groupBy
}
