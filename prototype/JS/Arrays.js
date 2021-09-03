const Option ={
  cleanArray:{
    removeSpaces:Boolean,
    removeEmptyCharacters:Boolean
  }
}

/**
 * Remove all space and empty strings in arrays
 * @param options {Object<Option.cleanArray>}
 * @example
 *  ['test','test ',''].cleanArray() // return [ 'test', 'test' ]
 * @returns {Array}

 */
Array.prototype.cleanArray = function (options ={
  removeSpaces:true,
  removeEmptyCharacters:true
}) {
  const newArray = [];
  for (let elem of this) {
    if(options.removeSpaces){
      elem = elem.trim()
    }
      if(options.removeEmptyCharacters){
        if (elem) {
          newArray.push(elem);
      }
    }else{
        newArray.push(elem);
      }
  }
  return newArray;
};

/**
 * Split an array into several arrays with a defined number of elements
 * @param chunkSize {Number} Number of element per array
 * * @example
 *  ['test','test ',''].splitIntoChunk(2) // return [ ['test','test ' ],['']]
 * @returns {Array<Array>}
 */
Array.prototype.splitIntoChunk = function (chunkSize) {
  let arrays = [];
  for (let i = 0; i < this.length; i += chunkSize) {
    let tempArray;
    tempArray = this.slice(i, i + chunkSize);
    arrays.push(tempArray);
  }

  return arrays;
};

Array.prototype.removeAll = function (str) {
  let arr = []
  for(const sentence of this){
    if(str !== sentence){
      arr.push(sentence)
    }
  }
  return arr;
};
