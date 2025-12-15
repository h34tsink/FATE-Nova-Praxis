import type { CharacterState } from '../types';

const states: CharacterState[] = [
	{
		id: 'pure',
		name: 'Pure',
		description: 'Inhabits their original, un-Apotheosized body.',
		short_description: 'Inhabits their original, un-Apotheosized body.',
		long_description:
			'Pure characters still inhabit the body they were born with. They have not undergone Apotheosis, though they may still have any number of Augmentations, both bioware and cyberware.',
		modifiers: 'No special modifiers for Pure state',
		recovery: 'Standard recovery methods apply',
		benefits: {
			skill_ranks_physical_allocation: {
				amount: 8,
				skills: ['athletics', 'endurance', 'perception'],
				max_per_skill: 5
			},
			additional_aspects: [
				{
					name: 'Physical Trait',
					description: 'Describes some physical trait related to your body.'
				}
			],
			refresh_rating_modifier: '+2',
			free_stunts: ['carpe_diem'],
			skill_bonus: {
				amount: '+1',
				type: 'non-physical',
				max_rank: 5
			},
			// Phase 1: Enhanced automatic benefits for rule compliance
			automaticBenefits: {
				refreshBonus: 2,
				automaticAspects: ['physical_trait'],
				automaticStunts: ['carpe_diem'],
				skillBonus: {
					amount: 1,
					type: 'non-physical',
					maxRank: 5
				}
			}
		},
		drawbacks: [],
		notes:
			'Loses all State Benefits (including the Skill bonus) if Apotheosis Augmentation is taken later.'
	},
	{
		id: 'sim',
		name: 'SIM',
		description: 'A substrate-independent mind residing as pure software in a host computer.',
		short_description: 'A substrate-independent mind residing as pure software in a host computer.',
		long_description:
			'The substrate-independent mind (SIM) has undergone Apotheosis, but has elected to reside in a host computer system purely as software instead of downloading into a sleeve.',
		modifiers: 'Special interaction with virtual environments and systems',
		recovery: 'Recovery through virtual environment restoration or system maintenance',
		benefits: {
			skill_ranks_physical_allocation: {
				amount: 7,
				skills: ['athletics', 'endurance', 'perception'],
				max_per_skill: 5,
				notes: 'These skills allow interaction with virtual objects.'
			},
			free_stunts: ['sim_state'],
			choice_stunts: [
				'digitally_evolved',
				'digital_spider',
				'drone_jock',
				'infusion',
				'skilled_sinc',
				'system_slip'
			],
			// Phase 1: Enhanced automatic benefits for rule compliance
			automaticBenefits: {
				refreshBonus: 0,
				automaticAspects: [],
				automaticStunts: ['sim_state'],
				skillBonuses: {
					sinc: { bonus: 1, maxRank: 5 },
					software_engineering: { bonus: 1, maxRank: 5 }
				},
				choiceStunts: [
					'digitally_evolved',
					'digital_spider',
					'drone_jock',
					'infusion',
					'skilled_sinc',
					'system_slip'
				]
			}
		},
		drawbacks: [
			{
				type: 'Interaction Limitation',
				description:
					'Can only view the world from one mesh at a time, taking about five minutes to transition. Can shift perspective within the same mesh at a pace equivalent to a running human.'
			},
			{
				type: 'Lag Penalty',
				description:
					'May suffer penalties due to lag on Skill tests when acting through machines located a great distance from the host. Within 1000 km: no penalty. Same star system: -2 penalty. Outside star system: -4 penalty.'
			},
			{ type: 'Physical Interaction', description: 'Requires drones for physical interaction.' },
			{
				type: 'Visibility',
				description:
					'Must appear as a semi-transparent ARO when ghosting in the physical world due to Humanity Preservation Act.'
			}
		],
		notes:
			'Spends most time in a custom home virtual environment; SIMs have dominion over their home environment.'
	},
	{
		id: 'sleeved',
		name: 'Sleeved',
		description: 'Has undergone Apotheosis and inhabits a sleeve.',
		short_description: 'Has undergone Apotheosis and inhabits a sleeve.',
		long_description:
			"You have undergone Apotheosis, and inhabit a sleeve. It may be the body you were born with, transformed via Apotheosis, or one you've purchased.",
		modifiers: 'Gains physical form through sleeve technology',
		recovery: 'Recovery through sleeve maintenance or replacement',
		benefits: {
			starting_sleeve: {
				description:
					'You begin play with a biosleeve or cybersleeve with a Cost no greater than the higher of your Assets or Rep-Rating, +4.',
				calculation: 'MAX(Assets Skill Rank, Rep-Rating) + 4',
				reference: '',
				type: 'biosleeve_or_cybersleeve'
			},
			character_creation_note:
				'Later steps in the character creation process will guide you through determining your Assets and Rep-Rating.',
			// Phase 1: Enhanced automatic benefits for rule compliance
			automaticBenefits: {
				refreshBonus: 0,
				automaticAspects: [],
				automaticStunts: []
			}
		},
		drawbacks: [],
		notes: 'Physical skills are determined by the chosen sleeve.'
	}
];

export default states;
