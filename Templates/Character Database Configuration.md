---

database-plugin: basic

---

```yaml:dbfolder
name: new database
description: new description
columns:
  __file__:
    key: __file__
    id: __file__
    input: markdown
    label: File
    accessorKey: __file__
    isMetadata: true
    skipPersist: false
    isDragDisabled: false
    csvCandidate: true
    accessor: __file__
    position: 3
    isSorted: true
    isSortedDesc: false
    width: 242
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: true
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
      source_data: current_folder
      content_alignment: text-align-center
      content_vertical_alignment: align-middle
      wrap_content: true
  __created__:
    key: __created__
    id: __created__
    input: calendar_time
    label: Created
    accessorKey: __created__
    isMetadata: true
    isDragDisabled: false
    skipPersist: false
    csvCandidate: true
    accessor: __created__
    position: 25
    width: 150
    isHidden: true
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
      source_data: current_folder
  __modified__:
    key: __modified__
    id: __modified__
    input: calendar_time
    label: Modified
    accessorKey: __modified__
    isMetadata: true
    isDragDisabled: false
    skipPersist: false
    csvCandidate: true
    accessor: __modified__
    position: 26
    width: 150
    isHidden: true
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 50
      media_height: 30
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
      source_data: current_folder
  State:
    input: select
    accessor: State
    key: State
    label: State
    position: 12
    skipPersist: false
    accessorKey: State
    width: 200
    isHidden: false
    sortIndex: -1
    options:
      - { label: "Pure", value: "Pure", color: "hsl(207, 61%, 30%);"}
      - { label: "Biosleeve", value: "Biosleeve", color: "hsl(207, 61%, 30%);"}
      - { label: "Cybersleeve", value: "Cybersleeve", color: "hsl(207, 61%, 30%);"}
      - { label: "SIM", value: "SIM", color: "hsl(207, 61%, 30%);"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 200
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
      source_data: current_folder
  Aesthetic:
    input: select
    accessor: Aesthetic
    key: Aesthetic
    label: Aesthetic
    position: 20
    skipPersist: false
    accessorKey: Aesthetic
    width: 180
    isHidden: false
    sortIndex: -1
    options:
      - { label: "☍ Other Gender", value: "☍ Other Gender", color: "hsl(207, 61%, 30%);"}
      - { label: "☿ Intersex", value: "☿ Intersex", color: "hsl(207, 61%, 30%);"}
      - { label: "♀ Feminine", value: "♀ Feminine", color: "hsl(207, 61%, 30%);"}
      - { label: "♂ Masculine", value: "♂ Masculine", color: "hsl(207, 61%, 30%);"}
      - { label: "⚥ Transgender", value: "⚥ Transgender", color: "hsl(207, 61%, 30%);"}
      - { label: "⚨ Androgynous", value: "⚨ Androgynous", color: "hsl(207, 61%, 30%);"}
      - { label: "⚲ Neutrois", value: "⚲ Neutrois", color: "hsl(207, 61%, 30%);"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
      source_data: current_folder
  Condition:
    input: select
    accessor: Condition
    key: Condition
    label: Condition
    position: 11
    skipPersist: false
    accessorKey: Condition
    width: 200
    isHidden: false
    sortIndex: -1
    options:
      - { label: "Healthy", value: "Healthy", color: "hsl(207, 61%, 30%);"}
      - { label: "-1 Wound", value: "-1 Wound", color: "hsl(207, 61%, 30%);"}
      - { label: "-2 Wound", value: "-2 Wound", color: "hsl(207, 61%, 30%);"}
      - { label: "-3 Wound", value: "-3 Wound", color: "hsl(207, 61%, 30%);"}
      - { label: "Incapacitated", value: "Incapacitated", color: "hsl(207, 61%, 30%);"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
      source_data: current_folder
  Alias:
    input: text
    accessor: Alias
    key: Alias
    label: Alias
    position: 7
    skipPersist: false
    accessorKey: Alias
    width: 127
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
      source_data: current_folder
      content_alignment: text-align-center
      content_vertical_alignment: align-middle
  Background:
    input: text
    accessor: Background
    key: Background
    label: Background
    position: 8
    skipPersist: false
    accessorKey: Background
    width: 274
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: false
      link_alias_enabled: false
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      wrap_content: true
      content_alignment: text-align-left
      content_vertical_alignment: align-top
  Goals:
    input: text
    accessor: Goals
    key: Goals
    label: Goals
    position: 9
    skipPersist: false
    accessorKey: Goals
    width: 300
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      wrap_content: true
  NPC:
    input: text
    accessor: NPC
    key: NPC
    label: NPC
    position: 10
    skipPersist: false
    accessorKey: NPC
    width: 300
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
      source_data: current_folder
      content_alignment: text-align-left
      content_vertical_alignment: align-top
      wrap_content: true
  Occupation:
    input: tags
    accessor: Occupation
    key: Occupation
    label: Occupation
    position: 21
    skipPersist: false
    accessorKey: Occupation
    width: 200
    isHidden: true
    sortIndex: -1
    options:
      - { label: "Adventurer", value: "Adventurer", color: "hsl(207, 61%, 30%);"}
      - { label: "Alchemist", value: "Alchemist", color: "hsl(207, 61%, 30%);"}
      - { label: "Archeologist", value: "Archeologist", color: "hsl(207, 61%, 30%);"}
      - { label: "Barkeeper", value: "Barkeeper", color: "hsl(207, 61%, 30%);"}
      - { label: "Blacksmith", value: "Blacksmith", color: "hsl(207, 61%, 30%);"}
      - { label: "Courier", value: "Courier", color: "hsl(207, 61%, 30%);"}
      - { label: "Enchanter", value: "Enchanter", color: "hsl(207, 61%, 30%);"}
      - { label: "Farmer", value: "Farmer", color: "hsl(207, 61%, 30%);"}
      - { label: "Guard", value: "Guard", color: "hsl(207, 61%, 30%);"}
      - { label: "Historian", value: "Historian", color: "hsl(207, 61%, 30%);"}
      - { label: "Libarian", value: "Libarian", color: "hsl(207, 61%, 30%);"}
      - { label: "Mage", value: "Mage", color: "hsl(207, 61%, 30%);"}
      - { label: "Merchant", value: "Merchant", color: "hsl(207, 61%, 30%);"}
      - { label: "Noble", value: "Noble", color: "hsl(207, 61%, 30%);"}
      - { label: "Priest", value: "Priest", color: "hsl(207, 61%, 30%);"}
      - { label: "Royal", value: "Royal", color: "hsl(207, 61%, 30%);"}
      - { label: "Servant", value: "Servant", color: "hsl(207, 61%, 30%);"}
      - { label: "Stablehand", value: "Stablehand", color: "hsl(207, 61%, 30%);"}
      - { label: "Steward", value: "Steward", color: "hsl(207, 61%, 30%);"}
      - { label: "Teacher", value: "Teacher", color: "hsl(207, 61%, 30%);"}
      - { label: "Hunter", value: "Hunter", color: "hsl(207, 61%, 30%);"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
      source_data: current_folder
  AssociatedGroup:
    input: tags
    accessor: AssociatedGroup
    key: AssociatedGroup
    label: AssociatedGroup
    position: 13
    skipPersist: false
    accessorKey: AssociatedGroup
    width: 200
    isHidden: false
    sortIndex: -1
    options:
      - { label: "Apostate", value: "Apostate", color: "hsl(207, 61%, 30%);"}
      - { label: "Cipriani (SIP-REE-AH-NEE)", value: "Cipriani (SIP-REE-AH-NEE)", color: "hsl(207, 61%, 30%);"}
      - { label: "Dalianis (DAH-LEE-ON-IS)", value: "Dalianis (DAH-LEE-ON-IS)", color: "hsl(207, 61%, 30%);"}
      - { label: "Jinzhan (GIN-ZAH-ON)", value: "Jinzhan (GIN-ZAH-ON)", color: "hsl(207, 61%, 30%);"}
      - { label: "Kimura (KEE-MOO-RAH)", value: "Kimura (KEE-MOO-RAH)", color: "hsl(207, 61%, 30%);"}
      - { label: "Silva (SIL-VAH)", value: "Silva (SIL-VAH)", color: "hsl(207, 61%, 30%);"}
      - { label: "Tsarya (ZAR-YAH)", value: "Tsarya (ZAR-YAH)", color: "hsl(207, 61%, 30%);"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
      source_data: current_folder
  Sexuality:
    input: select
    accessorKey: Sexuality
    key: Sexuality
    label: Sexuality
    position: 17
    width: 150
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "Asexual", value: "Asexual", color: "hsl(207, 61%, 30%);"}
      - { label: "Bisexual", value: "Bisexual", color: "hsl(207, 61%, 30%);"}
      - { label: "Gay", value: "Gay", color: "hsl(207, 61%, 30%);"}
      - { label: "Straight", value: "Straight", color: "hsl(207, 61%, 30%);"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
      source_data: current_folder
  SocialTrait:
    input: tags
    accessorKey: SocialTrait
    key: SocialTrait
    label: SocialTrait
    position: 15
    skipPersist: false
    isHidden: false
    sortIndex: -1
    width: 186
    options:
      - { label: "Bossy", value: "Bossy", color: "hsl(207, 61%, 30%);"}
      - { label: "Cruel", value: "Cruel", color: "hsl(207, 61%, 30%);"}
      - { label: "Deferential", value: "Deferential", color: "hsl(207, 61%, 30%);"}
      - { label: "Demanding", value: "Demanding", color: "hsl(207, 61%, 30%);"}
      - { label: "Dependable", value: "Dependable", color: "hsl(207, 61%, 30%);"}
      - { label: "Dishonest", value: "Dishonest", color: "hsl(207, 61%, 30%);"}
      - { label: "Forthcoming", value: "Forthcoming", color: "hsl(207, 61%, 30%);"}
      - { label: "Friendly", value: "Friendly", color: "hsl(207, 61%, 30%);"}
      - { label: "Generous", value: "Generous", color: "hsl(207, 61%, 30%);"}
      - { label: "Helpful", value: "Helpful", color: "hsl(207, 61%, 30%);"}
      - { label: "Honest", value: "Honest", color: "hsl(207, 61%, 30%);"}
      - { label: "Impartial", value: "Impartial", color: "hsl(207, 61%, 30%);"}
      - { label: "Intolerant", value: "Intolerant", color: "hsl(207, 61%, 30%);"}
      - { label: "Lenient", value: "Lenient", color: "hsl(207, 61%, 30%);"}
      - { label: "Loyal", value: "Loyal", color: "hsl(207, 61%, 30%);"}
      - { label: "Peaceful", value: "Peaceful", color: "hsl(207, 61%, 30%);"}
      - { label: "Quite", value: "Quite", color: "hsl(207, 61%, 30%);"}
      - { label: "Secretive", value: "Secretive", color: "hsl(207, 61%, 30%);"}
      - { label: "Selfish", value: "Selfish", color: "hsl(207, 61%, 30%);"}
      - { label: "Selfless", value: "Selfless", color: "hsl(207, 61%, 30%);"}
      - { label: "Stingy", value: "Stingy", color: "hsl(207, 61%, 30%);"}
      - { label: "Suspicious", value: "Suspicious", color: "hsl(207, 61%, 30%);"}
      - { label: "Talkative", value: "Talkative", color: "hsl(207, 61%, 30%);"}
      - { label: "Tolerant", value: "Tolerant", color: "hsl(207, 61%, 30%);"}
      - { label: "Trusting", value: "Trusting", color: "hsl(207, 61%, 30%);"}
      - { label: "Uncooperative", value: "Uncooperative", color: "hsl(207, 61%, 30%);"}
      - { label: "Unfair", value: "Unfair", color: "hsl(207, 61%, 30%);"}
      - { label: "Unfaithful", value: "Unfaithful", color: "hsl(207, 61%, 30%);"}
      - { label: "Unfriendly", value: "Unfriendly", color: "hsl(207, 61%, 30%);"}
      - { label: "Unreliable", value: "Unreliable", color: "hsl(207, 61%, 30%);"}
      - { label: "Violent", value: "Violent", color: "hsl(207, 61%, 30%);"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
  MentalTrait:
    input: tags
    accessorKey: MentalTrait
    key: MentalTrait
    label: MentalTrait
    position: 16
    skipPersist: false
    isHidden: false
    sortIndex: -1
    width: 165
    options:
      - { label: "Adaptive", value: "Adaptive", color: "hsl(207, 61%, 30%);"}
      - { label: "Ambitious", value: "Ambitious", color: "hsl(207, 61%, 30%);"}
      - { label: "Analytical", value: "Analytical", color: "hsl(207, 61%, 30%);"}
      - { label: "Cautious", value: "Cautious", color: "hsl(207, 61%, 30%);"}
      - { label: "Comformist", value: "Comformist", color: "hsl(207, 61%, 30%);"}
      - { label: "Complacent", value: "Complacent", color: "hsl(207, 61%, 30%);"}
      - { label: "Courageous", value: "Courageous", color: "hsl(207, 61%, 30%);"}
      - { label: "Cowardly", value: "Cowardly", color: "hsl(207, 61%, 30%);"}
      - { label: "Creative", value: "Creative", color: "hsl(207, 61%, 30%);"}
      - { label: "Decisive", value: "Decisive", color: "hsl(207, 61%, 30%);"}
      - { label: "Emotional", value: "Emotional", color: "hsl(207, 61%, 30%);"}
      - { label: "Impatient", value: "Impatient", color: "hsl(207, 61%, 30%);"}
      - { label: "Inattentive", value: "Inattentive", color: "hsl(207, 61%, 30%);"}
      - { label: "Incompetent", value: "Incompetent", color: "hsl(207, 61%, 30%);"}
      - { label: "Indecisive", value: "Indecisive", color: "hsl(207, 61%, 30%);"}
      - { label: "Independent", value: "Independent", color: "hsl(207, 61%, 30%);"}
      - { label: "Intelligent", value: "Intelligent", color: "hsl(207, 61%, 30%);"}
      - { label: "Patient", value: "Patient", color: "hsl(207, 61%, 30%);"}
      - { label: "Perceptive", value: "Perceptive", color: "hsl(207, 61%, 30%);"}
      - { label: "Reckless", value: "Reckless", color: "hsl(207, 61%, 30%);"}
      - { label: "Religious", value: "Religious", color: "hsl(207, 61%, 30%);"}
      - { label: "Secular", value: "Secular", color: "hsl(207, 61%, 30%);"}
      - { label: "Skeptical", value: "Skeptical", color: "hsl(207, 61%, 30%);"}
      - { label: "Skillful", value: "Skillful", color: "hsl(207, 61%, 30%);"}
      - { label: "Stupid", value: "Stupid", color: "hsl(207, 61%, 30%);"}
      - { label: "Superstitious", value: "Superstitious", color: "hsl(207, 61%, 30%);"}
      - { label: "Tenacious", value: "Tenacious", color: "hsl(207, 61%, 30%);"}
      - { label: "Uninventive", value: "Uninventive", color: "hsl(207, 61%, 30%);"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
  PersonalityTrait:
    input: tags
    accessorKey: PersonalityTrait
    key: PersonalityTrait
    label: PersonalityTrait
    position: 14
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "Anxious", value: "Anxious", color: "hsl(207, 61%, 30%);"}
      - { label: "Apathetic", value: "Apathetic", color: "hsl(207, 61%, 30%);"}
      - { label: "Articulate", value: "Articulate", color: "hsl(207, 61%, 30%);"}
      - { label: "Awkward", value: "Awkward", color: "hsl(207, 61%, 30%);"}
      - { label: "Calm", value: "Calm", color: "hsl(207, 61%, 30%);"}
      - { label: "Caring", value: "Caring", color: "hsl(207, 61%, 30%);"}
      - { label: "Charming", value: "Charming", color: "hsl(207, 61%, 30%);"}
      - { label: "Cheerful", value: "Cheerful", color: "hsl(207, 61%, 30%);"}
      - { label: "Childish", value: "Childish", color: "hsl(207, 61%, 30%);"}
      - { label: "Cold", value: "Cold", color: "hsl(207, 61%, 30%);"}
      - { label: "Depressed", value: "Depressed", color: "hsl(207, 61%, 30%);"}
      - { label: "Dull", value: "Dull", color: "hsl(207, 61%, 30%);"}
      - { label: "Eccentric", value: "Eccentric", color: "hsl(207, 61%, 30%);"}
      - { label: "Energetic", value: "Energetic", color: "hsl(207, 61%, 30%);"}
      - { label: "Enthusiastic", value: "Enthusiastic", color: "hsl(207, 61%, 30%);"}
      - { label: "Funny", value: "Funny", color: "hsl(207, 61%, 30%);"}
      - { label: "Gentle", value: "Gentle", color: "hsl(207, 61%, 30%);"}
      - { label: "Humble", value: "Humble", color: "hsl(207, 61%, 30%);"}
      - { label: "Humorless", value: "Humorless", color: "hsl(207, 61%, 30%);"}
      - { label: "Impolite", value: "Impolite", color: "hsl(207, 61%, 30%);"}
      - { label: "Incoherent", value: "Incoherent", color: "hsl(207, 61%, 30%);"}
      - { label: "Listless", value: "Listless", color: "hsl(207, 61%, 30%);"}
      - { label: "Mature", value: "Mature", color: "hsl(207, 61%, 30%);"}
      - { label: "Naive", value: "Naive", color: "hsl(207, 61%, 30%);"}
      - { label: "Optimistic", value: "Optimistic", color: "hsl(207, 61%, 30%);"}
      - { label: "Overt", value: "Overt", color: "hsl(207, 61%, 30%);"}
      - { label: "Pessimistic", value: "Pessimistic", color: "hsl(207, 61%, 30%);"}
      - { label: "Polite", value: "Polite", color: "hsl(207, 61%, 30%);"}
      - { label: "Proud", value: "Proud", color: "hsl(207, 61%, 30%);"}
      - { label: "Repulsive", value: "Repulsive", color: "hsl(207, 61%, 30%);"}
      - { label: "Respectful", value: "Respectful", color: "hsl(207, 61%, 30%);"}
      - { label: "Savvy", value: "Savvy", color: "hsl(207, 61%, 30%);"}
      - { label: "Sensitive", value: "Sensitive", color: "hsl(207, 61%, 30%);"}
      - { label: "Smooth", value: "Smooth", color: "hsl(207, 61%, 30%);"}
      - { label: "Subtle", value: "Subtle", color: "hsl(207, 61%, 30%);"}
      - { label: "Thick-skinned", value: "Thick-skinned", color: "hsl(207, 61%, 30%);"}
      - { label: "Wrathful", value: "Wrathful", color: "hsl(207, 61%, 30%);"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
  Likes:
    input: tags
    accessorKey: Likes
    key: Likes
    label: Likes
    position: 23
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "Fire", value: "Fire", color: "hsl(278, 95%, 90%)"}
      - { label: "Ice Cream", value: "Ice Cream", color: "hsl(45, 95%, 90%)"}
      - { label: "Pants", value: "Pants", color: "hsl(106, 95%, 90%)"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
  Dislikes:
    input: tags
    accessorKey: Dislikes
    key: Dislikes
    label: Dislikes
    position: 24
    skipPersist: false
    isHidden: false
    width: 152
    sortIndex: -1
    options:
      - { label: "Cabage", value: "Cabage", color: "hsl(88, 95%, 90%)"}
      - { label: "stones", value: "stones", color: "hsl(350, 95%, 90%)"}
      - { label: "rocks", value: "rocks", color: "hsl(91, 95%, 90%)"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
  Art:
    input: text
    accessorKey: Art
    key: Art
    id: Art
    label: Art
    position: 6
    skipPersist: false
    isHidden: false
    sortIndex: -1
    width: 73
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 50
      media_height: NaN
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      persist_formula: false
      content_alignment: text-align-center
      content_vertical_alignment: align-middle
  Hindrances:
    input: tags
    accessorKey: Hindrances
    key: Hindrances
    id: Hindrances
    label: Hindrances
    position: 22
    skipPersist: false
    isHidden: false
    sortIndex: -1
    width: 282
    options:
      - { label: "Apostate", value: "Apostate", color: "hsl(207, 64%, 48%)"}
      - { label: "Disreputable", value: "Disreputable", color: "hsl(207, 64%, 48%)"}
      - { label: "Dissonance", value: "Dissonance", color: "hsl(207, 64%, 48%)"}
      - { label: "Dubious Construction", value: "Dubious Construction", color: "hsl(207, 64%, 48%)"}
      - { label: "Incohesive", value: "Incohesive", color: "hsl(207, 64%, 48%)"}
      - { label: "Malware Afflicted", value: "Malware Afflicted", color: "hsl(207, 64%, 48%)"}
      - { label: "Object of Design", value: "Object of Design", color: "hsl(207, 64%, 48%)"}
      - { label: "Purist", value: "Purist", color: "hsl(207, 64%, 48%)"}
      - { label: "Supremacist", value: "Supremacist", color: "hsl(207, 64%, 48%)"}
      - { label: "All Thumbs", value: "All Thumbs", color: "hsl(207, 64%, 48%)"}
      - { label: "Anemic", value: "Anemic", color: "hsl(207, 64%, 48%)"}
      - { label: "Arrogant", value: "Arrogant", color: "hsl(207, 64%, 48%)"}
      - { label: "Bad Eyes", value: "Bad Eyes", color: "hsl(207, 64%, 48%)"}
      - { label: "Bad Luck", value: "Bad Luck", color: "hsl(207, 64%, 48%)"}
      - { label: "Big Mouth", value: "Big Mouth", color: "hsl(207, 64%, 48%)"}
      - { label: "Blind", value: "Blind", color: "hsl(207, 64%, 48%)"}
      - { label: "Bloodthirsty", value: "Bloodthirsty", color: "hsl(207, 64%, 48%)"}
      - { label: "Can't Swim", value: "Can't Swim", color: "hsl(207, 64%, 48%)"}
      - { label: "Cautious", value: "Cautious", color: "hsl(207, 64%, 48%)"}
      - { label: "Clueless", value: "Clueless", color: "hsl(207, 64%, 48%)"}
      - { label: "Clumsy", value: "Clumsy", color: "hsl(207, 64%, 48%)"}
      - { label: "Code of Honor", value: "Code of Honor", color: "hsl(207, 64%, 48%)"}
      - { label: "Curious", value: "Curious", color: "hsl(207, 64%, 48%)"}
      - { label: "Death Wish", value: "Death Wish", color: "hsl(207, 64%, 48%)"}
      - { label: "Delusional", value: "Delusional", color: "hsl(207, 64%, 48%)"}
      - { label: "Doubting Thomas", value: "Doubting Thomas", color: "hsl(207, 64%, 48%)"}
      - { label: "Driven", value: "Driven", color: "hsl(207, 64%, 48%)"}
      - { label: "Elderly", value: "Elderly", color: "hsl(207, 64%, 48%)"}
      - { label: "Enemy", value: "Enemy", color: "hsl(207, 64%, 48%)"}
      - { label: "Greedy", value: "Greedy", color: "hsl(207, 64%, 48%)"}
      - { label: "Habit", value: "Habit", color: "hsl(207, 64%, 48%)"}
      - { label: "Hard of Hearing", value: "Hard of Hearing", color: "hsl(207, 64%, 48%)"}
      - { label: "Heroic", value: "Heroic", color: "hsl(207, 64%, 48%)"}
      - { label: "Hesitant", value: "Hesitant", color: "hsl(207, 64%, 48%)"}
      - { label: "Illiterate", value: "Illiterate", color: "hsl(207, 64%, 48%)"}
      - { label: "Impulsive", value: "Impulsive", color: "hsl(207, 64%, 48%)"}
      - { label: "Jealous", value: "Jealous", color: "hsl(207, 64%, 48%)"}
      - { label: "Loyal", value: "Loyal", color: "hsl(207, 64%, 48%)"}
      - { label: "Mean", value: "Mean", color: "hsl(207, 64%, 48%)"}
      - { label: "Mild Mannered", value: "Mild Mannered", color: "hsl(207, 64%, 48%)"}
      - { label: "Mute", value: "Mute", color: "hsl(207, 64%, 48%)"}
      - { label: "Obese", value: "Obese", color: "hsl(207, 64%, 48%)"}
      - { label: "Obligation", value: "Obligation", color: "hsl(207, 64%, 48%)"}
      - { label: "One Arm", value: "One Arm", color: "hsl(207, 64%, 48%)"}
      - { label: "One Eye", value: "One Eye", color: "hsl(207, 64%, 48%)"}
      - { label: "Outsider", value: "Outsider", color: "hsl(207, 64%, 48%)"}
      - { label: "Overconfident", value: "Overconfident", color: "hsl(207, 64%, 48%)"}
      - { label: "Pacifist", value: "Pacifist", color: "hsl(207, 64%, 48%)"}
      - { label: "Phobia", value: "Phobia", color: "hsl(207, 64%, 48%)"}
      - { label: "Poverty", value: "Poverty", color: "hsl(207, 64%, 48%)"}
      - { label: "Quirk", value: "Quirk", color: "hsl(207, 64%, 48%)"}
      - { label: "Ruthless", value: "Ruthless", color: "hsl(207, 64%, 48%)"}
      - { label: "Secret", value: "Secret", color: "hsl(207, 64%, 48%)"}
      - { label: "Shamed", value: "Shamed", color: "hsl(207, 64%, 48%)"}
      - { label: "Slow", value: "Slow", color: "hsl(207, 64%, 48%)"}
      - { label: "Small", value: "Small", color: "hsl(207, 64%, 48%)"}
      - { label: "Stubborn", value: "Stubborn", color: "hsl(207, 64%, 48%)"}
      - { label: "Suspicious", value: "Suspicious", color: "hsl(207, 64%, 48%)"}
      - { label: "Thin Skinned", value: "Thin Skinned", color: "hsl(207, 64%, 48%)"}
      - { label: "Tongue-Tied", value: "Tongue-Tied", color: "hsl(207, 64%, 48%)"}
      - { label: "Ugly", value: "Ugly", color: "hsl(207, 64%, 48%)"}
      - { label: "Vengeful", value: "Vengeful", color: "hsl(207, 64%, 48%)"}
      - { label: "Vow", value: "Vow", color: "hsl(207, 64%, 48%)"}
      - { label: "Wanted", value: "Wanted", color: "hsl(207, 64%, 48%)"}
      - { label: "Yellow", value: "Yellow", color: "hsl(207, 64%, 48%)"}
      - { label: "Young", value: "Young", color: "hsl(207, 64%, 48%)"}
      - { label: "Acrobat", value: "Acrobat", color: "hsl(300, 95%, 90%)"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  Pronouns:
    input: select
    accessorKey: Pronouns
    key: Pronouns
    id: Pronouns
    label: Pronouns
    position: 18
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "He/Him", value: "He/Him", color: "hsl(207, 61%, 30%);"}
      - { label: "She/Her", value: "She/Her", color: "hsl(207, 61%, 30%);"}
      - { label: "They/Them", value: "They/Them", color: "hsl(207, 61%, 30%);"}
      - { label: "It", value: "It", color: "hsl(207, 61%, 30%);"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      option_source: manual
  __inlinks__:
    key: __inlinks__
    id: __inlinks__
    input: inlinks
    label: Inlinks
    accessorKey: __inlinks__
    isMetadata: true
    isDragDisabled: false
    skipPersist: false
    csvCandidate: false
    position: 1
    isHidden: true
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  __tags__:
    key: __tags__
    id: __tags__
    input: metadata_tags
    label: File Tags
    accessorKey: __tags__
    isMetadata: true
    isDragDisabled: false
    skipPersist: false
    csvCandidate: false
    position: 2
    isHidden: true
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  Origin:
    input: text
    accessorKey: Origin
    key: Origin
    id: Origin
    label: Origin
    position: 19
    skipPersist: false
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      content_alignment: text-align-center
      content_vertical_alignment: align-middle
  SheetLink:
    input: text
    accessorKey: SheetLink
    key: SheetLink
    id: SheetLink
    label: SheetLink
    position: 27
    skipPersist: false
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      content_alignment: text-align-left
      content_vertical_alignment: align-top
      wrap_content: true
  Tags:
    input: tags
    accessorKey: Tags
    key: Tags
    id: Tags
    label: Tags
    position: 5
    skipPersist: false
    isHidden: false
    sortIndex: -1
    width: 139
    options:
      - { label: "#Player", value: "#Player", color: "hsl(300, 95%, 90%)"}
      - { label: "#Christa", value: "#Christa", color: "hsl(14, 95%, 90%)"}
      - { label: "#Matt", value: "#Matt", color: "hsl(151, 95%, 90%)"}
      - { label: "#James", value: "#James", color: "hsl(275, 95%, 90%)"}
      - { label: "#Sara", value: "#Sara", color: "hsl(220, 95%, 90%)"}
      - { label: "#Dan", value: "#Dan", color: "hsl(253, 95%, 90%)"}
      - { label: "#Rob", value: "#Rob", color: "hsl(166, 95%, 90%)"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      option_source: manual
      content_vertical_alignment: align-top
      content_alignment: text-align-left
      wrap_content: true
  NaturalTraits:
    input: text
    accessorKey: NaturalTraits
    key: NaturalTraits
    id: NaturalTraits
    label: NaturalTraits
    position: 28
    skipPersist: false
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  SleevedTrait:
    input: text
    accessorKey: SleevedTrait
    key: SleevedTrait
    id: SLeevedTrait
    label: SLeevedTrait
    position: 29
    skipPersist: false
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  Player:
    input: text
    accessorKey: Player
    key: Player
    id: Player
    label: Player
    position: 4
    skipPersist: false
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
config:
  enable_show_state: false
  group_folder_column: 
  remove_field_when_delete_column: true
  cell_size: compact
  sticky_first_column: true
  show_metadata_created: true
  show_metadata_modified: true
  source_data: current_folder
  source_form_result: root
  show_metadata_tasks: false
  frontmatter_quote_wrap: false
  row_templates_folder: /
  current_row_template: Templates/Player Template.md
  pagination_size: 15
  source_destination_path: /
  remove_empty_folders: false
  automatically_group_files: false
  hoist_files_with_empty_attributes: true
  show_metadata_inlinks: true
  show_metadata_outlinks: false
  enable_js_formulas: false
  formula_folder_path: /
  inline_default: false
  inline_new_position: top
  date_format: yyyy-MM-dd
  datetime_format: "yyyy-MM-dd HH:mm:ss"
  font_size: 14
  metadata_date_format: "yyyy-MM-dd HH:mm:ss"
  enable_footer: false
  implementation: default
  show_metadata_tags: true
filters:
  enabled: false
  conditions:
```