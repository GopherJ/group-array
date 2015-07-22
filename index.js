/*!
 * group-array <https://github.com/doowb/group-array>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var typeOf = require('kind-of');
var get = require('get-value');

function groupArray(arr, props) {
  if (arr == null) {
    return [];
  }

  if (!Array.isArray(arr)) {
    throw new TypeError('group-array expects an array.');
  }

  if (arguments.length === 1) {
    return arr;
  }

  props = flatten([].slice.call(arguments, 1));
  var groups = groupBy(arr, props.shift());

  while (props.length) {
    subGroup(groups, props.shift());
  }
  return groups;
}

function groupBy(arr, prop) {
  var len = arr.length, i = -1;
  var groups = {};

  while (++i < len) {
    var obj = arr[i];
    var key;

    // allow a function to modify the object
    // and/or return a key to use
    if (typeof prop === 'function') {
      key = prop.call(groups, obj);
    } else {
      key = get(obj, prop);
    }

    if (typeof key === 'string') {
      groups[key] = groups[key] || [];
      groups[key].push(obj);
    } else if (typeOf(key) === 'object') {
      var value = key;
      for (var k in value) {
        if (value.hasOwnProperty(k)) {
          groups[k] = groups[k] || [];
          groups[k].push(obj);
        }
      }
    }
  }
  return groups;
}

function subGroup(groups, prop) {
  for (var key in groups) {
    if (groups.hasOwnProperty(key)) {
      var val = groups[key];
      if (!Array.isArray(val)) {
        groups[key] = subGroup(val, prop);
      } else {
        groups[key] = groupArray(val, prop);
      }
    }
  }
  return groups;
}

/**
 * Flatten the given array.
 */

function flatten(arr) {
  return [].concat.apply([], arr);
}

/**
 * Expose `groupArray`
 */

module.exports = groupArray;
