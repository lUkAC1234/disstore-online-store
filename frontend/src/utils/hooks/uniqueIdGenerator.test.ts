import uniqueIdGenerator from "./uniqueIdGenerator";

console.time("UNIQUE_ID_GENERATOR");
console.log(uniqueIdGenerator(1_000_000), "\n"); // 1.373s last test
console.timeEnd("UNIQUE_ID_GENERATOR");
