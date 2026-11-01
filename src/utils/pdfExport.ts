/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Character, SKILLS_LIST } from '../types/character';
import { cleanForPdf } from './5eParser';
import { FIVE_TOOLS_BACKGROUNDS } from '../data/backgrounds';
import {
  calculateArmorClass,
  calculatePassivePerception,
  calculateSpellAttackModifier,
  calculateSpellSaveDC,
  formatModifier,
  getAbilityModifier,
  getAbilityScoresTotal,
  getClassSpellSlots,
  getProficiencyBonus,
  getSavingThrowModifier,
  getSkillModifier,
  getStartingSpellsForClass,
  isSpellcastingClass,
} from './calculations';

export async function generateFillablePdf(character: Character): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const form = pdfDoc.getForm();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 612; // US Letter
  const PAGE_HEIGHT = 792;

  // Colors
  const black = rgb(0.1, 0.1, 0.1);
  const darkSlate = rgb(0.18, 0.22, 0.28);
  const parchmentBg = rgb(0.97, 0.96, 0.94);
  const boxBorder = rgb(0.4, 0.44, 0.5);
  const fieldBg = rgb(0.99, 0.99, 0.99);

  // Helper calculations
  const abilities = getAbilityScoresTotal(character);
  const profBonus = getProficiencyBonus(character.level);
  const passivePerception = calculatePassivePerception(
    abilities,
    character.skillProficiencies,
    character.skillExpertise,
    profBonus
  );
  const dexMod = getAbilityModifier(abilities.dex);
  const initiative = dexMod + (character.initiativeBonus || 0);
  const ac = calculateArmorClass(character.armor, abilities.dex);

  // Spellcasting calculations
  const spellAbility = character.spellcastingAbility || 'int';
  const spellScore = abilities[spellAbility];
  const spellSaveDC = calculateSpellSaveDC(spellScore, profBonus);
  const spellAttackBonus = calculateSpellAttackModifier(spellScore, profBonus);
  const isCaster = isSpellcastingClass(character.className) || !!character.spellcastingAbility;

  // Determine effective spells (if empty for a caster, populate starting 5e spells)
  const effectiveSpells =
    character.spells && character.spells.length > 0
      ? character.spells
      : isCaster
      ? getStartingSpellsForClass(character.className)
      : [];

  const spellsByLevel = effectiveSpells.reduce<Record<number, typeof effectiveSpells>>((acc, s) => {
    const lvlNum = Number(s.level) || 0;
    acc[lvlNum] = acc[lvlNum] || [];
    acc[lvlNum].push(s);
    return acc;
  }, {});

  const cantripList = spellsByLevel[0] || [];
  const level1List = spellsByLevel[1] || [];

  // ==========================================
  // PAGE 1: Core Sheet
  // ==========================================
  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Page 1 Background & Header Banner
  page1.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: parchmentBg,
  });

  // Top Title banner
  page1.drawRectangle({
    x: 24,
    y: 720,
    width: 200,
    height: 52,
    color: darkSlate,
  });
  page1.drawText('DUNGEONS & DRAGONS', {
    x: 32,
    y: 752,
    size: 11,
    font: fontBold,
    color: rgb(0.85, 0.75, 0.45),
  });
  page1.drawText('CHARACTER SHEET', {
    x: 32,
    y: 736,
    size: 14,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  // Header Box (Character info)
  page1.drawRectangle({
    x: 230,
    y: 715,
    width: 358,
    height: 62,
    borderWidth: 1,
    borderColor: boxBorder,
    color: rgb(1, 1, 1),
  });

  // Helper for adding labeled text field
  const addField = (
    page: any,
    fieldName: string,
    label: string,
    value: string,
    x: number,
    y: number,
    w: number,
    h: number,
    isMultiline: boolean = false
  ) => {
    if (label) {
      page.drawText(label.toUpperCase(), {
        x,
        y: y + h + 2,
        size: 6.5,
        font: fontBold,
        color: darkSlate,
      });
    }

    try {
      const field = form.createTextField(fieldName);
      field.addToPage(page, {
        x,
        y,
        width: w,
        height: h,
        borderWidth: 0.75,
        borderColor: boxBorder,
        backgroundColor: fieldBg,
        textColor: black,
        font: fontRegular,
      });
      if (isMultiline) {
        field.enableMultiline();
        field.setFontSize(8);
      } else {
        field.setFontSize(9);
      }
      field.setText(cleanForPdf(value) || '');
      return field;
    } catch {
      return null;
    }
  };

  // Helper for adding checkbox
  const addCheckbox = (
    page: any,
    fieldName: string,
    checked: boolean,
    x: number,
    y: number,
    size: number = 8
  ) => {
    try {
      const box = form.createCheckBox(fieldName);
      if (checked) {
        box.check();
      }
      box.addToPage(page, {
        x,
        y,
        width: size,
        height: size,
        borderWidth: 0.75,
        borderColor: boxBorder,
        backgroundColor: rgb(1, 1, 1),
      });
      return box;
    } catch {
      return null;
    }
  };

  // Header Form Fields
  addField(page1, 'CharacterName', 'Character Name', character.name, 32, 690, 185, 18);
  addField(page1, 'ClassLevel', 'Class & Level', `${character.className} ${character.level}${character.subclass ? ` (${character.subclass})` : ''}`, 236, 745, 110, 16);
  addField(page1, 'Background', 'Background', character.background, 352, 745, 110, 16);
  addField(page1, 'PlayerName', 'Player Name', character.playerName, 468, 745, 110, 16);
  addField(page1, 'Race', 'Race / Species', `${character.race}${character.subrace ? ` (${character.subrace})` : ''}`, 236, 720, 110, 16);
  addField(page1, 'Alignment', 'Alignment', character.alignment, 352, 720, 110, 16);
  addField(page1, 'ExperiencePoints', 'Exp Points', `${character.experience || 0} XP`, 468, 720, 110, 16);

  // ------------------------------------------
  // Left Column: Ability Scores (STR, DEX, CON, INT, WIS, CHA)
  // ------------------------------------------
  const abilitiesArr: { key: keyof typeof abilities; label: string }[] = [
    { key: 'str', label: 'Strength' },
    { key: 'dex', label: 'Dexterity' },
    { key: 'con', label: 'Constitution' },
    { key: 'int', label: 'Intelligence' },
    { key: 'wis', label: 'Wisdom' },
    { key: 'cha', label: 'Charisma' },
  ];

  let abilityY = 600;
  abilitiesArr.forEach((ab) => {
    // Ability card outline
    page1.drawRectangle({
      x: 24,
      y: abilityY,
      width: 58,
      height: 70,
      borderWidth: 1,
      borderColor: boxBorder,
      color: rgb(1, 1, 1),
    });
    page1.drawText(ab.label.toUpperCase(), {
      x: 27,
      y: abilityY + 58,
      size: 6.5,
      font: fontBold,
      color: darkSlate,
    });

    // Score & Modifier
    const scoreVal = abilities[ab.key];
    const modVal = getAbilityModifier(scoreVal);

    addField(page1, `Ability_${ab.key.toUpperCase()}_Mod`, 'Mod', formatModifier(modVal), 30, abilityY + 24, 46, 26);
    addField(page1, `Ability_${ab.key.toUpperCase()}_Score`, 'Score', `${scoreVal}`, 38, abilityY + 6, 30, 14);

    abilityY -= 76;
  });

  // ------------------------------------------
  // Left Mid Column: Saving Throws & Skills
  // ------------------------------------------
  // Inspiration Box
  page1.drawRectangle({ x: 92, y: 648, width: 110, height: 26, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  addCheckbox(page1, 'Inspiration', character.inspiration, 98, 656, 10);
  page1.drawText('INSPIRATION', { x: 114, y: 657, size: 7.5, font: fontBold, color: darkSlate });

  // Proficiency Bonus Box
  page1.drawRectangle({ x: 92, y: 616, width: 110, height: 26, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  addField(page1, 'ProficiencyBonus', 'Prof Bonus', formatModifier(profBonus), 96, 618, 30, 14);
  page1.drawText('PROFICIENCY BONUS', { x: 130, y: 624, size: 6.5, font: fontBold, color: darkSlate });

  // Saving Throws Box
  page1.drawRectangle({ x: 92, y: 504, width: 110, height: 106, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  page1.drawText('SAVING THROWS', { x: 112, y: 597, size: 7, font: fontBold, color: darkSlate });

  let stY = 582;
  abilitiesArr.forEach((ab) => {
    const isProf = character.savingThrowProficiencies.includes(ab.key);
    const mod = getSavingThrowModifier(ab.key, abilities[ab.key], isProf, profBonus);
    addCheckbox(page1, `ST_${ab.key.toUpperCase()}_Prof`, isProf, 96, stY, 7);
    addField(page1, `ST_${ab.key.toUpperCase()}_Mod`, '', formatModifier(mod), 106, stY - 2, 22, 11);
    page1.drawText(ab.label, { x: 132, y: stY, size: 7, font: fontRegular, color: black });
    stY -= 14;
  });

  // Skills Box
  page1.drawRectangle({ x: 92, y: 154, width: 110, height: 344, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  page1.drawText('SKILLS', { x: 132, y: 486, size: 7.5, font: fontBold, color: darkSlate });

  let skillY = 468;
  SKILLS_LIST.forEach((s) => {
    const isProf = character.skillProficiencies.includes(s.name);
    const mod = getSkillModifier(s.name, abilities, character.skillProficiencies, character.skillExpertise, profBonus);
    addCheckbox(page1, `Skill_${s.name}_Prof`, isProf, 96, skillY, 7);
    addField(page1, `Skill_${s.name}_Mod`, '', formatModifier(mod), 106, skillY - 2, 22, 11);
    page1.drawText(`${s.label} (${s.ability.toUpperCase()})`, {
      x: 131,
      y: skillY,
      size: 6.2,
      font: fontRegular,
      color: black,
    });
    skillY -= 17.5;
  });

  // Passive Perception & Other Proficiencies
  addField(page1, 'PassivePerception', 'Passive Wisdom (Perception)', `${passivePerception}`, 24, 114, 178, 18);

  const profsAndLanguages = [
    `LANGUAGES: ${character.languages?.join(', ') || 'Common'}`,
    `ARMOR: ${character.armorProficiencies?.join(', ') || 'None'}`,
    `WEAPONS: ${character.weaponProficiencies?.join(', ') || 'None'}`,
    `TOOLS: ${character.toolProficiencies?.join(', ') || 'None'}`,
  ].join('\n');

  addField(
    page1,
    'OtherProficienciesLanguages',
    'Other Proficiencies & Languages',
    profsAndLanguages,
    24,
    24,
    178,
    76,
    true
  );

  // ------------------------------------------
  // Middle Column: Combat & Vitals (AC, Init, Speed, HP, Attacks)
  // ------------------------------------------
  // Top Combat Row: AC, Initiative, Speed
  page1.drawRectangle({ x: 212, y: 616, width: 56, height: 58, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  addField(page1, 'ArmorClass', 'Armor Class', `${ac}`, 218, 622, 44, 34);

  page1.drawRectangle({ x: 274, y: 616, width: 56, height: 58, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  addField(page1, 'Initiative', 'Initiative', formatModifier(initiative), 280, 622, 44, 34);

  page1.drawRectangle({ x: 336, y: 616, width: 56, height: 58, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  addField(page1, 'Speed', 'Speed', `${character.speed || 30} ft`, 342, 622, 44, 34);

  // Hit Points Box
  page1.drawRectangle({ x: 212, y: 524, width: 180, height: 86, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  page1.drawText('HIT POINTS', { x: 272, y: 597, size: 7.5, font: fontBold, color: darkSlate });
  addField(page1, 'HPMax', 'Max HP', `${character.hpMax}`, 220, 566, 48, 18);
  addField(page1, 'HPCurrent', 'Current HP', `${character.hpCurrent}`, 274, 566, 56, 18);
  addField(page1, 'HPTemp', 'Temp HP', `${character.tempHp || 0}`, 336, 566, 48, 18);

  // Hit Dice & Death Saves
  page1.drawRectangle({ x: 212, y: 466, width: 86, height: 52, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  page1.drawText('HIT DICE', { x: 236, y: 508, size: 7, font: fontBold, color: darkSlate });
  addField(page1, 'HDTotal', 'Total HD', `${character.level}`, 218, 474, 34, 18);
  addField(page1, 'HDSpent', 'Spent', `${character.hitDiceSpent || 0}`, 256, 474, 34, 18);

  page1.drawRectangle({ x: 304, y: 466, width: 88, height: 52, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  page1.drawText('DEATH SAVES', { x: 320, y: 508, size: 7, font: fontBold, color: darkSlate });
  page1.drawText('SUCCESS', { x: 310, y: 494, size: 5.5, font: fontBold, color: black });
  addCheckbox(page1, 'DeathSaveSuccess1', (character.deathSaves?.successes || 0) >= 1, 344, 493, 7);
  addCheckbox(page1, 'DeathSaveSuccess2', (character.deathSaves?.successes || 0) >= 2, 356, 493, 7);
  addCheckbox(page1, 'DeathSaveSuccess3', (character.deathSaves?.successes || 0) >= 3, 368, 493, 7);

  page1.drawText('FAILURE', { x: 310, y: 478, size: 5.5, font: fontBold, color: black });
  addCheckbox(page1, 'DeathSaveFail1', (character.deathSaves?.failures || 0) >= 1, 344, 477, 7);
  addCheckbox(page1, 'DeathSaveFail2', (character.deathSaves?.failures || 0) >= 2, 356, 477, 7);
  addCheckbox(page1, 'DeathSaveFail3', (character.deathSaves?.failures || 0) >= 3, 368, 477, 7);

  // Attacks & Spellcasting Box
  page1.drawRectangle({ x: 212, y: 220, width: 180, height: 240, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  page1.drawText('ATTACKS & SPELLCASTING', { x: 244, y: 447, size: 7.5, font: fontBold, color: darkSlate });

  // Column headers for weapons
  page1.drawText('NAME', { x: 220, y: 434, size: 6, font: fontBold, color: darkSlate });
  page1.drawText('ATK BONUS', { x: 290, y: 434, size: 6, font: fontBold, color: darkSlate });
  page1.drawText('DAMAGE/TYPE', { x: 334, y: 434, size: 6, font: fontBold, color: darkSlate });

  // Weapons & combat cantrips list
  const equippedWeapons = (character.weapons || []).filter((w) => w.equipped);
  const weaponAttacks: { name: string; atk: string; dmg: string }[] = equippedWeapons.map((w) => {
    const isFinesse = w?.properties?.some((p) => p.toLowerCase().includes('finesse'));
    const isRanged = w?.category?.includes('Ranged');
    const abilityForAtk = isRanged || (isFinesse && abilities.dex > abilities.str) ? abilities.dex : abilities.str;
    const atkBonus = formatModifier(getAbilityModifier(abilityForAtk) + profBonus);
    const dmgStr = `${w.damage} ${w.damageType}`;
    return { name: w.name, atk: atkBonus, dmg: dmgStr };
  });

  // If fewer than 3 weapons, include combat cantrips into the weapon attack rows!
  if (weaponAttacks.length < 3 && cantripList.length > 0) {
    const combatCantrips = cantripList.filter(
      (c) =>
        c.damage ||
        c.damageType ||
        c.saveAbility ||
        ['Fire Bolt', 'Eldritch Blast', 'Ray of Frost', 'Sacred Flame', 'Toll the Dead', 'Shocking Grasp', 'Vicious Mockery'].includes(c.name)
    );
    for (const c of combatCantrips) {
      if (weaponAttacks.length >= 3) break;
      const atkStr = c.saveAbility
        ? `DC ${spellSaveDC} ${c.saveAbility.toUpperCase()}`
        : formatModifier(spellAttackBonus);
      const dmgStr = c.damage
        ? `${c.damage} ${c.damageType || ''}`
        : `${c.damageType || 'Special'}`;
      weaponAttacks.push({ name: c.name, atk: atkStr, dmg: dmgStr });
    }
  }

  for (let i = 0; i < 3; i++) {
    const w = weaponAttacks[i];
    const yOff = 414 - i * 22;
    addField(page1, `WeaponName_${i + 1}`, '', w?.name || '', 218, yOff, 68, 16);
    addField(page1, `WeaponAtk_${i + 1}`, '', w?.atk || '', 290, yOff, 38, 16);
    addField(page1, `WeaponDmg_${i + 1}`, '', w?.dmg || '', 332, yOff, 54, 16);
  }

  // Attacks Notes / Spells / Ammo description
  const cantripsSummary =
    cantripList.length > 0 ? `CANTRIPS: ${cantripList.map((c) => c.name).join(', ')}` : '';
  const lvl1Summary =
    level1List.length > 0 ? `1ST LEVEL SPELLS: ${level1List.map((s) => s.name).join(', ')}` : '';

  const attackNotes = [
    isCaster ? `Spell Save DC: ${spellSaveDC} | Spell Attack: ${formatModifier(spellAttackBonus)}` : '',
    cantripsSummary,
    lvl1Summary,
    ...equippedWeapons.map((w) => `${w.name}: ${w.properties?.join(', ') || ''}`),
  ]
    .filter(Boolean)
    .join('\n');

  addField(page1, 'AttacksSpellcastingNotes', 'Combat Notes', attackNotes, 218, 226, 168, 116, true);

  // Equipment & Currency Box
  page1.drawRectangle({ x: 212, y: 24, width: 180, height: 188, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  page1.drawText('EQUIPMENT & CURRENCY', { x: 250, y: 198, size: 7.5, font: fontBold, color: darkSlate });

  // Currency Row
  const cur = character.currency || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
  addField(page1, 'CP', 'CP', `${cur.cp || 0}`, 218, 172, 30, 14);
  addField(page1, 'SP', 'SP', `${cur.sp || 0}`, 252, 172, 30, 14);
  addField(page1, 'EP', 'EP', `${cur.ep || 0}`, 286, 172, 30, 14);
  addField(page1, 'GP', 'GP', `${cur.gp || 0}`, 320, 172, 34, 14);
  addField(page1, 'PP', 'PP', `${cur.pp || 0}`, 358, 172, 28, 14);

  // Gear text
  const gearText = [
    ...(character.armor || []).map((a) => `${a.name} (AC ${a.ac}, ${a.equipped ? 'Equipped' : 'Packed'})`),
    ...(character.inventory || []).map((g) => `${g.quantity > 1 ? `${g.quantity}x ` : ''}${g.name}`),
  ].join('\n');

  addField(page1, 'EquipmentList', '', gearText, 218, 30, 168, 134, true);

  // ------------------------------------------
  // Right Column: Personality & Features
  // ------------------------------------------
  const bgObj =
    FIVE_TOOLS_BACKGROUNDS.find(
      (b) => b.name.toLowerCase() === (character.background || '').toLowerCase()
    ) || FIVE_TOOLS_BACKGROUNDS[2]; // Fallback to Folk Hero

  const pTraits = character.personalityTraits?.trim() || bgObj?.suggestedTraits?.[0] || '';
  const pIdeals = character.ideals?.trim() || bgObj?.suggestedIdeals?.[0] || '';
  const pBonds = character.bonds?.trim() || bgObj?.suggestedBonds?.[0] || '';
  const pFlaws = character.flaws?.trim() || bgObj?.suggestedFlaws?.[0] || '';

  // Personality Traits
  addField(page1, 'PersonalityTraits', 'Personality Traits', pTraits, 400, 596, 188, 56, true);
  // Ideals
  addField(page1, 'Ideals', 'Ideals', pIdeals, 400, 520, 188, 48, true);
  // Bonds
  addField(page1, 'Bonds', 'Bonds', pBonds, 400, 444, 188, 48, true);
  // Flaws
  addField(page1, 'Flaws', 'Flaws', pFlaws, 400, 368, 188, 48, true);

  // Features & Traits (Class features, Racial traits, Feats)
  const featuresText = (character.features || [])
    .map((f) => `• ${f.name} (${f.source}${f.level ? ` Lvl ${f.level}` : ''}): ${cleanForPdf(f.description)}`)
    .join('\n\n');

  addField(page1, 'FeaturesAndTraits', 'Features & Traits', featuresText, 400, 24, 188, 318, true);

  // ==========================================
  // PAGE 2: Spellcasting & Grimoire Sheet
  // ==========================================
  const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page2.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: parchmentBg });

  // Top Spells Banner
  page2.drawRectangle({ x: 24, y: 720, width: 220, height: 50, color: darkSlate });
  page2.drawText('DUNGEONS & DRAGONS', { x: 32, y: 752, size: 10, font: fontBold, color: rgb(0.85, 0.75, 0.45) });
  page2.drawText('SPELLCASTING SHEET', { x: 32, y: 736, size: 13, font: fontBold, color: rgb(1, 1, 1) });

  page2.drawRectangle({ x: 254, y: 715, width: 334, height: 60, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  addField(page2, 'SpellClass', 'Spellcasting Class', character.className, 260, 725, 100, 18);
  addField(page2, 'SpellAbility', 'Spellcasting Ability', spellAbility.toUpperCase(), 368, 725, 66, 18);
  addField(page2, 'SpellSaveDC', 'Spell Save DC', `${spellSaveDC}`, 442, 725, 66, 18);
  addField(page2, 'SpellAttackBonus', 'Spell Attack Bonus', formatModifier(spellAttackBonus), 516, 725, 66, 18);

  const renderSpellLevelBox = (
    lvl: number,
    label: string,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    page2.drawRectangle({ x, y, width: w, height: h, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
    page2.drawText(label.toUpperCase(), { x: x + 8, y: y + h - 14, size: 7.5, font: fontBold, color: darkSlate });

    if (lvl > 0) {
      const calculatedSlots = getClassSpellSlots(character.className, character.level);
      const totalSlots = character.spellSlotsTotal?.[lvl - 1] ?? calculatedSlots[lvl - 1] ?? 0;
      const spentSlots = character.spellSlotsExpended?.[lvl - 1] || 0;
      addField(page2, `SpellSlotsTotal_${lvl}`, 'Slots Total', `${totalSlots}`, x + w - 74, y + h - 22, 32, 12);
      addField(page2, `SpellSlotsSpent_${lvl}`, 'Expended', `${spentSlots}`, x + w - 38, y + h - 22, 32, 12);
    }

    const list = spellsByLevel[lvl] || [];
    const textLines = list.map((sp) => `${sp.name} [${sp.school}, ${sp.castingTime}]`).join('\n');
    
    // For level 0, name standard field "Cantrips". For level 1, name "SpellsLevel_1".
    const fieldName = lvl === 0 ? 'Cantrips' : `SpellsLevel_${lvl}`;
    addField(page2, fieldName, '', textLines, x + 6, y + 8, w - 12, h - 36, true);
  };

  // Column 1: Cantrips (Lvl 0), 1st Level, 2nd Level
  renderSpellLevelBox(0, 'Cantrips (0 Level)', 24, 490, 178, 206);
  renderSpellLevelBox(1, '1st Level', 24, 256, 178, 222);
  renderSpellLevelBox(2, '2nd Level', 24, 24, 178, 222);

  // Column 2: 3rd Level, 4th Level, 5th Level
  renderSpellLevelBox(3, '3rd Level', 216, 474, 178, 222);
  renderSpellLevelBox(4, '4th Level', 216, 250, 178, 214);
  renderSpellLevelBox(5, '5th Level', 216, 24, 178, 216);

  // Column 3: 6th Level, 7th Level, 8th Level, 9th Level
  renderSpellLevelBox(6, '6th Level', 410, 528, 178, 168);
  renderSpellLevelBox(7, '7th Level', 410, 360, 178, 158);
  renderSpellLevelBox(8, '8th Level', 410, 192, 178, 158);
  renderSpellLevelBox(9, '9th Level', 410, 24, 178, 158);

  // ==========================================
  // PAGE 3: Character Backstory & Bio Details
  // ==========================================
  const page3 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page3.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: parchmentBg });

  // Top Bio Banner
  page3.drawRectangle({ x: 24, y: 720, width: 220, height: 50, color: darkSlate });
  page3.drawText('DUNGEONS & DRAGONS', { x: 32, y: 752, size: 10, font: fontBold, color: rgb(0.85, 0.75, 0.45) });
  page3.drawText('CHARACTER PROFILE & BIO', { x: 32, y: 736, size: 12, font: fontBold, color: rgb(1, 1, 1) });

  page3.drawRectangle({ x: 254, y: 715, width: 334, height: 60, borderWidth: 1, borderColor: boxBorder, color: rgb(1, 1, 1) });
  addField(page3, 'Age', 'Age', '25', 260, 725, 48, 18);
  addField(page3, 'Height', 'Height', "5'11\"", 314, 725, 48, 18);
  addField(page3, 'Weight', 'Weight', '170 lbs', 368, 725, 52, 18);
  addField(page3, 'Eyes', 'Eyes', 'Hazel', 426, 725, 48, 18);
  addField(page3, 'Skin', 'Skin', 'Fair', 480, 725, 48, 18);
  addField(page3, 'Hair', 'Hair', 'Dark Brown', 534, 725, 48, 18);

  // Backstory Box (Large)
  addField(page3, 'Backstory', 'Character Backstory', character.backstory || '', 24, 430, 360, 260, true);

  // Appearance / Portrait Box
  addField(page3, 'Appearance', 'Physical Appearance', character.appearance || '', 400, 430, 188, 260, true);

  // Allies & Organizations
  addField(page3, 'AlliesAndOrganizations', 'Allies & Organizations', character.alliesAndOrgs || '', 24, 220, 274, 180, true);

  // Additional Features & Notes
  addField(page3, 'AdditionalFeaturesAndTraits', 'Additional Notes & Quest Log', character.additionalNotes || '', 314, 220, 274, 180, true);

  // Treasure & Valuables
  addField(page3, 'Treasure', 'Treasure & Heirlooms', 'Family signet ring, curious brass key with archaic engravings, silver locket.', 24, 24, 564, 168, true);

  // Pre-generate appearance streams so form fields display filled in all PDF readers
  try {
    form.updateFieldAppearances(fontRegular);
  } catch (err) {
    console.warn('Could not update field appearances', err);
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export function downloadPdf(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
