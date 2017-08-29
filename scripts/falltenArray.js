
// expect inputs  of arbitrary nested arrays with numbers in it.
//second parameter 'results' is used to make nested call so ignore that while using function
function flattenInputArray(inputs, results){

    var allResults = results || [];

    if(inputs && Array.isArray(inputs) && inputs.length){
      var inputLength = inputs.length;
      for(var i=0; i<inputLength; i++){
         if(typeof inputs[i] == 'number'){
           allResults.push(inputs[i]);
         }else if(Array.isArray(inputs[i])){
           flattenInputArray(inputs[i], allResults);
         }
      }
    }

    return allResults;
}
