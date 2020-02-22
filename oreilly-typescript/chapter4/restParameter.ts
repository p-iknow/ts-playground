function sumVariadic(): number {
  return Array.from(arguments).reduce((total, n) => total + n, 0);
}

sumVariadic(1, 2, 3); // evaluates to 6

function sumVariadicSafe(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

sumVariadicSafe(1, 2, 3); // evaluates to 6
