const outputs = [];

//const predictionPoint = 300;
//const k = 3;




function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Runs every time a ball drops into a bucket

  outputs.push([dropPosition, bounciness, size, bucketLabel]);

  console.log(outputs);
}
function runAnalysis() {
  // Write code here to analyze stuff
  const testSetSize = 10;
  const k = 10;
  //console.log(testSet, trainingSet);
  let numberCorrect = 0;

  // for (let i = 0; i < testSet.length; i++) {
  //   const bucket = knn(trainingSet, testSet[i][0]);
  //   if (bucket === testSet[i][3]) {
  //     numberCorrect++;
  //   }
  //   //console.log(bucket, testSet[i][3]);

  // }
  _.range(0, 3).forEach(feature => {
    const data = _.map(outputs, row => [row[feature], _.last(row)]);
    //console.log(data);

    const [testSet, trainingSet] = splitDataset(minMax(data, 1), testSetSize);

    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint)
      )
      .size()
      .divide(testSetSize)
      .value()


    //console.log("For k of " + k + " accuracy: ", accuracy);
    console.log("Feature of ", feature, " accuracy is ", accuracy);

  })



  //console.log("Accuracy: ", numberCorrect / testSetSize);


}
//source - Training Data - trying to predict
function knn(data, point, k) {
  //console.log(point);

  return _.chain(data)
    .map(row => {
      return [
        distance(_.initial(row), point),
        _.last(row)
      ]
    })
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}


//pointB - prediction point. pointA - actual point of a throw
function distance(pointA, pointB) {
  //pointA and pointB is now an array [300, 0.5,16, ....]


  // return Math.abs(pointA - pointB);

  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5

}

//testCount - number of points to test
function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  //from testCount to a very end of the array
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];

}

//featureCount - number of row to normilze
function minMax(data, featureCount) {
  const clonedData = _.cloneDeep(data);
  for (let i = 0; i < featureCount; i++) {
    const column = clonedData.map(row => row[i])
    const min = _.min(column);
    const max = _.max(column);
    for (let j = 0; j < clonedData.length; j++) {

      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);

    }


  }
  return clonedData;
}