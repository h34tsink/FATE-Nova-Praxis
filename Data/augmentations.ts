import type { Augmentation } from '../types';

// NOTE: Augmentations listed in a sleeve's includedAugmentations array (see nova-praxis-sleeves.ts)
//       should NOT count against augmentationPoints. The character creator logic must ignore these for AP calculations.
//       Cosmetic choices (e.g. cosmetic_customization_or_striking_looks) should be handled as a choice, not as two separate augments.

const augmentations: Augmentation[] = [
  // Superscript ¹⁵: Free with sleeve purchase AND does not count against aug limit
  { 
    id: 'apotheosis', 
    name: 'Apotheosis', 
    short: 'Required for sleeves; grants mindset and mnemonic core.',
    long: 'Your sleeve has undergone Apotheosis and features a mindset and mnemonic core, granting the Apotheosized Aspect. The Mindset functions as an implanted PPC, hosting the ego and providing an onboard computer system with an augmented reality interface. Capable of storing data (including sensies) and running programs, connecting wirelessly to the Extranet, and featuring a data jack. Comes with a free Alpha Agent and data jack. The Mnemonic Core is a hardened, shielded memory module storing personality and memories. Used to upload ego into new sleeves, making digital data (including Savant SINC) transition as well. Offers virtual immortality despite the psychological trauma of resleeving. Drawbacks include susceptibility to computer attacks and Purist prejudice.',
    av: 3, 
    freeWith: 'sleeve_purchase', 
    onlyFor: ['sleeve'],
    countsAgainstLimit: false // ⁵: Does not count against aug limit
  },
  
  // Superscript ⁴⁵: Cybersleeve only AND does not count against aug limit
  { 
    id: 'fully_synthetic', 
    name: 'Fully Synthetic', 
    short: 'Sleeve is completely synthetic with no biological components.',
    long: 'Sleeve is completely synthetic, with no biological components. Non-magnetic metal skeleton driven by synthetic muscles for fine motor control, strength, and durability. Gains Synthetic Biology(P) Aspect, representing composition and ego fragmentation tendency. Can be compelled during Cohesion tests, especially resleeving, or for difficulties with those prejudiced against posthumans. Ego housed in cyberbrain with mnemonic core. Requires 2 hours of "sleep" daily for Agent to repair psychological damage.', 
    av: 'N/A', 
    onlyFor: ['cybersleeve'],
    countsAgainstLimit: false // ⁵: Does not count against aug limit
  },
  
  // Superscript ⁵: Does not count against aug limit
  { 
    id: 'cosmetic_customization', 
    name: 'Cosmetic Customization', 
    short: 'Custom features like crystalline canines or glowing eyes.',
    long: 'Custom features like crystalline canines or glowing eyes, primarily cosmetic. Gains an Aspect describing the modification. Does not count against aug limit. Purchasing more than once for human or biosleeve violates HPA.',
    av: 1,
    countsAgainstLimit: false // ⁵: Does not count against aug limit
  },
  
  // Superscript ⁵: Does not count against aug limit
  { 
    id: 'striking_looks', 
    name: 'Striking Looks', 
    short: 'Sleeve is exceptionally attractive.',
    long: 'Sleeve is exceptionally attractive. Gains Striking Looks Aspect. Does not count against aug limit. Note: Cybersleeve must have Bio-Skin Sheath with Seemingly Real upgrade.', 
    av: 1,
    countsAgainstLimit: false // ⁵: Does not count against aug limit
  },
  
  // Superscript ⁵: Does not count against aug limit
  { 
    id: 'bio_skin_sheath', 
    name: 'Bio-Skin Sheath', 
    short: 'Natural skin-like covering for cybernetic limbs or sleeves.',
    long: 'A natural skin-like substance for covering cybernetic limbs or cybersleeves. Identifiable by lack of hair, glossy texture, and visible seams. Registers as synthetic to chemical sniffers, SMR transceivers, and animals. Improves tactile sensation, making the sleeve feel more alive. If fully sheathing a cybersleeve, the Synthetic Biology Aspect is no longer Persistent.', 
    av: 1, 
    onlyFor: ['cybersleeve', 'sleeve'],
    countsAgainstLimit: false // ⁵: Does not count against aug limit
  },
  
  // Superscript ⁵: Does not count against aug limit
  { 
    id: 'optimized_power_system', 
    name: 'Optimized Power System', 
    short: 'Top-of-the-line power management for cyberware efficiency.',
    long: 'Cyberware Augmentations depend on a top-of-the-line power management system for efficient power distribution and storage. Once per scene, you may invoke an Aspect from a cyberware Augmentation for free. Increases total number of augmentations your body/sleeve can support by +1, and does not count against total.', 
    av: 1, 
    onlyFor: ['cybersleeve'],
    countsAgainstLimit: false, // ⁵: Does not count against aug limit
    increasesMaxAugCountBy: 1 // Increases total aug slots by +1
  },
  
  // Superscript ³⁵: Human/Biosleeve only AND does not count against aug limit
  { 
    id: 'exceptional_genegineering', 
    name: 'Exceptional Genegineering', 
    short: 'Enhanced biological design; may be free if included.', 
    long: 'Exceptional genetic design and engineering enhance the biological structure, providing superior performance and capabilities.',
    av: 1, 
    onlyFor: ['biosleeve'],
    countsAgainstLimit: false, // ⁵: Does not count against aug limit
    increasesMaxAugCountBy: 1 // Increases total aug slots by +1
  },
  
  // Complete augmentation list from Nova Praxis guide
  {
    id: 'adrenal_boost_module',
    name: 'Adrenal Boost Module',
    short: 'Trigger adrenaline surge for enhanced athletics and combat.',
    long: 'Allows you to trigger an adrenaline surge at will, increasing Athletics and Melee Skills by +1, and increasing stress absorbed by Physical Consequences by +1 for the duration. Lasts for rounds equal to your Endurance, after which you gain the Got the Shakes Aspect.',
    av: 1,
    onlyFor: ['human', 'biosleeve'], // ³: Human/biosleeve only
    freeWith: 'sleeve_purchase' // ¹: Free with sleeve purchase
  },
  {
    id: 'alternative_mobility_system', 
    name: 'Alternative Mobility System',
    short: 'Replace legs with alternate locomotion (wheels, spider legs, etc.).',
    long: 'Replace your natural legs with an alternative locomotion system such as wheels, spider legs, snake-like undulation, or other non-human movement methods.',
    av: 1,
    violatesHPA: true // ⁶: HPA violation when applied as bioware
  },
  {
    id: 'arterial_toxin_filter',
    name: 'Arterial Toxin Filter', 
    short: 'Heart filter cleanses toxins/bacteria, aids resistance and healing.',
    long: 'A sophisticated filter system integrated into the circulatory system that cleanses toxins and harmful bacteria from the bloodstream, providing enhanced resistance to poisons and diseases while accelerating natural healing processes.',
    av: 1,
    onlyFor: ['human', 'biosleeve'] // ³: Human/biosleeve only
  },
  {
    id: 'auditory_amp_filter',
    name: 'Auditory Amp and Filter Module',
    short: 'Enhanced hearing and background noise filtering.',
    long: 'An implant replacing the inner ear, allowing enhanced hearing and filtering out background noise. Grants the Auditory Amplifier and Filtering Module(P) Aspect.',
    av: 1
  },
  {
    id: 'beholder_sensory_suite',
    name: 'Beholder Sensory Suite',
    short: 'Distributed sensors provide 360° vision.',
    long: 'Dozens of tiny sensors across the sleeve feed visual data for full 360-degree vision. Grants the Beholder Sensory Suite(P) Persistent Aspect.',
    av: 2,
    requiresApotheosis: true // ²: Requires Apotheosis
  },
  {
    id: 'cogware_partition',
    name: 'Cogware Partition',
    short: 'Mindset partition for streaming temporary skills and knowledge.',
    long: 'Mindset partition for cogware, which streams self-contained data packets into conscious mind, allowing tasks you normally would not know how to perform. Activating loads a cogware piece, gaining a representative Aspect (e.g., Kung-fu Master, Brain Surgeon). Each piece purchased separately (standard cost 4, high-quality (P) cost 8), with one free standard piece upon purchase of the aug. Stresses mind and systems; requires Cohesion test to activate.',
    av: 3,
    restricted: true, // General restriction
    requiresApotheosis: true // ²: Requires Apotheosis
  },
  {
    id: 'crypto_laser_link',
    name: 'Crypto-Laser Link',
    short: 'IR laser transceiver for encrypted, invisible communication.',
    long: 'IR laser transceiver for encrypted, invisible, and silent wireless communication with another transceiver. Mental commands if you have a mindset, otherwise via PPC.',
    av: 1
  },
  {
    id: 'custom_built',
    name: 'Custom Built',
    short: 'Sleeve customized for specific task or environment.',
    long: 'Sleeve custom-built for a specific task (e.g., high-gravity worlds, harsh climates, stealth, intimidation). Sleeve gains an Aspect describing its special task.',
    av: 1,
    onlyFor: ['sleeve'],
    requiresApotheosis: true
  },
  {
    id: 'data_jack',
    name: 'Data Jack and Storage',
    short: 'Wired interface to external systems and storage.',
    long: 'A port on body/sleeve for wired connection to an outside system, connecting to a data storage device. With a mindset, can allow read/write access to partitions.',
    av: 1,
    freeWith: 'apotheosis'
  },
  {
    id: 'els_system',
    name: 'ELS System',
    short: 'Emergency life support auto-activates under lethal threat.',
    long: 'Emergency life support system installed in torso, activated automatically by life-threatening danger (poison, toxins, starvation, dehydration). Stops heart, pumps oxygenated blood, administers nutrients and pain killers. Pain killers last 12 hours, during which Severe Physical Consequences are not Persistent. Prevents poison attacks for 12 hours. Cannot be used again for 48 hours.',
    av: 2,
    onlyFor: ['human', 'biosleeve']
  },
  {
    id: 'esper_vent',
    name: 'Esper Vent',
    short: 'Hollow sections host esper swarm with venting capability.',
    long: 'Parts of sleeve replaced with hollow synthetic sections to store an esper swarm, with vents for emergence. Commonly in arms.',
    av: 1
  },
  {
    id: 'extra_limb',
    name: 'Extra Limb',
    short: 'Additional prehensile limbs for grappling/climbing/complex tasks.',
    long: 'One or more additional prehensile limbs (genetic tampering or cybernetic grafts). Grants a Persistent Aspect (e.g., Prehensile Tail(P), Cybernetic Tentacle(P)). Can be invoked for bonuses on grappling, climbing, running, or complex work.',
    av: 2,
    requiresApotheosis: true,
    violatesHPA: true, // When applied as bioware
    restricted: true // On biosleeves
  },
  {
    id: 'fibro_muscle_weave',
    name: 'Fibro-Muscle Weave',
    short: 'Synthetic fibers woven into muscles for superhuman strength.',
    long: 'Muscles woven with synthetic fibers for super-human strength. Grants the Fibro-Muscle Weave Aspect, invokable for Athletics tests and melee/thrown weapon attack tests (after hitting).',
    av: 2,
    onlyFor: ['human', 'biosleeve']
  },
  {
    id: 'gills_gene_graft',
    name: 'Gills Gene-Graft',
    short: 'Fish-like gills allow oxygen extraction from water.',
    long: 'Neck sports fish-like gills through genetic manipulation, allowing oxygen extraction from water. Can still breathe air. Technically violates HPA, but granted an exception.',
    av: 1,
    onlyFor: ['human', 'biosleeve']
  },
  {
    id: 'gyroscopic_stabilizers',
    name: 'Gyroscopic Stabilizers',
    short: 'Small gyros stabilize for motor control and reduce recoil.',
    long: 'Wrists and elbows outfitted with small gyroscopes to stabilize hands for motor control and reduce firearm recoil. Grants Gyro-Stabilized Aspect, invokable for delicate tasks, full-auto attacks, or placing In My Sights Aspect.',
    av: 2
  },
  {
    id: 'hidden_weapon_system',
    name: 'Hidden Weapon System',
    short: 'Built-in hidden weapon mount (blade or firearm).',
    long: 'Sleeve features a hidden weapon (e.g., retractable blade, shoulder-mounted PAc gun). Weapon must be acquired separately, then purchased for installation. Can be purchased multiple times if GM agrees there is room.',
    av: 1,
    restricted: true
  },
  {
    id: 'light_screen_camouflage',
    name: 'Light Screen Camouflage',
    short: 'Magnetic field generators bend light for near-invisibility.',
    long: 'Skin woven with magnetic field generators that bend light, making you nearly invisible to visible and IR light. Grants +3 bonus on Stealth tests when not moving, or +2 bonus when moving.',
    av: 2,
    restricted: true
  },
  {
    id: 'massive_size',
    name: 'Massive Size',
    short: 'Sleeve is Size 1 and 3-4 meters tall; +1 WR to melee attacks.',
    long: 'Sleeve is huge, towering 3-4 meters. Cybersleeves of this size are rare but exist for heavy lifting/fine motor control. Massive-sized biosleeves are illegal per HPA, but aberrants may use them. Sleeves are Size 1, gain +1 bonus to WR of all melee weapon attacks, and gain the Massive Aspect.',
    av: 1,
    onlyFor: ['sleeve'],
    violatesHPA: true, // When applied to biosleeves
    restricted: true // On biosleeves
  },
  {
    id: 'medichine_factory',
    name: 'Medichine Factory',
    short: 'Nanomachine factory aids natural healing mechanisms.',
    long: 'Small nanomachine factory implanted to aid natural healing mechanisms (stop bleeding, close wounds, ward off infection). Reduces time for Physical Consequences to degrade by 1 time increment.',
    av: 2,
    onlyFor: ['human', 'biosleeve']
  },
  {
    id: 'nano_cyber_limb',
    name: 'Nano-Cyber Limb',
    short: 'Nanocybernetic prosthetic with strength and unique articulation.',
    long: 'One limb replaced with a nanocybernetic prosthetic (synthetic limb with non-magnetic metal skeleton and artificial muscles). Controlled via nervous system. Stronger than natural limbs and capable of unnatural bending/rotation. Provides vague sense of touch/pain. Gains an Aspect (e.g., Cyber-Arm, Shiny New Leg), invokable for strength/versatility benefits.',
    av: 1,
    onlyFor: ['human', 'biosleeve']
  },
  {
    id: 'neura_surge',
    name: 'Neura-Surge',
    short: 'Overclocks nerves/muscles for instant action and interrupt capability.',
    long: 'Augmented nervous system threads body/sleeve, sending mind and body into overdrive when activated. Allows you to move and process info so quickly that the world appears to slow down. Activation is an Instant Action, can interrupt another\'s turn, and allows immediate Simple Action. Cannot be activated more than once per turn. Stresses muscles/nervous system, requiring Endurance test to activate (Difficulty 4). Failure results in physical stress equal to amount failed by.',
    av: 2,
    restricted: true
  },
  {
    id: 'particle_detection_analysis',
    name: 'Particle Detection and Analysis Suite',
    short: 'Advanced sensors for detecting and analyzing particles.',
    long: 'Advanced sensors for detecting and analyzing particles. Provides detailed information about atmospheric composition, trace chemicals, and airborne substances.',
    av: 1
  },
  {
    id: 'performance_enhanced',
    name: 'Performance Enhanced',
    short: 'Sleeve quality boost: +1 rank in chosen Physical Skill.',
    long: 'Sleeve is well-built and higher quality, granting 1 additional Skill Rank in a Physical Skill of your choosing. This bonus allows surpassing the normal max rank of 5. Can be purchased up to three times, each time for a different Physical Skill.',
    av: 1,
    onlyFor: ['sleeve']
  },
  {
    id: 'pheromone_control',
    name: 'Pheromone Control & Sensitivity',
    short: 'Emit and sense pheromones for subtle influence and emotional reads.',
    long: 'Ability to emit desired pheromones for subtle emotional influence, and actively sense others\' pheromones. Once per scene, can gain +2 bonus on tests to convince biological beings or determine their emotional state.',
    av: 1,
    onlyFor: ['human', 'biosleeve']
  },
  {
    id: 'physiological_behavior_mods',
    name: 'Physiological Behavior Mods',
    short: 'Genetic tweaks induce specific emotional/behavioral drives.',
    long: 'Genetic code modifications trigger specific emotional responses (e.g., desire to bond, urge to hunt, overactive libido). Gains an Aspect reflecting built-in behavior (e.g., Pack Mentality, Insatiable Curiosity, Solitary Predator).',
    av: 1,
    onlyFor: ['human', 'biosleeve']
  },
  {
    id: 'poison_gland',
    name: 'Poison Gland',
    short: 'Produces toxin (commonly in saliva). Basic: two uses/day, Potency 4.',
    long: 'Body/sleeve can produce a toxin, most commonly released into saliva for administration via kiss or bite. Basic version produces two uses of Potency 4 poison per day.',
    av: 2,
    restricted: true
  },
  {
    id: 'reinforced_skeleton',
    name: 'Reinforced Skeleton',
    short: 'Ceramics and metals reinforce bones; Severe/Extreme Consequences absorb +3.',
    long: 'Body/sleeve heavily fortified with ceramics and non-magnetic metals, making bones/frame nearly indestructible. Increases stress absorbed when taking a Severe or Extreme Physical Consequence by +3.',
    av: 2
  },
  {
    id: 'retinal_implant',
    name: 'Retinal Implant',
    short: 'Nanocybernetic eye with zoom and enhanced low-light detail.',
    long: 'One eye replaced by a nanocybernetic prosthetic. Functions like normal eye but with zoom capabilities and enhanced detail detection in the dark. Pairs with computers for entoptic display and AR interface. Gains Retinal Implant Aspect. (Note: Cybersleeve eyes have normal resolution without this aug).',
    av: 1
  },
  {
    id: 'retractable_claws',
    name: 'Retractable Claws',
    short: 'Razor-sharp catlike claws emerging from beneath fingernails.',
    long: 'Hands outfitted with razor-sharp catlike claws emerging from beneath fingernails. Weapon Rating of 2. If also have Poison Gland, can administer poison with claw attack.',
    av: 1,
    restricted: true
  },
  {
    id: 'sim_cell_module',
    name: 'SIM-Cell Module',
    short: 'Mindset partition and second mnemonic core to host another ego.',
    long: 'Mindset has a special partition and second mnemonic core to host another ego. The residing SIM can dwell in its home environment or view the real world through host\'s senses. Can use host\'s mindset systems if allowed. Host retains full control of body and senses.',
    av: 1,
    requiresApotheosis: true
  },
  {
    id: 'skinweave_armor',
    name: 'Skinweave Armor',
    short: 'Spider silk/graphene mesh woven into skin; +1 Armor Rating.',
    long: 'Skin (or bio-skin sheath) woven with a mesh of spider silk and graphene, making it strong and resistant to damage without affecting outward appearance. Gains an Armor Rating of +1, which stacks with other armor.',
    av: 1
  },
  {
    id: 'smr_transceiver',
    name: 'SMR Transceiver and Translation Suite',
    short: 'Sub-millimeter radiation sensors allow seeing through materials.',
    long: 'Sensors emit and receive sub-millimeter radiation to see through objects like clothing, paper, wood, plastic, ceramics. Cannot penetrate skin, water, or metal, hampered by moisture. Handy for detecting hidden weapons. Poorer resolution than normal sight.',
    av: 1
  },
  {
    id: 'smugglers_compartment',
    name: 'Smuggler\'s Compartment',
    short: 'Hidden insulated compartment for small item concealment.',
    long: 'A disguised, insulated compartment in body to store an item (fist-sized/small pistol). Will not set off metal detectors, but contents visible with X-Ray scanners unless upgraded with charlatan.',
    av: 1,
    restricted: true
  },
  {
    id: 'sonar_reception_array',
    name: 'Sonar Reception Array',
    short: 'Audio-based echolocation feeds visual cortex for real-time sonar.',
    long: 'Sensors on face/neck analyze sound, compiling data for the brain\'s visual cortex, granting real-time sonar. Allows "seeing" in the dark and perceiving objects covered by a light screen. Gains Sonar Reception Array(P) Persistent Aspect.',
    av: 2
  },
  {
    id: 'stillness_body_lock',
    name: 'Stillness Body Lock System',
    short: 'Joint locks and oxygen store for extended breath-holding.',
    long: 'Nanocybernetically modified joints can be selectively locked, and system stores oxygen for extended breath-holding. Popular for posing or precision shooting (eliminates involuntary movement/breathing). Gains Stillness Body Lock System Aspect.',
    av: 1
  },
  {
    id: 'subdermal_plating',
    name: 'Subdermal Plating',
    short: 'Thin flexible armor beneath skin; Mild/Moderate Consequences absorb +2.',
    long: 'Layer of thin, flexible armor woven beneath skin. Not visible to casual observer. Can deflect bullets and blades. Increases stress absorbed by Mild or Moderate Physical Consequences by +2 (e.g., Moderate absorbs 6 instead of 4).',
    av: 2
  },
  {
    id: 'synthesis',
    name: 'Synthesis',
    short: 'Nanocybernetic fibers woven through tissue; pinnacle of evolution.',
    long: 'Process weaves nanocybernetic fibers through living tissues, transforming body into seamless blend of man and machine. Makes body tougher, stronger, and allows finer control/sensitivity. Seen as pinnacle of human evolution by transhumanists, but viewed with disgust by Purists (who have killed synthesized individuals). Synthesized bodies look normal but have metallic luster and slight eye glow. Gains Synthesized Biological Perfection Aspect. Immune to poisons and disease, unaffected by prolonged microgravity exposure.',
    av: 3,
    onlyFor: ['biosleeve'],
    requiresApotheosis: true
  },
  {
    id: 'targeting_support_system',
    name: 'Targeting Support System',
    short: '+1 on ranged attacks with synced firearms; integrates hand/arm/mindset sensors.',
    long: 'Sensors in hand, arm, and mindset sync with a targeting support module to enhance firearm aim. Guidance software snaps weapon on target, guiding arm. Gains +1 bonus on all ranged attacks with firearms equipped with a synced module.',
    av: 2,
    restricted: true
  },
  {
    id: 'tiny_size',
    name: 'Tiny Size',
    short: 'Sleeve is Size -1 (less than 1 meter tall); +1 Stealth and Athletics defense.',
    long: 'Sleeve is very small, less than a meter tall. Cybersleeves useful for sneaking into secured locations or small areas. Biosleeves of this size are illegal per HPA. Size limited to human baby or small dog size to house mindset. Sleeves are Size -1, suffer -1 penalty to WR of unarmed/melee attacks. Gains +1 bonus on Stealth tests and Athletics-based defense tests. Gains Tiny Aspect.',
    av: 2,
    onlyFor: ['sleeve'],
    violatesHPA: true, // When applied to biosleeves
    restricted: true // On biosleeves
  }
];

export default augmentations;
