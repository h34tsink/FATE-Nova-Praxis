import type { SleeveVariant } from '../types';

// Biosleeve Variants
const biosleeves: SleeveVariant[] = [
	{
		id: 'alpha_biosleeve',
		type: 'biosleeve',
		variant: 'alpha',
		name: 'Alpha Biosleeve',
		baseCost: 6,
		description: 'Basic gene-fixed biosleeve with essential enhancements. Entry-level option with reduced aesthetics.',
		physicalSkillRanks: 8,
		aspects: [
			{
				name: 'Gene-Fixed Biosleeve',
				isPersistent: false,
				description: 'Biological body with genetic health improvements'
			},
			{
				name: 'Unattractive',
				isPersistent: false,
				description: 'Basic appearance with genetic randomization flaws'
			}
		],
		includedAugmentations: ['apotheosis'],
		augmentationPoints: 2,
		restrictions: ['unattractive_appearance']
	},
	{
		id: 'beta_biosleeve',
		type: 'biosleeve',
		variant: 'beta',
		name: 'Beta Biosleeve',
		baseCost: 7,
		description: 'Standard gene-fixed biosleeve with improved capabilities and neutral appearance.',
		physicalSkillRanks: 9,
		aspects: [
			{
				name: 'Gene-Fixed Biosleeve',
				isPersistent: false,
				description: 'Biological body with genetic health improvements'
			}
		],
		includedAugmentations: ['apotheosis'],
		augmentationPoints: 3
	},
	{
		id: 'gamma_biosleeve',
		type: 'biosleeve',
		variant: 'gamma',
		name: 'Gamma Biosleeve',
		baseCost: 9,
		description: 'Enhanced biosleeve with improved genetics and appearance customization options.',
		physicalSkillRanks: 10,
		aspects: [
			{
				name: 'Gene-Fixed Biosleeve',
				isPersistent: false,
				description: 'Biological body with genetic health improvements'
			}
		],
		includedAugmentations: ['apotheosis'],
		augmentationChoices: [{
			name: 'Cosmetic Enhancement',
			description: 'Choose your cosmetic augmentation',
			options: ['cosmetic_customization', 'striking_looks']
		}],
		augmentationPoints: 4
	},
	{
		id: 'delta_biosleeve',
		type: 'biosleeve',
		variant: 'delta',
		name: 'Delta Biosleeve',
		baseCost: 11,
		description: 'Premium biosleeve with exceptional genegineering and enhanced capabilities.',
		physicalSkillRanks: 11,
		aspects: [
			{
				name: 'Gene-Fixed Biosleeve',
				isPersistent: false,
				description: 'Biological body with genetic health improvements'
			}
		],
		includedAugmentations: ['apotheosis', 'exceptional_genegineering'],
		augmentationChoices: [{
			name: 'Cosmetic Enhancement',
			description: 'Choose your cosmetic augmentation',
			options: ['cosmetic_customization', 'striking_looks']
		}],
		augmentationPoints: 6
	},
	{
		id: 'epsilon_biosleeve',
		type: 'biosleeve',
		variant: 'epsilon',
		name: 'Epsilon Biosleeve',
		baseCost: 14,
		description: 'Top-tier biosleeve representing the pinnacle of biological enhancement technology.',
		physicalSkillRanks: 12,
		aspects: [
			{
				name: 'Gene-Fixed Biosleeve',
				isPersistent: false,
				description: 'Biological body with genetic health improvements'
			}
		],
		includedAugmentations: ['apotheosis', 'exceptional_genegineering'],
		augmentationChoices: [{
			name: 'Cosmetic Enhancement',
			description: 'Choose your cosmetic augmentation',
			options: ['cosmetic_customization', 'striking_looks']
		}],
		augmentationPoints: 8
	}
];

// Cybersleeve Variants
const cybersleeves: SleeveVariant[] = [
	{
		id: 'alpha_cybersleeve',
		type: 'cybersleeve',
		variant: 'alpha',
		name: 'Alpha Cybersleeve',
		baseCost: 5,
		description: 'Basic mass-produced humanoid robot with obvious synthetic appearance and construction flaws.',
		physicalSkillRanks: 7,
		aspects: [
			{
				name: 'Synthetic Biology',
				isPersistent: true,
				description: 'Fully synthetic body composition'
			},
			{
				name: 'Inhuman Appearance',
				isPersistent: false,
				description: 'Clearly artificial appearance that affects social interactions'
			},
			{
				name: 'Dubious Construction',
				isPersistent: false,
				description: 'Lower quality construction with potential reliability issues'
			}
		],
		includedAugmentations: ['apotheosis', 'fully_synthetic'],
		augmentationPoints: 3,
		armorRating: 1,
		restrictions: ['inhuman_appearance', 'purist_prejudice'],
		specialRules: ['dubious_construction']
	},
	{
		id: 'beta_cybersleeve',
		type: 'cybersleeve',
		variant: 'beta',
		name: 'Beta Cybersleeve',
		baseCost: 6,
		description: 'Improved cybersleeve with better construction quality but still obviously artificial.',
		physicalSkillRanks: 8,
		aspects: [
			{
				name: 'Synthetic Biology',
				isPersistent: true,
				description: 'Fully synthetic body composition'
			},
			{
				name: 'Inhuman Appearance',
				isPersistent: false,
				description: 'Clearly artificial appearance that affects social interactions'
			}
		],
		includedAugmentations: ['apotheosis', 'fully_synthetic'],
		augmentationPoints: 4,
		armorRating: 1,
		restrictions: ['inhuman_appearance', 'purist_prejudice']
	},
	{
		id: 'gamma_cybersleeve',
		type: 'cybersleeve',
		variant: 'gamma',
		name: 'Gamma Cybersleeve',
		baseCost: 8,
		description: 'Enhanced cybersleeve with improved armor and appearance customization options.',
		physicalSkillRanks: 9,
		aspects: [
			{
				name: 'Synthetic Biology',
				isPersistent: true,
				description: 'Fully synthetic body composition'
			},
			{
				name: 'Inhuman Appearance',
				isPersistent: false,
				description: 'Clearly artificial appearance that affects social interactions'
			}
		],
		includedAugmentations: ['apotheosis', 'fully_synthetic'],
		augmentationChoices: [{
			name: 'Appearance Enhancement',
			description: 'Choose your appearance augmentation',
			options: ['bio_skin_sheath', 'cosmetic_customization']
		}],
		augmentationPoints: 5,
		armorRating: 2,
		restrictions: ['inhuman_appearance', 'purist_prejudice']
	},
	{
		id: 'delta_cybersleeve',
		type: 'cybersleeve',
		variant: 'delta',
		name: 'Delta Cybersleeve',
		baseCost: 10,
		description: 'High-quality cybersleeve with optimized power systems and enhanced durability.',
		physicalSkillRanks: 10,
		aspects: [
			{
				name: 'Synthetic Biology',
				isPersistent: true,
				description: 'Fully synthetic body composition'
			},
			{
				name: 'Inhuman Appearance',
				isPersistent: false,
				description: 'Clearly artificial appearance that affects social interactions'
			}
		],
		includedAugmentations: ['apotheosis', 'fully_synthetic', 'optimized_power_system'],
		augmentationChoices: [{
			name: 'Appearance Enhancement',
			description: 'Choose your appearance augmentation',
			options: ['bio_skin_sheath', 'cosmetic_customization']
		}],
		augmentationPoints: 7,
		armorRating: 2,
		restrictions: ['inhuman_appearance', 'purist_prejudice']
	},
	{
		id: 'epsilon_cybersleeve',
		type: 'cybersleeve',
		variant: 'epsilon',
		name: 'Epsilon Cybersleeve',
		baseCost: 13,
		description: 'Premium cybersleeve representing the cutting edge of synthetic body technology.',
		physicalSkillRanks: 11,
		aspects: [
			{
				name: 'Synthetic Biology',
				isPersistent: true,
				description: 'Fully synthetic body composition'
			},
			{
				name: 'Inhuman Appearance',
				isPersistent: false,
				description: 'Clearly artificial appearance that affects social interactions'
			}
		],
		includedAugmentations: ['apotheosis', 'fully_synthetic', 'optimized_power_system'],
		augmentationChoices: [{
			name: 'Appearance Enhancement',
			description: 'Choose your appearance augmentation',
			options: ['bio_skin_sheath', 'cosmetic_customization']
		}],
		augmentationPoints: 9,
		armorRating: 2,
		restrictions: ['inhuman_appearance', 'purist_prejudice']
	}
];

// Export all sleeves
export const allSleeves: SleeveVariant[] = [...biosleeves, ...cybersleeves];

// Export by type for filtering
export { biosleeves, cybersleeves };

// Helper functions
export function getSleeveById(id: string): SleeveVariant | undefined {
	return allSleeves.find(sleeve => sleeve.id === id);
}

export function getSleevesByType(type: 'biosleeve' | 'cybersleeve'): SleeveVariant[] {
	return allSleeves.filter(sleeve => sleeve.type === type);
}

export function getAffordableSleeves(sleeves: SleeveVariant[], maxCost: number): SleeveVariant[] {
	return sleeves.filter(sleeve => sleeve.baseCost <= maxCost);
}

export function calculateMaxSleeveCost(assets: number, repRating: number): number {
	return Math.max(assets, repRating) + 4;
}