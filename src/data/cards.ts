/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card, CardRarity, CardType, CardTag } from '../types';

export interface CardTemplate {
  templateId: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  cost: number;
  damage?: number;
  block?: number;
  heal?: number;
  strength?: number;
  drawBonus?: number;
  description: string;
  upgradedDescription: string;
  baseGoldCost: number;
  tags: CardTag[];
  synergyWith: string;
  counterCard: string;
  recommendArchetype: string;
  isInfiniteComboPart?: boolean;
}

export const CARD_TEMPLATES: Record<string, CardTemplate> = {
  // ==================== [1] COMMON CARDS (30 Sheets) ====================
  strike: {
    templateId: 'strike',
    name: '타격 (Strike)',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    damage: 6,
    description: '적에게 6의 피해를 줍니다.',
    upgradedDescription: '적에게 9의 피해를 줍니다.',
    baseGoldCost: 40,
    tags: ['Attack'],
    synergyWith: '기집중 (힘 증가)',
    counterCard: '민첩 기량',
    recommendArchetype: '기본 타격 덱'
  },
  defend: {
    templateId: 'defend',
    name: '수비 (Defend)',
    type: 'defense',
    rarity: 'common',
    cost: 1,
    block: 5,
    description: '방어도를 5 얻습니다.',
    upgradedDescription: '방어도를 8 얻습니다.',
    baseGoldCost: 40,
    tags: ['Skill'],
    synergyWith: '보초 철갑 (방어 비례 공격)',
    counterCard: '방어 관통 타격',
    recommendArchetype: '방어 반격 덱'
  },
  recover: {
    templateId: 'recover',
    name: '안정 (Recover)',
    type: 'heal',
    rarity: 'common',
    cost: 1,
    heal: 4,
    description: '체력을 4 회복합니다.',
    upgradedDescription: '체력을 7 회복합니다.',
    baseGoldCost: 55,
    tags: ['Skill', 'Exhaust'],
    synergyWith: '소멸 해방 (소멸 시 추가 시너지)',
    counterCard: '최대 흡혈',
    recommendArchetype: '방어 반격 덱'
  },
  shield_slam: {
    templateId: 'shield_slam',
    name: '보초 철벽격 (Shield Slam)',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    damage: 5,
    block: 5,
    description: '피해를 5 주고, 방어도를 5 얻습니다.',
    upgradedDescription: '피해를 8 주고, 방어도를 8 얻습니다.',
    baseGoldCost: 50,
    tags: ['Attack', 'Skill'],
    synergyWith: '방패 밀치기 극대화',
    counterCard: '방어 삭감 충격',
    recommendArchetype: '방어 반격 덱'
  },
  venom_prick: {
    templateId: 'venom_prick',
    name: '독침 투하 (Venom Prick)',
    type: 'debuff',
    rarity: 'common',
    cost: 1,
    damage: 3,
    description: '피해를 3 주고 적에게 [독] 상태이상을 3 중첩 부여합니다.',
    upgradedDescription: '피해를 4 주고 적에게 [독] 상태이상을 5 중첩 부여합니다.',
    baseGoldCost: 45,
    tags: ['Attack', 'Poison'],
    synergyWith: '독소 기폭 (Poison 폭발)',
    counterCard: '상태 정화 방패',
    recommendArchetype: '독 덱'
  },
  sulfur_ash: {
    templateId: 'sulfur_ash',
    name: '유황 불그을음 (Sulfur Ash)',
    type: 'debuff',
    rarity: 'common',
    cost: 1,
    damage: 2,
    description: '피해를 2 주고 적에게 [화상] 상태이상을 3 중첩 부여합니다.',
    upgradedDescription: '피해를 3 주고 적에게 [화상] 상태이상을 5 중첩 부여합니다.',
    baseGoldCost: 45,
    tags: ['Attack', 'Burn'],
    synergyWith: '잿더미 점화 (Burn 지속 피해 기폭)',
    counterCard: '얼음의 보호',
    recommendArchetype: '화상 덱'
  },
  pocket_draw: {
    templateId: 'pocket_draw',
    name: '비상 주머니 (Pocket Draw)',
    type: 'special',
    rarity: 'common',
    cost: 0,
    drawBonus: 1,
    description: '카드를 1장 뽑습니다.',
    upgradedDescription: '카드를 2장 뽑습니다.',
    baseGoldCost: 50,
    tags: ['Draw', 'Infinite'],
    synergyWith: '마력 수환 (드로우 시 코스트 충전)',
    counterCard: '버림 유도 마티유',
    recommendArchetype: '드로우 덱',
    isInfiniteComboPart: true
  },
  energy_crystal: {
    templateId: 'energy_crystal',
    name: '에너지 수정 (Energy Crystal)',
    type: 'special',
    rarity: 'common',
    cost: 0,
    description: '이번 턴에 사용할 마력 에너지를 1 얻고 소멸합니다.',
    upgradedDescription: '이번 턴에 사용할 마력 에너지를 1 얻고 카드 전력을 1장 뽑습니다. (소멸)',
    baseGoldCost: 65,
    tags: ['Energy', 'Exhaust'],
    synergyWith: '마력 집중의 고리',
    counterCard: '에너지 공허 저주',
    recommendArchetype: '에너지 덱'
  },
  quick_slap: {
    templateId: 'quick_slap',
    name: '속전속결 속차 (Quick Slap)',
    type: 'attack',
    rarity: 'common',
    cost: 0,
    damage: 3,
    description: '피해를 3 줍니다. 드로우 덱의 무한 구심점 가치.',
    upgradedDescription: '피해를 5 줍니다.',
    baseGoldCost: 40,
    tags: ['Attack', 'Infinite'],
    synergyWith: '마나 플로우 바인더',
    counterCard: '가시 방벽',
    recommendArchetype: '무한 콤보 덱',
    isInfiniteComboPart: true
  },
  reactive_guard: {
    templateId: 'reactive_guard',
    name: '즉각 철수 (Reactive Guard)',
    type: 'defense',
    rarity: 'common',
    cost: 1,
    block: 4,
    drawBonus: 1,
    description: '방어도를 4 획득하고 카드를 1장 드로우합니다.',
    upgradedDescription: '방어도를 6 획득하고 카드를 2장 드로우합니다.',
    baseGoldCost: 50,
    tags: ['Skill', 'Draw'],
    synergyWith: '철옹성 덱 압축',
    counterCard: '자해 가시',
    recommendArchetype: '드로우 덱'
  },
  spark: {
    templateId: 'spark',
    name: '불길 번쩍임 (Spark)',
    type: 'attack',
    rarity: 'common',
    cost: 0,
    damage: 2,
    description: '피해를 2 줍니다. 사용 후 버림더미로 가며 드로우 체인 연결점입니다.',
    upgradedDescription: '피해를 4 줍니다. 이번 턴 다음 드로우 카드 비용이 0이 됩니다.',
    baseGoldCost: 40,
    tags: ['Attack', 'Chain'],
    synergyWith: '체인 파이어 블래스트',
    counterCard: '반격 가시갑옷',
    recommendArchetype: '드로우 덱'
  },
  toxic_vapor: {
    templateId: 'toxic_vapor',
    name: '독성 안개 (Toxic Vapor)',
    type: 'debuff',
    rarity: 'common',
    cost: 1,
    description: '적에게 턴당 피해를 주는 [독]을 4 중첩 부여합니다.',
    upgradedDescription: '적에게 [독]을 7 중첩 부여합니다.',
    baseGoldCost: 50,
    tags: ['Skill', 'Poison'],
    synergyWith: '맹독의 성채 파열',
    counterCard: '신성 치유 정화',
    recommendArchetype: '독 덱'
  },
  kindling: {
    templateId: 'kindling',
    name: '불쏘시개 투척 (Kindling)',
    type: 'debuff',
    rarity: 'common',
    cost: 1,
    description: '적에게 지속 피해를 가하는 [화상]을 4 중첩 부여합니다.',
    upgradedDescription: '적에게 [화상]을 7 중첩 부여합니다.',
    baseGoldCost: 50,
    tags: ['Skill', 'Burn'],
    synergyWith: '대화재 기폭 장치',
    counterCard: '빙하지대 장막',
    recommendArchetype: '화상 덱'
  },
  recycle_rubble: {
    templateId: 'recycle_rubble',
    name: '부스러기 수집 (Recycle Rubble)',
    type: 'special',
    rarity: 'common',
    cost: 1,
    description: '버림더미에서 일반 공격 카드 중 1장을 무작위로 손패로 즉시 가져옵니다.',
    upgradedDescription: '비용 0으로 버림더미에서 무작위 공격 카드 1장을 손패로 가져옵니다.',
    baseGoldCost: 45,
    tags: ['Skill', 'Recycle'],
    synergyWith: '무한 동력의 검투사',
    counterCard: '심연 침묵의 종소리',
    recommendArchetype: '무한 콤보 덱'
  },
  exhaust_scrap: {
    templateId: 'exhaust_scrap',
    name: '탄피 소각 (Exhaust Scrap)',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    damage: 8,
    description: '강력한 타격을 가하고 내 손패의 무작위 카드 1장을 강제로 소멸(Exhaust)시킵니다.',
    upgradedDescription: '피해를 11 주고 패에서 선택 소멸을 발동합니다.',
    baseGoldCost: 45,
    tags: ['Attack', 'Exhaust'],
    synergyWith: '잿더미 무덤 (소멸 수치 비례 타격)',
    counterCard: '무한 증식 오물',
    recommendArchetype: '소멸 활용 덱'
  },
  barricade_prep: {
    templateId: 'barricade_prep',
    name: '바리케이드 구축 (Barricade Prep)',
    type: 'defense',
    rarity: 'common',
    cost: 1,
    block: 6,
    description: '방어도를 6 획득합니다. 만약 독 공격을 받은 이력이 있다면 방어도가 2배가 됩니다.',
    upgradedDescription: '방어도를 9 획득합니다. 독 공격 대항 보너스 2배.',
    baseGoldCost: 40,
    tags: ['Skill'],
    synergyWith: '공성 성채 수성전',
    counterCard: '관통 관착 가시',
    recommendArchetype: '방어 반격 덱'
  },
  fever: {
    templateId: 'fever',
    name: '열병 전이 (Fever)',
    type: 'debuff',
    rarity: 'common',
    cost: 1,
    description: '화상 덱의 불쏘시개가 됩니다. 적에게 [화상] 1중첩 및 6의 폭발 도트 화격 피해를 가합니다.',
    upgradedDescription: '적에게 [화상] 2중첩 및 9의 도트 화격 피해를 가합니다.',
    baseGoldCost: 55,
    tags: ['Skill', 'Burn'],
    synergyWith: '잿더미 점화 폭발',
    counterCard: '빙하기 얼음벽',
    recommendArchetype: '화상 덱'
  },
  mana_well: {
    templateId: 'mana_well',
    name: '마나 샘물 (Mana Well)',
    type: 'special',
    rarity: 'common',
    cost: 1,
    drawBonus: 1,
    description: '카드를 1장 뽑고 마나 코스트 비용을 1 회복합니다.',
    upgradedDescription: '카드를 2장 뽑고 마나 코스트 비용을 1 회복합니다.',
    baseGoldCost: 60,
    tags: ['Draw', 'Energy', 'Infinite'],
    synergyWith: '명인 무한 순환 바인더',
    counterCard: '침묵의 안개 저주',
    recommendArchetype: '에너지 덱',
    isInfiniteComboPart: true
  },
  preparation: {
    templateId: 'preparation',
    name: '철저한 수배 (Preparation)',
    type: 'buff',
    rarity: 'common',
    cost: 1,
    description: '다음 공격 카드의 데미지가 +5 증가합니다. (기첩 버프)',
    upgradedDescription: '다음 공격 카드의 데미지가 +10 증가합니다. (기첩 버프)',
    baseGoldCost: 45,
    tags: ['Skill', 'Combo'],
    synergyWith: '다단 광역 연격 참',
    counterCard: '가시 보철 갑틀',
    recommendArchetype: '무한 콤보 덱'
  },
  adrenaline_rush: {
    templateId: 'adrenaline_rush',
    name: '아드레날린 방출 (Adrenaline Rush)',
    type: 'buff',
    rarity: 'common',
    cost: 1,
    description: '다음 사용할 스킬 카드의 마나 비용이 0이 됩니다.',
    upgradedDescription: '다음 사용할 스킬 카드의 마나 비용이 0이 되며 카드를 1장 즉시 뽑습니다.',
    baseGoldCost: 55,
    tags: ['Energy', 'Combo'],
    synergyWith: '초동 무한 드로기',
    counterCard: '사념의 방해 장막',
    recommendArchetype: '에너지 덱'
  },
  shield_rebound: {
    templateId: 'shield_rebound',
    name: '방패 반사 격돌 (Shield Rebound)',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    damage: 4,
    description: '타격을 가하고 내 방어도의 50%만큼 추가 피해를 입힙니다.',
    upgradedDescription: '타격을 가하고 내 방어도의 100%만큼 추가 피해를 입힙니다.',
    baseGoldCost: 50,
    tags: ['Attack'],
    synergyWith: '합금 철성 벽체',
    counterCard: '강철 융진 지대 무위화',
    recommendArchetype: '방어 반격 덱'
  },
  poison_cloud: {
    templateId: 'poison_cloud',
    name: '부식성 구름 (Poison Cloud)',
    type: 'debuff',
    rarity: 'common',
    cost: 2,
    description: '적 전체에 치명적인 [독] 상태이상을 6 중첩 대대 부여합니다.',
    upgradedDescription: '적 전체에 치명적인 [독] 상태이상을 10 중첩 축적 부여합니다.',
    baseGoldCost: 70,
    tags: ['Skill', 'Poison'],
    synergyWith: '맹독 용해산',
    counterCard: '정화수 가호',
    recommendArchetype: '독 덱'
  },
  heat_stroke: {
    templateId: 'heat_stroke',
    name: '열충격파 (Heat Stroke)',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    damage: 10,
    description: '적에게 10의 화염 타격을 가하고 이미 화상 상태일 시 5 추가 피해를 줍니다.',
    upgradedDescription: '피해 15를 가하고 화상 상태일 시 9의 치명 보너스 피해를 가산합니다.',
    baseGoldCost: 65,
    tags: ['Attack', 'Burn'],
    synergyWith: '잿더미 기폭의 불길',
    counterCard: '빙하기 장갑',
    recommendArchetype: '화상 덱'
  },
  fletcher: {
    templateId: 'fletcher',
    name: '바람 가르기 (Fletcher)',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    damage: 4,
    description: '4의 피해를 입힙니다. 이 카드가 드로우될 때 자동으로 손패에서 0코스트로 발동됩니다.',
    upgradedDescription: '7의 피해를 입힙니다. 드로우될 때 공짜 즉시 사사 발동.',
    baseGoldCost: 50,
    tags: ['Attack', 'Draw'],
    synergyWith: '대량 초특급 드로 엔진',
    counterCard: '속도 마비 충격파',
    recommendArchetype: '드로우 덱'
  },
  discard_trap: {
    templateId: 'discard_trap',
    name: '찌끼 가려내기 (Discard Trap)',
    type: 'special',
    rarity: 'common',
    cost: 1,
    description: '손패에서 쓸모없는 카드 1장을 버리고 2장을 드로우합니다.',
    upgradedDescription: '손패에서 1장을 버리고 3장을 드로우하며 마력 비용 1을 취득합니다.',
    baseGoldCost: 45,
    tags: ['Draw', 'Recycle'],
    synergyWith: '버림 시너지 인챈트 수집',
    counterCard: '정신 마비 사슬',
    recommendArchetype: '드로우 덱'
  },
  pyro_starter: {
    templateId: 'pyro_starter',
    name: '초동 방화 소자 (Pyro Starter)',
    type: 'buff',
    rarity: 'common',
    cost: 1,
    description: '지속 마비 강화: 앞으로 [Burn] 카드를 부여할 때마다 화상 피해를 1씩 가산 영구 추가 부여합니다.',
    upgradedDescription: '지속 마비 강화: 화상 부여당 피해를 2씩 가산 추가합니다.',
    baseGoldCost: 60,
    tags: ['Power', 'Burn'],
    synergyWith: '영성 성채 대화재 열화',
    counterCard: '침수 냉각 보호망',
    recommendArchetype: '화상 덱'
  },
  venom_flask: {
    templateId: 'venom_flask',
    name: '유독 플라스크 (Venom Flask)',
    type: 'debuff',
    rarity: 'common',
    cost: 1,
    description: '독 충돌 촉매제: 적에게 [독] 3 중첩을 가하고 가볍게 3 피해를 줍니다.',
    upgradedDescription: '적에게 [독] 5 중첩을 가하고 5 피해를 줍니다.',
    baseGoldCost: 50,
    tags: ['Attack', 'Poison'],
    synergyWith: '맹독 확산기',
    counterCard: '신성 장막 보호막',
    recommendArchetype: '독 덱'
  },
  quick_defense: {
    templateId: 'quick_defense',
    name: '초경량 수비식 (Quick Defense)',
    type: 'defense',
    rarity: 'common',
    cost: 0,
    block: 3,
    description: '신속하게 방어력 3을 가볍게 즉시 회복 획득합니다.',
    upgradedDescription: '방어력 5를 비용 0으로 묵직하게 즉시 회복 획득합니다벨.',
    baseGoldCost: 45,
    tags: ['Skill', 'Infinite'],
    synergyWith: '방어 극치 가시 성채 격',
    counterCard: '관통 침투 화살',
    recommendArchetype: '무한 콤보 덱',
    isInfiniteComboPart: true
  },
  scavenge: {
    templateId: 'scavenge',
    name: '전장 청결 잔골 무력화 (Scavenge)',
    type: 'special',
    rarity: 'common',
    cost: 1,
    description: '손패의 불필요 카드를 1장 버리는 즉시 방어도를 5 얻습니다.',
    upgradedDescription: '손패 카드를 1장 버리는 즉시 방어도를 8 얻고 다음 공격 카드가 무료가 됩니다.',
    baseGoldCost: 45,
    tags: ['Skill', 'Recycle'],
    synergyWith: '버림더미 회생 연의',
    counterCard: '공격 전선 수장 저항',
    recommendArchetype: '방어 반격 덱'
  },
  chain_slash: {
    templateId: 'chain_slash',
    name: '연환 절격 (Chain Slash)',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    damage: 5,
    description: '피해를 5 줍니다. 만약 체인 카드 사용 이력이 존재하면 즉시 손패로 반향 회귀합니다.',
    upgradedDescription: '피해를 8 주고 아리랑 연환 체인을 유지하며 1장을 추가 드로우합니다.',
    baseGoldCost: 55,
    tags: ['Attack', 'Chain'],
    synergyWith: '체인 리액션 폭발격',
    counterCard: '충격 제동 성곽',
    recommendArchetype: '무한 콤보 덱'
  },

  // ==================== [2] RARE/EPIC CARDS (20 Sheets) ====================
  heavy_strike: {
    templateId: 'heavy_strike',
    name: '황혼의 대강타 (Heavy Strike)',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    damage: 14,
    description: '묵직한 관통 타격으로 14의 파괴적인 가시 피해를 깊게 가합니다.',
    upgradedDescription: '묵직한 격쇄로 20의 기합 가시 피해를 가합니다.',
    baseGoldCost: 80,
    tags: ['Attack'],
    synergyWith: '광전사의 분노 세공',
    counterCard: '금강 불괴 수비망',
    recommendArchetype: '기본 타격 덱'
  },
  swift_slash: {
    templateId: 'swift_slash',
    name: '신속 백련검 (Swift Slash)',
    type: 'attack',
    rarity: 'rare',
    cost: 1,
    damage: 4, // Hit twice handled in execution logic
    description: '매우 빠르게 4의 검격을 두 번 연속 가합니다. (힘 증가 시 위력 2배 가가 증대)',
    upgradedDescription: '피해량 6으로 두 번 자상 타격을 가합니다.',
    baseGoldCost: 90,
    tags: ['Attack', 'Combo'],
    synergyWith: '기집중 (Focus Strength)',
    counterCard: '영구 가시 보호망',
    recommendArchetype: '무한 콤보 덱'
  },
  focus: {
    templateId: 'focus',
    name: '기집중 선무 (Focus)',
    type: 'buff',
    rarity: 'rare',
    cost: 1,
    strength: 2,
    description: '힘의 고리를 충천하여 힘을 2 영구 획득합니다.',
    upgradedDescription: '힘의 원천을 완전히 개방하여 힘을 4 영구 획득합니다.',
    baseGoldCost: 85,
    tags: ['Power'],
    synergyWith: '신속 백련검, 연격 참',
    counterCard: '힘 감쇄 맹독 가호',
    recommendArchetype: '기본 타격 덱'
  },
  iron_wall: {
    templateId: 'iron_wall',
    name: '제국성 철옹벽 (Iron Wall)',
    type: 'defense',
    rarity: 'rare',
    cost: 2,
    block: 14,
    description: '성채 수성 장막을 세워 방어도를 14 두텁게 얻습니다.',
    upgradedDescription: '두터운 고밀도 탄소강 성옹 구축으로 방어도를 20 획득합니다.',
    baseGoldCost: 75,
    tags: ['Skill'],
    synergyWith: '방패 파쇄돌격 성옹 방방',
    counterCard: '관통 용해탄',
    recommendArchetype: '방어 반격 덱'
  },
  retaliate: {
    templateId: 'retaliate',
    name: '역전의 복수전 (Retaliate)',
    type: 'defense',
    rarity: 'rare', // Unified in rare range
    cost: 1,
    block: 7,
    strength: 1,
    description: '방어 보호막 7을 취득하고 역공 태세 힘을 1 얻습니다.',
    upgradedDescription: '방막 구도 10으로 늘리고 힘 충전을 2로 대폭 보완합니다.',
    baseGoldCost: 100,
    tags: ['Skill', 'Combo'],
    synergyWith: '복수심 각성',
    counterCard: '정신 교란 미약',
    recommendArchetype: '방어 반격 덱'
  },
  berserk: {
    templateId: 'berserk',
    name: '피의 광란 (Berserk)',
    type: 'buff',
    rarity: 'rare',
    cost: 1,
    strength: 4,
    heal: -3,
    description: '자해 극통 피해 3을 입는 각오로 투쟁 폭발 힘을 4 영구 충전합니다.',
    upgradedDescription: '자해 통증 줄임으로 2 소모하고 전술 폭발 힘을 6 충전합니다.',
    baseGoldCost: 110,
    tags: ['Power', 'Exhaust'],
    synergyWith: '용암 지옥의 불꽃 빌드',
    counterCard: '자제 마법 봉인',
    recommendArchetype: '무한 콤보 덱'
  },
  overcharge: {
    templateId: 'overcharge',
    name: '증기 과충전 (Overcharge)',
    type: 'special',
    rarity: 'rare',
    cost: 1,
    drawBonus: 3,
    description: '증기를 과출력하여 덱에서 카드를 3장 즉각 드로우합니다.',
    upgradedDescription: '마나 비용을 0으로 완전히 감축하여 카드를 3장 번개같이 드로우합니다.',
    baseGoldCost: 105,
    tags: ['Draw', 'Infinite'],
    synergyWith: '드로우 시너지 일점 수립',
    counterCard: '정신 과부하 봉쇄 안대',
    recommendArchetype: '드로우 덱',
    isInfiniteComboPart: true
  },
  execution: {
    templateId: 'execution',
    name: '철퇴 단죄처형 (Execution)',
    type: 'attack',
    rarity: 'rare',
    cost: 3,
    damage: 25,
    description: '철퇴의 구도로 적 적진 무방비에 단죄의 피해 25를 때립니다.',
    upgradedDescription: '강화 파괴력 36의 거대 참격을 꽂아버립니다.',
    baseGoldCost: 125,
    tags: ['Attack', 'Exhaust'],
    synergyWith: '초고밀 마나 폭격',
    counterCard: '공허 분산 장벽',
    recommendArchetype: '기본 타격 덱'
  },
  holy_light: {
    templateId: 'holy_light',
    name: '성령 장막 (Holy Light)',
    type: 'heal',
    rarity: 'rare',
    cost: 2,
    heal: 8,
    block: 8,
    description: '성스러운 비호 아래 갈라진 외상을 8 극적 회복하고 방막 8을 얻습니다.',
    upgradedDescription: '성령 활치 능력 강화로 치유 12 및 방어 충전 12를 취득합니다.',
    baseGoldCost: 135,
    tags: ['Skill', 'Exhaust'],
    synergyWith: '체력 생존 보너스 극대화',
    counterCard: '출혈 가위 침통',
    recommendArchetype: '방어 반격 덱'
  },
  noxious_spores: {
    templateId: 'noxious_spores',
    name: '맹독성 잔존 포자 (Noxious Spores)',
    type: 'debuff',
    rarity: 'rare',
    cost: 1,
    description: '독 지속 전개식 마력: 매 턴 개막 시 적에게 자동적 독 3중첩을 누산 가사 기여합니다.',
    upgradedDescription: '매턴 적 개막 독 누산 수량을 5중첩으로 높여 파멸을 재촉합니다.',
    baseGoldCost: 95,
    tags: ['Power', 'Poison'],
    synergyWith: '독소 살포 확정 격쇄',
    counterCard: '고열 살균 화염막',
    recommendArchetype: '독 덱'
  },
  catalyst: {
    templateId: 'catalyst',
    name: '유독성 촉매제 (Catalyst)',
    type: 'debuff',
    rarity: 'rare',
    cost: 1,
    description: '격변 독 유발 작용: 적에게 현재 적재 축적된 [독] 중첩 가치를 즉석에서 2배로 폭증시킵니다. (소멸)',
    upgradedDescription: '적재 축적 독 가치를 치명적인 3배 수량으로 증대 기폭시킵니다. (소멸)',
    baseGoldCost: 110,
    tags: ['Skill', 'Poison', 'Exhaust'],
    synergyWith: '독침 투하, 부식성 구름',
    counterCard: '완치 치료 정결화',
    recommendArchetype: '독 덱'
  },
  fire_breath: {
    templateId: 'fire_breath',
    name: '화염룡의 멸식 (Fire Breath)',
    type: 'buff',
    rarity: 'rare',
    cost: 1,
    description: '화상 사슬 전력: 매턴 내가 카드를 뽑아 올릴 때 적의 성곽에 [화상] 1중첩을 발사 멸균합니다.',
    upgradedDescription: '뽑아 올리는 드로 카드당 [화상] 누계를 2중첩으로 발사 기여합니다.',
    baseGoldCost: 95,
    tags: ['Power', 'Burn'],
    synergyWith: '드로우 체인 무적 소각',
    counterCard: '서리 골렘 빙결',
    recommendArchetype: '화상 덱'
  },
  immolation: {
    templateId: 'immolation',
    name: '공허 소멸 발화 (Immolation)',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    damage: 15,
    description: '적에게 15 피해를 주고 내 손패 잔량 카드 전체를 소멸 구치에 처박습니다.',
    upgradedDescription: '피해 수량을 화려하게 22로 키운 뒤 선택 소멸을 전체 화염 연계로 수행합니다.',
    baseGoldCost: 115,
    tags: ['Attack', 'Burn', 'Exhaust'],
    synergyWith: '소멸 영성 환수기',
    counterCard: '불가침 고체 갑옷',
    recommendArchetype: '소멸 활용 덱'
  },
  discard_mill: {
    templateId: 'discard_mill',
    name: '무한의 순환 분쇄가 (Discard Mill)',
    type: 'special',
    rarity: 'rare',
    cost: 1,
    description: '드로 파격: 손패를 모두 폐기 처분하고 즉각 그 수량만큼 새로운 도전을 드로우합니다.',
    upgradedDescription: '손패 모두 폐기 후 버림 수량의 +1장만큼 추가 수혈 가사를 이룹니다.',
    baseGoldCost: 90,
    tags: ['Draw', 'Recycle', 'Infinite'],
    synergyWith: '드로 고속 제압 바인더',
    counterCard: '탈진 고립 사막 저주',
    recommendArchetype: '드로우 덱',
    isInfiniteComboPart: true
  },
  exhaust_catalyst: {
    templateId: 'exhaust_catalyst',
    name: '소멸 환원식 역류 (Exhaust Catalyst)',
    type: 'special',
    rarity: 'rare',
    cost: 0,
    description: '이번 전투 도중 소멸 영역으로 추출 소외된 무작위 카드 2장을 영광스럽게 복구하여 손패로 돌립니다.',
    upgradedDescription: '소멸 영역에서 원하는 전략 카드를 직접 2장 영광스레 반향 회귀시켜 복구합니다.',
    baseGoldCost: 100,
    tags: ['Skill', 'Recycle', 'Exhaust'],
    synergyWith: '소멸 순환 고대 연사',
    counterCard: '기분 상실 차원의 붕쇄',
    recommendArchetype: '소멸 활용 덱'
  },
  adrenaline: {
    templateId: 'adrenaline',
    name: '순수 아드레날린 액츄에이터 (Adrenaline)',
    type: 'special',
    rarity: 'rare',
    cost: 0,
    drawBonus: 2,
    description: '소모 마나 0의 전략 심장: 에너지를 1 즉시 회복 쟁취하고 정교하게 2장 드로우합니다. (소멸)',
    upgradedDescription: '에너지를 2 회복하고 카드를 2장 드로우해 전장의 영도를 선도합니다. (소멸)',
    baseGoldCost: 120,
    tags: ['Energy', 'Draw', 'Exhaust', 'Infinite'],
    synergyWith: '무한 사이클의 극치 연격',
    counterCard: '마력 피로 한계선',
    recommendArchetype: '에너지 덱',
    isInfiniteComboPart: true
  },
  combust: {
    templateId: 'combust',
    name: '기체 연소 폭격 (Combust)',
    type: 'buff',
    rarity: 'rare',
    cost: 1,
    description: '매턴 내 턴 종결 때 체력을 1 강제 자해 소진하고 적 전체에 7의 폭열 고압 화염 피해를 누계 환원합니다.',
    upgradedDescription: '매턴 자해 1의 손실을 무릅쓰고 적 누계에 11의 폭열 피해를 먹입니다.',
    baseGoldCost: 85,
    tags: ['Power', 'Burn'],
    synergyWith: '피의 광분 폭발',
    counterCard: '정밀 수장 치료대',
    recommendArchetype: '화상 덱'
  },
  loop_recharge: {
    templateId: 'loop_recharge',
    name: '영원의 고리 환류 (Loop Recharge)',
    type: 'special',
    rarity: 'rare',
    cost: 2,
    description: '손패에 쥐어지고 남은 잔량 카드들의 이번 전투 수거 코스트 비용을 영구적으로 1 줄여줍니다.',
    upgradedDescription: '잔량 카드들의 코스트 비용을 영구히 2 줄여 극적 시너지를 폭발시킵니다.',
    baseGoldCost: 110,
    tags: ['Power', 'Energy', 'Infinite'],
    synergyWith: '초정량 거대 극강화 덱',
    counterCard: '코스트 동결의 빙설 한파',
    recommendArchetype: '에너지 덱',
    isInfiniteComboPart: true
  },
  venom_spit: {
    templateId: 'venom_spit',
    name: '맹독 용해 타액 (Venom Spit)',
    type: 'attack',
    rarity: 'rare',
    cost: 1,
    damage: 6,
    description: '피해를 6 가하고 적지에 [독] 4 중첩을 뿌린 뒤 그 수량에 연관해 체력 2 스틸 흡혈합니다.',
    upgradedDescription: '피해 9를 입히고 적 누산에 [독] 6 중첩에 치유 보너스 4를 충당 취득합니다.',
    baseGoldCost: 95,
    tags: ['Attack', 'Poison'],
    synergyWith: '침식 침투 산성액',
    counterCard: '가시 침묵 보호벽',
    recommendArchetype: '독 덱'
  },
  shield_barrier: {
    templateId: 'shield_barrier',
    name: '강철 성곽 방루 (Shield Barrier)',
    type: 'defense',
    rarity: 'rare',
    cost: 1,
    block: 8,
    description: '견고한 방어막 8을 취득합니다. 드로우 덱 및 방어 반격 시너지 완수 기둥입니다.',
    upgradedDescription: '마나 코스트를 소소하게 0으로 낮추고 단단한 방막 10을 세워 즉각 방어 충당전략을 펼칩니다.',
    baseGoldCost: 85,
    tags: ['Skill', 'Combo'],
    synergyWith: '방패 보조 반격격',
    counterCard: '구조 분해 철퇴',
    recommendArchetype: '방어 반격 덱'
  },

  // ==================== [3] LEGENDARY CARDS (10 Sheets) ====================
  double_energy: {
    templateId: 'double_energy',
    name: '마나 무한의 기백 (Double Energy)',
    type: 'special',
    rarity: 'legendary',
    cost: 0,
    drawBonus: 1,
    description: '코스트 제한을 넘치게 타파하는 기둥: 에너지를 1 쟁취 회복하고 카드 소모품을 1장 정밀 드로우합니다.',
    upgradedDescription: '에너지를 완벽하게 2 환원 회복하고 카드를 2장 정교하게 드로우합니다.',
    baseGoldCost: 200,
    tags: ['Energy', 'Draw', 'Infinite'],
    synergyWith: '신검 합일 드로 세공',
    counterCard: '고대의 억압 성유물 저주',
    recommendArchetype: '무한 콤보 덱',
    isInfiniteComboPart: true
  },
  sword_of_light: {
    templateId: 'sword_of_light',
    name: '홀리 리뎀션 (Sword of Light)',
    type: 'attack',
    rarity: 'legendary',
    cost: 2,
    damage: 16,
    block: 10,
    description: '심판의 위용: 빛의 예기를 가해 16의 거대 성휘 피해를 먹이고 견고한 방벽 10을 마운트합니다.',
    upgradedDescription: '타격을 24로 대폭 확장 강화하고 장엄한 영신 방벽 15를 확보 투사합니다.',
    baseGoldCost: 220,
    tags: ['Attack', 'Skill'],
    synergyWith: '방어적 일점 돌파력',
    counterCard: '타락 마귀 마력 흡선',
    recommendArchetype: '방어 반격 덱'
  },
  corpses_explode: {
    templateId: 'corpses_explode',
    name: '시체 폭발 연쇄선 (Corpse Exploder)',
    type: 'debuff',
    rarity: 'legendary',
    cost: 2,
    description: '파멸 침식 핵: 적에게 치밀한 [독] 상태이상을 무려 12 중첩 부여합니다! 사후 해당 누계치만큼 대대적 광격 기폭합니다.',
    upgradedDescription: '적 대량 처단을 촉진하도록 [독] 20 중첩을 삽입 부여하고 가속 기폭시킵니다.',
    baseGoldCost: 240,
    tags: ['Skill', 'Poison', 'Combo'],
    synergyWith: '유독성 연쇄 파열 촉매',
    counterCard: '구원의 성결 정수',
    recommendArchetype: '독 덱'
  },
  supernova: {
    templateId: 'supernova',
    name: '초신성 종말 소멸격 (Supernova)',
    type: 'attack',
    rarity: 'legendary',
    cost: 3,
    damage: 32,
    description: '종말급 핵참격: 신성의 에너지 불꽃으로 전방 적 중심에 32의 파멸 피해를 터뜨립니다! (이번 전투 중 소멸)',
    upgradedDescription: '파멸 타격의 위력을 극강화 45로 끌어올리고 전방위 대폭발을 완성합니다. (소멸)',
    baseGoldCost: 260,
    tags: ['Attack', 'Burn', 'Exhaust'],
    synergyWith: '소멸 영역 활용 잿더미 각성자',
    counterCard: '초월적 불사 보호막',
    recommendArchetype: '화상 덱'
  },
  time_dilation: {
    templateId: 'time_dilation',
    name: '크로노스 비동기 루프 (Time Dilation)',
    type: 'special',
    rarity: 'legendary',
    cost: 1,
    description: '시간 정밀 왜곡 기기: 이번 턴에 내가 사용해 버렸던 카드집 중 3장을 선택하여 비용 0 상태로 내 손패에 역류 복사합니다.',
    upgradedDescription: '비용 0으로 완전히 조율하여 즉시 버림더미의 카드 4장을 즉시 마나 소모전환 없이 역류 복제합니다.',
    baseGoldCost: 250,
    tags: ['Skill', 'Recycle', 'Infinite'],
    synergyWith: '크로노 루프 무한 콤보 머신',
    counterCard: '고장 난 태엽 고리 마기 저주',
    recommendArchetype: '무한 콤보 덱',
    isInfiniteComboPart: true
  },
  transcendence: {
    templateId: 'transcendence',
    name: '아카식 레코드 초월 (Transcendence)',
    type: 'buff',
    rarity: 'legendary',
    cost: 2,
    description: '영혼의 아카식 각성: 앞으로 내가 드로우하는 모든 카드의 소모 마나 코스트 비용이 영구히 0이 됩니다! (소멸)',
    upgradedDescription: '소모 마나 비용을 1로 경감하여 초동 소설식 전개를 완성시켜 모든 카드집을 무료화시킵니다. (소멸)',
    baseGoldCost: 280,
    tags: ['Power', 'Exhaust', 'Infinite'],
    synergyWith: '전 승천 카드 폭격 덱',
    counterCard: '절대 마력 봉쇄 사슬 고성',
    recommendArchetype: '에너지 덱',
    isInfiniteComboPart: true
  },
  endless_reservoir: {
    templateId: 'endless_reservoir',
    name: '무한 샘물 마력수원 (Endless Reservoir)',
    type: 'buff',
    rarity: 'legendary',
    cost: 1,
    description: '원천 복사 전개: 수거 카드를 뽑아 올릴 때마다 50%의 행운으로 마나 비용을 획득하고 계속 영속 드로우를 시도합니다.',
    upgradedDescription: '100%의 확률로 마나 에너지를 매 드로 수거 시 기어이 1 획득하여 무한의 루프를 영원화합니다.',
    baseGoldCost: 230,
    tags: ['Power', 'Draw', 'Energy', 'Infinite'],
    synergyWith: '드로우 동력 극대 추진',
    counterCard: '기력 고갈 황폐의 늪지',
    recommendArchetype: '드로우 덱',
    isInfiniteComboPart: true
  },
  judgment_day: {
    templateId: 'judgment_day',
    name: '라그나로크 최후 심판 (Ragnarok)',
    type: 'attack',
    rarity: 'legendary',
    cost: 3,
    damage: 10, // hits 4 times! Handled in GameScreen execution logic
    description: '심판의 신속 폭격: 적에게 10의 피해를 기세 사납게 4번 연속 난사 가합니다. (힘 버프의 극치 보상!)',
    upgradedDescription: '영웅의 무쌍 15 가시 피해를 무려 4번 난타하여 60의 파괴 위용을 적지에 증명해 냅니다.',
    baseGoldCost: 270,
    tags: ['Attack', 'Combo'],
    synergyWith: '기집중 선무, 피의 광분 폭발',
    counterCard: '가시 침 바리케이드 요새',
    recommendArchetype: '기본 타격 덱'
  },
  plague_bearer: {
    templateId: 'plague_bearer',
    name: '역병 군주의 침묵 사신 (Plague Bearer)',
    type: 'debuff',
    rarity: 'legendary',
    cost: 2,
    description: '독소 살포 극화: 전방 적지에 치명적인 [독] 8 중첩을 깔아내고 매번 카드 손놀림을 보일 때마다 [독]을 추가로 기산합니다.',
    upgradedDescription: '전방 적지에 치명적인 [독] 12 중첩을 부여하고 대량 침식을 자동 발현합니다.',
    baseGoldCost: 210,
    tags: ['Power', 'Poison'],
    synergyWith: '포자 감염 핵기폭 촉매제',
    counterCard: '신성 구원의 대천사 성막',
    recommendArchetype: '독 덱'
  },
  bastion_of_glory: {
    templateId: 'bastion_of_glory',
    name: '영광의 전설 철옹성 (Bastion of Glory)',
    type: 'defense',
    rarity: 'legendary',
    cost: 2,
    block: 22,
    description: '수성 결집: 불침의 방어도를 무려 22 시원히 획득하며 이번 턴 받는 어떠한 디버프 가용 상태이상을 완전 무력 복사 차단합니다.',
    upgradedDescription: '비용 소소히 축소하여 방어도도 무려 30 취득하고 고결 상대를 전개합니다.',
    baseGoldCost: 230,
    tags: ['Power', 'Combo'],
    synergyWith: '방패 보조 복수 참격 강타',
    counterCard: '용암 지저 압축용 멜터',
    recommendArchetype: '방어 반격 덱'
  }
};

let uniqueCounter = 0;

export function createCard(templateId: string, upgraded = false): Card {
  const template = CARD_TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Card template not found: ${templateId}`);
  }

  // Basic calculation mappings
  let cost = template.cost;
  let damage = template.damage;
  let block = template.block;
  let heal = template.heal;
  let strength = template.strength;
  let drawBonus = template.drawBonus;

  if (upgraded) {
    if (templateId === 'strike') damage = 9;
    if (templateId === 'defend') block = 8;
    if (templateId === 'recover') heal = 7;
    if (templateId === 'shield_slam') {
      damage = 8;
      block = 8;
    }
    if (templateId === 'venom_prick') {
      damage = 4;
    }
    if (templateId === 'sulfur_ash') {
      damage = 3;
    }
    if (templateId === 'pocket_draw') {
      drawBonus = 2;
    }
    if (templateId === 'energy_crystal') {
      drawBonus = 1;
    }
    if (templateId === 'quick_slap') {
      damage = 5;
    }
    if (templateId === 'reactive_guard') {
      block = 6;
      drawBonus = 2;
    }
    if (templateId === 'spark') {
      damage = 4;
    }
    if (templateId === 'fever') {
      damage = 9;
    }
    if (templateId === 'mana_well') {
      drawBonus = 2;
    }
    if (templateId === 'shield_rebound') {
      damage = 8;
    }
    if (templateId === 'heat_stroke') {
      damage = 15;
    }
    if (templateId === 'fletcher') {
      damage = 7;
    }
    if (templateId === 'discard_trap') {
      drawBonus = 3;
    }
    if (templateId === 'venom_flask') {
      damage = 5;
    }
    if (templateId === 'quick_defense') {
      block = 5;
    }
    if (templateId === 'chain_slash') {
      damage = 8;
      drawBonus = 1;
    }

    // Rare/Epic limits:
    if (templateId === 'heavy_strike') damage = 20;
    if (templateId === 'swift_slash') damage = 6;
    if (templateId === 'focus') strength = 4;
    if (templateId === 'iron_wall') block = 20;
    if (templateId === 'retaliate') {
      block = 10;
      strength = 2;
    }
    if (templateId === 'berserk') {
      strength = 6;
      heal = -2;
    }
    if (templateId === 'overcharge') cost = 0;
    if (templateId === 'execution') damage = 36;
    if (templateId === 'holy_light') {
      heal = 12;
      block = 12;
    }
    if (templateId === 'immolation') {
      damage = 22;
    }
    if (templateId === 'discard_mill') {
      // upgraded handled via game flow engine
    }
    if (templateId === 'exhaust_catalyst') {
      // upgraded handled via game flow engine
    }
    if (templateId === 'adrenaline') {
      // upgrade effects handled in calculation logic
    }
    if (templateId === 'loop_recharge') {
      // upgrade effects handled in calculation logic
    }
    if (templateId === 'venom_spit') {
      damage = 9;
    }
    if (templateId === 'shield_barrier') {
      cost = 0;
      block = 10;
    }

    // Legendary mappings:
    if (templateId === 'double_energy') {
      drawBonus = 2;
    }
    if (templateId === 'sword_of_light') {
      damage = 24;
      block = 15;
    }
    if (templateId === 'supernova') {
      damage = 45;
    }
    if (templateId === 'judgment_day') {
      damage = 15;
    }
    if (templateId === 'plague_bearer') {
      // handled via power execution logic
    }
    if (templateId === 'bastion_of_glory') {
      cost = 1;
      block = 30;
    }
  }

  uniqueCounter += 1;
  const id = `${templateId}_${Date.now()}_${uniqueCounter}`;
  const description = upgraded ? template.upgradedDescription : template.description;

  return {
    id,
    templateId,
    name: template.name,
    type: template.type,
    rarity: template.rarity,
    cost,
    damage,
    block,
    heal,
    strength,
    drawBonus,
    description,
    upgraded,
    tags: template.tags,
    synergyWith: template.synergyWith,
    counterCard: template.counterCard,
    recommendArchetype: template.recommendArchetype,
    isInfiniteComboPart: template.isInfiniteComboPart,
    goldCost: Math.floor(template.baseGoldCost * (0.9 + Math.random() * 0.2))
  };
}

export function getStartingDeck(): Card[] {
  const deck: Card[] = [];
  
  // Create solid versatile starter deck matching our newly mapped structures
  for (let i = 0; i < 4; i++) {
    deck.push(createCard('strike'));
  }
  for (let i = 0; i < 4; i++) {
    deck.push(createCard('defend'));
  }
  deck.push(createCard('recover'));
  deck.push(createCard('shield_slam'));

  return deck;
}

export function getRandomDraftOptions(excludeTemplates?: string[]): Card[] {
  const templates = Object.keys(CARD_TEMPLATES);
  const options: Card[] = [];
  
  const getRandTemplateId = () => {
    let rand = Math.random();
    let selectedRarity: CardRarity = 'common';
    if (rand < 0.05) {
      selectedRarity = 'legendary';
    } else if (rand < 0.25) {
      selectedRarity = 'rare';
    }

    const filtered = templates.filter(id => {
      const isExcluded = excludeTemplates?.includes(id);
      return CARD_TEMPLATES[id].rarity === selectedRarity && !isExcluded;
    });

    if (filtered.length > 0) {
      return filtered[Math.floor(Math.random() * filtered.length)];
    }

    return templates[Math.floor(Math.random() * templates.length)];
  };

  while (options.length < 3) {
    const tId = getRandTemplateId();
    if (!options.some(o => o.templateId === tId)) {
      options.push(createCard(tId));
    }
  }

  return options;
}
