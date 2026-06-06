/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Enemy, EnemyIntent } from '../types';

export interface EnemyTemplate {
  name: string;
  maxHp: number;
  difficulty: 'basic' | 'elite' | 'boss' | 'infinite';
  goldReward: number;
}

export const ENEMY_TEMPLATES: Record<string, EnemyTemplate> = {
  slime: {
    name: '점액질 슬라임 (Core Slime)',
    maxHp: 22,
    difficulty: 'basic',
    goldReward: 25
  },
  goblin: {
    name: '날랜 고블린 도적 (Goblin Thief)',
    maxHp: 32,
    difficulty: 'basic',
    goldReward: 35
  },
  golem: {
    name: '화강암 골렘 수호자 (Granite Golem)',
    maxHp: 52,
    difficulty: 'elite',
    goldReward: 55
  },
  firematch: {
    name: '지옥불 방화마도사 (Fire Arcanist)',
    maxHp: 65,
    difficulty: 'elite',
    goldReward: 65
  },
  demon_king: {
    name: '심연의 마왕 (Demon King - BOSS)',
    maxHp: 95,
    difficulty: 'boss',
    goldReward: 150
  }
};

/**
 * Enemy Actions generators for transparent Intent System
 */
export function getNextIntent(enemyName: string, turn: number, currentHp: number, maxEnergy: number = 3): EnemyIntent {
  // Pattern cycles based on name and turns
  const lowerName = enemyName.toLowerCase();

  // 1. SLIME (Basic, easy, attacks for 5-6, blocks for 5-6)
  if (lowerName.includes('슬라임') || lowerName.includes('slime')) {
    const cycle = turn % 3;
    if (cycle === 0) {
      return { type: 'attack', value: 6, text: '탄력적 타격 준비 (6 피해)' };
    } else if (cycle === 1) {
      return { type: 'defend', value: 5, text: '점액 축적 방패 (5 방어도)' };
    } else {
      return { type: 'attack', value: 4, text: '몸통 박치기 조준 (4 피해)' };
    }
  }

  // 2. GOBLIN (Highly offensive and self-buffing)
  if (lowerName.includes('고블린') || lowerName.includes('goblin')) {
    const cycle = turn % 4;
    if (cycle === 0) {
      return { type: 'attack', value: 8, text: '배후 기습 단검 (8 피해)' };
    } else if (cycle === 1) {
      return { type: 'buff', value: 2, text: '광포화 기합 (적의 힘 +2 영구 충전)' };
    } else if (cycle === 2) {
      return { type: 'attack', value: 6, text: '연속 난도질 공격 (6 피해)' };
    } else {
      return { type: 'defend', value: 6, text: '그림자 회피 (6 방어도)' };
    }
  }

  // 3. GOLEM (Elite, slow, high damage, huge block)
  if (lowerName.includes('골렘') || lowerName.includes('golem')) {
    const cycle = turn % 3;
    if (cycle === 0) {
      return { type: 'defend', value: 12, text: '화강암 철옹벽 (12 방어도)' };
    } else if (cycle === 1) {
      return { type: 'attack', value: 11, text: '대지 분쇄 슬램 (11 피해)' };
    } else {
      return { type: 'attack', value: 16, text: '기 모으기 후 돌격 타격 (16 무시무시한 피해!)' };
    }
  }

  // 4. FIRE ARCANIST (Elite magic user, stacks strength, deals heavy magic fireballs)
  if (lowerName.includes('방화마도사') || lowerName.includes('arcanist') || lowerName.includes('fire')) {
    const cycle = turn % 4;
    if (cycle === 0) {
      return { type: 'attack', value: 10, text: '화염구 투사 (10 마법 피해)' };
    } else if (cycle === 1) {
      return { type: 'buff', value: 3, text: '마력 증폭 불꽃 선언 (힘 +3 영구 증가!)' };
    } else if (cycle === 2) {
      return { type: 'attack', value: 14, text: '대화염 열풍 발산 (14 광역 피해)' };
    } else {
      return { type: 'defend', value: 8, text: '화염 결계 장막 (8 방어도)' };
    }
  }

  // 5. DEMON KING (Boss: Double strikes, severe buffs, catastrophic actions)
  if (lowerName.includes('마왕') || lowerName.includes('demon')) {
    // Stage boss health low mechanics
    if (currentHp < 35 && turn % 3 === 0) {
      return { type: 'buff', value: 4, text: '절체절명의 각성 (힘 +4 급격 팽창!)' };
    }
    
    const cycle = turn % 5;
    if (cycle === 0) {
      return { type: 'attack', value: 15, text: '지옥참마도 휩쓸기 (15 거대 대미지!)' };
    } else if (cycle === 1) {
      return { type: 'defend', value: 15, text: '어둠의 심연 보호막 (15 방어도 + 은폐)' };
    } else if (cycle === 2) {
      return { type: 'attack', value: 9, text: '지옥 발톱 연속 공격 (9 피해)' };
    } else if (cycle === 3) {
      return { type: 'buff', value: 2, text: '마계의 지지율 흡수 (힘 +2)' };
    } else {
      return { type: 'attack', value: 22, text: '★종말의 카타클리즘 브레스★ (22 파멸의 피해!)' };
    }
  }

  // 6. DEFAULT INFINITE / SCALED MONSTERS
  const loopCycle = turn % 3;
  if (loopCycle === 0) {
    return { type: 'attack', value: 10 + turn, text: '무한의 폭주 공격' };
  } else if (loopCycle === 1) {
    return { type: 'defend', value: 8 + turn, text: '무한의 경화 방패' };
  } else {
    return { type: 'buff', value: 2, text: '초월적 힘 팽창' };
  }
}

/**
 * Creates an enemy for a specific stage.
 * If stage > 5, scales metrics using loopCount and creates an infinite enemy.
 */
export function generateEnemyForStage(stage: number, loopCount: number): Enemy {
  let templateId = 'slime';
  let name = '';
  let hp = 20;
  let reward = 25;
  let difficulty: 'basic' | 'elite' | 'boss' | 'infinite' = 'basic';

  if (loopCount === 0) {
    // Normal campaign
    switch (stage) {
      case 1:
        templateId = 'slime';
        break;
      case 2:
        templateId = 'goblin';
        break;
      case 3:
        templateId = 'golem';
        break;
      case 4:
        templateId = 'firematch';
        break;
      case 5:
        templateId = 'demon_king';
        break;
      default:
        templateId = 'slime';
    }
    
    const template = ENEMY_TEMPLATES[templateId];
    name = template.name;
    hp = template.maxHp;
    reward = template.goldReward;
    difficulty = template.difficulty;
  } else {
    // Infinite Mode scales metrics beautifully!
    const names = [
      '심연의 맹독성 오버-슬라임 (Venomous Over-Slime)',
      '어둠의 암살자 무덤도적 (Graveyard Shadow Assassin)',
      '초고압 아다만티움 기가-골렘 (Gigantic Golem Armor)',
      '재불멸의 메가 파이어 카발 (Immortal Flame Arch-Mage)',
      '공허의 삼도천 마왕 주권자 (Abyssal Overlord Sovereign)'
    ];
    
    // Pick an index based on stage
    const nameIndex = Math.min((stage - 1) % 5, names.length - 1);
    name = `${names[nameIndex]} (루프 ${loopCount})`;
    
    // Scale stats exponentially based on loop count!
    // E.g., HP scales * 1.5 per loop, Damage * 1.3 per loop
    const healthMultiplier = Math.pow(1.5, loopCount);
    const indexHp = [22, 32, 52, 65, 95][nameIndex];
    hp = Math.floor(indexHp * healthMultiplier);
    reward = Math.floor(ENEMY_TEMPLATES[Object.keys(ENEMY_TEMPLATES)[nameIndex]].goldReward * (1 + 0.5 * loopCount));
    difficulty = 'infinite';
  }

  // Prepopulate the first plan (turn 1)
  const initialIntent = getNextIntent(name, 1, hp);

  return {
    id: `enemy_${Date.now()}`,
    name,
    maxHp: hp,
    hp,
    block: 0,
    strength: loopCount * 2, // starts with some extra strength in later loops!
    intent: initialIntent,
    difficulty,
    goldReward: reward
  };
}
