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
      'The ability to use explosives, such as grenades or satchel charges, both in combat and to demolish structures.'
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
      "Education measures 'book learning.' It covers history, science, geography, literature, sociology, government, physics, math, and other academic fields of study."
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
      'Your understanding of how human-written computer software works, both in how to write code and manipulate existing software. This Skill is also used to operate CISTs.'
  },
  {
    id: 'firearms',
    name: 'Firearms',
    type: 'Standard Skill',
    description:
      'Your capacity to use projectile weapons, be they railguns, coil guns, particle accelerators, or heavy artillery such as cannons or vehicular weaponry.'
  },
  {
    id: 'guile',
    name: 'Guile',
    type: 'Standard Skill',
    description:
      'The ability to lie, con, seduce, or bluff. Also the ability to haggle for a good deal.'
  },
  {
    id: 'insight',
    name: 'Insight',
    type: 'Standard Skill',
    description:
      "Mental reflexes or 'common sense.' It is used to make quick and accurate decisions based on unexpected or incomplete information. It is also used to intuit other's emotions."
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
      'The understanding of how to use your body as a weapon, or how to use handheld melee weapons.'
  },
  {
    id: 'mnemonics',
    name: 'Mnemonics',
    type: 'Standard Skill',
    description:
      'The understanding of software minds, both human egos and AIs. You can perform mnemonic editing on an ego, and aid in resleeving, merging, and forking.'
  },
  {
    id: 'house_networking',
    name: 'Networking, House (H.Net)',
    type: 'Standard Skill',
    description:
      'The number of contacts you have among the Houses and their desire or ability to help you. Also determines your starting Rep.'
  },
  {
    id: 'pilot',
    name: 'Pilot',
    type: 'Standard Skill',
    description:
      'Your knowledge of driving and flying vehicles of all sorts, and your familiarity with their navigational systems.'
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
      'The measure of your courage, willpower, and ability to resist temptation. It also represents the drive to not quit in the face of overwhelming opposition. Adds to your Mental Stress Track.'
  },
  {
    id: 'sinc',
    name: 'SINC',
    type: 'Special Skill',
    description:
      'The ability to write and use Self-Interfacing Neural Code, the computer code that comprises Savant Programs.'
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
      'Your ability to hide, filch items, pick pockets, and move about unnoticed.'
  },
  {
    id: 'apostate_networking',
    name: 'Networking, Apostate (A.Net)',
    type: 'Standard Skill',
    description:
      'The quality and quantity of the contacts you have that are willing to provide you aid among apostates.'
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
