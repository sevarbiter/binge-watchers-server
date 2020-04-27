var SortedMap = require("collections/sorted-map");
var Set = require("collections/set");

class Data {
  constructor(columns, rows){
    this.columns = columns;
    this.rows = rows;
    this.maps = [];
    for(let i = 0; i < this.columns.length; i++){
      this.maps.push(new SortedMap());
    }
    for(let i = 0; i < this.rows.length; i++){
      for(let j = 0; j < this.rows[i].length; j++){
        if(this.maps[j].has(rows[i][j])){
          this.maps[j].get(this.rows[i][j]).add(i);
        }
        else{
          var temp = new Set();
          temp.add(i);
          this.maps[j].set(this.rows[i][j], temp);
        }
      }
    }
  }
  
  searchIndex(columnsIndex, values){
    if(columnsIndex.length != values.length){
      return null;
    }
    let possibleResults = [];
    let results = [];
    if(columnsIndex.length == 1){
      let possibleResultsSet = this.maps[columnsIndex[0]].get(values[0]);
      console.log("possibleResultsSet: ", possibleResultsSet);
      if(possibleResultsSet != undefined){
        possibleResults = Array.from(possibleResultsSet.values());
        possibleResults.sort();
        for(let i = 0; i < possibleResults.length; i++){
          results.push(this.rows[possibleResults[i]]);
        }
        return results;
      }
      else{
        return null;
      }
    }
    for(let i = 0; i < columnsIndex.length; i++){
      let newResults = this.maps[i].get(values[i]);
      if(newResults != undefined){
        possibleResults.concat(Array.from(newResults.values()));
      }
    }
    possibleResults.sort();
    for(let i = 0; i < possibleResults.length; i++){
      numberOfResults = 0;
      let j = 1;
      while(i+j < possibleResults.length && possibleResults[i+j] == possibleResults[i]){
        j++;
      }
      if(j >= columnsIndex.length){
        results.push(this.rows[possibleResults[i]]);
      }
    }
    return results;
  }

  //columnsText values are values that are the same as columns, 
  //and they are in the same order as in columns 
  //(if "xxxx" is before "yyyy" in columns, then it has to be the same in columnsText)
  searchText(columnsText, values){
    if(columnsText.length != values.length){
      return null;
    }
    let searchColumns = [];
    let j = 0; 
    for(let i = 0; i < this.columns.length && j < columnsText.length; i++){
      if(this.columns[i] == columnsText[j]){
        searchColumns.push(i);
        j++;
      }
    }
    if( j < columnsText.length){
      return null;
    }
    else{
      return this.searchIndex(searchColumns, values);
    }
  }
  

  updateIndex(index, row){
    if(row.length != this.columns.length || (index > this.rows.length || index < 0)){
      return null;
    }
    else{
      for(let i = 0; i < this.maps.length; i++){
        this.maps[i].get(this.rows[index][i]).delete(index);
        let temp = this.maps[i].get(row[i]);
        if(temp == undefined){
          let tempSet = new Set();
          tempSet.add(index);
          this.maps[i].set(row[i], tempSet)
        }
        else{
          temp.add(index);
        }
      }
      this.rows[index] = row;
    }
  }

  updateText(index, json){
    let row = [];
    
    for(let i = 0; i < this.columns.length; i++){
      let temp = json[this.columns[i]];
      if(temp == undefined){
        row.push(this.rows[index][i]);
      }
      else{
        row.push(temp);
      }
    }
    this.updateIndex(index, row);
  }
}

module.exports = {
    Data: Data
}