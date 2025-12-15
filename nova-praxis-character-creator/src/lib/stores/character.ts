import { writable, derived } from 'svelte/store';

export interface Character {
	// Identity
	name: string;
	playerName: string;
	
	// Aspects
	aspects: {
		ambition: string;
		belief: string;
		connection: string;
		disadvantage: string;
		expertise: string;
	};
	
	// State & Allegiance
	characterState: 'pure' | 'sim' | 'sleeved' | null;
	houseAffiliation: string | null;
	
	// Skills
	skills: Record<string, number>;
	skillDistribution: 'specialist' | 'expert' | 'generalist' | null;
	physicalSkills: {
		athletics: number;
		endurance: number;
		perception: number;
	};
	
	// Rep & Resources
	repRating: number;
	
	// Abilities
	stunts: string[];
	savantPrograms: string[];
	
	// Sleeve (if Sleeved)
	sleeve: {
		type: 'biosleeve' | 'cybersleeve' | null;
		variant: string | null;
		augmentations: string[];
	} | null;
	
	// Gear
	gear: Array<{
		name: string;
		type: string;
		quantity: number;
	}>;
	
	// Calculated Stats
	refresh: number;
	physicalStress: number;
	mentalStress: number;
}

function createCharacterStore() {
	const defaultCharacter: Character = {
		name: '',
		playerName: '',
		aspects: {
			ambition: '',
			belief: '',
			connection: '',
			disadvantage: '',
			expertise: ''
		},
		characterState: null,
		houseAffiliation: null,
		skills: {},
		skillDistribution: null,
		physicalSkills: {
			athletics: 0,
			endurance: 0,
			perception: 0
		},
		repRating: 0,
		stunts: [],
		savantPrograms: [],
		sleeve: null,
		gear: [],
		refresh: 3,
		physicalStress: 2,
		mentalStress: 2
	};

	const { subscribe, set, update } = writable<Character>(defaultCharacter);

	return {
		subscribe,
		set,
		update,
		reset: () => set(defaultCharacter),
		
		// Helper methods
		setAspect: (type: keyof Character['aspects'], value: string) => {
			update(char => ({
				...char,
				aspects: { ...char.aspects, [type]: value }
			}));
		},
		
		setState: (state: Character['characterState']) => {
			update(char => ({ ...char, characterState: state }));
		},
		
		setHouse: (house: string | null) => {
			update(char => ({ ...char, houseAffiliation: house }));
		},
		
		setSkill: (skillName: string, rank: number) => {
			update(char => ({
				...char,
				skills: { ...char.skills, [skillName]: rank }
			}));
		},
		
		calculateRep: () => {
			update(char => {
				if (char.houseAffiliation === 'apostate') {
					return { ...char, repRating: 0 };
				}
				const houseNetworking = char.skills['house_networking'] || 0;
				const diplomacy = char.skills['diplomacy'] || 0;
				return { ...char, repRating: (houseNetworking + 2) + diplomacy };
			});
		},
		
		calculateRefresh: () => {
			update(char => {
				let refresh = 3;
				if (char.characterState === 'pure') refresh += 2;
				refresh -= Math.max(0, char.stunts.length - 3);
				return { ...char, refresh };
			});
		},
		
		calculateStress: () => {
			update(char => {
				const endurance = char.physicalSkills.endurance || 0;
				const resolve = char.skills['resolve'] || 0;
				return {
					...char,
					physicalStress: 2 + endurance,
					mentalStress: 2 + resolve
				};
			});
		}
	};
}

export const character = createCharacterStore();

// Derived stores for validation
export const isApostate = derived(
	character,
	$char => $char.houseAffiliation === 'apostate'
);

export const isSavant = derived(
	character,
	$char => $char.stunts.includes('savant')
);

export const isSleeved = derived(
	character,
	$char => $char.characterState === 'sleeved'
);

export const maxSleeveCost = derived(
	character,
	$char => {
		const assets = $char.skills['assets'] || 0;
		const rep = $char.repRating || 0;
		return Math.max(assets, rep) + 4;
	}
);
