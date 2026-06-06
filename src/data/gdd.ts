/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GddSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  bullets?: string[];
}

export const GDD_CONTENT: GddSection[] = [
  {
    id: 'intro',
    title: '1. 게임 한 줄 소개',
    icon: 'Sparkles',
    content: '무한한 조합과 전략적 수 싸움을 3분 만에 즐기는 브라우저 기반 로그라이크 덱빌딩 카드 게임',
    bullets: [
      '단순명료함: 누구나 직관적인 규칙으로 즉시 터득 후 몰입적인 플레이 가능',
      '깊이 있는 전략: 적의 의도를 즉각 파악하여 공격, 방어, 버프 카드의 연계를 최적화',
      '고속 전개: 빠른 전투 사이클과 간편화된 성장 요소로 단판 완성형 로그라이크 경험 제공'
    ]
  },
  {
    id: 'rules',
    title: '2. 게임 규칙',
    icon: 'BookOpen',
    content: '플레이어는 고유의 덱(Deck)을 가꾸며 스테이지를 돌파하고, 적을 물리쳐 최고 점수를 목표로 합니다.',
    bullets: [
      '드로우 및 턴 진행: 매 턴 덱에서 일정 수의 카드를 무작위로 뽑고(기본 5장), 제한된 마나(에너지)로 최적의 조합을 사용',
      '승리 조건: 총 5단계로 설계된 맵의 마지막 노드에서 최종 보스 "데몬 킹(Demon King)"을 처치하거나, 무한 모드에서 한계 돌파',
      '패배 조건: 전투 도중 체력(HP)이 0이 되거나, 턴 마감 시까지 적의 파괴력 가중을 견디지 못하는 경우 즉시 게임 종료'
    ]
  },
  {
    id: 'cards',
    title: '3. 카드 시스템',
    icon: 'Layers',
    content: '등급별 속성을 활용해 나만의 시너지를 창출하고 카드를 강화 및 소비하는 시스템입니다.',
    bullets: [
      '카드 등급: 일반(Common), 희귀(Rare), 영웅(Epic), 전설(Legendary)로 나뉘며, 높은 등급일수록 변수 창출력이 우수함',
      '효과 분류: 공격(적에게 데미지 전달), 방어(블록 획득), 회복(HP 수복), 버프(공격력을 증가시키는 힘(Strength))',
      '덱 튜닝: 모험 중 조우하는 상점과 모닥불 이벤트를 통해 카드를 제거(정제)하거나 카드를 더욱 비싼 성능으로 1회 진화 가능',
      '시너지 연구: "힘 버프 카드" + "연타 공격계 카드"의 조합은 시너지를 증폭시켜 단숨에 엘리트 및 보스를 제압하는 쾌감을 유발'
    ]
  },
  {
    id: 'combat',
    title: '4. 전투 시스템',
    icon: 'Sword',
    content: '턴제 심리 전술이 핵심이며, 철저하게 적의 다음 행동 예측에 기반해 대응하는 상성 관리식 배틀입니다.',
    bullets: [
      '의도 표시(Intent System): 적 상단에 다음 턴에 행할 행동(일반 공격, 철벽 방어, 위협 버프 등)의 종류와 수치가 명확히 투사됨',
      '방어막 메커니즘(Block System): 턴 동안 부여받은 방어막은 아쉽게도 적의 공격을 흡수한 후 내 턴이 돌아오기 직전에 소멸',
      '전투 흐름: 플레이어 행동 → 카드 소요 및 코스트 지출 → 적 행동 실행 → 버프/디버프 소모 정산 순으로 엄격하게 순환'
    ]
  },
  {
    id: 'scoring',
    title: '5. 점수 시스템',
    icon: 'Trophy',
    content: '단순 행운 요소를 억제하고 실력적인 정밀 플레잉을 보상하는 세분화된 고유 점수 평가 시스템입니다.',
    bullets: [
      '계산식: 점수 = (완료 스테이지 × 200) + (수집된 골드 × 1) + (완전무결 전투 횟수 × 150) + (남은 HP 비율 × 300) + (속전속결 가산 최대 100 - 총 누적 턴수 × 10)',
      '완전무결 전투(Perfect Win): 공격받은 후 체력이 단 1도 손상되지 않고 블록으로 완전히 방어하며 무찔렀을 때 막대한 가산점 부여',
      '랭킹 리더보드: 브라우저 로컬 저장소(localStorage)에 역대 높은 스코어들과 가상 유저 기록을 보존하여 지속 성취 동기 강화'
    ]
  },
  {
    id: 'difficulty',
    title: '6. 난이도 시스템',
    icon: 'ShieldAlert',
    content: '쉬운 초반으로 학습 곡선을 부드럽게 만들되 중반부터 가속하여 고인물도 무한 도전이 가능한 선형적 가중 방식입니다.',
    bullets: [
      '스테이지 1-2 (기본전): 조작법 숙지를 돕기 위한 원형 슬라임(Slime) 및 날랜 오크(Goblin) 등장',
      '스테이지 3-4 (엘리트전/캠프비어): 누적 대미지를 강요하는 바위 골렘(Golem)이 등장하며 상점/정비를 통한 선택 장애 유도',
      '스테이지 5 (최종 보스전): 무자비한 패턴과 자생 체력 회복력을 겸비한 "데몬 킹"의 압박',
      '무한 루프(Infinite Mode): 보스 클리어 이후 진행 시 적의 체력과 공격 수치가 1.5배씩 무한 증가하여 숨 막히는 긴장감 제공'
    ]
  },
  {
    id: 'economy',
    title: '7. 경제 시스템',
    icon: 'Coins',
    content: '로그라이크 특유의 가용 재화 제한과 합리적 소비 간의 기회비용 저울질 시스템입니다.',
    bullets: [
      '골드 수급: 적 처치 보상 및 특수 이벤트를 벌어들여 획득',
      '상점 이용: 소장 가치가 높은 우수 속성 카드 직접 구매(Common~Legendary), 무작위 카드 리롤(새로고침), 효율을 낮추는 쓸모없는 기초 타격 카드 유료 정화 제거',
      '모닥불(Campfire): 위험 부위 치유(체력 회복) 또는 보유 최애 카드의 위력 강화(+3 데미지 등) 양자택일 구조 제공'
    ]
  },
  {
    id: 'ui',
    title: '8. UI 구성',
    icon: 'Layout',
    content: '가독성을 비약적으로 높인 싱글 스펙트럼 인핸스드 뷰입니다.',
    bullets: [
      '메인 로비(Menu): 영광의 기록 및 시작 버튼 제공',
      '정교한 전투창(Battle Room): 에너지바, 카드 손수 패(Hand), 덱 더미 잔여 개수, 적 인텐트 표출 및 HP 바 정렬',
      '모험 지도책(Map Route): 진행 방향이 시각적으로 노출되며 다음 보상 노드를 미리 식별',
      '인덱스 도감(Codex & Settings): 등장하는 모든 고밸류 시너지 조합 가이드 및 효과 목록 확인 가능'
    ]
  },
  {
    id: 'datamodel',
    title: '9. 데이터 구조 예시',
    icon: 'Database',
    content: '확장 및 유지보수가 간결하도록 정밀 타입으로 설계',
    bullets: [
      'Card: { id: string, name: string, type: "attack"|"defense"|"heal"|"buff", cost: number, damage: number, upgraded: boolean }',
      'Enemy: { id: string, name: string, hp: number, maxHp: number, block: number, intent: { type: "attack" | "defend", value: number } }',
      'GameState: { phase: "menu" | "battle" | "map" | "shop" | "victory", gold: number, deck: Card[], hand: Card[], graveyard: Card[] }'
    ]
  },
  {
    id: 'difficultyLevel',
    title: '10. 구현 난이도',
    icon: 'TrendingUp',
    content: '중간 (Intermediate)',
    bullets: [
      '클라이언트 순수 상태 머신 설계로 네트워킹 지연이 전무하여 조작 피드백이 극히 빠름',
      '전체적인 전투 상태 동기화 및 애니메이션 효과(motion 라이브러리 활용)의 연동 완성도가 품질을 결정'
    ]
  },
  {
    id: 'timeline',
    title: '11. 개발 예상 기간',
    icon: 'Calendar',
    content: '총 3주 (1인 풀타임 기획 및 개발 기준)',
    bullets: [
      '1주차: 카드/전투 규칙 상태 엔진 코어 프로토타입 개발 및 기본적인 터치 타겟 매핑 완료',
      '2주차: 상점, 캠프파이어, 하이 임팩트 시각 효과 디테일 업 및 카드 등급 간 밸런싱 수정',
      '3주차: 로컬 리더보드 점수 집계, 최종 테스팅, 폴리싱 및 반응형 웹 모바일 최적화 배포'
    ]
  },
  {
    id: 'expansion',
    title: '12. 확장 가능한 콘텐츠',
    icon: 'PlusCircle',
    content: '향후 추가 시 팬층 형성을 가속화할 강력한 추가 업데이트 후보군들입니다.',
    bullets: [
      '신규 직업군 추가: 마법사(보호막 유지 및 마나 충전 특화), 자객(드로우 촉진 및 중독 디버프 누적)',
      '유물 수집 시스템(Relic): 장착 시 항구적인 추가 패시브 제공 (예: 첫 드로우에 무조건 힘 1 획득 등)',
      '실시간 멀티 대항전(Direct PvP): 비동기 고스트 매치 방식 또는 턴 제한 시간 압박이 수반되는 실시간 카드 전장 개장'
    ]
  }
];
