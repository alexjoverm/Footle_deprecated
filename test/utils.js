const Immutable = require('immutable');

  /**
   * Deletes properties from an object (Immutable)
   * @param  {Object} obj   Object to remove props from
   * @param  {Array}  props Properties to delete
   * @return {Object}   Object copy with deleted props
   */
exports.deleteProps = (obj, props) => {
  let map = Immutable.fromJS(obj);
  for (const prop of props) {
    map = map.delete(prop);
  }
  return map.toJS();
};

  /**
   * Same as "deleteProps" for an array of objects
   * @param  {Array}  arr   [description]
   * @param  {Array} props [description]
   * @return {Array}       [description]
   */
exports.deletePropsMultiple = (arr, props) => {
  let result = new Immutable.List();
  for (const obj of arr) {
    result = result.push(this.deleteProps(obj, props));
  }
  return result.toJS();
};
