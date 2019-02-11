



const add = (() => {
  let count = 0;

  return () => { count++; return count }
})();





console.log(add());
console.log(add());
console.log(add());

