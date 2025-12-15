import type { GearItem, GearFeature } from '../domain/gear';

// Re-export types for easy importing
export type { GearItem, GearFeature };

// Armor Features
export const armorFeatures: GearFeature[] = [
	{
		id: 'air_pack',
		name: 'Air Pack',
		description: '8 hours breathable air in sealed helmet',
		effect: 'Provides 8 hours of breathable air in sealed helmet',
		powerArmorOnly: false
	},
	{
		id: 'computer_gauntlet',
		name: 'Computer Gauntlet',
		description: 'PPC (Alpha Agent) with voice/holographic interface',
		effect: 'Includes PPC with Alpha Agent, voice commands and holographic interface',
		powerArmorOnly: false
	},
	{
		id: 'enhanced_mobility',
		name: 'Enhanced Mobility Actuators',
		description: '+2 Athletics for movement tests',
		effect: '+2 bonus on all Athletics tests related to movement, climbing, etc.',
		powerArmorOnly: true
	},
	{
		id: 'high_density_plating',
		name: 'High-Density Plating',
		description: '+1 to Armor Rating',
		effect: 'Increases the armor\'s AR by +1',
		powerArmorOnly: false
	},
	{
		id: 'hydrostatic_gel',
		name: 'Hydrostatic Gel Layer',
		description: '+3 AR vs explosions, AR absorbs falling damage',
		effect: '+3 bonus to AR when defending against explosions, AR absorbs stress from falling',
		powerArmorOnly: true
	},
	{
		id: 'integrated_weaponry',
		name: 'Integrated Weaponry',
		description: 'Built-in weapon (pistol, PDW, dagger, or short sword), -1 Cost',
		effect: 'Armor includes built-in weapon, reduces weapon cost by -1',
		powerArmorOnly: true
	},
	{
		id: 'interface_surface',
		name: 'Interface Surface',
		description: 'Touch interface for digital data transmission',
		effect: 'Hand surface can transmit digital data via touch interface',
		powerArmorOnly: false
	},
	{
		id: 'jump_jets',
		name: 'Jump Jets',
		description: 'Jump 50 feet, +1 zone Hustling, +2 zones Running, +3 chase bonus',
		effect: 'Jump up to 50 feet, extra movement zones, +3 bonus during chases',
		powerArmorOnly: false
	},
	{
		id: 'light_screen_camouflage',
		name: 'Light Screen Camouflage',
		description: 'Chameleon aspect when activated',
		effect: 'Grants Chameleon Aspect when activated for near-invisibility',
		powerArmorOnly: true
	},
	{
		id: 'mag_traction',
		name: 'Mag-Traction',
		description: 'Electromagnet boots for zero-g traversal',
		effect: 'Electromagnet boots allow safe traversal of zero-g environments',
		powerArmorOnly: false
	},
	{
		id: 'motion_tracker',
		name: 'Motion Tracker',
		description: 'Detect motion up to 20 meters, Motion Tracker aspect',
		effect: 'Sensors detect motion up to 20 meters, grants Motion Tracker Aspect',
		powerArmorOnly: false
	},
	{
		id: 'reinforced_cyber_musculature',
		name: 'Reinforced Cyber-Musculature',
		description: '+2 Athletics for physical tasks, +2 melee WR',
		effect: '+2 Athletics for lifting/grappling, +2 WR for melee/thrown attacks',
		powerArmorOnly: true
	},
	{
		id: 'thermal_regulation',
		name: 'Thermal Regulation System',
		description: 'Comfortable in -60°C to 140°C',
		effect: 'Keeps wearer comfortable in extreme temperatures (-60°C to 140°C)',
		powerArmorOnly: false
	},
	{
		id: 'vacuum_sealed',
		name: 'Vacuum Sealed and Shielded',
		description: 'Protection from vacuum and radiation',
		effect: 'Provides protection from vacuum and radiation hazards',
		powerArmorOnly: false
	},
	{
		id: 'zero_g_jets',
		name: 'Zero-G Assistance Jets',
		description: 'Zero-G Maneuverability aspect',
		effect: 'Tiny thrusters aid zero-g maneuvering, grants Zero-G Maneuverability Aspect',
		powerArmorOnly: false
	}
];

// Firearms
export const firearms: GearItem[] = [
	// Pistols
	{
		id: 'light_rail_pistol',
		name: 'Light Rail-Pistol',
		category: 'firearm',
		subcategory: 'pistol',
		cost: 3,
		wr: 3,
		range: 2,
		aspects: ['Armor Penetrating', 'Small', '-2 WR for Silent'],
		description: 'A compact railgun that uses electromagnetic fields to accelerate projectiles to tremendous velocities. The high-velocity rounds easily penetrate armor but are less effective against soft targets.',
		restricted: true
	},
	{
		id: 'heavy_rail_pistol',
		name: 'Heavy Rail-Pistol',
		category: 'firearm',
		subcategory: 'pistol',
		cost: 4,
		wr: 4,
		range: 2,
		aspects: ['Armor Penetrating', 'Small', '-2 WR for Silent'],
		description: 'An enhanced railgun pistol with increased power output and larger projectiles. Delivers devastating armor-piercing capability in a compact package.',
		restricted: true
	},
	{
		id: 'light_pac_pistol',
		name: 'Light PAc Pistol',
		category: 'firearm',
		subcategory: 'pistol',
		cost: 5,
		wr: 4,
		range: 4,
		aspects: ['Particle Accelerator', 'Small', 'Beam Weapon'],
		description: 'A particle accelerator weapon that fires a focused stream of charged particles. The beam can cause significant damage but performs poorly in vacuum environments.',
		restricted: true
	},
	{
		id: 'heavy_pac_pistol',
		name: 'Heavy PAc Pistol',
		category: 'firearm',
		subcategory: 'pistol',
		cost: 6,
		wr: 5,
		range: 4,
		aspects: ['Particle Accelerator', 'Small', 'Beam Weapon'],
		description: 'A high-powered particle accelerator pistol capable of devastating damage. The focused particle beam can punch through most defenses but requires atmospheric conditions to function optimally.',
		restricted: true
	},
	
	// PDWs
	{
		id: 'light_coil_pdw',
		name: 'Light Coil PDW',
		category: 'firearm',
		subcategory: 'pdw',
		cost: 4,
		wr: 3,
		range: 3,
		aspects: ['Full Auto', '-2 WR for Silent'],
		description: 'A personal defense weapon using coil-gun technology to fire multiple projectiles in rapid succession. The high rate of fire makes it effective for suppression and close-quarters combat.',
		restricted: true
	},
	{
		id: 'heavy_coil_pdw',
		name: 'Heavy Coil PDW',
		category: 'firearm',
		subcategory: 'pdw',
		cost: 5,
		wr: 4,
		range: 3,
		aspects: ['Full Auto', '-2 WR for Silent'],
		description: 'An enhanced coil-gun PDW with increased power and projectile velocity. The weapon maintains the rapid-fire capability while delivering more damage per shot.',
		restricted: true
	},
	{
		id: 'light_pac_pdw',
		name: 'Light PAc PDW',
		category: 'firearm',
		subcategory: 'pdw',
		cost: 6,
		wr: 4,
		range: 5,
		aspects: ['Beam Weapon', 'Particle Accelerator'],
		description: 'A particle accelerator weapon designed for personal defense. The continuous particle beam can sustain fire longer than projectile weapons but loses effectiveness in vacuum.',
		restricted: true
	},
	{
		id: 'heavy_pac_pdw',
		name: 'Heavy PAc PDW',
		category: 'firearm',
		subcategory: 'pdw',
		cost: 7,
		wr: 5,
		range: 5,
		aspects: ['Beam Weapon', 'Particle Accelerator'],
		description: 'A high-powered particle accelerator PDW with extended range capabilities. The enhanced particle stream delivers significant damage at longer distances than typical PDWs.',
		restricted: true
	},

	// Assault Rifles
	{
		id: 'coil_carbine',
		name: 'Coil Carbine',
		category: 'firearm',
		subcategory: 'rifle',
		cost: 6,
		wr: 4,
		range: 4,
		aspects: ['Full Auto', 'Large', '-2 WR for Silent'],
		description: 'A compact assault rifle using coil-gun technology for rapid-fire capability. The carbine version offers good balance between firepower and maneuverability.',
		restricted: true
	},
	{
		id: 'heavy_coil_assault_rifle',
		name: 'Heavy Coil Assault Rifle',
		category: 'firearm',
		subcategory: 'rifle',
		cost: 7,
		wr: 5,
		range: 4,
		aspects: ['Full Auto', 'Huge(P)', '-2 WR for Silent'],
		description: 'A heavier variant of coil-gun assault rifles built for sustained automatic fire. The increased mass and barrel length provide improved accuracy and muzzle velocity at the cost of portability.',
		restricted: true
	},
	{
		id: 'rail_carbine',
		name: 'Rail-Carbine',
		category: 'firearm',
		subcategory: 'rifle',
		cost: 6,
		wr: 5,
		range: 4,
		aspects: ['Armor Penetrating', 'Large', '-2 WR for Silent'],
		description: 'A compact railgun assault rifle that uses electromagnetic rails to accelerate projectiles to extremely high velocities. The railgun technology provides exceptional armor penetration capabilities.',
		restricted: true
	},
	{
		id: 'heavy_assault_rail_rifle',
		name: 'Heavy Assault Rail-Rifle',
		category: 'firearm',
		subcategory: 'rifle',
		cost: 7,
		wr: 6,
		range: 4,
		aspects: ['Armor Penetrating', 'Huge(P)', '-2 WR for Silent'],
		description: 'A full-size railgun assault rifle designed for maximum armor penetration. The heavy electromagnetic rails and targeting systems make it particularly effective against armored targets and vehicles.',
		restricted: true
	},
	{
		id: 'pac_carbine',
		name: 'PAc Carbine',
		category: 'firearm',
		subcategory: 'rifle',
		cost: 8,
		wr: 6,
		range: 6,
		aspects: ['Beam Weapon', 'Particle Accelerator', 'Large'],
		description: 'A compact particle accelerator carbine that fires focused beams of accelerated particles. The beam weapon technology provides excellent range and damage with reduced projectile drop.',
		restricted: true
	},
	{
		id: 'heavy_pac_assault_rifle',
		name: 'Heavy PAc Assault Rifle',
		category: 'firearm',
		subcategory: 'rifle',
		cost: 9,
		wr: 7,
		range: 6,
		aspects: ['Beam Weapon', 'Particle Accelerator', 'Huge(P)'],
		description: 'The most powerful particle accelerator assault rifle available. This heavy PAc weapon generates devastating particle beams with maximum range and damage, making it highly effective against all target types.',
		restricted: true
	},

	// Shotguns
	{
		id: 'combat_shotgun',
		name: 'Combat Shotgun',
		category: 'firearm',
		subcategory: 'shotgun',
		cost: 5,
		wr: 5,
		range: 1,
		aspects: ['Shotgun', '-2 WR for Silent'],
		description: 'A pump-action or semi-automatic shotgun designed for combat use. The wide spread pattern is devastating at close range but loses effectiveness quickly at distance.',
		restricted: true
	},

	// Heavy Weapons
	{
		id: 'heavy_coil_automatic_rifle',
		name: 'Heavy Coil Automatic Rifle',
		category: 'firearm',
		subcategory: 'heavy',
		cost: 8,
		wr: 6,
		range: 4,
		aspects: ['Full Auto', 'Armor Penetrating', 'High Capacity', 'Huge(P)'],
		description: 'A heavy-duty coil-gun designed for sustained automatic fire with armor-penetrating capabilities. The high-capacity magazine and robust construction make it ideal for suppressive fire against armored targets.',
		restricted: true
	},
	{
		id: 'portable_rail_minigun',
		name: 'Portable Rail-Minigun',
		category: 'firearm',
		subcategory: 'heavy',
		cost: 10,
		wr: 7,
		range: 3,
		aspects: ['Full Auto', 'Armor Penetrating', 'High Capacity(P)', 'Huge(P)'],
		description: 'A devastating multi-barrel railgun system that fires electromagnetically accelerated projectiles at an extremely high rate. The rotating barrel design allows for continuous fire while maintaining extreme accuracy and armor penetration.',
		restricted: true
	},
	{
		id: 'heavy_pac_cannon',
		name: 'Heavy PAc Cannon',
		category: 'firearm',
		subcategory: 'heavy',
		cost: 12,
		wr: 9,
		range: 7,
		aspects: ['Beam Weapon', 'Particle Accelerator', '1 round cooldown', 'Anti-Vehicular', 'Huge(P)'],
		description: 'The ultimate in portable particle accelerator technology. This heavy cannon fires concentrated particle beams capable of destroying vehicles and fortifications. The power requirements necessitate a cooldown period between shots.',
		restricted: true
	},
	{
		id: 'grenade_launcher',
		name: 'Grenade Launcher',
		category: 'firearm',
		subcategory: 'heavy',
		cost: 6,
		range: 3,
		description: 'A shoulder-fired weapon system designed to launch explosive grenades at medium range. Can fire any standard grenade type including fragmentation, incendiary, and specialty rounds. Weapon Rating varies based on grenade type used.',
		notes: ['See Explosives table for damage', 'WR varies by grenade type'],
		restricted: true
	},
	{
		id: 'light_plasma_flamer',
		name: 'Light Plasma Flamer',
		category: 'firearm',
		subcategory: 'heavy',
		cost: 6,
		wr: 5,
		range: 2,
		aspects: ['Huge(P)', 'Incendiary', 'Environmental Hazard'],
		description: 'A directed-energy weapon that projects superheated plasma streams. Targets hit by the plasma suffer severe burns and the affected zone catches fire with intense heat.',
		notes: ['Targets hit + zone On Fire (Intensity 6 Environmental Hazard)'],
		restricted: true
	},
	{
		id: 'heavy_plasma_flamer',
		name: 'Heavy Plasma Flamer',
		category: 'firearm',
		subcategory: 'heavy',
		cost: 7,
		wr: 6,
		range: 2,
		aspects: ['Huge(P)', 'Incendiary', 'Environmental Hazard'],
		description: 'An enhanced plasma weapon that creates larger and more intense plasma streams. The increased power output results in more devastating burns and wider areas of intense fire.',
		notes: ['Targets hit + zone On Fire (Intensity 6 Environmental Hazard)'],
		restricted: true
	},
	{
		id: 'rocket_launcher',
		name: 'Rocket Launcher (RPG)',
		category: 'firearm',
		subcategory: 'heavy',
		cost: 10,
		wr: 9,
		range: 4,
		exr: 4,
		aspects: ['Explosive', 'Anti-Vehicular', 'Huge(P)', 'Slow Firing(P)'],
		description: 'A shoulder-fired rocket-propelled grenade launcher designed to destroy vehicles and fortifications. The high-explosive warhead delivers devastating damage but requires time to reload between shots.',
		restricted: true
	},
	{
		id: 'kinetic_strike_rail_cannon',
		name: 'Kinetic Strike Rail-Cannon',
		category: 'firearm',
		subcategory: 'heavy',
		cost: 11,
		wr: 10,
		exr: 5,
		aspects: ['Explosive', 'Anti-Vehicular', 'Huge(P)', 'Slow Firing(P)'],
		description: 'The most powerful portable railgun system available, firing ultra-high velocity projectiles that create explosive impacts. The kinetic energy is so intense that it produces explosive effects on impact.',
		restricted: true
	}
];

// Melee Weapons
export const meleeWeapons: GearItem[] = [
	// Blades
	{
		id: 'knife_dagger',
		name: 'Knife/Dagger',
		category: 'melee',
		subcategory: 'blade',
		cost: 0,
		wr: 1,
		range: '1 TH',
		aspects: ['Small'],
		description: 'A basic cutting implement that can serve as both tool and weapon. Knives and daggers are compact, easily concealed, and effective in close combat situations.',
		restricted: false
	},
	{
		id: 'machete',
		name: 'Machete',
		category: 'melee',
		subcategory: 'blade',
		cost: 1,
		wr: 2,
		range: 0,
		description: 'A broad, heavy blade originally designed for cutting through vegetation. The machete\'s weight and sharp edge make it an effective weapon for close combat.',
		restricted: false
	},
	{
		id: 'mono_edged_dagger',
		name: 'Dagger, Mono-Edged',
		category: 'melee',
		subcategory: 'blade',
		cost: 2,
		wr: 2,
		range: '1 TH',
		aspects: ['Small', 'Mono-Edged'],
		description: 'A dagger enhanced with mono-molecular edge technology. These bladed weapons feature an almost infinitely sharp edge created with a single carbon nanotube running the length of the blade.',
		restricted: false
	},
	{
		id: 'mono_edged_short_sword',
		name: 'Short Sword, Mono-Edged',
		category: 'melee',
		subcategory: 'blade',
		cost: 3,
		wr: 3,
		range: 0,
		aspects: ['Mono-Edged'],
		description: 'A balanced one-handed sword with mono-molecular edge technology. The mono-edge never needs sharpening and maintains its cutting ability indefinitely, though the leading edge may need replacement over time.',
		restricted: false
	},
	{
		id: 'mono_edged_longsword',
		name: 'Longsword, Mono-Edged',
		category: 'melee',
		subcategory: 'blade',
		cost: 4,
		wr: 4,
		range: 0,
		aspects: ['Large', 'Mono-Edged'],
		description: 'A two-handed sword with mono-molecular edge technology. This weapon combines the devastating cutting power of mono-edge construction with the reach and leverage of a longsword design.',
		restricted: true
	},
	{
		id: 'mono_edged_spear',
		name: 'Spear, Mono-Edged',
		category: 'melee',
		subcategory: 'blade',
		cost: 5,
		wr: 4,
		range: '1 TH',
		aspects: ['Large', 'Mono-Edged'],
		description: 'A polearm weapon with a mono-molecular edge spearhead. The spear\'s length allows attacks at greater distance while the mono-edge ensures devastating penetration.',
		restricted: true
	},
	{
		id: 'mono_edged_halberd',
		name: 'Halberd, Mono-Edged',
		category: 'melee',
		subcategory: 'blade',
		cost: 6,
		wr: 5,
		range: 0,
		aspects: ['Long', 'Huge(P)', 'Mono-Edged'],
		description: 'A massive polearm combining axe, spear, and hook into one devastating weapon, enhanced with mono-molecular edge technology. The halberd\'s exceptional reach and versatility make it formidable but unwieldy.',
		restricted: true
	},

	// Axes
	{
		id: 'hatchet',
		name: 'Hatchet',
		category: 'melee',
		subcategory: 'axe',
		cost: 0,
		wr: 1,
		range: '1 TH',
		aspects: ['Small'],
		description: 'A small, single-handed axe originally designed for cutting wood. Its compact size makes it easy to conceal and effective in close quarters combat.',
		restricted: false
	},
	{
		id: 'battle_axe_mono',
		name: 'Battle Axe, Mono-Edged',
		category: 'melee',
		subcategory: 'axe',
		cost: 4,
		wr: 4,
		range: 0,
		aspects: ['Large', 'Mono-Edged'],
		description: 'A two-handed battle axe enhanced with mono-molecular edge technology. The combination of the axe\'s crushing weight and the mono-edge\'s cutting power creates a devastatingly effective weapon.',
		restricted: true
	},

	// Blunt Weapons
	{
		id: 'unarmed',
		name: 'Punch/Kick',
		category: 'melee',
		subcategory: 'blunt',
		cost: 0,
		wr: 0,
		range: 0,
		aspects: ['Unarmed', 'Small'],
		description: 'Basic hand-to-hand combat using fists, elbows, knees, and feet. While not as effective as weapons, unarmed combat is always available and difficult to restrict.',
		restricted: false
	},
	{
		id: 'small_club',
		name: 'Small Club/Baton',
		category: 'melee',
		subcategory: 'blunt',
		cost: 0,
		wr: 1,
		range: 0,
		aspects: ['Small'],
		description: 'A short bludgeoning weapon, often used by security personnel. Its compact size allows for easy concealment while providing more striking power than bare hands.',
		restricted: false
	},
	{
		id: 'tonfa',
		name: 'Tonfa (Police Nightstick)',
		category: 'melee',
		subcategory: 'blunt',
		cost: 0,
		wr: 1,
		range: 0,
		aspects: ['Quick'],
		description: 'A side-handled baton favored by law enforcement. The tonfa\'s design allows for rapid strikes and defensive blocks, making it effective for crowd control and personal defense.',
		restricted: false
	},
	{
		id: 'hammer',
		name: 'Hammer',
		category: 'melee',
		subcategory: 'blunt',
		cost: 0,
		wr: 1,
		range: 0,
		description: 'A basic tool that doubles as an improvised weapon. The hammer\'s weighted head delivers focused impact, making it more effective than most improvised weapons.',
		restricted: false
	},
	{
		id: 'club_baseball_bat',
		name: 'Club/Baseball Bat',
		category: 'melee',
		subcategory: 'blunt',
		cost: 0,
		wr: 2,
		range: 0,
		aspects: ['Large'],
		description: 'A long wooden or metal club, often a repurposed baseball bat. Its length provides leverage for powerful strikes, though its size makes it difficult to conceal.',
		restricted: true
	},
	{
		id: 'large_club',
		name: 'Large Club',
		category: 'melee',
		subcategory: 'blunt',
		cost: 0,
		wr: 2,
		range: 0,
		aspects: ['Huge(P)'],
		description: 'A massive bludgeoning weapon that requires two hands to wield effectively. While devastatingly powerful, its enormous size makes it impractical in confined spaces.',
		restricted: true
	},
	{
		id: 'gravitic_baton',
		name: 'Gravitic Baton',
		category: 'melee',
		subcategory: 'blunt',
		cost: 3,
		wr: 3,
		range: 0,
		aspects: ['Gravitic'],
		description: 'A powered melee weapon that utilizes magnetic fields to amplify and redirect natural gravity. The weapon\'s impact is dramatically increased with additional kinetic force delivered to the target.',
		restricted: false
	},
	{
		id: 'gravitic_hammer',
		name: 'Gravitic Hammer',
		category: 'melee',
		subcategory: 'blunt',
		cost: 4,
		wr: 4,
		range: 0,
		aspects: ['Huge(P)', 'Gravitic'],
		description: 'A massive two-handed weapon combining traditional hammer design with gravitic amplification technology. The devastating impact force makes it extremely effective but difficult to wield in tight spaces.',
		restricted: true
	}
];

// Armor
export const armor: GearItem[] = [
	// Unpowered Armor
	{
		id: 'flight_suit',
		name: 'Flight Suit',
		category: 'armor',
		subcategory: 'unpowered',
		cost: 2,
		ar: 0,
		builtInFeatures: ['thermal_regulation'],
		maxFeatures: 0,
		restricted: false
	},
	{
		id: 'reinforced_clothing',
		name: 'Reinforced Clothing/Protective Vest',
		category: 'armor',
		subcategory: 'unpowered',
		cost: 3,
		ar: 1,
		maxFeatures: 0,
		restricted: false
	},
	{
		id: 'vacuum_suit',
		name: 'Vacuum Suit',
		category: 'armor',
		subcategory: 'unpowered',
		cost: 4,
		ar: 1,
		builtInFeatures: ['vacuum_sealed', 'air_pack', 'thermal_regulation'],
		aspects: ['Bulky'],
		maxFeatures: 0,
		restricted: false
	},
	{
		id: 'reinforced_vacuum_suit',
		name: 'Reinforced Vacuum Suit',
		category: 'armor',
		subcategory: 'unpowered',
		cost: 5,
		ar: 2,
		builtInFeatures: ['vacuum_sealed', 'air_pack', 'thermal_regulation'],
		aspects: ['Bulky'],
		maxFeatures: 1,
		restricted: false
	},
	{
		id: 'light_battle_armor',
		name: 'Light Battle Armor',
		category: 'armor',
		subcategory: 'unpowered',
		cost: 4,
		ar: 3,
		maxFeatures: 1,
		restricted: true
	},
	{
		id: 'heavy_battle_armor',
		name: 'Heavy Battle Armor',
		category: 'armor',
		subcategory: 'unpowered',
		cost: 5,
		ar: 4,
		maxFeatures: 1,
		restricted: true
	},

	// Powered Armor
	{
		id: 'powered_recon_armor',
		name: 'Powered Recon Armor',
		category: 'armor',
		subcategory: 'powered',
		cost: 7,
		ar: 4,
		builtInFeatures: ['vacuum_sealed', 'air_pack', 'thermal_regulation'],
		maxFeatures: 1,
		restricted: true
	},
	{
		id: 'powered_light_assault_armor',
		name: 'Powered Light Assault Armor',
		category: 'armor',
		subcategory: 'powered',
		cost: 9,
		ar: 5,
		builtInFeatures: ['vacuum_sealed', 'air_pack', 'thermal_regulation', 'reinforced_cyber_musculature'],
		maxFeatures: 2,
		restricted: true
	},
	{
		id: 'powered_heavy_assault_armor',
		name: 'Powered Heavy Assault Armor',
		category: 'armor',
		subcategory: 'powered',
		cost: 11,
		ar: 6,
		builtInFeatures: ['vacuum_sealed', 'air_pack', 'thermal_regulation', 'reinforced_cyber_musculature'],
		maxFeatures: 3,
		restricted: true
	}
];

// Explosives
export const explosives: GearItem[] = [
	{
		id: 'fragmentation_grenade',
		name: 'Fragmentation Grenade',
		category: 'explosive',
		cost: 4,
		exr: 6,
		area: 1,
		description: 'A standard anti-personnel explosive device that fragments upon detonation, sending deadly shrapnel in all directions to attack everyone in the target zone.',
		restricted: true
	},
	{
		id: 'incendiary_grenade',
		name: 'Incendiary Grenade',
		category: 'explosive',
		cost: 5,
		exr: 6,
		area: 1,
		notes: ['Targets hit + zone On Fire'],
		restricted: true
	},
	{
		id: 'stun_grenade',
		name: 'Stun Grenade',
		category: 'explosive',
		cost: 2,
		exr: 1,
		area: 1,
		notes: ['Targets hit are Stunned'],
		restricted: true
	},
	{
		id: 'gooper_grenade',
		name: 'Gooper Grenade',
		category: 'explosive',
		cost: 4,
		exr: 4,
		area: 1,
		description: 'A less-than-lethal explosive that blasts the area with super-sticky strands that entangle those caught in the spray. The gooper creates movement restrictions without causing direct physical harm.',
		notes: ['Less-than-lethal', 'Super-sticky strands', 'Entangles targets'],
		restricted: true
	},
	{
		id: 'hell_ball',
		name: 'Hell Ball',
		category: 'explosive',
		cost: 5,
		exr: 8,
		area: 1,
		aspects: ['Anti-Vehicular', 'Incendiary'],
		description: 'A thermobaric grenade that releases combustible gases before exploding for massive overpressure and extreme heat. The Hell Ball creates an inferno with tremendous heat and devastating shockwaves, making it highly effective against both personnel and structures.',
		notes: ['Thermobaric', 'Massive overpressure', 'Extreme heat'],
		restricted: true
	},
	{
		id: 'smoke_grenade',
		name: 'Smoke Grenade',
		category: 'explosive',
		cost: 2,
		area: 1,
		aspects: ['Concealment'],
		description: 'A non-lethal tactical device that creates a dense cloud of smoke to obscure vision and provide concealment. Often used by security forces for crowd control or tactical advantage.',
		notes: ['Creates Smokey aspect for scene'],
		restricted: false
	},
	{
		id: 'high_explosive_satchel',
		name: 'High Explosive Satchel Charge',
		category: 'explosive',
		cost: 8,
		exr: 10,
		area: 3,
		aspects: ['Anti-Vehicular', 'Demolitions'],
		description: 'A powerful demolition charge designed for breaching fortifications and destroying structures. The satchel charge requires skill to place effectively but can cause massive devastation over a large area.',
		notes: ['Uses Demolitions skill', 'Attack test uses Demolitions'],
		restricted: true
	}
];

// Equipment
export const equipment: GearItem[] = [
	{
		id: 'agent',
		name: 'Agent (AI Assistant)',
		category: 'equipment',
		subcategory: 'computing',
		cost: 4, // Base cost for Alpha
		er: 1, // Base ER for Alpha
		description: 'Agents are personal AI assistants that provide skill bonuses and computational support. These intelligent software programs are designed to augment human capabilities, offering expertise in various fields. Agents come in three levels: Alpha (basic AI assistance), Beta (advanced AI with broader expertise), and Gamma (sophisticated AI with comprehensive support capabilities).',
		restricted: false,
		hasVariants: true,
		variants: [
			{
				id: 'alpha',
				name: 'Alpha',
				description: 'Alpha-level Agent provides basic AI assistance with focused expertise in one area. This entry-level AI offers reliable support for routine tasks and simple analysis, making it accessible for most users who need computational augmentation in a specific field.',
				cost: 4,
				er: 1,
				selectableSkillBonuses: {
					count: 1,
					bonus: 1,
					restrictions: ['diplomacy', 'education', 'engineering_hardware', 'engineering_software', 'insight', 'mnemonics', 'research', 'strategy']
				}
			},
			{
				id: 'beta',
				name: 'Beta',
				description: 'Beta-level Agent provides advanced AI assistance with broader expertise across multiple disciplines. This mid-tier AI offers sophisticated analysis and can provide meaningful support in two areas of specialization.',
				cost: 7,
				er: 1,
				selectableSkillBonuses: {
					count: 2,
					bonus: 1,
					restrictions: ['diplomacy', 'education', 'engineering_hardware', 'engineering_software', 'insight', 'mnemonics', 'research', 'strategy']
				}
			},
			{
				id: 'gamma',
				name: 'Gamma',
				description: 'Gamma-level Agent represents the pinnacle of personal AI assistance, offering sophisticated computational support with deep expertise in one primary area and advanced capabilities in two additional fields. These top-tier AIs provide comprehensive analytical support.',
				cost: 10,
				er: 2,
				selectableSkillBonuses: [
					{
						count: 1,
						bonus: 2,
						restrictions: ['diplomacy', 'education', 'engineering_hardware', 'engineering_software', 'insight', 'mnemonics', 'research', 'strategy']
					},
					{
						count: 2,
						bonus: 1,
						restrictions: ['diplomacy', 'education', 'engineering_hardware', 'engineering_software', 'insight', 'mnemonics', 'research', 'strategy']
					}
				]
			}
		]
	},
	{
		id: 'ar_display_device',
		name: 'AR Display Device',
		category: 'equipment',
		subcategory: 'computing',
		cost: 2,
		description: 'AR display devices are wearable systems that display augmented reality content, most commonly taking the form of glasses (Cost 2) or contact lenses (Cost 3). When worn, AR display devices provide a rich information overlay of the area around the user, allowing them to interface with computers, networks, and other electronic devices through visual cues and gestures.',
		variants: [
			{ id: 'ar_glasses', name: 'Glasses', cost: 2, description: 'Standard AR glasses with heads-up display' },
			{ id: 'ar_contacts', name: 'Contact Lenses', cost: 3, description: 'Discreet contact lens AR system' }
		],
		restricted: false
	},
	{
		id: 'arid_tag',
		name: 'ARID Tag',
		category: 'equipment',
		subcategory: 'computing',
		cost: 0,
		description: 'ARID (Automated Registry of Individual Data) tags are small digital fingerprints that carry basic identification and contact information. They can be programmed with details such as name, occupation, contact information, medical data, and other relevant personal information. The Coalition requires all citizens to carry ARID tags at all times.',
		restricted: false
	},
	{
		id: 'arid_cloner',
		name: 'ARID Cloner',
		category: 'equipment',
		subcategory: 'computing',
		cost: 4,
		description: 'A specialized device used to copy and implant ARID information from one tag to another. This illegal technology allows users to clone identification data, enabling identity theft and circumvention of Coalition security systems.',
		restricted: true
	},
	{
		id: 'broadcast_screen',
		name: 'Broadcast Screen',
		category: 'equipment',
		subcategory: 'computing',
		cost: 4,
		description: 'A portable electromagnetic interference generator that creates a 2-meter radius shell blocking all transmissions and electronic communications. The interference provides significant protection against hacking attempts but also prevents outgoing communications.',
		restricted: false
	},
	{
		id: 'compiler_home',
		name: 'Compiler (Home)',
		category: 'equipment',
		subcategory: 'manufacturing',
		cost: 6,
		description: 'A home-scale nanomachine assembler capable of creating simple objects and materials from raw components. The system is Coalition-locked to prevent manufacturing of restricted items or weapons.',
		restricted: false
	},
	{
		id: 'compiler_industrial',
		name: 'Compiler (Industrial)',
		category: 'equipment',
		subcategory: 'manufacturing',
		cost: 12,
		description: 'A large-scale industrial nanomachine assembler capable of manufacturing complex equipment, vehicles, and structures. The system remains Coalition-locked to prevent unauthorized production of restricted materials.',
		restricted: true
	},
	{
		id: 'credit_disk',
		name: 'Credit Disk',
		category: 'equipment',
		subcategory: 'financial',
		cost: 0,
		description: 'A reprogrammable transaction device used for underground banking and anonymous financial transactions. Credit disks allow users to store and transfer funds without leaving digital trails through official Coalition banking systems.',
		restricted: false
	},
	{
		id: 'cist',
		name: 'CIST (Cyber-Intrusion and Security Terminal)',
		category: 'equipment',
		subcategory: 'computing',
		cost: 10, // Base cost for standard variant
		description: 'Purpose-built computer for running cyber-intrusion software. Choose configuration type.',
		restricted: true,
		hasVariants: true,
		variants: [
			{
				id: 'savant_program',
				name: 'Savant Program CIST',
				description: 'Allows non-Savant characters to use a single Savant Program. Uses Software Engineering instead of SINC. Cannot be used more than once per scene.',
				cost: 10,
				selectableSavantPrograms: {
					count: 1,
					restrictions: [] // Can select any Savant Program
				}
			},
			{
				id: 'cyber_warfare',
				name: 'Cyber-Warfare Suite (CWS)',
				description: 'Upgraded systems capable of electronic attacks against enemies within sensor range. Provides +1 bonus on system attack rolls.',
				cost: 12,
				cyberWarfareLevel: 1
			},
			{
				id: 'cyber_warfare_enhanced',
				name: 'Enhanced Cyber-Warfare Suite',
				description: 'Advanced CWS providing +2 bonus on system attack rolls against enemies within sensor range.',
				cost: 15,
				cyberWarfareLevel: 2
			},
			{
				id: 'cyber_warfare_superior',
				name: 'Superior Cyber-Warfare Suite',
				description: 'Top-tier CWS providing +3 bonus on system attack rolls against enemies within sensor range.',
				cost: 20,
				cyberWarfareLevel: 3
			},
			{
				id: 'defensive',
				name: 'Defensive CIST',
				description: 'Adds +3 to execution difficulty of any Savant Program attempt against the user or chosen computer system.',
				cost: 8
			}
		]
	},
	{
		id: 'false_cid',
		name: 'False CID',
		category: 'equipment',
		subcategory: 'identity',
		cost: 5, // Base cost - lowest variant
		er: 1, // Base ER - lowest variant
		description: 'Fake Coalition identity with selectable quality levels',
		restricted: true,
		hasVariants: true,
		variants: [
			{
				id: 'basic',
				name: 'Basic',
				cost: 5,
				er: 1,
				description: 'Fake identity (Rep 4, ER +1, detection test Diff 2)'
			},
			{
				id: 'advanced',
				name: 'Advanced',
				cost: 7,
				er: 2,
				description: 'Fake identity (Rep 5, ER +2, detection test Diff 2)'
			},
			{
				id: 'superior',
				name: 'Superior',
				cost: 9,
				er: 3,
				description: 'Fake identity (Rep 6, ER +3, detection test Diff 2)'
			},
			{
				id: 'elite',
				name: 'Elite',
				cost: 11,
				er: 4,
				description: 'Fake identity (Rep 7, ER +4, detection test Diff 2)'
			}
		]
	},
	{
		id: 'holomask',
		name: 'HoloMask',
		category: 'equipment',
		subcategory: 'disguise',
		cost: 6,
		er: 2,
		description: 'A sophisticated holographic disguise system that projects a realistic face over the wearer\'s actual features. The advanced hologram technology provides a convincing visual disguise that can fool most observers and surveillance systems.',
		restricted: true
	},
	{
		id: 'neural_link',
		name: 'Neural Link',
		category: 'equipment',
		subcategory: 'computing',
		cost: 3,
		description: 'A direct neural interface device that allows thought-to-computer communication. The neural link enables users to interact with computer systems and networks using only mental commands, providing faster and more intuitive control than traditional interfaces.',
		restricted: false
	},
	{
		id: 'ppc',
		name: 'Portable Personal Computer (PPC)',
		category: 'equipment',
		subcategory: 'computing',
		cost: 5, // Base cost for Alpha variant
		description: 'Ranges from wrist-worn systems to tablets. Interacted with by voice commands or AR display/interface devices. Always equipped with an Agent and other software programs.',
		variants: [
			{ id: 'personal_computer_alpha', name: 'Alpha', cost: 5, description: 'Personal computer with Alpha Agent' },
			{ id: 'personal_computer_beta', name: 'Beta', cost: 8, description: 'Personal computer with Beta Agent' },
			{ id: 'personal_computer_gamma', name: 'Gamma', cost: 11, description: 'Personal computer with Gamma Agent' }
		],
		restricted: false
	},
	{
		id: 'vr_interface',
		name: 'VR Interface (Ego Channel)',
		category: 'equipment',
		subcategory: 'computing',
		cost: 3,
		description: 'A virtual reality interface system that provides full virtuality access for non-Apotheosis users. The ego channel technology allows complete immersion in virtual environments and digital spaces that would normally require Apotheosis augmentation.',
		restricted: false
	},

	// Survival & Exploration
	{
		id: 'aerial_condenser',
		name: 'Aerial Condenser',
		category: 'equipment',
		subcategory: 'survival',
		cost: 2,
		description: 'A portable atmospheric water extraction device that condenses moisture from the air to produce clean drinking water. The condenser can produce approximately one gallon of water every three hours, making it invaluable for survival in arid environments.',
		restricted: false
	},
	{
		id: 'ballistic_cartographer',
		name: 'Ballistic Cartographer',
		category: 'equipment',
		subcategory: 'exploration',
		cost: 4,
		description: 'An advanced mapping system that fires sensor projectiles to scan unknown areas and create detailed real-time 3D maps. The ballistic sensors can penetrate difficult terrain and provide comprehensive environmental data for exploration and tactical planning.',
		restricted: false
	},
	{
		id: 'box_tent',
		name: 'Box Tent',
		category: 'equipment',
		subcategory: 'survival',
		cost: 2,
		description: 'A compact survival shelter that unfolds from a book-sized container into a fully functional tent for two people. The tent includes integrated climate control systems to maintain comfortable temperatures in any environment.',
		restricted: false
	},
	{
		id: 'esper_swarm',
		name: 'Esper Swarm',
		category: 'equipment',
		subcategory: 'utility',
		cost: 7,
		description: 'A programmable nanomachine swarm capable of performing various tasks including surveillance, construction, and repair. The swarm requires a Queen server (cost 10) to coordinate complex operations and maintain nanomachine communication.',
		restricted: false
	},
	{
		id: 'fiberscope',
		name: 'Fiberscope',
		category: 'equipment',
		subcategory: 'surveillance',
		cost: 2,
		description: 'A flexible fiber-optic surveillance device capable of multi-spectrum imaging and audio recording. The fiberscope can be threaded through small spaces to observe areas without detection, making it ideal for reconnaissance and security applications.',
		restricted: false
	},
	{
		id: 'spatial_camera_4d',
		name: '4D Spatial Camera',
		category: 'equipment',
		subcategory: 'surveillance',
		cost: 3,
		description: '3D environment mapping with AR/VR display',
		restricted: false
	},
	{
		id: 'molecular_glue',
		name: 'Molecular Glue & Solvent',
		category: 'equipment',
		subcategory: 'utility',
		cost: 1,
		description: 'Near-permanent adhesive with removal solution',
		restricted: false
	},
	{
		id: 'plasti_rope',
		name: 'Plasti-Rope Dispenser',
		category: 'equipment',
		subcategory: 'utility',
		cost: 1,
		description: '100m liquid-to-rope dispenser (4-ton capacity)',
		restricted: false
	},
	{
		id: 'plasma_torch',
		name: 'Portable Plasma Torch',
		category: 'equipment',
		subcategory: 'tool',
		cost: 3,
		wr: 1,
		description: 'Precision cutting tool (WR 1 as weapon)',
		restricted: false
	},
	{
		id: 'broadcast_power_generator',
		name: 'Broadcast Power Generator',
		category: 'equipment',
		subcategory: 'utility',
		cost: 6,
		description: '100m range wireless power (briefcase to building size)',
		restricted: false
	},
	{
		id: 'spider_gear_kit',
		name: 'Spider Gear Kit',
		category: 'equipment',
		subcategory: 'utility',
		cost: 2,
		description: 'Adhesive climbing gear for any surface',
		restricted: false
	},
	{
		id: 'telepresence_sensor',
		name: 'Tele-presence Sensor Unit',
		category: 'equipment',
		subcategory: 'surveillance',
		cost: 3,
		description: '360° remote viewing with hologram projection',
		restricted: false
	},

	// Medical & Enhancement
	{
		id: 'cri',
		name: 'CRI (Cyber-Repair Injection)',
		category: 'equipment',
		subcategory: 'medical',
		cost: 3,
		description: 'Cyber-repair nanites (heals cybernetic consequences faster)',
		restricted: false
	},
	{
		id: 'hostware',
		name: 'Hostware',
		category: 'equipment',
		subcategory: 'computing',
		cost: 7,
		description: 'Software suite for hosting active egos in computers',
		restricted: false
	},
	{
		id: 'msi',
		name: 'MSI (Medi-Stimulant Injection)',
		category: 'equipment',
		subcategory: 'medical',
		cost: 3,
		description: 'Medical nanites (heals biological consequences faster)',
		restricted: false
	},
	{
		id: 'ration_lozenge',
		name: 'Ration Lozenge',
		category: 'equipment',
		subcategory: 'survival',
		cost: 1,
		description: 'Half-day nutrition that expands with water',
		restricted: false
	},
	{
		id: 'resurrection_chamber',
		name: 'Resurrection Chamber',
		category: 'equipment',
		subcategory: 'medical',
		cost: 12,
		description: 'Room-sized ego download/resleeving facility',
		restricted: true
	},
	{
		id: 'targeting_support_module',
		name: 'Targeting Support Module',
		category: 'equipment',
		subcategory: 'weapon_accessory',
		cost: 4,
		description: 'Weapon-mounted targeting system',
		restricted: true
	}
];

// All gear combined
export const allGear: GearItem[] = [
	...firearms,
	...meleeWeapons,
	...armor,
	...explosives,
	...equipment
];

// Gear by category for easy filtering
export const gearByCategory = {
	firearm: firearms,
	melee: meleeWeapons,
	armor: armor,
	explosive: explosives,
	equipment: equipment
};
