/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FiveToolsBackground } from '../types/fivetools';

export const FIVE_TOOLS_BACKGROUNDS: FiveToolsBackground[] = [
  {
    name: 'Acolyte',
    source: 'PHB',
    page: 127,
    skillProficiencies: ['Insight', 'Religion'],
    languages: ['Two languages of your choice'],
    startingEquipment: [
      'A holy symbol (a gift to you when you entered the priesthood)',
      'A prayer book or prayer wheel',
      '5 sticks of incense',
      'Vestments',
      'A set of common clothes',
      'A pouch containing 15 gp',
    ],
    feature: {
      name: 'Shelter of the Faithful',
      entries: [
        'As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells.',
      ],
    },
    suggestedTraits: [
      "I idolize a particular hero of my faith, and constantly refer to that person's deeds and example.",
      'I can find common ground between the fiercest enemies, empathizing with them and always working toward peace.',
      'I see presages in every event and action. The gods are speaking to us, we must only listen.',
      'Nothing can shake my optimistic attitude and pious devotion.',
    ],
    suggestedIdeals: [
      'Tradition. The ancient traditions of worship and sacrifice must be preserved and upheld. (Lawful)',
      'Charity. I always try to help those in need, no matter what the personal cost. (Good)',
      'Change. We must help bring about the changes the gods are constantly working in the world. (Chaotic)',
      'Aspiration. I seek to prove myself worthy of my god’s favor by matching my actions against their teachings. (Any)',
    ],
    suggestedBonds: [
      'I would die to recover an ancient relic of my faith that was lost long ago.',
      'I will someday get revenge on the corrupt temple hierarchy who branded me a heretic.',
      'I owe my life to the priest who took me in when my parents died.',
      'Everything I do is for the common people who come to our altar for salvation.',
    ],
    suggestedFlaws: [
      'I judge others harshly, and myself even more severely.',
      'I put too much trust in those who wield power within my temple’s hierarchy.',
      'My piety sometimes leads me to blindly trust those that profess faith in my god.',
      'I am inflexible in my thinking and dogma.',
    ],
    entries: [
      'You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices.',
    ],
  },
  {
    name: 'Criminal / Spy',
    source: 'PHB',
    page: 129,
    skillProficiencies: ['Deception', 'Stealth'],
    toolProficiencies: ['One type of gaming set', "Thieves' tools"],
    startingEquipment: [
      'A crowbar',
      'A set of dark common clothes including a hood',
      'A pouch containing 15 gp',
    ],
    feature: {
      name: 'Criminal Contact',
      entries: [
        'You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances.',
      ],
    },
    suggestedTraits: [
      'The first thing I do in a new place is note the locations of everything valuable or how to escape.',
      'I am always calm, no matter what the situation. I never raise my voice or let my emotions control me.',
      'I would rather make a new friend than a new enemy in the criminal underworld.',
      'I blow up at the slightest insult and keep a keen dagger ready.',
    ],
    suggestedIdeals: [
      'Freedom. Chains are meant to be broken, both physical and metaphorical. (Chaotic)',
      'Honor. I don’t steal from others in the trade or innocent paupers. (Lawful)',
      'People. I’m loyal to my friends, not to any ideals or guilds. (Neutral)',
      'Greed. I will do whatever it takes to become wealthy and powerful. (Evil)',
    ],
    suggestedBonds: [
      'I owe my survival to a street urchin guild leader who gave me bread when I had nothing.',
      'My ill-gotten gains go to support my family back home.',
      'Someone I loved died because of a mistake I made. That will never happen again.',
      'I’m trying to pay off an old debt I owe to a generous benefactor.',
    ],
    suggestedFlaws: [
      'An innocent face cannot hide my kleptomaniac urges around shiny heirlooms.',
      'When I see something valuable, I can’t think about anything other than how to steal it.',
      'If there’s a plan, I’ll forget it. If there isn’t, I’ll make one up on the fly.',
      'I turn tail and run when things look dangerous.',
    ],
    entries: [
      'You are an experienced criminal with a history of breaking the law. You have spent plenty of time among other criminals and still have contacts within the criminal underworld.',
    ],
  },
  {
    name: 'Folk Hero',
    source: 'PHB',
    page: 131,
    skillProficiencies: ['Animal Handling', 'Survival'],
    toolProficiencies: ["One type of artisan's tools", 'Vehicles (land)'],
    startingEquipment: [
      "A set of artisan's tools",
      'A shovel',
      'An iron pot',
      'A set of common clothes',
      'A pouch containing 10 gp',
    ],
    feature: {
      name: 'Rustic Hospitality',
      entries: [
        'Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them.',
      ],
    },
    suggestedTraits: [
      'I judge people by their actions, not their titles or lineage.',
      'If someone is in trouble, I’m always ready to lend help.',
      'When I set my mind to something, I follow through no matter what gets in my way.',
      'I have a strong sense of fair play and always try to find the most equitable solution.',
    ],
    suggestedIdeals: [
      'Respect. People deserve to be treated with dignity and respect. (Good)',
      'Fairness. No one ought to get preferential treatment before the law. (Lawful)',
      'Freedom. Tyrants must not be allowed to oppress the common folk. (Chaotic)',
      'Destiny. Nothing and no one can steer me away from my higher calling. (Any)',
    ],
    suggestedBonds: [
      'I protect those who cannot protect themselves.',
      'One day I will return to my home village and be recognized as its champion.',
      'A proud noble once gave me a horrible beating, and I will take my revenge on any bully.',
      'My tools are symbols of my past life, and I carry them so that I will never forget my roots.',
    ],
    suggestedFlaws: [
      'The tyrant who rules my land will stop at nothing to see me killed.',
      'I have trouble trusting in my allies when high stakes are involved, taking all the burden on myself.',
      'I am convinced of the significance of my destiny, and blind to my shortcomings and the risk of failure.',
      'I have a weakness for the vices of the city, especially hard drink.',
    ],
    entries: [
      'You come from a humble social rank, but you are destined for so much more. Already the people of your home village regard you as their champion.',
    ],
  },
  {
    name: 'Noble',
    source: 'PHB',
    page: 135,
    skillProficiencies: ['History', 'Persuasion'],
    toolProficiencies: ['One type of gaming set'],
    languages: ['One language of your choice'],
    startingEquipment: [
      'A set of fine clothes',
      'A signet ring',
      'A scroll of pedigree',
      'A purse containing 25 gp',
    ],
    feature: {
      name: 'Position of Privilege',
      entries: [
        'Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. Commoners make every effort to accommodate you and avoid your displeasure.',
      ],
    },
    suggestedTraits: [
      'My eloquent flattery makes everyone I talk to feel like the most wonderful person in the world.',
      'No one could doubt by looking at my regal bearing that I am a cut above the unwashed masses.',
      'Despite my noble birth, I do not place myself above other folk. We all have the same blood.',
      'I take great pains to always look my best and follow the latest courtly fashions.',
    ],
    suggestedIdeals: [
      'Respect. Respect is due to me because of my position, but all people warrant respect. (Good)',
      'Responsibility. It is my duty to respect the authority of those above me, just as those below must respect mine. (Lawful)',
      'Noble Obligation. My family rules by divine right, and it is our duty to protect our people. (Good)',
      'Independence. I must prove that I can handle myself without the coddling of my family. (Chaotic)',
    ],
    suggestedBonds: [
      'I will face any challenge to win the approval of my family.',
      'My house’s alliance with another noble family must be sustained at all costs.',
      'The common folk must see me as a hero who champions their cause.',
      'I am in love with the heir of a family that my house despises.',
    ],
    suggestedFlaws: [
      'I secretly believe that everyone is beneath me.',
      'I hide a truly scandalous secret that could ruin my family forever.',
      'A fatal flaw in my pride makes it impossible for me to admit when I am wrong.',
      'I have an insatiable appetite for opulent luxuries and high-stakes gambling.',
    ],
    entries: [
      'You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields significant political influence.',
    ],
  },
  {
    name: 'Sage',
    source: 'PHB',
    page: 137,
    skillProficiencies: ['Arcana', 'History'],
    languages: ['Two languages of your choice'],
    startingEquipment: [
      'A bottle of black ink',
      'A quill',
      'A small knife',
      'A letter from a dead colleague posing a question you have not yet been able to answer',
      'A set of common clothes',
      'A pouch containing 10 gp',
    ],
    feature: {
      name: 'Researcher',
      entries: [
        'When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature.',
      ],
    },
    suggestedTraits: [
      'There is nothing I like better than a good mystery or an arcane conundrum.',
      'I’m used to helping out those who aren’t as smart as I am, and I patiently explain anything and everything.',
      'I’m convinced that people are always trying to steal my secrets.',
      'I speak in elaborate riddles and archaic phrases that confuse ordinary folk.',
    ],
    suggestedIdeals: [
      'Knowledge. The path to power and self-improvement is through knowledge. (Neutral)',
      'No Limits. Nothing should fetter the infinite possibility inherent in all existence. (Chaotic)',
      'Power. Solitary study yields arcane power that commands destiny. (Evil)',
      'Self-Improvement. The goal of a life of study is the betterment of oneself. (Any)',
    ],
    suggestedBonds: [
      'I have an ancient parchment from an archaic archive that holds secrets yet unraveled.',
      'My life’s work is a series of tomes related to a specific field of planar lore.',
      'I work to preserve a library, university, or monastery of ancient lore.',
      'I’ve been searching my whole life for the answer to a single colossal question.',
    ],
    suggestedFlaws: [
      'Unlocking an ancient secret is worth any risk to life or limb.',
      'I am easily distracted by the promise of information or arcane trinkets.',
      'I speak without really thinking through my words, invariably insulting others.',
      'Most people scream and run when they see a demon. I stop and take notes on its anatomy.',
    ],
    entries: [
      'You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you.',
    ],
  },
  {
    name: 'Soldier',
    source: 'PHB',
    page: 140,
    skillProficiencies: ['Athletics', 'Intimidation'],
    toolProficiencies: ['One type of gaming set', 'Vehicles (land)'],
    startingEquipment: [
      'An insignia of rank',
      'A trophy taken from a fallen enemy (a dagger, broken blade, or piece of a banner)',
      'A set of bone dice or deck of cards',
      'A set of common clothes',
      'A pouch containing 10 gp',
    ],
    feature: {
      name: 'Military Rank',
      entries: [
        'You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use.',
      ],
    },
    suggestedTraits: [
      'I can stare down a hell hound without flinching. I face problems head-on.',
      'I enjoy being strong and like breaking things with my bare hands.',
      'I’m haunted by memories of war. I can’t get the images of carnage out of my head.',
      'I use crude language and rough tavern manners that shock polite society.',
    ],
    suggestedIdeals: [
      'Greater Good. Our lot is to lay down our lives in defense of others. (Good)',
      'Responsibility. I do what I must and obey just authority without hesitation. (Lawful)',
      'Independence. When people follow orders blindly, they embrace a kind of tyranny. (Chaotic)',
      'Might. In life as in war, the stronger force wins. (Evil)',
    ],
    suggestedBonds: [
      'Those who fight beside me are those of worth dying for.',
      'I’ll never forget the crushing defeat my company suffered or the enemies who dealt it.',
      'My honor is my life, and my comrades are my true family.',
      'I fight for those who cannot fight for themselves.',
    ],
    suggestedFlaws: [
      'I have little respect for anyone who is not a proven warrior.',
      'The monstrous enemy we faced in battle still leaves me quivering with fear in darkness.',
      'I obey the law, even if the law causes suffering.',
      'My hatred of my enemies is blind and unreasoning.',
    ],
    entries: [
      'War has been your life for as long as you can remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, and served with honor.',
    ],
  },
  {
    name: 'Entertainer',
    source: 'PHB',
    page: 130,
    skillProficiencies: ['Acrobatics', 'Performance'],
    toolProficiencies: ['Disguise kit', 'One type of musical instrument'],
    startingEquipment: [
      'A musical instrument (one of your choice)',
      'The favor of an admirer (love letter, lock of hair, or trinket)',
      'A costume',
      'A pouch containing 15 gp',
    ],
    feature: {
      name: 'By Popular Demand',
      entries: [
        'You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble’s court. At such a place, you receive free lodging and food of a modest or comfortable standard, as long as you perform each night.',
      ],
    },
    suggestedTraits: [
      'I know a story relevant to almost every situation and always chime in with ballads.',
      'Whenever I come to a new place, I collect local rumors and spread intriguing gossip.',
      'I love a good insult, even one directed at me.',
      'Nobody stays angry at me or around me for long, since I can defuse any tension with humor.',
    ],
    suggestedIdeals: [
      'Beauty. When I perform, I make the world better than it was. (Good)',
      'Tradition. The stories, songs, and poems of the past must never be forgotten. (Lawful)',
      'Creativity. The world is in need of new ideas and bold artistic action. (Chaotic)',
      'Honesty. Art must reflect the soul; it can’t come from a place of deception. (Any)',
    ],
    suggestedBonds: [
      'My instrument is my most treasured possession, and it reminds me of someone I love.',
      'Someone stole my precious instrument or lute, and someday I’ll get it back.',
      'I want to be famous, whatever it takes.',
      'I idolize an old master of stagecraft and strive to measure up to their standard.',
    ],
    suggestedFlaws: [
      'I’ll do anything to win fame and renown, no matter how reckless.',
      'I’m a sucker for a pretty face and easily lured into compromised situations.',
      'A scandal prevents me from ever going home again.',
      'I once satirized a noble who still wants my head on a pike.',
    ],
    entries: [
      'You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them. Your poetics, music, or dance stirs their emotions.',
    ],
  },
  {
    name: 'Guild Artisan',
    source: 'PHB',
    page: 132,
    skillProficiencies: ['Insight', 'Persuasion'],
    toolProficiencies: ["One type of artisan's tools"],
    languages: ['One language of your choice'],
    startingEquipment: [
      "A set of artisan's tools",
      'A letter of introduction from your guild',
      'A set of traveler’s clothes',
      'A pouch containing 15 gp',
    ],
    feature: {
      name: 'Guild Membership',
      entries: [
        'As an established and respected member of a guild, you can rely on certain benefits that membership provides. Your fellow guild members will provide you with lodging and food if necessary, and pay for your funeral if needed.',
      ],
    },
    suggestedTraits: [
      'I believe that anything worth doing is worth doing right. I can’t help it—I’m a perfectionist.',
      'I’m a snob who looks down on those who can’t appreciate fine art or bespoke craft.',
      'I always want to know how things work and what makes people and clockworks tick.',
      'I’m well known for my generosity toward the needy and apprentices in my trade.',
    ],
    suggestedIdeals: [
      'Community. It is the duty of all civilized people to strengthen the bonds of community. (Lawful)',
      'Generosity. My talents were given to me so that I could use them for the benefit of the world. (Good)',
      'Freedom. Everyone should be free to pursue their own livelihood. (Chaotic)',
      'Aspiration. I work hard to be the best there is at my craft. (Any)',
    ],
    suggestedBonds: [
      'The workshop where I learned my trade is the most important place in the world to me.',
      'I owe my guild a great debt for forging me into the artisan I am today.',
      'I will pursue my craft to create a masterwork that will outlive me by centuries.',
      'I created a masterpiece for someone who never paid me; I will reclaim it.',
    ],
    suggestedFlaws: [
      'I’ll do anything to get my hands on something rare, priceless, or arcane for crafting.',
      'I’m quick to assume that someone is trying to cheat or undercut me.',
      'No one must ever learn that I once stole guild funds to fuel my early ambitions.',
      'I’m never satisfied with what I have; I always want more wealth and prestige.',
    ],
    entries: [
      'You are a member of an artisan’s guild, skilled in a particular field and closely associated with other artisans. You are a well-established part of the mercantile world.',
    ],
  },
  {
    name: 'Outlander',
    source: 'PHB',
    page: 136,
    skillProficiencies: ['Athletics', 'Survival'],
    toolProficiencies: ['One type of musical instrument'],
    languages: ['One language of your choice'],
    startingEquipment: [
      'A staff',
      'A hunting trap',
      'A trophy from an animal you killed',
      'A set of traveler’s clothes',
      'A pouch containing 10 gp',
    ],
    feature: {
      name: 'Wanderer',
      entries: [
        'You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find fresh water and food for yourself and up to five other people each day, provided the land offers berries, small game, water, etc.',
      ],
    },
    suggestedTraits: [
      'I’ve been isolated for so long that I rarely speak, preferring gestures and the occasional grunt.',
      'I place no stock in wealthy or well-mannered folk. Money and manners won’t save you from a hungry owlbear.',
      'I’m always picking up interesting oddities and crafting small trinkets from bones and twigs.',
      'I feel far more comfortable among beasts of the wilderness than among urban folk.',
    ],
    suggestedIdeals: [
      'Change. Life is like the seasons, in constant change, and we must change with it. (Chaotic)',
      'Greater Good. It is each person’s responsibility to make the most happiness for the whole tribe. (Good)',
      'Nature. The natural world is more important than all the constructs of civilization. (Neutral)',
      'Might. The strongest are meant to lead and cull the weak. (Evil)',
    ],
    suggestedBonds: [
      'My family, clan, or tribe is the most important thing in my life, even when they are far from me.',
      'An injury to the unspoiled wilderness of my home is an injury to me.',
      'I will bring terrible wrath down on the evildoers who destroyed my homeland.',
      'I carry a tribal totem that links me directly to my ancestral guardian spirits.',
    ],
    suggestedFlaws: [
      'I am too enamored of ale, wine, and other intoxicants.',
      'There’s no room for caution in a life lived to the fullest.',
      'I remember every insult I’ve ever received and nurse a silent resentment toward anyone who has ever slighted me.',
      'I am slow to trust members of other races, tribes, and societies.',
    ],
    entries: [
      'You grew up in the wilds, far from the comfort of town and technology. You’ve witnessed the migration of herds larger than forests, survived weather more extreme than any city-dweller can imagine, and enjoyed the solitude of being the only thinking creature for miles.',
    ],
  },
  {
    name: 'Urchin',
    source: 'PHB',
    page: 141,
    skillProficiencies: ['Sleight of Hand', 'Stealth'],
    toolProficiencies: ['Disguise kit', "Thieves' tools"],
    startingEquipment: [
      'A small knife',
      'A map of the city you grew up in',
      'A pet mouse',
      'A token to remember your parents by',
      'A set of common clothes',
      'A pouch containing 10 gp',
    ],
    feature: {
      name: 'City Secrets',
      entries: [
        'You know the secret patterns and flow to cities and can find passages through the urban sprawl that others would miss. When you are not in combat, you (and companions you lead) can travel between any two locations in the city twice as fast as your speed would normally allow.',
      ],
    },
    suggestedTraits: [
      'I hide scraps of food and trinkets away in my pockets, always expecting famine.',
      'I ask a lot of questions and watch people’s hands constantly.',
      'I like to squeeze into small places where no one can reach or corner me.',
      'I eat like a starved beast, wolfing down whatever food is set before me.',
    ],
    suggestedIdeals: [
      'Respect. All people, rich or poor, deserve to be treated with respect. (Good)',
      'Community. We have to take care of each other, because no one else is going to do it. (Lawful)',
      'Change. The low are raised up, and the high and mighty are brought down. (Chaotic)',
      'Survival. No matter what happens, staying alive is what matters most. (Any)',
    ],
    suggestedBonds: [
      'My town or city is my home, and I’ll fight to defend it from oppressors.',
      'I sponsor an orphanage to keep others from enduring what I was forced to endure.',
      'No one else is going to have to suffer the way I did if I have anything to say about it.',
      'I owe my life to another urchin who taught me how to survive on the streets.',
    ],
    suggestedFlaws: [
      'If I’m outnumbered, I’ll run away from a fight rather than stick around.',
      'Gold seems like an impossible fortune to me, and I’ll do almost anything for more of it.',
      'I will never fully trust anyone other than myself.',
      'People who can’t take care of themselves get what they deserve.',
    ],
    entries: [
      'You grew up on the rough streets alone, orphaned, and poor. You had no one to watch over you or provide for you, so you learned to provide for yourself.',
    ],
  },
];
