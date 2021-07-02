// 1 2 - no
// 1 2 3 - no

// 2 4 1 3 - yes
// 4 2 5 3 1 - yes
// 6 4 2 5 3 1 - yes
// 6 4 2 7 5 3 1 - yes
// 8 6 4 2 7 5 3 1 - yes
// 8 6 4 2 9 7 5 3 1 - yes
// 10 8 6 4 2 9 7 5 3 1 - yes
// 10 8 6 4 2 11 9 7 5 3 1 - yes


function permutationNaiveSolution(numbersCount) {
    if (numbersCount > 1 && numbersCount < 4) {
        return null;
    } else if (numbersCount === 4) {
        return [2, 4, 1, 3];
    } else {
        const result = [];

        const isNoMiddleValue = numbersCount % 2 === 0;
        const limit = isNoMiddleValue ? numbersCount / 2 : (numbersCount - 1) / 2;

        for (let counter1 = limit; counter1 > 0; counter1 -= 1) {
            result.push(counter1 * 2);
        }

        if (!isNoMiddleValue) {
            result.push(numbersCount);
        }

        for (let counter1 = limit; counter1 > 0; counter1 -= 1) {
            result.push((counter1 * 2) - 1);
        }

        return result;
    }
}

// let result = new Array(numbersCount);

/* for (let counter1 = 0; counter1 < limit; counter1++) {
     result[counter1] = (limit - counter1) * 2;
     result[counter1 + limit] = ((limit - counter1) * 2) - 1;
 }*/

console.log('Permutations');
console.log('============');
console.log('');

console.log('Naive solution');
console.log('--------------');
console.log('');

console.log('Permutations (1) - naive solution (case 1)');
console.log('Permutations: ', permutationNaiveSolution(1));
console.log('');

console.log('Permutations (2) - naive solution (case 2)');
console.log('Permutations: ', permutationNaiveSolution(2));
console.log('');

console.log('Permutations (3) - naive solution (case 3)');
console.log('Permutations: ', permutationNaiveSolution(3));
console.log('');

console.log('Permutations (4) - naive solution (case 4)');
console.log('Permutations: ', permutationNaiveSolution(4));
console.log('');

console.log('Permutations (5) - naive solution (case 5)');
console.log('Permutations: ', permutationNaiveSolution(5));
console.log('');

console.log('Permutations (6) - naive solution (case 6)');
console.log('Permutations: ', permutationNaiveSolution(6));
console.log('');

console.log('Permutations (7) - naive solution (case 7)');
console.log('Permutations: ', permutationNaiveSolution(7));
console.log('');

console.log('Permutations (8) - naive solution (case 8)');
console.log('Permutations: ', permutationNaiveSolution(8));
console.log('');

console.log('Permutations (9) - naive solution (case 9)');
console.log('Permutations: ', permutationNaiveSolution(9));
console.log('');

console.log('Permutations (10) - naive solution (case 10)');
console.log('Permutations: ', permutationNaiveSolution(10));
console.log('');

console.log('Permutations (11) - naive solution (case 11)');
console.log('Permutations: ', permutationNaiveSolution(11));
console.log('');

console.log('Permutations (12) - naive solution (case 12)');
console.log('Permutations: ', permutationNaiveSolution(12));
console.log('');
