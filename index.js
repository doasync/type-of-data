/* eslint-disable no-restricted-syntax, no-param-reassign */

const typeDetect = require('type-detect');

/**
 * Detect variable type
 *
 * @param {*} variable - A variable of any type
 * @return {string} type - Type of variable (string representation, lowercase for primitives)
 */
function getType (variable) {
  const type = typeDetect(variable);

  /* Ensure consistency of 'type-detect' */

  if (type === 'function') {
    return 'Function';
  }

  if (type === 'Symbol') {
    return 'symbol';
  }

  if (type === 'object') {
    return 'Object';
  }

  if (type === 'AsyncFunction') {
    return 'Function';
  }

  if (type === 'GeneratorFunction') {
    return 'Function';
  }

  return type;
}

/**
 * Get the first property of an object
 *
 * @param {Object} object - An object created with literal notation
 * @return {?Object} property - the first property of an object
 * @return {string} property.key property key
 * @return {*} property.value  property value
 */
function getFirstProp (object) {
  for (const prop in object) {
    if (Object.prototype.hasOwnProperty.call(object, prop)) {
      return {key: prop, value: object[prop]};
    }
  }
  return null;
}

/**
 * Check types of variables
 *
 * @param {Object|Array<Object>} schema - Definition or an array of definitions
 * @return {Object} result - An object which is a map of all variables (hash map)
 */
function checkTypes (schema) {
  const result = Object.create(null);

  if (Array.isArray(schema)) {
    for (let i = 0; i < schema.length; i += 1) {
      const {key, value} = checkDefinition(schema[i], i);
      result[key] = value;
    }
  } else {
    const {key, value} = checkDefinition(schema, 0);
    result[key] = value;
  }

  return result;
}

/**
 * Check if a variable matches its type definition and return a variable object
 *
 * @param {Object} definition - Definition object, for example: {myVar, is: String, opt: true}
 * @param {number} index - an index in the array of definitions
 * @return {Object} variable - an object representing a variable
 * @return {string} variable.key - variable key
 * @return {*} variable.value - variable value
 * @return {number} variable.index - index in the array of definitions
 * @return {boolean} variable.optional - if a variable can be undefined or not
 * @return {string} variable.type - variable type
 */
// eslint-disable-next-line complexity
function checkDefinition (definition, index) {
  const definitionType = definition.is;

  const variable = getFirstProp(definition);

  if (!variable) {
    throw new Error(`Definition #${index}: variable should be present`);
  }

  variable.optional = (
    definition.opt === true ||
    definition.opt === 1 ||
    definition.optional === true ||
    definition.optional === 1
  );

  variable.index = index;

  // Handle undefined value
  if (variable.value === undefined) {
    if (variable.optional) {
      return variable;
    }
    throw new TypeError(`Variable "${variable.key}" is not optional but equals undefined`);
  }

  variable.type = getType(variable.value);

  if (Array.isArray(definitionType)) {
    const types = definitionType;
    variable.multiple = true;
    let oneOfTypes = false;

    if (!(types.length > 1)) {
      throw new Error(`Definition #${index}: array of types should contain two or more items`);
    }

    for (let x = 0; x < types.length; x += 1) {
      const ofType = types[x];
      if (checkVariableIs(variable, ofType)) {
        oneOfTypes = true;
        return variable;
      }
    }

    if (!oneOfTypes) {
      throw new TypeError(`Type ${variable.type} of variable "${variable.key}" is not allowed`);
    }
  } else if (checkVariableIs(variable, definitionType)) {
    return variable;
  }

  throw new TypeError(`Definition #${index}: variable could not be checked`);
}

/**
 * Check "is" rule in the definition
 *
 * @param {Object} variable - Variable object, returned by checkDefinition function
 * @param {Function|?string} ofType - A type to check against (a constructor, string or null)
 * @return {boolean} - a boolean result of a check (or throws an error)
 */
function checkVariableIs (variable, ofType) {
  if (ofType === undefined) {
    throw new Error(`Definition #${variable.index}: type "undefined" is not a valid type, use "optional" key instead`);
  } else if (ofType === null) {
    return (variable.value === null);
  } else if (typeof ofType === 'function') {
    return checkByConstructor(variable, ofType);
  } else if (typeof ofType === 'string') {
    return checkCustomType(variable, ofType);
  } else if (ofType[Symbol.toStringTag] === 'JSON') {
    return checkJSON(variable);
  }
  return false;
}

/**
 * Check variable type by a constructor function
 *
 * @param {Object} variable - Variable object, returned by checkDefinition function
 * @param {Function} constructor - A constructor to check type against (name property is used)
 * @return {boolean} - a boolean result of a check (or throws an error)
 */
// eslint-disable-next-line complexity
function checkByConstructor (variable, constructor) {
  const constructorName = constructor.name;
  const {type, key, value, index, multiple} = variable;

  if (!constructorName) {
    throw new Error(`Definition #${index}: constructor should have a name`);
  }

  // Handle NaN and Infinity
  if (type === 'number') {
    if (Number.isNaN(value)) {
      throw new TypeError(`Numerical variable "${key}" is NaN`);
    } else if (!Number.isFinite(value)) {
      throw new TypeError(`Numerical variable "${key}" is Infinity`);
    }
  }

  if (
    (type === constructorName) ||
    (type === 'boolean' && constructorName === 'Boolean') ||
    (type === 'number' && constructorName === 'Number') ||
    (type === 'string' && constructorName === 'String') ||
    (type === 'symbol' && constructorName === 'Symbol') ||
    (value && value.constructor && value.constructor.name === constructorName)
  ) {
    return true;
  } else if (multiple) {
    return false;
  }

  throw new TypeError(`Variable "${key}" is not of type ${constructorName}`);
}

/**
 * Check variable type using a string
 *
 * @param {Object} variable - Variable object, returned by checkDefinition function
 * @param {string} customType - A string representation of a type (is compared to typeDetect)
 * @return {boolean} - a boolean result of a check (or throws an error)
 */
function checkCustomType (variable, customType) {
  const {type, key, multiple} = variable;
  if (type === customType) {
    return true;
  } else if (multiple) {
    return false;
  }

  throw new TypeError(`Variable "${key}" is not of type "${customType}"`);
}

/**
 * Check variable type using a JSON object
 *
 * @param {Object} variable - Variable object, returned by checkDefinition function
 * @return {boolean} - a boolean result of a check (or throws an error)
 */
function checkJSON (variable) {
  const {key, value, multiple} = variable;

  if (isJSON(value)) {
    return true;
  } else if (multiple) {
    return false;
  }

  throw new TypeError(`Variable "${key}" is not of type JSON`);
}

/**
 * Check if a value is a valid JSON string
 *
 * @param {string} value - A string to check
 * @return {boolean} - a boolean result of a check (doesn't throw errors, just checks)
 */
function isJSON (value) {
  if (!(typeof value === 'string' || value instanceof String)) {
    return false;
  }

  try {
    const json = JSON.parse(value);
    if (json && typeof json === 'object') {
      return true;
    }
  } catch (err) {
    /* skip */
  }

  return false;
}

module.exports = checkTypes;
