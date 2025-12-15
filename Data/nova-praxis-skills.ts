// Nova Praxis Skills Data
// import type { Skill } from '../types'; // Disabled: Skill type not exported

export const skillsData = [
  {
    id: 'assets',
    name: 'Assets',
    type: 'Standard Skill',
    description:
      'The general measure of your wealth, be it a stash of gold, valuable art, ownership of land, a habitat, a vehicle, and so on. Assets determines how many restricted items you can begin play with, and is used to buy black market goods.'
  },
  {
    id: 'cohesion',
    name: 'Cohesion',
    type: 'Standard Skill',
    description:
      "Your mental stability and sense of self. It's the ability to deal with psychological trauma, retain your humanity, and recover from resurrection. Adds to your Mental Stress Track."
  },
  {
    id: 'demolitions',
    name: 'Demolitions',
    type: 'Standard Skill',
    description:
      'The use of explosives to destroy structures, disable vehicles, breach obstacles, and harm others.'
  },
  {
    id: 'diplomacy',
    name: 'Diplomacy',
    type: 'Standard Skill',
    description:
      'The ability to talk with people in a friendly fashion, make a good impression, and perhaps convince others to see your side of things in a dispute or debate.'
  },
  {
    id: 'education',
    name: 'Education',
    type: 'Standard Skill',
    description:
      'Your general knowledge and educational background. Use this to recall facts, understand academic subjects, and make logical deductions.'
  },
  {
    id: 'engineering_hardware',
    name: 'Engineering, Hardware (H.Eng)',
    type: 'Standard Skill',
    description:
      'Understanding how machinery works for operating, building, repairing, and disassembly.'
  },
  {
    id: 'engineering_software',
    name: 'Engineering, Software (S.Eng)',
    type: 'Standard Skill',
    description:
      'Understanding human-written software, writing or manipulating code, operating CISTs.'
  },
  {
    id: 'firearms',
    name: 'Firearms',
    type: 'Standard Skill',
    description:
      'Your skill with projectile weapons including pistols, rifles, shotguns, and exotic projectile weapons.'
  },
  {
    id: 'guile',
    name: 'Guile',
    type: 'Standard Skill',
    description:
      'Your ability to lie, deceive, and manipulate others through words and actions. Also covers disguise and acting.'
  },
  {
    id: 'insight',
    name: 'Insight',
    type: 'Standard Skill',
    description:
      'Your ability to read people, understand their motivations, detect lies, and notice behavioral cues.'
  },
  {
    id: 'intimidation',
    name: 'Intimidation',
    type: 'Standard Skill',
    description: 'Forcing others through threat of force; also torture for information.'
  },
  {
    id: 'melee',
    name: 'Melee',
    type: 'Standard Skill',
    description:
      'Your skill with hand-to-hand combat and melee weapons including knives, swords, clubs, and unarmed combat.'
  },
  {
    id: 'mnemonics',
    name: 'Mnemonics',
    type: 'Standard Skill',
    description:
      'Your ability to interface with and manipulate digital systems, including mindsets, computers, and electronic devices.'
  },
  {
    id: 'house_networking',
    name: 'Networking, House (H.Net)',
    type: 'Standard Skill',
    description:
      'Contacts among the Houses; also determines starting Rep.'
  },
  {
    id: 'pilot',
    name: 'Pilot',
    type: 'Standard Skill',
    description:
      'Your skill at operating various vehicles including ground vehicles, aircraft, spacecraft, and other transportation.'
  },
  {
    id: 'research',
    name: 'Research',
    type: 'Standard Skill',
    description:
      'Finding information on the Extranet/meshes; locating SIMs in a host.'
  },
  {
    id: 'resolve',
    name: 'Resolve',
    type: 'Standard Skill',
    description:
      'Your mental fortitude, willpower, and ability to resist mental influence, fear, and psychological attacks.'
  },
  {
    id: 'sinc',
    name: 'SINC',
    type: 'Savant Skill',
    description:
      'Synthetic Intelligence Neural Control - the ability to interface directly with computer systems and run Savant Programs. Only available to characters with the Savant Stunt.'
  },
  {
    id: 'strategy',
    name: 'Strategy',
    type: 'Standard Skill',
    description:
      'Reacting, organizing, preparing for conflict; analyzing plans of enemies.'
  },
  {
    id: 'stealth',
    name: 'Stealth',
    type: 'Standard Skill',
    description:
      'Your ability to move unseen, hide from detection, and avoid notice through careful movement and concealment.'
  },
  {
    id: 'apostate_networking',
    name: 'Networking, Apostate (A.Net)',
    type: 'Apostate Skill',
    description:
      'Your connections within apostate communities and underground networks. Similar to Networking but specifically for non-Coalition contacts.'
  },
  {
    id: 'athletics',
    name: 'Athletics',
    type: 'Physical Skill',
    description:
      'How well you can move your body: running speed, balance, hand-eye coordination, and so on. Also determines how well you can use your body to move something else: lifting, dragging, pulling, and the like. Adds to your Physical Stress Track.'
  },
  {
    id: 'endurance',
    name: 'Endurance',
    type: 'Physical Skill',
    description:
      'Your health, vigor, and ability to withstand pain, toxins, sicknesses, and diseases of the body. Adds to your Physical Stress Track.'
  },
  {
    id: 'perception',
    name: 'Perception',
    type: 'Physical Skill',
    description:
      'The quality of your five senses and general awareness of your surroundings. Can be used to make Assessments (pg. 63).'
  }
];


export const PHYSICAL_IDS = ['athletics', 'endurance', 'perception'];
export default skillsData;
