const outputs = [];

//const predictionPoint = 300;
//const k = 3;




function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Runs every time a balls drops into a bucket

  outputs.push([dropPosition, bounciness, size, bucketLabel]);

  //console.log(outputs);
}

function runAnalysis() {
  // Write code here to analyze stuff
  const testSetSize = 10;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);
  console.log(testSet, trainingSet);
  let numberCorrect = 0;

  // for (let i = 0; i < testSet.length; i++) {
  //   const bucket = knn(trainingSet, testSet[i][0]);
  //   if (bucket === testSet[i][3]) {
  //     numberCorrect++;
  //   }
  //   //console.log(bucket, testSet[i][3]);

  // }

  _.range(1, 20).forEach(k => {

    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, testPoint[0], k) === testPoint[3]
      )
      .size()
      .divide(testSetSize)
      .value()


    console.log("For k of " + k + " accuracy: ", accuracy);

  })



  //console.log("Accuracy: ", numberCorrect / testSetSize);


}
//source - Training Data - trying to predict
function knn(data, point, k) {
  //console.log(point);

  return _.chain(data)
    .map(row => {
      [distance(row[0], point), row[3]]
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