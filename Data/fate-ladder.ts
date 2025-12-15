export const fateLadder = [
  { value: 8, name: 'Legendary', adjective: 'Legendary' },
  { value: 7, name: 'Epic', adjective: 'Epic' },
  { value: 6, name: 'Fantastic', adjective: 'Fantastic' },
  { value: 5, name: 'Superb', adjective: 'Superb' },
  { value: 4, name: 'Great', adjective: 'Great' },
  { value: 3, name: 'Good', adjective: 'Good' },
  { value: 2, name: 'Fair', adjective: 'Fair' },
  { value: 1, name: 'Average', adjective: 'Average' },
  { value: 0, name: 'Mediocre', adjective: 'Mediocre' },
  { value: -1, name: 'Poor', adjective: 'Poor' },
  { value: -2, name: 'Terrible', adjective: 'Terrible' }
];

export function getLadderStep(value: number) {
  return fateLadder.find((s) => s.value === value) || fateLadder.find((s) => s.value === 0)!;
}

export function formatLadderValue(value: number) {
  const step = getLadderStep(value);
  const sign = value > 0 ? '+' : '';
  return `${sign}${value} ${step.adjective}`;
}

export const skillDistributions = {
  specialist: {
    name: 'Specialist',
    description: 'Focused expertise in a few key areas',
    ranks: { 5: 1, 4: 2, 3: 2, 2: 3, 1: 6 },
    totalSkills: 14
  },
  expert: {
    name: 'Expert',
    description: 'Well-rounded with strong capabilities',
    ranks: { 4: 3, 3: 3, 2: 4, 1: 6 },
    totalSkills: 16
  },
  generalist: {
    name: 'Generalist',
    description: 'Broad knowledge across many skills',
    ranks: { 3: 7, 2: 8, 1: 3 },
    totalSkills: 18
  }
};
