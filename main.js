/********Change variables in this section and then run */
const offspringMutationChance = 0.25; // % chance that offspring will have mutation when born
const startingPopulation = 2000; //number of starting organisms in the simulation
const numberOfCycles = 15; // number of cycles the simutation will run for
const userMutationChance = 0.35; // % chance an organism will have a mutation in a cycle
const userSurvivorChance = 0.7; // chance an organism with the LIKELY TO SURVIVE trait will live another cycle.  Organisms without this trait will survive half as frequently

/********Changes to any variables below, not guaranteed to work */
let lifetimePopulation = 0; // Count of all pAequor produced
let pAequorPopulation = []; //living population
let startWithTrait = 0; // percent with trait to start simulation
let endedWithTrait = 0; // percent with trat at end of simulation

// Returns a random DNA base, for mutation purposes you can exclude a base that is to be mutated.
const returnRandBase = (excludedBase = "") => {
  let dnaBases = ["A", "T", "C", "G"];
  if (excludedBase) dnaBases = dnaBases.filter((base) => base !== excludedBase);
  return dnaBases[Math.floor(Math.random() * dnaBases.length)];
};

// Returns a random single stand of DNA containing 15 bases
const mockUpStrand = () => {
  const newStrand = [];
  for (let i = 0; i < 15; i++) {
    newStrand.push(returnRandBase());
  }
  return newStrand;
};

// generate # of organisms
const generatePopulation = (numStartingOrganisms) => {
  const startingPopulation = [];
  for (let index = 1; index <= numStartingOrganisms; index++) {
    startingPopulation.push(pAequorFactory(index, mockUpStrand()));
  }
  return startingPopulation;
};

// calculate the % of the population with the likely to survive trait
const percentWithTrait = (population) => {
  let sum = population.reduce((a, b, currentIndex) => {
    if (population[currentIndex].willLikelySurvive()) b = 1;
    else b = 0;
    return a + b;
  }, 0);

  return `${((sum / population.length) * 100).toFixed(2)}%`;
};
//completeCycle() takes an array of pAequor and evaluates each elements cycle results.
//if the organism survives, the function will check for reproduction/mutation and simulate the results.
const completeCycle = (pAequorArray) => {
  const newGeneration = [];
  pAequorArray.forEach((pAequor) => {
    pAequor.alive = pAequor.isAlive();
    if (pAequor.alive) {
      if (pAequor.mutationChance < Math.random) pAequor.mutate(); //mutate the parent
      if (pAequor.canReplicate()) {
        let newAequor = pAequorFactory(
          lifetimePopulation + 1,
          pAequor.dnaArray
        );
        newAequor.mutate(offspringMutationChance);
        newGeneration.push(newAequor);
      }
    }
  });
  let remainingpAequor = pAequorArray.filter(
    (livingPAequor) => livingPAequor.alive
  );
  console.log(
    `   pAequor Died...${pAequorArray.length - remainingpAequor.length}`
  );
  console.log(`   pAequor Born...${newGeneration.length}`);
  return newGeneration.concat(remainingpAequor);
};

// Factory function pAequorFactory() that has two parameters:

// The first parameter is a number (no two organisms should have the same number).
// The second parameter is an array of 15 DNA bases.
// Returns   an object that contains the properties specimenNum and dna that correspond to the parameters provided.
const pAequorFactory = (specimenNum, dnaArray) => {
  lifetimePopulation++;
  return {
    specimenNum: specimenNum,
    dnaArray: dnaArray,
    lifeSpan: 8,
    reproductionCycle: 1,
    likelySurvival: userSurvivorChance, //chance to survive if organisms DNA gives it a likely chance
    age: 0,
    mutationChance: userMutationChance, //chance to mutate in a cycle
    alive: true,

    // .mutate() is responsible for randomly selecting a base in the object’s dna property and changing the current base to a different base.
    // For example, if the randomly selected base is the 1st base and it is 'A', the base must be changed to 'T', 'C', or 'G'. But it cannot be 'A' again.
    // return the object’s dna.
    mutate(mutationChance = 1) {
      if (Math.random() < mutationChance) {
        let baseIndex = Math.floor(Math.random() * dnaArray.length);
        dnaArray[baseIndex] = returnRandBase(dnaArray[baseIndex]);
      }
      return this.dnaArray;
    },

    // .compareDNA() has one parameter, another pAequor object.

    // The behavior of .compareDNA() is to compare the current pAequor‘s .dna with the passed in pAequor‘s .dna and compute how many bases are identical and in the same locations. .compareDNA() does not return anything, but prints a message that states the percentage of DNA the two objects have in common — use the .specimenNum to identify which pAequor objects are being compared.

    // For example:

    // ex1 = ['A', 'C', 'T', 'G']
    // ex2 = ['C', 'A', 'T', 'T']
    // ex1 and ex2 only have the 3rd element in common ('T') and therefore, have 25% (1/4) of their DNA in common. The resulting message would read something along the lines of: s
    // Return `${specimen1} and ${specimen2} have ${sharedDNA}% DNA in common.`
    comopareDNA(specimen) {
      let specimen1 = this;
      let specimen2 = specimen;
      let sharedDNA = 0;

      specimen1.dnaArray.forEach((base, index) => {
        sharedDNA += base === specimen2.dnaArray[index]; //bool evaluates to 1 if match, 0 if not
      });
      return `Specimen ${specimen1.specimenNum} and Specimen ${
        specimen2.specimenNum
      } have ${
        //divide count by strand length, multiply to get percent
        ((sharedDNA / specimen1.dnaArray.length) * 100).toFixed(2)
      }% shared DNA.`; //round to 2 decimal places
    },
    //.willLikelySurvive()
    // returns true if the object’s .dna array contains at least 60% 'C' or 'G' bases.
    // Otherwise, .willLikelySurvive() returns false.
    willLikelySurvive() {
      return (
        this.dnaArray.filter((base) => base === "C" || base === "G").length >=
        15 * 0.6
      );
    },
    isAlive() {
      // let alive =
      //   Math.random() >
      //   (this.willLikelySurvive()
      //     ? this.likelySurvival
      //     : this.likelySurvival / 2.5);
      let factor = this.willLikelySurvive()
        ? this.likelySurvival
        : this.likelySurvival / 2;

      if ((stillAlive = Math.random() < factor)) this.age++;
      return stillAlive && this.age <= this.lifeSpan;
    },
    canReplicate() {
      //identifies if the creature can reproduce this cycle
      return this.age % this.reproductionCycle === 0;
    },
  };
};

console.log("Start Simulation");
pAequorPopulation = generatePopulation(startingPopulation);
startWithTrait = percentWithTrait(pAequorPopulation);
// simulate 16 years segments
for (let index = 1; index <= numberOfCycles; index++) {
  console.log(`Generation ${index}:`);
  pAequorPopulation = completeCycle(pAequorPopulation);
  console.log(`   Total pAequor..${pAequorPopulation.length}`);
  if (pAequorPopulation.length === 0) break;
}
endedWithTrait = percentWithTrait(pAequorPopulation);
console.log("End Simulation");
console.log(
  `Throughout the simulation ${lifetimePopulation} organisms were created!`
);
console.log(`% with Likely to Survive at Start: ${startWithTrait}`);
console.log(`% with Likely to Survive at Finish: ${endedWithTrait}`);
