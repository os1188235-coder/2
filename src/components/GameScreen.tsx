/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Shield, 
  Heart, 
  Zap, 
  Coins, 
  Sword, 
  MapPin, 
  Compass, 
  ChevronRight, 
  RefreshCw, 
  Trophy, 
  Play, 
  RotateCcw,
  User,
  Sparkles,
  ChevronLeft,
  Settings,
  HelpCircle,
  Hourglass,
  Skull,
  BookOpen,
  Crown
} from 'lucide-react';
import { Card, Enemy, PlayerStats, LeaderboardEntry, GamePhase, CardTag } from '../types';
import { getStartingDeck, createCard, getRandomDraftOptions, CARD_TEMPLATES } from '../data/cards';

// Multi-chapter configurations for a strategic 1-hour immersive game
interface ChapterInfo {
  num: number;
  title: string;
  subtitle: string;
  lore: string;
  color: string;
}

const CHAPTERS: Record<number, ChapterInfo> = {
  1: {
    num: 1,
    title: "잊혀진 왕국의 돌성채",
    subtitle: "Chapter I: The Desolate Citadel Ruins",
    lore: "몰락한 왕들의 비명이 차가운 바람을 타고 석벽 사이를 훑고 지나갑니다. 이곳에는 고대의 기억에 오염된 야수들과 고블린 유격대가 순찰을 돌고 있습니다.",
    color: "from-stone-850 to-stone-950"
  },
  2: {
    num: 2,
    title: "강철의 고문 지하감옥",
    subtitle: "Chapter II: Catacombs of Eternal Iron",
    lore: "지하 깊은 곳, 타오르는 마그마와 끓는 쇳물 소리가 요동칩니다. 지옥불 결계와 침략 기계 골렘들이 영웅의 침입에 경보를 울립니다.",
    color: "from-amber-950/80 to-stone-950"
  },
  3: {
    num: 3,
    title: "흑요석 종말의 파멸인",
    subtitle: "Chapter III: The Obsidian Chaos Throne",
    lore: "차원을 가르는 공허의 어둠 속, 마지막 파멸의 마왕 군주 데몬 킹이 심연의 기도를 올리는 종장입니다. 한 순간의 실수가 곧 절대 파멸입니다.",
    color: "from-purple-950/70 to-stone-950"
  }
};

// Strategic Map Node types
type MapNodeType = 'combat' | 'elite' | 'event' | 'merchant' | 'sanctuary';

interface MapNode {
  id: string;
  type: MapNodeType;
  title: string;
  desc: string;
  detail: string;
}

// Pre-constructed highscore board defaults
const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'h1', name: '영주 반 케일런 (Lord Kaelen)', score: 7850, stageCleared: 30, deckSize: 18, date: '2026-06-01', isPlayer: false },
  { id: 'h2', name: '흑조 가문 실라 (Shilla Crow)', score: 6420, stageCleared: 27, deckSize: 14, date: '2026-06-03', isPlayer: false },
  { id: 'h3', name: '구원의 사제 마리우스 (Marius)', score: 5900, stageCleared: 30, deckSize: 22, date: '2026-06-04', isPlayer: false },
  { id: 'h4', name: '바람의 방랑자 티모시 (Timothy)', score: 4350, stageCleared: 21, deckSize: 12, date: '2026-06-05', isPlayer: false },
  { id: 'h5', name: '심연의 잠수부 바일라 (Vayla)', score: 3200, stageCleared: 15, deckSize: 15, date: '2026-06-05', isPlayer: false }
];

// Gothic Dark Illustration Mappings (1st Person POV)
const getIllustrationForNode = (type: MapNodeType, title: string, stage: number) => {
  const normTitle = (title || "").toLowerCase();
  if (type === 'merchant') {
    return "/src/assets/images/gothic_merchant_1780708147474.png";
  }
  if (type === 'sanctuary') {
    return "/src/assets/images/holy_fountain_1780708163317.png";
  }
  if (type === 'elite') {
    if (stage > 10) {
      return "/src/assets/images/iron_behemoth_1780708130612.png";
    }
    return "/src/assets/images/citadel_fight_1780708112926.png";
  }
  if (type === 'event') {
    return "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=600";
  }
  // combat / basic
  if (stage <= 10) {
    return "/src/assets/images/citadel_fight_1780708112926.png";
  }
  return "/src/assets/images/iron_behemoth_1780708130612.png";
};

const getEnemyIllustration = (enemyName: string, stage: number) => {
  const name = (enemyName || "").toLowerCase();
  
  if (name.includes("하르슈트") || name.includes("harshute") || name.includes("overlord")) {
    return "/src/assets/images/citadel_fight_1780708112926.png";
  }
  if (name.includes("골렘") || name.includes("behemoth") || name.includes("iron")) {
    return "/src/assets/images/iron_behemoth_1780708130612.png";
  }
  if (name.includes("데몬 킹") || name.includes("demon") || name.includes("sovereign")) {
    // Beautiful ominous crimson portal/dark castle for final Demon King
    return "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800";
  }
  
  // Elites
  if (name.includes("검귀") || name.includes("slayer") || name.includes("학살") || name.includes("우두머리")) {
    return "/src/assets/images/citadel_fight_1780708112926.png";
  }
  if (name.includes("가고일") || name.includes("공성병") || name.includes("gargoyle")) {
    return "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=800";
  }
  
  // Stage fallback
  if (stage <= 10) {
    return "/src/assets/images/citadel_fight_1780708112926.png";
  }
  if (stage <= 20) {
    return "/src/assets/images/iron_behemoth_1780708130612.png";
  }
  return "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800";
};

interface GameScreenProps {
  initialShowLeaderboard?: boolean;
  activeTab?: 'game' | 'hall_of_fame';
  setActiveTab?: (tab: 'game' | 'hall_of_fame') => void;
}

export default function GameScreen({ 
  initialShowLeaderboard = false,
  activeTab = 'game',
  setActiveTab
}: GameScreenProps) {
  // Game Setup
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [playerName, setPlayerName] = useState<string>('');
  const [playerCode, setPlayerCode] = useState<string>(''); // 4-digit verification code
  const [deck, setDeck] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [drawPile, setDrawPile] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  
  // Stats
  const [stats, setStats] = useState<PlayerStats>({
    hp: 60,
    maxHp: 60,
    block: 0,
    strength: 0,
    gold: 120, // generous gold for longer strategy
    energy: 3,
    maxEnergy: 3,
    score: 0,
    perfBattles: 0
  });

  // Campaign Save status for Personal Deck feature
  const [hasSavedCampaign, setHasSavedCampaign] = useState<boolean>(false);
  const [savedCampaignData, setSavedCampaignData] = useState<any>(null);

  // Campaign Progression details
  const [currentStage, setCurrentStage] = useState<number>(1); // Total Stages (Unlimited/Infinite scale)
  const [hasVisitedCampOrShopNode, setHasVisitedCampOrShopNode] = useState<boolean>(false);
  
  // Real-time strategic clock
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Combat Entities
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [battleTurn, setBattleTurn] = useState<number>(1);
  const [damageTakenThisFight, setDamageTakenThisFight] = useState<boolean>(false);

  // Map phase strategic options
  const [mapNodes, setMapNodes] = useState<MapNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [draftOptions, setDraftOptions] = useState<Card[]>([]);

  // Shop & Alchemy Upgrade states
  const [shopCards, setShopCards] = useState<Card[]>([]);
  const [alchemyTargetCardId, setAlchemyTargetCardId] = useState<string | null>(null);
  const [alchemyMessage, setAlchemyMessage] = useState<string | null>(null);

  // Text Event State
  const [currentEventResult, setCurrentEventResult] = useState<{
    title: string;
    description: string;
    outcomeText: string;
    resolved: boolean;
    choices: { text: string; action: () => void }[];
  } | null>(null);

  // Visual highlights
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [enemyShaking, setEnemyShaking] = useState<boolean>(false);
  const [playerShaking, setPlayerShaking] = useState<boolean>(false);
  const [screenFlash, setScreenFlash] = useState<'player-hit' | 'enemy-hit' | 'heal' | 'shield' | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<{ id: string; val: string; type: 'damage' | 'shield' | 'heal' | 'buff', target: 'player' | 'enemy' }[]>([]);

  // Hall of Fame registry
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboardTab, setShowLeaderboardTab] = useState<boolean>(initialShowLeaderboard);

  // Score submitted status
  const [scoreSubmitted, setScoreSubmitted] = useState<boolean>(false);

  // Synergy & Combo System states
  const [enemyPoison, setEnemyPoison] = useState<number>(0);
  const [enemyBurn, setEnemyBurn] = useState<number>(0);
  const [exhaustPile, setExhaustPile] = useState<Card[]>([]);
  const [comboCount, setComboCount] = useState<number>(0);
  const [infiniteComboCounter, setInfiniteComboCounter] = useState<number>(0);
  const [freeNextCardType, setFreeNextCardType] = useState<'all' | 'attack' | 'skill' | null>(null);
  const [lastPlayedTags, setLastPlayedTags] = useState<CardTag[]>([]);
  const [isTranscendenceActive, setIsTranscendenceActive] = useState<boolean>(false);
  const [endlessReservoirActive, setEndlessReservoirActive] = useState<boolean>(false);
  const [pyroStarterAddMultiplier, setPyroStarterAddMultiplier] = useState<number>(0);
  const [noxiousSporesActive, setNoxiousSporesActive] = useState<boolean>(false);
  const [plagueBearerActive, setPlagueBearerActive] = useState<boolean>(false);
  const [fireBreathActive, setFireBreathActive] = useState<boolean>(false);

  // Timer reference
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Detect Personal Deck saves whenever player keys credentials
  useEffect(() => {
    if (playerName.trim() && playerCode.length === 4) {
      checkCampaignSave(playerName.trim(), playerCode.trim());
    } else {
      setHasSavedCampaign(false);
      setSavedCampaignData(null);
    }
  }, [playerName, playerCode]);

  const checkCampaignSave = async (pName: string, pCode: string) => {
    try {
      const res = await fetch(`/api/campaign/load?player_name=${encodeURIComponent(pName)}&player_code=${encodeURIComponent(pCode)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.found) {
          setHasSavedCampaign(true);
          setSavedCampaignData(json.data);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to ping server load_campaign API:", e);
    }
    
    // Local fallback
    const local = localStorage.getItem(`card_rogue_save_${pName}_${pCode}`);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setHasSavedCampaign(true);
        setSavedCampaignData(parsed);
      } catch (err) {
        setHasSavedCampaign(false);
        setSavedCampaignData(null);
      }
    } else {
      setHasSavedCampaign(false);
      setSavedCampaignData(null);
    }
  };

  // Sync leaderboard tab if changed from parent
  useEffect(() => {
    if (activeTab === 'hall_of_fame') {
      setShowLeaderboardTab(true);
    } else {
      setShowLeaderboardTab(false);
    }
  }, [activeTab]);

  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/rankings');
      if (response.ok) {
        const data = await response.json();
        const mapped: LeaderboardEntry[] = data.map((item: any) => ({
          id: item.id || String(Math.random()),
          name: item.player_name || item.name || "무명의 연대검투사",
          score: item.score || 0,
          stageCleared: item.stage || item.stageCleared || 1,
          deckSize: item.deck_size || item.deckSize || 12,
          date: item.created_at ? item.created_at.split('T')[0] : (item.date || new Date().toISOString().split('T')[0]),
          isPlayer: item.isPlayer ?? (item.player_name ? true : false)
        }));
        setLeaderboard(mapped);
      } else {
        throw new Error("Rankings API response is not ok");
      }
    } catch (err) {
      console.warn("Failed to fetch server rankings, using localStorage fallback:", err);
      const saved = localStorage.getItem('card_rogue_hof_v2');
      if (saved) {
        try {
          setLeaderboard(JSON.parse(saved));
        } catch (e) {
          setLeaderboard(DEFAULT_LEADERBOARD);
        }
      } else {
        localStorage.setItem('card_rogue_hof_v2', JSON.stringify(DEFAULT_LEADERBOARD));
        setLeaderboard(DEFAULT_LEADERBOARD);
      }
    }
  };

  // Load Leaderboard on Mount
  useEffect(() => {
    fetchRankings();
  }, []);

  // Clock Trigger
  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerActive]);

  // Floating text trigger
  const triggerFloatingText = (val: string, type: 'damage' | 'shield' | 'heal' | 'buff', target: 'player' | 'enemy') => {
    const id = `float_${Date.now()}_${Math.random()}`;
    setFloatingTexts(prev => [...prev, { id, val, type, target }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(f => f.id !== id));
    }, 1500);
  };

  // Convert digital timer format (e.g. 01:23:45)
  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getChapterOfStage = (stageNum: number): ChapterInfo => {
    const cycle = Math.floor((stageNum - 1) / 30);
    const relativeStage = stageNum - cycle * 30;
    
    if (relativeStage <= 10) {
      return {
        ...CHAPTERS[1],
        title: `${CHAPTERS[1].title} [${cycle + 1} 루프]`,
        subtitle: `${CHAPTERS[1].subtitle} (Cycle ${cycle + 1})`
      };
    }
    if (relativeStage <= 20) {
      return {
        ...CHAPTERS[2],
        title: `${CHAPTERS[2].title} [${cycle + 1} 루프]`,
        subtitle: `${CHAPTERS[2].subtitle} (Cycle ${cycle + 1})`
      };
    }
    return {
      ...CHAPTERS[3],
      title: `${CHAPTERS[3].title} [${cycle + 1} 루프]`,
      subtitle: `${CHAPTERS[3].subtitle} (Cycle ${cycle + 1})`
    };
  };

  /**
   * Save current campaign state to Local & Server DB for Personal Deck persistence
   */
  const saveCurrentCampaign = async (updatedStage?: number, updatedStats?: PlayerStats, updatedDeck?: Card[]) => {
    if (!playerName.trim() || playerCode.length !== 4) return;
    const campaignStage = updatedStage !== undefined ? updatedStage : currentStage;
    const campaignStats = updatedStats !== undefined ? updatedStats : stats;
    const campaignDeck = updatedDeck !== undefined ? updatedDeck : deck;

    const campaignSaveObj = {
      player_name: playerName.trim(),
      player_code: playerCode.trim(),
      stage: campaignStage,
      stats: campaignStats,
      deck: campaignDeck,
      elapsed_seconds: elapsedSeconds,
      updated_at: new Date().toISOString()
    };

    localStorage.setItem(`card_rogue_save_${playerName.trim()}_${playerCode.trim()}`, JSON.stringify(campaignSaveObj));

    try {
      await fetch('/api/campaign/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignSaveObj)
      });
    } catch (e) {
      console.warn("Failed to dispatch campaign sync to server:", e);
    }
  };

  /**
   * Resume/Load campaign with Personal Deck & Status
   */
  const handleResumeCampaign = () => {
    if (!savedCampaignData) return;
    const data = savedCampaignData;
    setPlayerName(data.player_name);
    setPlayerCode(data.player_code);
    setDeck(data.deck);
    setCurrentStage(data.stage);
    setStats(data.stats);
    setElapsedSeconds(data.elapsed_seconds || 0);
    setTimerActive(true);
    setScoreSubmitted(false);
    setShowLeaderboardTab(false);
    generateMapNodes(data.stage);
    setPhase('map');
  };

  /**
   * Conclude Adventure (Retire) to claim score securely without dying
   */
  const handleConcludeAdventure = () => {
    setStats(prev => ({
      ...prev,
      score: prev.score + currentStage * 150 + Math.floor(prev.gold / 2) // compute final glory valuation
    }));
    setTimerActive(false);
    setPhase('victory');
  };

  /**
   * Core Game Start
   */
  const handleStartNewGame = (draftedHeroName: string) => {
    const finalizedName = draftedHeroName.trim() || "무명의 도전자";
    setPlayerName(finalizedName);
    
    const initialDeck = getStartingDeck();
    setDeck(initialDeck);
    setCurrentStage(1);
    
    const initialStats = {
      hp: 75, // boosted for strategic scaling length
      maxHp: 75,
      block: 0,
      strength: 0,
      gold: 140,
      energy: 3,
      maxEnergy: 3,
      score: 0,
      perfBattles: 0
    };
    setStats(initialStats);

    setElapsedSeconds(0);
    setTimerActive(true);
    setScoreSubmitted(false);
    setShowLeaderboardTab(false);
    generateMapNodes(1);
    setPhase('map');

    // Trigger initial save after slate initialization
    if (playerCode.length === 4) {
      setTimeout(() => {
        const campaignSaveObj = {
          player_name: finalizedName,
          player_code: playerCode.trim(),
          stage: 1,
          stats: initialStats,
          deck: initialDeck,
          elapsed_seconds: 0,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem(`card_rogue_save_${finalizedName}_${playerCode.trim()}`, JSON.stringify(campaignSaveObj));
        fetch('/api/campaign/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaignSaveObj)
        }).catch(err => console.warn(err));
      }, 100);
    }
  };

  /**
   * Generates 3 strategic node choices for the stage path
   */
  const generateMapNodes = (stageNum: number) => {
    const chap = getChapterOfStage(stageNum);

    // If Boss Stage (Stage 10, 20, 30)
    if (stageNum % 10 === 0) {
      setMapNodes([
        {
          id: 'boss_node',
          type: 'elite',
          title: `심연 군주 멸족 관문 (Chapter Boss)`,
          desc: "돌아갈 수 없습니다. 피와 연철로 쓰여진 잔혹한 수문장을 격파하고 다음 챕터로 나아가야 합니다.",
          detail: "장시간 연마한 아군 전술 덱의 모든 기량을 쏟아붓는 극한의 대결전."
        }
      ]);
      return;
    }

    const nodePool: { type: MapNodeType; title: string; desc: string; detail: string }[] = [
      {
        type: 'combat',
        title: "성채 보초병 백병전 (Frontline Skirmish)",
        desc: "길목을 통제하는 마두식 무리들이 칼날을 가다듬고 있습니다.",
        detail: "무난한 전투 위주의 안전망. 승리 시 풍어의 보상 골드와 새로운 가용 카드 드래프트 카드를 보상받습니다."
      },
      {
        type: 'elite',
        title: "지옥불 군단 정예 강습구 (Archdemon Elite Clash)",
        desc: "불길하고 장엄한 고대 문양이 빛나는 장벽 너머, 중장 기병이 사슬을 쇠지레하며 기다립니다.",
        detail: "고난도 무결한 타격 전술이 요구되는 강습 전투. 치명적 피해 위험이 있으나 강력한 황금 보상과 고품격 전술 등급의 카드가 약속됩니다."
      },
      {
        type: 'event',
        title: "현자의 비고서 유적 (Ancient Scriptorium Event)",
        desc: "무너진 고딕 문짝 뒤편, 빛바랜 파란 등불이 아지랑이 피어오르는 미지의 도서관입니다.",
        detail: "운명과 결정을 겨루는 선택형 서사 이벤트. 건강을 담보하여 강력한 마스터 카드를 획득하거나, 불필요한 저주를 해제할 수 있습니다."
      },
      {
        type: 'merchant',
        title: "암시장 룬 용병단 마차 (Midnight Caravan Merchant & Runes)",
        desc: "기괴한 눈동자 랜턴을 매단 노상 수레에서 룬 융합 장비와 사역 카드가 지글거리는 진열장입니다.",
        detail: "시장 방문 및 연금술 룬 개조. 가용한 소지 골드를 바쳐 카드를 삭제하거나, 특유 카드를 구입하고, 능력치 합성인 룬 제련을 집행할 수 있습니다."
      },
      {
        type: 'sanctuary',
        title: "새벽빛 영혼 성소터 (Sacred Fountain Sanctuary)",
        desc: "영험한 푸른 성수 아지랑이가 서려 있어 오랜 행군의 고달픔을 영적으로 정화합니다.",
        detail: "안식처 방문. 신속하게 손상된 HP를 대폭 복원하거나 소중한 카드를 완전히 무료로 1회 제련할 기회를 얻습니다."
      }
    ];

    // Generate 3 random different nodes
    const selected: MapNode[] = [];
    const availablePool = [...nodePool];

    // Guarantee at least one combat
    const firstIdx = 0; // combat
    selected.push({
      id: `node_0_${stageNum}`,
      ...availablePool[firstIdx]
    });
    availablePool.splice(firstIdx, 1);

    // Pick 2 more unique ones
    while (selected.length < 3) {
      const rIdx = Math.floor(Math.random() * availablePool.length);
      selected.push({
        id: `node_${selected.length}_${stageNum}`,
        ...availablePool[rIdx]
      });
      availablePool.splice(rIdx, 1);
    }

    // Shuffle options array
    setMapNodes(selected.sort(() => Math.random() - 0.5));
  };

  /**
   * Selecting Node Route
   */
  const handleSelectNode = (node: MapNode) => {
    setSelectedNode(node);
    
    if (node.type === 'combat') {
      handleInitializeBattle(currentStage, 'basic');
    } else if (node.type === 'elite') {
      handleInitializeBattle(currentStage, 'elite');
    } else if (node.type === 'event') {
      generateScribeEvent();
    } else if (node.type === 'merchant') {
      generateShopItems();
      setPhase('shop');
    } else if (node.type === 'sanctuary') {
      setHasVisitedCampOrShopNode(false);
      setPhase('campfire');
    }
  };

  /**
   * Strategic Battle Engine Setup
   */
  const handleInitializeBattle = (stage: number, forceType?: 'basic' | 'elite') => {
    const isBossGate = stage % 10 === 0;
    const chap = getChapterOfStage(stage);

    let enemyHp = 30 + stage * 7;
    let enemyName = "";
    let difficulty: 'basic' | 'elite' | 'boss' = forceType === 'elite' ? 'elite' : 'basic';
    let goldReward = 20 + stage * 5;

    // Advanced scaling difficulty properties
    if (isBossGate) {
      difficulty = 'boss';
      goldReward = 80 + stage * 10;
      if (stage === 10) {
        enemyName = " Citadel Overlord: 성채 고문관 하르슈트";
        enemyHp = 135;
      } else if (stage === 20) {
        enemyName = " Iron Behemoth: 용암의 심장 강철 기계골렘";
        enemyHp = 220;
      } else {
        enemyName = " ⭐ Sovereign Demon King: 차원의 심연 종말군주 데몬 킹";
        enemyHp = 350;
      }
    } else if (forceType === 'elite') {
      enemyHp = Math.floor(enemyHp * 1.6);
      goldReward = Math.floor(goldReward * 1.8);
      const eliteNames = ["고딕 어둠 학살검귀", "광포한 헬하운드 우두머리", "심연 가고일 공성병", "흑마술 장벽 집행관"];
      enemyName = ` 💀 정예: ${eliteNames[stage % eliteNames.length]}`;
    } else {
      const basicNames = ["돌성채 타락 보초병", "익사한 성자 부활군", "암흑 역병 슬라임", "황야 단검 약탈자", "고대 지하감옥 돌거미"];
      enemyName = basicNames[stage % basicNames.length];
    }

    const firstActionValue = difficulty === 'boss' ? 12 : (difficulty === 'elite' ? 9 : 6);
    const initialEnemy: Enemy = {
      id: `enemy_${Date.now()}`,
      name: enemyName,
      maxHp: enemyHp,
      hp: enemyHp,
      block: 0,
      strength: Math.floor(stage / 5.5),
      intent: {
        type: 'attack',
        value: firstActionValue,
        text: `격파 전술 칼바람 (공격 ${firstActionValue})`
      },
      difficulty,
      goldReward
    };

    setEnemy(initialEnemy);
    setBattleTurn(1);
    setDamageTakenThisFight(false);

    // Shuffle and draw
    const initDrawPile = [...deck].sort(() => Math.random() - 0.5);
    const initHand = initDrawPile.slice(0, 5);
    const remainingDraw = initDrawPile.slice(5);

    setDrawPile(remainingDraw);
    setHand(initHand);
    setDiscardPile([]);

    // Turn starting stats
    setStats(prev => ({
      ...prev,
      block: 0,
      strength: 0, // dynamic start of combat Reset
      energy: prev.maxEnergy
    }));

    // Reset synergy systems and counters
    setEnemyPoison(0);
    setEnemyBurn(0);
    setExhaustPile([]);
    setComboCount(0);
    setInfiniteComboCounter(0);
    setFreeNextCardType(null);
    setLastPlayedTags([]);
    setIsTranscendenceActive(false);
    setEndlessReservoirActive(false);
    setPyroStarterAddMultiplier(0);
    setNoxiousSporesActive(false);
    setPlagueBearerActive(false);
    setFireBreathActive(false);

    setPhase('battle');
  };

  /**
   * Draw Card Method
   */
  const drawCardsCount = (count: number, currentDraw: Card[], currentDiscard: Card[], currentHand: Card[]) => {
    let newDraw = [...currentDraw];
    let newDiscard = [...currentDiscard];
    let newHand = [...currentHand];

    for (let i = 0; i < count; i++) {
      if (newHand.length >= 10) break; // limit hand

      if (newDraw.length === 0) {
        if (newDiscard.length === 0) break;
        newDraw = [...newDiscard].sort(() => Math.random() - 0.5);
        newDiscard = [];
      }

      const drawnCard = newDraw.shift();
      if (drawnCard) {
        newHand.push(drawnCard);
      }
    }

    setDrawPile(newDraw);
    setDiscardPile(newDiscard);
    setHand(newHand);
  };

  /**
   * Playing Card mechanics
   */
  /**
   * Playing Card mechanics (High-Fidelity Synergy & Combo System)
   */
  const handlePlayCard = (card: Card) => {
    if (!enemy) return;

    // Evaluate dynamic cost reductions and Transcendence
    const isFree = isTranscendenceActive ||
      freeNextCardType === 'all' ||
      (freeNextCardType === 'attack' && card.type === 'attack') ||
      (freeNextCardType === 'skill' && card.type !== 'attack');

    const effectiveCost = isFree ? 0 : card.cost;

    if (stats.energy < effectiveCost) {
      triggerFloatingText("마나 부족!", "damage", "player");
      return;
    }

    setActiveCardId(card.id);
    setTimeout(() => setActiveCardId(null), 250);

    // Consume free card buffers
    if (isFree && freeNextCardType !== null) {
      setFreeNextCardType(null); // Consumed
    }

    const nextEnergy = stats.energy - effectiveCost;
    let nextPlayerStrength = stats.strength;
    let nextPlayerHp = stats.hp;
    let nextEnemyHp = enemy.hp;
    let nextPlayerBlock = stats.block;
    let nextEnemyBlock = enemy.block;
    let nextPoison = enemyPoison;
    let nextBurn = enemyBurn;

    // Increment turn combo counter
    const nextCombo = comboCount + 1;
    setComboCount(nextCombo);

    // Infinite Combo detector
    if (nextCombo > 12) {
      setInfiniteComboCounter(prev => prev + 1);
      triggerFloatingText(`★ 무한 콤보 루틴 발동! (+15점) ★`, 'buff', 'player');
      setStats(prev => ({ ...prev, score: prev.score + 15 }));
    }

    // Tag-based consecutive usage (e.g. Poison tag -> Attack tag deals bonus damage)
    let synergyMultiplier = 1.0;
    if (lastPlayedTags.includes('Poison') && card.tags?.includes('Attack')) {
      synergyMultiplier = 1.5; // +50% synergistic damage
      triggerFloatingText(`독성 연계 격발 (+50%)`, 'buff', 'player');
    }

    // Multi-hit and core damage calculation
    if (card.damage !== undefined && card.damage > 0) {
      let hits = 1;
      if (card.templateId === 'swift_slash') hits = 2;
      if (card.templateId === 'judgment_day') hits = 4;

      let totalInflicted = 0;
      for (let h = 0; h < hits; h++) {
        let baseDam = card.damage + stats.strength;
        let finalDam = Math.floor(baseDam * synergyMultiplier);

        // Interact with defense block
        if (nextEnemyBlock > 0) {
          if (nextEnemyBlock >= finalDam) {
            nextEnemyBlock -= finalDam;
            finalDam = 0;
          } else {
            finalDam -= nextEnemyBlock;
            nextEnemyBlock = 0;
          }
        }
        nextEnemyHp = Math.max(0, nextEnemyHp - finalDam);
        totalInflicted += finalDam;
      }

      setScreenFlash('enemy-hit');
      setEnemyShaking(true);
      setTimeout(() => setEnemyShaking(false), 400);
      setTimeout(() => setScreenFlash(null), 150);
      triggerFloatingText(`-${totalInflicted} HP`, 'damage', 'enemy');
    }

    // Shield/Block Defense calculation
    if (card.block !== undefined && card.block > 0) {
      let finalBlock = card.block;
      // Shield rebound bonus
      if (card.templateId === 'shield_rebound') {
        const bonus = Math.floor(nextPlayerBlock * (card.upgraded ? 1.0 : 0.5));
        if (bonus > 0) {
          nextEnemyHp = Math.max(0, nextEnemyHp - bonus);
          triggerFloatingText(`방패 격돌 -${bonus}`, 'damage', 'enemy');
        }
      }
      nextPlayerBlock += finalBlock;
      setScreenFlash('shield');
      setTimeout(() => setScreenFlash(null), 150);
      triggerFloatingText(`+${finalBlock} 방벽`, 'shield', 'player');
    }

    // Heal / Self-harm resolution
    if (card.heal !== undefined && card.heal !== 0) {
      if (card.heal > 0) {
        nextPlayerHp = Math.min(stats.maxHp, nextPlayerHp + card.heal);
        setScreenFlash('heal');
        setTimeout(() => setScreenFlash(null), 150);
        triggerFloatingText(`+${card.heal} 체력`, 'heal', 'player');
      } else {
        // Self-harm
        nextPlayerHp = Math.max(1, nextPlayerHp + card.heal);
        setPlayerShaking(true);
        setTimeout(() => setPlayerShaking(false), 400);
        triggerFloatingText(`피의 봉헌 ${card.heal}`, 'damage', 'player');
      }
    }

    // Strength stat changes
    if (card.strength !== undefined && card.strength > 0) {
      nextPlayerStrength += card.strength;
      triggerFloatingText(`기세 힘 +${card.strength}`, 'buff', 'player');
    }

    // Poison / Burn state applicator
    if (card.tags?.includes('Poison')) {
      if (card.templateId === 'venom_prick') nextPoison += card.upgraded ? 5 : 3;
      if (card.templateId === 'toxic_vapor') nextPoison += card.upgraded ? 7 : 4;
      if (card.templateId === 'poison_cloud') nextPoison += card.upgraded ? 10 : 6;
      if (card.templateId === 'venom_flask') nextPoison += card.upgraded ? 5 : 3;
      if (card.templateId === 'venom_spit') nextPoison += card.upgraded ? 6 : 4;
      if (card.templateId === 'corpses_explode') nextPoison += card.upgraded ? 20 : 12;

      triggerFloatingText(`침식 독 +${nextPoison - enemyPoison}`, 'buff', 'enemy');
    }

    if (card.tags?.includes('Burn')) {
      let addBurn = 0;
      if (card.templateId === 'sulfur_ash') addBurn = card.upgraded ? 5 : 3;
      if (card.templateId === 'kindling') addBurn = card.upgraded ? 7 : 4;
      if (card.templateId === 'fever') addBurn = card.upgraded ? 2 : 1;
      if (card.templateId === 'immolation') addBurn = card.upgraded ? 8 : 5;
      if (card.templateId === 'heat_stroke') {
        addBurn = 2;
        // Heat stroke bonus damage on already burning enemies
        if (enemyBurn > 0) {
          const bonus = card.upgraded ? 9 : 5;
          nextEnemyHp = Math.max(0, nextEnemyHp - bonus);
          triggerFloatingText(`고열 발화 +${bonus}`, 'damage', 'enemy');
        }
      }

      const totalBurnAdded = addBurn + pyroStarterAddMultiplier;
      nextBurn += totalBurnAdded;
      triggerFloatingText(`화상 열화 +${totalBurnAdded}`, 'damage', 'enemy');
    }

    // Catalyst (Multiplier) handling
    if (card.templateId === 'catalyst') {
      const mult = card.upgraded ? 3 : 2;
      nextPoison = nextPoison * mult;
      triggerFloatingText(`독소 기폭 ${mult}배!`, 'buff', 'enemy');
    }

    // Active power nodes
    if (card.templateId === 'pyro_starter') {
      setPyroStarterAddMultiplier(prev => prev + (card.upgraded ? 2 : 1));
      triggerFloatingText(`방화 각인 장착`, 'buff', 'player');
    }
    if (card.templateId === 'noxious_spores') {
      setNoxiousSporesActive(true);
      triggerFloatingText(`독성 포자 살포기 가동`, 'buff', 'player');
    }
    if (card.templateId === 'plague_bearer') {
      setPlagueBearerActive(true);
      triggerFloatingText(`역병 의식 개막`, 'buff', 'player');
    }
    if (card.templateId === 'fire_breath') {
      setFireBreathActive(true);
      triggerFloatingText(`화룡의 멸식 전사`, 'buff', 'player');
    }
    if (card.templateId === 'transcendence') {
      setIsTranscendenceActive(true);
      triggerFloatingText(`아카식 해방 (전체 무료화)`, 'buff', 'player');
    }
    if (card.templateId === 'endless_reservoir') {
      setEndlessReservoirActive(true);
      triggerFloatingText(`마력 무한 수원지 확보`, 'buff', 'player');
    }

    // Draw engines and Energy boosters
    let extraDraw = 0;
    let extraMana = 0;

    if (card.templateId === 'pocket_draw') {
      extraDraw = card.upgraded ? 2 : 1;
    }
    if (card.templateId === 'energy_crystal') {
      extraMana = 1;
      if (card.upgraded) extraDraw = 1;
    }
    if (card.templateId === 'mana_well') {
      extraMana = 1;
      extraDraw = card.upgraded ? 2 : 1;
    }
    if (card.templateId === 'adrenaline_rush') {
      setFreeNextCardType('skill');
      if (card.upgraded) extraDraw = 1;
    }
    if (card.templateId === 'double_energy') {
      extraMana = card.upgraded ? 2 : 1;
      extraDraw = card.upgraded ? 2 : 1;
    }
    if (card.templateId === 'adrenaline') {
      extraMana = card.upgraded ? 2 : 1;
      extraDraw = 2;
    }
    if (card.drawBonus !== undefined && card.drawBonus > 0 && card.templateId !== 'double_energy') {
      extraDraw = card.drawBonus;
    }

    // Dynamic state integration
    let nextHand = hand.filter(h => h.id !== card.id);
    let nextDiscard = [...discardPile];
    let nextExhaust = [...exhaustPile];

    // Recycling mechanics: Discard Mill (discards hand, draws equal count)
    if (card.templateId === 'discard_mill') {
      const discardsCount = nextHand.length;
      nextDiscard = [...nextDiscard, ...nextHand];
      nextHand = [];
      extraDraw = card.upgraded ? (discardsCount + 1) : discardsCount;
      triggerFloatingText(`순환 분쇄 (${discardsCount}장 순환)`, 'buff', 'player');
    }

    // Immolation: exhaust entire remaining hand
    if (card.templateId === 'immolation') {
      nextExhaust = [...nextExhaust, ...nextHand];
      triggerFloatingText(`패 ${nextHand.length}장 강제 소멸!`, 'damage', 'player');
      nextHand = [];
    }

    // Recycle Rubble: pull random Attack from discard to hand
    if (card.templateId === 'recycle_rubble') {
      const discardAttacks = nextDiscard.filter(c => c.type === 'attack');
      if (discardAttacks.length > 0) {
        const pulled = discardAttacks[Math.floor(Math.random() * discardAttacks.length)];
        nextDiscard = nextDiscard.filter(c => c.id !== pulled.id);
        nextHand.push(pulled);
        triggerFloatingText(`버림더미 무작위 복원`, 'buff', 'player');
      }
    }

    // Exhaust Catalyst: pull 2 exhausted cards back to hand
    if (card.templateId === 'exhaust_catalyst') {
      const availableCount = Math.min(2, nextExhaust.length);
      for (let k = 0; k < availableCount; k++) {
        const pulled = nextExhaust.pop();
        if (pulled) {
          nextHand.push(pulled);
        }
      }
      triggerFloatingText(`소멸대 복원 (+${availableCount}장)`, 'buff', 'player');
    }

    // Time Dilation: clone up to 3/4 discarded cards with 0-cost
    if (card.templateId === 'time_dilation') {
      const targetCount = card.upgraded ? 4 : 3;
      const cloneTargets = nextDiscard.slice(-targetCount);
      cloneTargets.forEach(c => {
        nextHand.push({
          ...c,
          id: `${c.templateId}_dilated_${Date.now()}_${Math.random()}`,
          cost: 0,
          description: `🕒비정밀 루프: 비용 0 (${c.description})`
        });
      });
      triggerFloatingText(`시간 역류 복제 (+${cloneTargets.length}장)`, 'buff', 'player');
    }

    // Chain Slash returning logic
    let chainPushedBack = false;
    if (card.templateId === 'chain_slash' && lastPlayedTags.includes('Chain')) {
      chainPushedBack = true;
      nextHand.push(card); // immediate recursive rebound to hand!
      triggerFloatingText(`연루프 체인 반사!`, 'buff', 'player');
    }

    // Consolidate location of played card (Exhaust vs Discard)
    const isExhausted = card.tags?.includes('Exhaust') || card.templateId === 'catalyst' || card.templateId === 'supernova';
    if (isExhausted) {
      if (!chainPushedBack) {
        nextExhaust.push(card);
      }
      triggerFloatingText(`소멸 영구 봉인`, 'damage', 'player');
    } else {
      if (!chainPushedBack) {
        nextDiscard.push(card);
      }
    }

    // Set dynamic status updates
    setEnemyPoison(nextPoison);
    setEnemyBurn(nextBurn);
    setExhaustPile(nextExhaust);
    setHand(nextHand);
    setDiscardPile(nextDiscard);
    setLastPlayedTags(card.tags || []);

    const resolvedMana = Math.min(stats.maxEnergy, nextEnergy + extraMana);
    setStats(prev => ({
      ...prev,
      hp: nextPlayerHp,
      block: nextPlayerBlock,
      strength: nextPlayerStrength,
      energy: resolvedMana
    }));

    setEnemy(prev => {
      if (!prev) return null;
      return {
        ...prev,
        hp: nextEnemyHp,
        block: nextEnemyBlock
      };
    });

    // Run Draw routine if any
    if (extraDraw > 0) {
      setTimeout(() => {
        drawCardsCount(extraDraw, drawPile, nextDiscard, nextHand);
        // Endless Reservoir bonus energy per drawn card
        if (endlessReservoirActive) {
          setStats(prev => ({
            ...prev,
            energy: Math.min(prev.maxEnergy, prev.energy + extraDraw)
          }));
          triggerFloatingText(`수원지 마나 +${extraDraw}`, 'buff', 'player');
        }
      }, 50);
    }

    // Check combat victory termination
    if (nextEnemyHp <= 0) {
      setTimeout(() => {
        handleVictoryCombat(enemy.goldReward);
      }, 550);
    }
  };

  /**
   * End Turn Enemy Action Routine
   */
  /**
   * End Turn Enemy Action Routine and Status Effect Resolution
   */
  const handleEndTurn = () => {
    if (!enemy) return;

    // Reset turn combo counter
    setComboCount(0);

    let nextPlayerHp = stats.hp;
    let nextPlayerBlock = stats.block;
    let nextEnemyStrength = enemy.strength;
    let nextEnemyBlock = enemy.block;
    let nextEnemyHp = enemy.hp;

    // 1. Resolve Poison & Burn damage ticks on the enemy
    let dotDamage = 0;
    
    if (enemyPoison > 0) {
      dotDamage += enemyPoison;
      triggerFloatingText(`독 장막 침해 -${enemyPoison}`, 'damage', 'enemy');
    }
    if (enemyBurn > 0) {
      const burnCalc = enemyBurn + pyroStarterAddMultiplier;
      dotDamage += burnCalc;
      triggerFloatingText(`화상 고압 연소 -${burnCalc}`, 'damage', 'enemy');
    }

    // Apply tick damage
    nextEnemyHp = Math.max(0, nextEnemyHp - dotDamage);

    // Apply passive power expansions for next turn
    let subsequentPoison = Math.max(0, enemyPoison - 1);
    let subsequentBurn = Math.max(0, enemyBurn - 1);

    if (noxiousSporesActive && nextEnemyHp > 0) {
      subsequentPoison += 3;
      triggerFloatingText(`포자 포집 독 +3`, 'buff', 'enemy');
    }
    if (plagueBearerActive && nextEnemyHp > 0) {
      subsequentPoison += 5;
      triggerFloatingText(`역병 침투 독 +5`, 'buff', 'enemy');
    }
    if (fireBreathActive && nextEnemyHp > 0) {
      subsequentBurn += 3;
      triggerFloatingText(`룡멸 파열 화상 +3`, 'damage', 'enemy');
    }

    setEnemyPoison(subsequentPoison);
    setEnemyBurn(subsequentBurn);

    // Check if enemy died from DoT before taking action
    if (nextEnemyHp <= 0) {
      setEnemy(prev => prev ? { ...prev, hp: 0 } : null);
      setTimeout(() => {
        handleVictoryCombat(enemy.goldReward);
      }, 500);
      return;
    }

    // 2. Enemy executes scheduled intent
    const action = enemy.intent;

    if (action.type === 'attack') {
      let calcDmg = action.value + enemy.strength;
      
      if (stats.block > 0) {
        if (stats.block >= calcDmg) {
          nextPlayerBlock -= calcDmg;
          calcDmg = 0;
        } else {
          calcDmg -= stats.block;
          nextPlayerBlock = 0;
        }
      }

      nextPlayerHp = Math.max(0, nextPlayerHp - calcDmg);
      if (calcDmg > 0) {
        setDamageTakenThisFight(true);
      }

      setScreenFlash('player-hit');
      setPlayerShaking(true);
      setTimeout(() => setPlayerShaking(false), 400);
      setTimeout(() => setScreenFlash(null), 150);
      triggerFloatingText(`-${action.value + enemy.strength} HP`, 'damage', 'player');
    } else if (action.type === 'defend') {
      nextEnemyBlock += action.value;
      triggerFloatingText(`+${action.value} 방패`, 'shield', 'enemy');
    } else if (action.type === 'buff') {
      nextEnemyStrength += action.value;
      triggerFloatingText(`힘 +${action.value}`, 'buff', 'enemy');
    }

    // Player Death checks
    if (nextPlayerHp <= 0) {
      setStats(prev => ({ ...prev, hp: 0 }));
      setTimerActive(false);
      setTimeout(() => {
        setPhase('gameover');
      }, 600);
      return;
    }

    // End turn dynamic updates
    nextPlayerBlock = 0; // block is short-lived standard
    nextEnemyBlock = 0;

    const nextTurn = battleTurn + 1;
    setBattleTurn(nextTurn);

    setStats(prev => ({
      ...prev,
      hp: nextPlayerHp,
      block: nextPlayerBlock,
      energy: prev.maxEnergy
    }));

    // Generate Enemy Next Intent
    const isBossGate = currentStage % 10 === 0;
    let nextIntentType: 'attack' | 'defend' | 'buff' = 'attack';
    let val = 6 + Math.floor(currentStage * 0.7);
    let desc = "";

    const rand = Math.random();
    if (isBossGate) {
      val = 14 + nextTurn;
      if (nextTurn % 3 === 0) {
        nextIntentType = 'buff';
        val = 3;
        desc = "⭐ 파멸 심연 각성 (힘 +3 영구강화)";
      } else if (nextTurn % 2 === 0) {
        nextIntentType = 'defend';
        val = 15;
        desc = "심연의 흑요석 대성막 (+15 방어도)";
      } else {
        desc = `🔥 폭열 지옥 칼바람 발사 (공격 ${val})`;
      }
    } else {
      if (rand < 0.25) {
        nextIntentType = 'defend';
        val = 5 + Math.floor(currentStage * 0.5);
        desc = `철갑의 기세 수비 태세 (+${val} 방벽)`;
      } else if (rand < 0.4) {
        nextIntentType = 'buff';
        val = 1 + Math.floor(currentStage / 8);
        desc = `어둠의 혈맥 축복 (아군 힘 영구 +${val})`;
      } else {
        desc = `적 보초 참격타 (대미지 ${val})`;
      }
    }

    setEnemy({
      id: enemy.id,
      name: enemy.name,
      maxHp: enemy.maxHp,
      hp: nextEnemyHp,
      block: nextEnemyBlock,
      strength: nextEnemyStrength,
      intent: {
        type: nextIntentType,
        value: val,
        text: desc
      },
      difficulty: enemy.difficulty,
      goldReward: enemy.goldReward
    });

    // Recycle hand to discard and draw 5 new cards
    const nextDiscard = [...discardPile, ...hand];
    setDiscardPile(nextDiscard);
    drawCardsCount(5, drawPile, nextDiscard, []);
  };

  /**
   * Victory combat bonuses
   */
  const handleVictoryCombat = (goldReward: number) => {
    let perfectScoreBonus = 0;
    let perfBattlesInc = 0;

    if (!damageTakenThisFight) {
      perfectScoreBonus = 180;
      perfBattlesInc = 1;
      triggerFloatingText("Perfect! +180", "buff", "player");
    }

    const calculatedEarnedScore = 150 + perfectScoreBonus + Math.max(10, 100 - battleTurn * 10);
    setStats(prev => ({
      ...prev,
      gold: prev.gold + goldReward,
      score: prev.score + calculatedEarnedScore,
      perfBattles: prev.perfBattles + perfBattlesInc
    }));

    // Trigger Reward Draft options
    const rawOptions = getRandomDraftOptions(deck.map(c => c.templateId));
    setDraftOptions(rawOptions);
    setPhase('reward');
  };

  /**
   * Card draft collection
   */
  const handleChooseDraftCard = (card: Card) => {
    setDeck(prev => [...prev, card]);
    advanceStagePath();
  };

  const handleSkipDraft = () => {
    advanceStagePath();
  };

  const advanceStagePath = () => {
    // Stage cap completely removed for Endless Mode!
    const nextS = currentStage + 1;
    setCurrentStage(nextS);
    setHasVisitedCampOrShopNode(false);
    generateMapNodes(nextS);
    setSelectedNode(null);
    setPhase('map');

    // Dynamically preserve the player's personal deck and progress
    setTimeout(() => {
      saveCurrentCampaign(nextS);
    }, 100);
  };

  /**
   * Scriptorium Text Event generator (Deeper narratives with strategic outcomes)
   */
  const generateScribeEvent = () => {
    const stageNum = currentStage;
    const eventPool = [
      {
        title: "잃어버린 성골 기사의 관물대 (Epitaph of the Martyr)",
        description: "습하고 이끼 낀 기사 단장의 석관 위에 타오르는 푸른 빛 룬 문자 검이 꽂혀 있습니다. 비석에는 다음과 같이 갈겨져 있습니다. '우리의 기억을 취한 자, 결코 피 흘려 속죄할 수 없으리라.'",
        choices: [
          {
            text: "석관의 황금 성검을 움켜잡습니다. (체력 -15 소실, 전설 무작위 카드 1장 획득)",
            action: () => {
              const legendaryCards = Object.keys(CARD_TEMPLATES).filter(k => CARD_TEMPLATES[k].rarity === 'legendary');
              const randomTId = legendaryCards[Math.floor(Math.random() * legendaryCards.length)];
              const newC = createCard(randomTId);
              setDeck(prev => [...prev, newC]);
              setStats(prev => ({ ...prev, hp: Math.max(5, prev.hp - 15), score: prev.score + 220 }));
              triggerFloatingText("-15 체력, 영웅 카드 가중!", "damage", "player");
              setCurrentEventResult(prev => prev ? { ...prev, outcomeText: `성급히 손잡이를 움켜잡자 피맺힌 고대 불길이 영혼을 정화합니다! 고귀한 [${newC.name}]이 빛나며 가방에 스며듭니다.`, resolved: true } : null);
            }
          },
          {
            text: "석관 주변에 흩어져 있는 은제 제단 장식물을 털어갑니다. (75골드 획득, 덱에 수비 카드 1장 혼입)",
            action: () => {
              const strikeCard = createCard('defend');
              setDeck(prev => [...prev, strikeCard]);
              setStats(prev => ({ ...prev, gold: prev.gold + 75, score: prev.score + 100 }));
              triggerFloatingText("+75 Gold", "buff", "player");
              setCurrentEventResult(prev => prev ? { ...prev, outcomeText: "소지품 가방을 두둑하게 채우는 은그릇들을 회수했으나, 어깨가 무거워져 수비력에 제약을 받습니다.", resolved: true } : null);
            }
          },
          {
            text: "공손하게 기도를 올리고 물러납니다. (아무 일도 일어나지 않음, 영적 조화로 전술 가중 점수 +80)",
            action: () => {
              setStats(prev => ({ ...prev, score: prev.score + 80 }));
              setCurrentEventResult(prev => prev ? { ...prev, outcomeText: "무너지거나 탐하지 않고 기도를 올리자 영혼이 공명하며 평온을 유지합니다.", resolved: true } : null);
            }
          }
        ]
      },
      {
        title: "차원을 넘나드는 차가운 유랑 노새 (The Glimmering Mule)",
        description: "마계 독가스로 갈라진 성곽 뒤편에 짐마차 하나가 굴러가고 있습니다. 상인은 등 뒤를 돌아보며 기괴하게 속삭입니다. '보잘것없는 골드 한 푼 혹은 자양의 피를 전한다면, 전설 제천의 비약을 나눠드리지요.'",
        choices: [
          {
            text: "자신의 왕성한 상징 체력의 한계를 늘립니다. (소금 주머니 구입: 골드 -50 지불, 최대 체력 +12 영구 증가!)",
            action: () => {
              if (stats.gold < 50) {
                triggerFloatingText("골드 부족!", "damage", "player");
                return;
              }
              setStats(prev => ({ ...prev, gold: prev.gold - 50, maxHp: prev.maxHp + 12, hp: prev.hp + 12, score: prev.score + 150 }));
              triggerFloatingText("+12 Max HP", "buff", "player");
              setCurrentEventResult(prev => prev ? { ...prev, outcomeText: "정제된 성산 소금을 삼키자 사지의 피막이 바위처럼 튼튼해지며 기력이 팽창합니다.", resolved: true } : null);
            }
          },
          {
            text: "불필요하여 가방을 무겁게 하는 하위 카드를 하나 기부합니다. (타격(Strike) 카드 1장 헌납 탈삭제)",
            action: () => {
              const hasStrike = deck.some(c => c.templateId === 'strike' && !c.upgraded);
              if (!hasStrike) {
                triggerFloatingText("하위 타격 카드 부재!", "damage", "player");
                return;
              }
              // Remove first strike card
              let count = 0;
              const filteredDeck = deck.filter(c => {
                if (c.templateId === 'strike' && !c.upgraded && count === 0) {
                  count++;
                  return false;
                }
                return true;
              });
              setDeck(filteredDeck);
              setStats(prev => ({ ...prev, score: prev.score + 180 }));
              triggerFloatingText("Strike 제거 완료", "buff", "player");
              setCurrentEventResult(prev => prev ? { ...prev, outcomeText: "상인은 만족하는 섬뜩한 미소를 지으며 기초 타격 카드 무리를 불태워 회수해갔습니다. 덱이 매우 날렵해졌습니다.", resolved: true } : null);
            }
          }
        ]
      },
      {
        title: "침묵의 불경한 정화의 피아노 (Gothic Discord Chord)",
        description: "천장에 달린 오래된 쇠사슬들이 그늘진 피아노 건반 위에서 흔들거립니다. 건반을 건드리면 파괴의 멜로디 혹은 구원의 수막도가 열릴 것입니다.",
        choices: [
          {
            text: "운명의 강경한 화음을 내리칩니다. (체력 -8 감소하는 대신 모든 '타격'과 '수비'가 영구 제련되어 업그레이드!)",
            action: () => {
              const forgedDeck = deck.map(c => {
                if ((c.templateId === 'strike' || c.templateId === 'defend') && !c.upgraded) {
                  return createCard(c.templateId, true);
                }
                return c;
              });
              setDeck(forgedDeck);
              setStats(prev => ({ ...prev, hp: Math.max(5, prev.hp - 8), score: prev.score + 250 }));
              triggerFloatingText("-8 HP, 고대의 제련!", "damage", "player");
              setCurrentEventResult(prev => prev ? { ...prev, outcomeText: "고통 자금 피아노 현이 손바닥을 뒤감고 가벼운 피를 촉진한 뒤 모든 기본 카드를 업그레이드 개조했습니다!", resolved: true } : null);
            }
          },
          {
            text: "노래의 축성을 듣고 휴식을 전술로 승화합니다. (체력 +20 치유)",
            action: () => {
              setStats(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 20) }));
              triggerFloatingText("+20 체력", "heal", "player");
              setCurrentEventResult(prev => prev ? { ...prev, outcomeText: "조용히 연주되는 은총의 기도로 온몸의 피로 장벽이 무너지며 가뿐해집니다.", resolved: true } : null);
            }
          }
        ]
      }
    ];

    const randomEv = eventPool[stageNum % eventPool.length];
    setCurrentEventResult({
      title: randomEv.title,
      description: randomEv.description,
      outcomeText: "",
      resolved: false,
      choices: randomEv.choices
    });
    setPhase('event');
  };

  /**
   * Generating Caravans shop items
   */
  const generateShopItems = () => {
    // 4 random cards of higher rarity
    const templates = Object.keys(CARD_TEMPLATES);
    const selectedCards: Card[] = [];
    
    while (selectedCards.length < 4) {
      const randomId = templates[Math.floor(Math.random() * templates.length)];
      if (!selectedCards.some(c => c.templateId === randomId)) {
        selectedCards.push(createCard(randomId));
      }
    }
    setShopCards(selectedCards);
    setAlchemyTargetCardId(null);
    setAlchemyMessage(null);
  };

  /**
   * Shop purchase logic
   */
  const handleBuyShopCard = (card: Card) => {
    const cost = card.goldCost || 60;
    if (stats.gold < cost) {
      triggerFloatingText("골드가 모자랍니다!", "damage", "player");
      return;
    }

    const nextStats = { ...stats, gold: stats.gold - cost, score: stats.score + 80 };
    const nextDeck = [...deck, card];
    setStats(nextStats);
    setDeck(nextDeck);
    setShopCards(prev => prev.filter(c => c.id !== card.id));
    triggerFloatingText(`-${cost}G 구매`, "buff", "player");

    setTimeout(() => {
      saveCurrentCampaign(undefined, nextStats, nextDeck);
    }, 100);
  };

  /**
   * Sells or Removes card from deck (A valuable strategy in Roguelikes!)
   */
  const handleRemoveCardInShop = (cardId: string) => {
    const removeCost = 50;
    if (stats.gold < removeCost) {
      triggerFloatingText("골드 부족!", "damage", "player");
      return;
    }

    const nextDeck = deck.filter(c => c.id !== cardId);
    const nextStats = { ...stats, gold: stats.gold - removeCost, score: stats.score + 50 };
    setDeck(nextDeck);
    setStats(nextStats);
    setAlchemyTargetCardId(null);
    setAlchemyMessage("성공: 저주 혹은 하위 카드를 공허 소멸시켰습니다.");
    triggerFloatingText("-50G 영구 제거", "damage", "player");

    setTimeout(() => {
      saveCurrentCampaign(undefined, nextStats, nextDeck);
    }, 100);
  };

  /**
   * Permanent custom card upgrades via Alchemy Rune System (Strategic!)
   */
  const handleApplyRuneToCard = (cardId: string, runeType: 'cataclysm' | 'aegis' | 'ascension' | 'vitality') => {
    const targetCard = deck.find(c => c.id === cardId);
    if (!targetCard) return;

    let cost = 45;
    let descAdd = "";

    if (runeType === 'cataclysm') { cost = 60; descAdd = " [Rune of Cataclysm: 공격력 +5]"; }
    else if (runeType === 'aegis') { cost = 50; descAdd = " [Rune of Aegis: 방어벽 +4]"; }
    else if (runeType === 'ascension') { cost = 75; descAdd = " [Rune of Ascension: 마나 소모 -1]"; }
    else if (runeType === 'vitality') { cost = 55; descAdd = " [Rune of Vitality: 회복력 +4]"; }

    if (stats.gold < cost) {
      triggerFloatingText("개조 자금 부족!", "damage", "player");
      return;
    }

    const modifiedDeck = deck.map(c => {
      if (c.id === cardId) {
        const updated = { ...c };
        updated.name = `${c.name} ★fused`;
        updated.description = `${c.description}${descAdd}`;
        
        if (runeType === 'cataclysm') updated.damage = (c.damage || 0) + 5;
        if (runeType === 'aegis') updated.block = (c.block || 0) + 4;
        if (runeType === 'vitality') updated.heal = (c.heal || 0) + 4;
        if (runeType === 'ascension') updated.cost = Math.max(0, c.cost - 1);
        
        return updated;
      }
      return c;
    });

    const nextStats = { ...stats, gold: stats.gold - cost, score: stats.score + 100 };
    setDeck(modifiedDeck);
    setStats(nextStats);
    setAlchemyMessage(`룬 인챈트 장착 완료! [${targetCard.name}] 카드의 마력이 고정 증대되었습니다.`);
    setAlchemyTargetCardId(null);
    triggerFloatingText(`-${cost}G 룬 개조`, "buff", "player");

    setTimeout(() => {
      saveCurrentCampaign(undefined, nextStats, modifiedDeck);
    }, 100);
  };

  /**
   * Sanctuary Rest Camp choices
   */
  const handleCampfireHeal = () => {
    const healVal = Math.floor(stats.maxHp * 0.4);
    const nextStats = {
      ...stats,
      hp: Math.min(stats.maxHp, stats.hp + healVal)
    };
    setStats(nextStats);
    setHasVisitedCampOrShopNode(true);
    triggerFloatingText(`+${healVal} 체력`, "heal", "player");

    setTimeout(() => {
      saveCurrentCampaign(undefined, nextStats);
    }, 100);
  };

  const handleCampfireFreeForge = (cardId: string) => {
    const updated = deck.map(c => {
      if (c.id === cardId) {
        return createCard(c.templateId, true);
      }
      return c;
    });
    setDeck(updated);
    setHasVisitedCampOrShopNode(true);
    triggerFloatingText("승천 개조 성공!", "buff", "player");

    setTimeout(() => {
      saveCurrentCampaign(undefined, undefined, updated);
    }, 100);
  };

  /**
   * Score submissions & Hall of legends tracking
   */
  const handleSubmitHighScore = () => {
    if (scoreSubmitted) return;

    const finalScore = stats.score + Math.floor(stats.gold / 2);
    const newRecord = {
      player_name: playerName || "무명의 연대검투사",
      score: finalScore,
      stage: currentStage,
      survived: phase === 'victory',
      play_time: elapsedSeconds,
      deck_size: deck.length
    };

    // Client-side local instant feedback update
    const newHofRecord: LeaderboardEntry = {
      id: `player_${Date.now()}`,
      name: playerName || "무명의 연대검투사",
      score: finalScore,
      stageCleared: currentStage,
      deckSize: deck.length,
      date: new Date().toISOString().split('T')[0],
      isPlayer: true
    };

    const updatedHof = [...leaderboard, newHofRecord].sort((a, b) => b.score - a.score);
    setLeaderboard(updatedHof);
    localStorage.setItem('card_rogue_hof_v2', JSON.stringify(updatedHof));

    // Server-side database submission
    fetch('/api/rankings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newRecord)
    })
      .then(res => {
        if (res.ok) {
          console.log("Ranking uploaded successfully to server!");
          fetchRankings(); // Refresh with database records
        } else {
          console.error("Server API returned error for ranking upload");
        }
      })
      .catch(err => {
        console.error("Failed to connect to /api/rankings server endpoint:", err);
      });

    setScoreSubmitted(true);
    setShowLeaderboardTab(true);
    setPhase('menu');
  };

  return (
    <div id="antique_game_controller_viewport" className="w-full flex-1 flex flex-col space-y-6 relative select-none">
      
      {/* EXTREMELY DETAILED TOP STATS BAR / LORE GLASS */}
      <div id="antique_hud_panel" className="vintage-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow corner decorations */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl border-none" />

        {/* Hero details */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#c2965e]/30 to-[#1e1710] border gold-border flex items-center justify-center text-[#d4af37] shadow">
            <User className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-black tracking-wide text-[#d4af37]">{playerName || "영웅 대명"}</span>
              <span className="text-[10px] font-display border border-amber-500/40 text-amber-500 bg-amber-950/40 px-1.5 py-0.2 rounded uppercase">
                {currentStage <= 10 ? 'Citadel Knight' : currentStage <= 20 ? 'Ashen Seeker' : 'Void Champion'}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-serif italic flex items-center gap-1.5 mt-0.5">
              <span>수치 정산: <strong className="text-stone-200">{stats.score} Glory Score</strong></span>
            </p>
          </div>
        </div>

        {/* Global Progress */}
        <div className="flex items-center gap-10">
          
          {/* Chapter / Stage indicator */}
          <div className="text-left">
            <span className="text-[10px] font-display tracking-widest text-[#c2965e]/70 block uppercase">연대기 관문 위치</span>
            <div className="flex items-center gap-2 mt-0.5">
              <Crown className="w-4 h-4 text-amber-400 animate-spin-slow shrink-0" />
              <strong className="font-display text-sm text-[#d4af37] uppercase tracking-wider font-bold">
                심연 {currentStage}층 도달 (Endless)
              </strong>
            </div>
          </div>

          {/* Real-time Game Elapsed Clock */}
          <div className="text-left font-mono">
            <span className="text-[10px] font-display tracking-widest text-[#c2965e]/70 block uppercase">여정 도과 시간</span>
            <div className="flex items-center gap-2 mt-0.5 text-stone-200 text-sm font-semibold">
              <Hourglass className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          </div>

          {/* Current Gold cache */}
          <div className="text-left">
            <span className="text-[10px] font-display tracking-widest text-[#c2965e]/70 block uppercase">금전 잔고</span>
            <div className="flex items-center gap-1.5 mt-0.5 text-amber-400">
              <Coins className="w-4 h-4 shrink-0 fill-amber-500/10" />
              <strong className="font-display font-black text-sm">{stats.gold}</strong>
              <span className="text-[10px] text-stone-400 font-serif">골드</span>
            </div>
          </div>

          {/* HP Gauge */}
          <div className="text-left w-36 sm:w-44">
            <div className="flex justify-between text-[11px] font-serif mb-0.5 text-stone-400">
              <span>생명 수치 (HP)</span>
              <strong className="text-rose-400">{stats.hp} / {stats.maxHp}</strong>
            </div>
            <div className="w-full h-2.5 bg-stone-900 border border-amber-900/40 rounded overflow-hidden relative shadow-inner">
              <div 
                className="bg-gradient-to-r from-red-700 to-rose-600 h-full rounded-sm transition-all duration-300"
                style={{ width: `${Math.max(0, (stats.hp / stats.maxHp) * 100)}%` }}
              />
            </div>
          </div>

          {/* Deck Size review trigger */}
          <div className="text-left">
            <span className="text-[10px] font-display tracking-widest text-[#c2965e]/70 block uppercase">덱 카드 보관함</span>
            <div className="flex items-center gap-1.5 mt-0.5 text-indigo-400">
              <BookOpen className="w-4 h-4 text-amber-500/60" />
              <strong className="font-display font-medium text-sm text-stone-100">{deck.length}장</strong>
            </div>
          </div>

        </div>
      </div>

      {/* CORE FRAME ROUTING PHASE */}

      {/* 1. SEAFARING MAIN MENU WINDOW */}
      {phase === 'menu' && (
        <div id="antique_main_menu" className="w-full flex-1 flex flex-col md:flex-row gap-8 items-stretch pt-2">
          
          {/* Main Title Left Card */}
          <div className="flex-1 vintage-panel-gold p-8 rounded-xl flex flex-col justify-between space-y-6 relative overflow-hidden group">
            {/* Ambient visual overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-500/60 italic text-xs uppercase tracking-widest">
                <span>Eternal Gothic Odyssey</span>
              </div>
              <h1 className="text-4xl font-extrabold font-display tracking-widest text-[#d4af37] leading-tight">
                카드 로그 : 심연의 서가
              </h1>
              <p className="text-stone-300 font-serif text-sm leading-relaxed">
                한계 없는 심연의 층을 자발적으로 돌파하며 무한한 영예 점수와 개인 고유 전술 덱의 조합을 개진해 나아갑니다.
                본인의 이름과 전용 4자리 본인 확인 코드로 덱이 자동 동기화 보존됩니다.
              </p>
            </div>

            {/* Quick Hero Draft Selector */}
            <div className="space-y-4 pt-6 border-t border-amber-900/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="block text-xs uppercase tracking-wider text-[#c2965e] font-display font-medium">도전자 대명 (이름 / ID)</label>
                  <input 
                    type="text" 
                    placeholder="도전자 명칭 기입..." 
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-stone-900 border gold-border px-4 py-2 text-stone-100 rounded text-sm font-serif focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="block text-xs uppercase tracking-wider text-[#c2965e] font-display font-medium">본인 확인 코드 (비밀 4자리)</label>
                  <input 
                    type="text" 
                    maxLength={4}
                    placeholder="숫자/영문 4자" 
                    value={playerCode}
                    onChange={(e) => setPlayerCode(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                    className="w-full bg-stone-900 border gold-border px-4 py-2 text-stone-100 rounded text-sm font-sans focus:outline-none focus:ring-1 focus:ring-amber-500 tracking-widest font-black text-center"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              {hasSavedCampaign && savedCampaignData && (
                <button
                  id="resume_personal_deck_btn"
                  onClick={handleResumeCampaign}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-6 font-display uppercase tracking-widest text-amber-400 bg-amber-950/80 hover:bg-amber-900 border border-amber-500 hover:border-amber-400 font-bold rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span>개인 전술 덱 복원 및 원정 재개 (Resume)</span>
                </button>
              )}

              <button
                id="start_adventure_initial_btn"
                onClick={() => handleStartNewGame(playerName)}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 font-display uppercase tracking-widest text-slate-950 bg-[#d4af37] hover:bg-[#ebd074] font-black rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(194,150,94,0.3)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Sword className="w-5 h-5" />
                <span>심연의 원정 출범 (Embark New Journey)</span>
              </button>
            </div>
          </div>

          {/* HALL OF FAMERS RANKINGS RIGHT PANEL */}
          <div className="flex-1 vintage-panel p-8 rounded-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-wider font-display">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Hall of Legends (전설 랭킹)</span>
              </div>
              <h2 className="text-xl font-bold font-display text-[#d4af37]">역대 전직 불멸자단</h2>
              <p className="text-xs text-stone-400 font-serif leading-relaxed">
                가장 높고 신속한 영예 점수를 도달한 최고 헌정단 징표판입니다. (체류 시간, 덱 크기 및 금전 상태 종합 산출)
              </p>

              {/* Ranking Lists */}
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {leaderboard.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`p-3 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                      item.isPlayer 
                        ? 'bg-amber-950/20 border-amber-500/50' 
                        : 'bg-stone-900/40 border-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank badge custom display */}
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-display text-[11px] font-bold ${
                        index === 0 ? 'bg-[#d4af37] text-slate-950 shadow-[0_0_10px_#d4af37]' :
                        index === 1 ? 'bg-stone-300 text-slate-950' :
                        index === 2 ? 'bg-amber-700 text-stone-100' :
                        'bg-stone-850 text-stone-400'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <strong className="text-stone-200 capitalize">{item.name}</strong>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-400">
                          <span>돌파 관문: Stage {item.stageCleared}</span>
                          <span>•</span>
                          <span>보유 덱: {item.deckSize}장</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <strong className="text-amber-400 font-display block font-semibold">{item.score} GLORY</strong>
                      <span className="text-[9px] text-stone-500 font-mono italic">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center font-serif text-[11px] text-stone-500 pt-3 border-t border-stone-900">
              ※ 명인의 전당은 각 도전 종료 시 보유한 영광 잔액으로 자동 기록 갱신됩니다.
            </div>
          </div>

        </div>
      )}

      {/* 2. THE EXPEDITION BRANCH SELECT MAP */}
      {phase === 'map' && (
        <div id="antique_campaign_map" className="space-y-6 w-full flex-1">
          {/* Chapter header and visual lore glass */}
          <div className="vintage-panel p-6 rounded-xl border-l-4 border-l-[#d4af37] space-y-3 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[10px] font-display text-amber-500/40 uppercase tracking-widest">
              {getChapterOfStage(currentStage).subtitle}
            </div>
            <h2 className="text-2xl font-bold font-display text-[#d4af37] tracking-widest flex items-center gap-2">
              <span>{getChapterOfStage(currentStage).title}</span>
              <span className="text-xs bg-amber-950 text-amber-400 px-2 py-0.5 border border-amber-500/50 rounded font-mono">
                Stage {currentStage}
              </span>
            </h2>
            <p className="text-stone-300 font-serif leading-relaxed text-xs italic">
              " {getChapterOfStage(currentStage).lore} "
            </p>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-sm font-display tracking-widest text-[#c2965e] uppercase">
              -- 여정의 분기가 열렸습니다. 나아갈 탐험지를 신중하게 서명하여 진격하십시오 --
            </h3>
            <p className="text-[11px] text-stone-500 font-serif">
              각 지점은 서로 다른 전술 자원과 위협을 내포합니다. 현재 덱 상태와 HP를 조율해보세요.
            </p>
          </div>

          {/* Node Options layout Cards with custom illustrative banners */}
          <div id="campaign_nodes_list" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mapNodes.map((node) => (
              <button
                id={`map_node_${node.id}`}
                key={node.id}
                onClick={() => handleSelectNode(node)}
                className="vintage-panel-gold hover:border-[#d4af37]/80 hover:shadow-[0_0_35px_rgba(194,150,94,0.22)] text-left p-0 overflow-hidden rounded-xl flex flex-col justify-between group transition-all duration-300 relative cursor-pointer"
              >
                {/* CHOICES ILLUSTRATION BANNER */}
                <div className="relative h-32 w-full border-b border-amber-900/15 overflow-hidden select-none">
                  <img 
                    src={getIllustrationForNode(node.type, node.title, currentStage)} 
                    alt={node.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.7] group-hover:brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14100c] to-transparent" />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-display px-2 py-0.5 border rounded uppercase tracking-wider ${
                        node.type === 'elite' ? 'text-red-400 border-red-500/40 bg-red-950/20' :
                        node.type === 'event' ? 'text-blue-400 border-blue-500/40 bg-blue-950/20' :
                        node.type === 'merchant' ? 'text-amber-400 border-amber-500/50 bg-amber-950/20' :
                        node.type === 'sanctuary' ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20' :
                        'text-stone-400 border-stone-700'
                      }`}>
                        {node.type}
                      </span>
                      <div className="p-1 px-2.5 rounded bg-stone-900 text-stone-400 text-[10px] font-mono border border-stone-800">
                        위험지수: {node.type === 'elite' ? '★★★' : node.type === 'combat' ? '★★☆' : '★☆☆'}
                      </div>
                    </div>

                    <h4 className="text-[#d4af37] font-display font-bold text-base tracking-wide group-hover:translate-x-1 transition-transform">
                      {node.title}
                    </h4>
                    <p className="text-xs text-stone-300 font-serif leading-relaxed line-clamp-3">
                      {node.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-amber-900/20">
                    <p className="text-[11px] text-stone-500 font-serif leading-tight group-hover:text-[#c2965e] transition-colors leading-relaxed">
                      {node.detail}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-display mt-3 font-semibold justify-end">
                      <span>진입 조사하기</span>
                      <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Deck Overview & Retirement bento grids inside campaign map */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 vintage-panel p-6 rounded-xl space-y-4">
              <h4 className="text-xs font-display tracking-widest text-[#c2965e] uppercase font-bold border-b border-amber-900/20 pb-2">
                보안 보관 중인 현재의 전술 카드집 ({deck.length}장)
              </h4>
              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-1 text-xs">
                {deck.map((card) => (
                  <div 
                    key={card.id} 
                    className={`px-3 py-1.5 rounded border ${
                      card.rarity === 'legendary' ? 'border-[#d4af37]/60 text-amber-400 bg-amber-950/10' :
                      card.rarity === 'epic' ? 'border-purple-500/40 text-purple-400 bg-purple-950/10' :
                      card.rarity === 'rare' ? 'border-blue-500/40 text-blue-400 bg-blue-950/10' :
                      'border-stone-850 text-stone-300 bg-stone-900/30'
                    }`}
                  >
                    <strong className="font-mono text-[11px]">{card.name}</strong>
                    <span className="text-[9px] font-mono text-stone-500 ml-1">cost {card.cost}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* End of Career Conclude panel */}
            <div className="vintage-panel-gold p-6 rounded-xl space-y-4 flex flex-col justify-between border-t-2 border-t-amber-500/80">
              <div className="space-y-2 text-left">
                <h4 className="text-xs font-display tracking-widest text-[#d4af37] uppercase font-black">
                  🏆 연대기 강제 은퇴 정산 (Retire Run)
                </h4>
                <p className="text-[11px] text-stone-300 font-serif leading-relaxed">
                  현재 심연 {currentStage}층에서 영광의 퇴진을 선언할 수 있습니다. 
                  고난도 몬스터에 대패하여 영예 점수가 소실하기 전, 원정을 아름답게 마무리하고 공허 랭킹 전당에 전설을 등재하세요.
                </p>
              </div>

              <button
                onClick={handleConcludeAdventure}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-lg border border-amber-400 hover:brightness-110 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.25)] active:translate-y-0.5 hover:-translate-y-0.5 transition-all text-center"
              >
                <Trophy className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>여정 정산 및 전설 각인</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 3. THE IMMERSIVE FIRST-PERSON BATTLEFIELD POV */}
      {phase === 'battle' && enemy && (
        <div id="antique_battle_arena" className="space-y-6 w-full flex-1">
          
          {/* FIRST-PERSON TACTICAL VIEWPORT */}
          <div 
            className={`relative min-h-[460px] md:h-[500px] w-full rounded-2xl border-2 border-amber-900/35 overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300 relative select-none ${
              playerShaking ? 'combat-shake border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)]' : ''
            }`}
            style={{
              backgroundImage: `radial-gradient(circle at center, rgba(16, 12, 8, 0.45) 0%, rgba(5, 4, 3, 0.95) 100%), url(${
                currentStage <= 10 
                  ? "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=1200"
                  : currentStage <= 20
                    ? "https://images.unsplash.com/photo-1548003673-50ec82ccdb5e?auto=format&fit=crop&q=80&w=1200"
                    : "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200"
              })`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Viewport Vignette Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(10,8,6,0.92)_100%)] pointer-events-none" />

            {/* Viewport Top Info Header Bar */}
            <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between pointer-events-none">
              <div>
                <span className="text-[10px] font-display text-[#c2965e] tracking-widest uppercase block">
                  침묵의 성채 - 전장 깊이 {currentStage}층 (Stage {currentStage})
                </span>
                <span className="text-[11px] text-stone-300 font-serif italic">
                  {currentStage <= 10 ? '제 1장: 불경한 축성의 대성당 성소' : currentStage <= 20 ? '제 2장: 검붉은 용융의 철광 기지' : '제 3장: 공허 심층부 왕좌의 주랑'}
                </span>
              </div>

              <div className="px-2.5 py-1 bg-black/60 rounded border border-amber-900/30 text-[10px] font-mono text-[#d4af37]">
                진행 턴수: <strong className="text-stone-100 font-sans">{battleTurn}T</strong>
              </div>
            </div>

            {/* Viewport Center: Colossal Enemy 1st Person POV Rendering */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
              <div 
                className={`relative transition-all duration-300 flex flex-col items-center max-w-[280px] md:max-w-[340px] text-center ${
                  enemyShaking ? 'combat-shake scale-105' : 'hover:scale-[1.03]'
                }`}
              >
                {/* Ominous Glow Behind Monster */}
                <div className={`absolute -inset-4 bg-red-900/10 rounded-full filter blur-xl transition-all duration-300 ${
                  enemyShaking ? 'bg-red-800/40 blur-2xl scale-110' : 'animate-pulse'
                }`} />

                {/* Monster Full Illustration Card Frame */}
                <div className="relative w-40 h-52 md:w-48 md:h-60 rounded-xl overflow-hidden border-2 border-red-900/45 shadow-[0_15px_40px_rgba(0,0,0,0.95)]">
                  <img 
                    src={getEnemyIllustration(enemy.name, currentStage)} 
                    alt={enemy.name}
                    className={`w-full h-full object-cover transition-transform duration-500 rounded-lg ${
                      enemyShaking ? 'brightness-125 scale-110 contrast-125' : 'brightness-90 hover:brightness-100'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {/* Blood vignette overlays when hit */}
                  {enemyShaking && (
                    <div className="absolute inset-0 bg-red-650/20 mix-blend-color-dodge animate-pulse" />
                  )}
                  {/* Dark shadow floor gradient inside picture */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                </div>

                {/* Monster Floating Info overlay inside POV */}
                <div className="relative mt-4 space-y-1 w-64 p-3 bg-stone-950/85 border border-[#c2965e]/30 rounded-xl shadow-2xl">
                  <div className="flex items-center justify-between text-left">
                    <div>
                      <span className="text-[9px] font-display text-rose-500/70 tracking-widest uppercase font-bold block">
                        {enemy.difficulty === 'boss' ? 'CRITICAL LEVEL BOSS' : 'ACT CHAMPION'}
                      </span>
                      <h3 className="font-display font-medium text-stone-100 text-sm md:text-base tracking-wide line-clamp-1">
                        {enemy.name}
                      </h3>
                    </div>
                    {/* Enemy Active Strength/Atk Buff indicator */}
                    <span className="text-[10px] font-mono bg-red-950 text-rose-400 px-1.5 py-0.5 rounded border border-red-900/50">
                      공격력: +{enemy.strength}
                    </span>
                  </div>

                  {/* Enemy HP Progress Meter */}
                  <div className="space-y-1.5 pt-1.5 border-t border-stone-800/60">
                    <div className="flex justify-between text-[10px] font-serif">
                      <span className="text-stone-400">적 침식 생체 에너지</span>
                      <strong className="text-rose-400 font-mono text-[11px] font-semibold">{enemy.hp} / {enemy.maxHp} HP</strong>
                    </div>
                    <div className="w-full h-2.5 bg-stone-900 border border-amber-900/20 rounded-full overflow-hidden relative">
                      <div 
                        className="bg-gradient-to-r from-red-950 via-red-800 to-rose-650 h-full rounded-sm transition-all duration-300"
                        style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
                      />
                      {enemy.block > 0 && (
                        <div 
                          className="absolute top-0 bottom-0 right-0 bg-blue-500/40 border-l border-blue-400 animate-pulse transition-all"
                          style={{ left: `${Math.max(0, 100 - (enemy.block / enemy.maxHp) * 100)}%` }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Status Synergy indicators (Poison, Burn & Active Powers) */}
                  {(enemyPoison > 0 || enemyBurn > 0 || noxiousSporesActive || plagueBearerActive || fireBreathActive || pyroStarterAddMultiplier > 0) && (
                    <div className="py-1 flex flex-wrap gap-1 items-center justify-center text-[9px] border-t border-stone-800/40 mt-1">
                      {enemyPoison > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 animate-pulse font-mono flex items-center gap-0.5">
                          💀 독 {enemyPoison}
                        </span>
                      )}
                      {enemyBurn > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-orange-950 hover:bg-orange-900 text-orange-400 border border-orange-850/60 animate-pulse font-mono flex items-center gap-0.5">
                          🔥 화상 {enemyBurn}
                        </span>
                      )}
                      
                      {/* Active Powers badges */}
                      {noxiousSporesActive && (
                        <span className="px-1 py-px rounded bg-purple-950/80 text-purple-300 border border-purple-900/50 scale-90" title="매 턴 적에게 포자 감염 추가 독 부여">
                          포자공장
                        </span>
                      )}
                      {plagueBearerActive && (
                        <span className="px-1 py-px rounded bg-red-950/80 text-rose-350 border border-red-900/50 scale-90" title="매 턴 가속 치명독 부여">
                          역병군주
                        </span>
                      )}
                      {fireBreathActive && (
                        <span className="px-1 py-px rounded bg-yellow-950/80 text-yellow-300 border border-yellow-900/50 scale-90" title="드로우할 때마다 화상 스택 추가">
                          용멸숨결
                        </span>
                      )}
                      {pyroStarterAddMultiplier > 0 && (
                        <span className="px-1 py-px rounded bg-orange-950/80 text-orange-300 border border-orange-900/50 scale-90">
                          방화각인 +{pyroStarterAddMultiplier}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Active Shields on Enemy */}
                  {enemy.block > 0 && (
                    <div className="flex items-center gap-1.5 justify-center font-bold text-blue-400 bg-blue-950/40 py-0.5 px-2 rounded-lg border border-blue-500/20 text-[10px] animate-pulse">
                      <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>중첩 전술 방벽: {enemy.block} AP</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Viewport Bottom Overlay Bar: Intent System & Player Weapon Sight HUD representation */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent border-t border-amber-900/10 flex flex-col md:flex-row gap-4 md:items-center justify-between">
              
              {/* OMINOUS INTENT SIGNAL (Telegraphed directly from POV) */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-950/80 text-rose-500 border border-red-800/40 animate-pulse shrink-0">
                  {enemy.intent.type === 'attack' ? (
                    <Sword className="w-5 h-5 text-red-400" />
                  ) : enemy.intent.type === 'defend' ? (
                    <Shield className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-display text-rose-400/90 tracking-widest uppercase block font-semibold">
                    적 전술 행동 예령 (Telegraphed Intent)
                  </span>
                  <p className="text-xs text-stone-200 font-serif leading-none line-clamp-1">
                    {enemy.intent.text}
                  </p>
                </div>
              </div>

              {/* Player First-person reticle pointer / view locks decorative */}
              <div className="hidden md:flex items-center gap-3 text-[10px] font-mono text-[#c2965e]/60">
                <div className="flex items-center gap-1 bg-stone-950/70 border border-stone-850 px-2 py-1 rounded">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>FOV LOCK TARGET: READY</span>
                </div>
                <span>AIM_LIFT: SECURE</span>
              </div>
            </div>
          </div>

          {/* REALTIME FLOATING DAMAGE / FEATHERING NUMBERS LAYER */}
          <div className="relative min-h-[40px] overflow-visible w-full flex items-center justify-center pointer-events-none">
            {floatingTexts.map(f => (
              <span 
                key={f.id}
                className={`absolute text-lg font-display font-black tracking-widest px-3 py-1.5 rounded-lg border shadow-2xl select-none ${
                  f.type === 'damage' ? 'damage-pop-red border-red-950 bg-stone-950/90' :
                  f.type === 'shield' ? 'damage-pop-shield border-blue-900/60 bg-stone-950/90' :
                  f.type === 'heal' ? 'damage-pop-blue border-emerald-950 bg-stone-950/90' :
                  'damage-pop-shield border-amber-900/60 bg-stone-950/90'
                }`}
                style={{
                  left: f.target === 'player' ? '25%' : '75%',
                }}
              >
                {f.val}
              </span>
            ))}
          </div>

          {/* COMBATANT TACTICAL TRAY (Player Active Dungeon-Command Center) */}
          <div className="vintage-panel p-5 rounded-xl border-l-4 border-l-amber-600 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Player profile core stats */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <h4 className="font-display font-semibold text-stone-200 text-sm">
                  {playerName} <span className="text-[10px] text-stone-400 font-serif font-normal italic">(Hero POV)</span>
                </h4>
                <span className="text-[10px] font-mono bg-stone-900 text-amber-500 px-2 py-0.5 rounded border border-stone-800">
                  아군 힘 버프: +{stats.strength}
                </span>
              </div>
              
              {/* HP indicator */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-serif">
                  <span className="text-stone-400">아군 수호 생명력</span>
                  <strong className="text-[#d4af37] font-mono">{stats.hp} / {stats.maxHp} HP</strong>
                </div>
                <div className="w-full h-3 bg-stone-900 border border-amber-900/40 rounded-full overflow-hidden relative">
                  <div 
                    className="bg-gradient-to-r from-red-800 via-red-650 to-rose-600 h-full rounded-sm transition-all duration-300"
                    style={{ width: `${Math.max(0, (stats.hp / stats.maxHp) * 100)}%` }}
                  />
                  {stats.block > 0 && (
                    <div 
                      className="absolute top-0 bottom-0 right-0 bg-blue-500/40 border-l-2 border-blue-400 animate-pulse transition-all"
                      style={{ left: `${Math.max(0, 100 - (stats.block / stats.maxHp) * 100)}%` }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Shield and block layout pulse */}
            <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
              {stats.block > 0 ? (
                <div className="inline-flex items-center gap-2 font-bold text-blue-400 bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-500/55 shield-pulse-glow transition-all duration-300">
                  <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-xs">방호벽 전개 중인 실드: +{stats.block} AP</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-stone-500 italic text-[11px] bg-stone-900/30 px-3 py-1.5 rounded border border-stone-850/40">
                  <span>가용 무위 방벽 없음</span>
                </div>
              )}
            </div>

            {/* Strategic Combat statistics help */}
            <div className="flex items-center justify-between md:justify-end gap-6 text-[11px] text-stone-400 border-t md:border-t-0 border-stone-800/40 pt-3 md:pt-0">
              <div className="text-right">
                <span className="text-stone-500 block text-[10px]">지옥의 위협 수준</span>
                <span className="text-amber-500 font-sans tracking-tight">
                  {currentStage >= 21 ? '💀💀💀 상천 심연 지옥' : currentStage >= 11 ? '💀💀 화염 용융 난이도' : '💀 하천 복도 난이도'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-stone-500 block text-[10px]">전투 점수 보너스</span>
                <span className="text-stone-300 font-mono font-semibold">+{(stats.score + (deck.length * 10)) || 0} PTS</span>
              </div>
            </div>

          </div>

          {/* HAND OF CARDS ENGINE DISPLAY */}
          <div className="space-y-4">
            
            {/* Control HUD: Energy indicator & End turn CTA */}
            <div className="flex items-center justify-between py-3.5 border-b border-amber-900/10 text-xs font-serif">
              <div className="flex items-center gap-2.5">
                <span className="text-stone-400 font-display font-bold uppercase tracking-wider">가용 마력 (Energy)</span>
                <div className="flex gap-1 bg-stone-900 px-3 py-1.5 rounded-lg border gold-border">
                  {Array.from({ length: stats.maxEnergy }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                        i < stats.energy 
                          ? 'bg-[#d4af37] shadow-[0_0_10px_#d4af37] scale-105' 
                          : 'bg-stone-800'
                      }`}
                    />
                  ))}
                  <span className="text-stone-300 font-display ml-1 font-semibold">{stats.energy} / {stats.maxEnergy}</span>
                </div>
              </div>

              {/* Draw overview metrics */}
              <div className="flex items-center gap-4 text-xs font-serif text-stone-500">
                <span>드로우 잔고: <strong className="text-stone-300">{drawPile.length}장</strong></span>
                <span>버린 카드 더미: <strong className="text-stone-300">{discardPile.length}장</strong></span>
              </div>

              <button
                id="end_turn_btn"
                onClick={handleEndTurn}
                className="flex items-center gap-2 py-2.5 px-6 bg-gradient-to-r from-[#c2965e] to-stone-900 hover:from-[#d4af37] text-stone-950 font-display font-bold rounded-lg text-xs tracking-wider uppercase border border-[#c2965e]/50 cursor-pointer shadow active:scale-95 transition-all"
              >
                <span>턴 종료 및 적 격세 (End Turn)</span>
                <ChevronRight className="w-4 h-4 text-stone-950" />
              </button>
            </div>

            {/* Hand Cards layout */}
            <div id="battle_hand_cards" className="flex flex-wrap items-center justify-center gap-4 min-h-[160px] pt-2">
              {hand.map((card, index) => {
                const canAfford = stats.energy >= card.cost;
                const isPlaying = activeCardId === card.id;

                const getCardFrame = (rarity: string) => {
                  if (rarity === 'legendary') return 'border-[#d4af37] text-[#d4af37] bg-stone-950 shadow-[0_0_15px_rgba(194,150,94,0.15)]';
                  if (rarity === 'epic') return 'border-purple-600/80 text-purple-400 bg-stone-950/90';
                  if (rarity === 'rare') return 'border-blue-600/80 text-blue-400 bg-stone-950/90';
                  return 'border-stone-800 text-stone-300 bg-stone-950/80';
                };

                return (
                  <button
                    id={`hand_card_${card.id}`}
                    key={card.id}
                    onClick={() => handlePlayCard(card)}
                    disabled={!canAfford}
                    className={`vintage-card flex flex-col justify-between w-36 h-48 p-3 rounded-lg hover:-translate-y-5 transition-all duration-300 text-left border relative select-none disabled:opacity-35 disabled:pointer-events-none cursor-pointer ${getCardFrame(card.rarity)} ${
                      isPlaying ? 'card-played-transition scale-95 bg-amber-500/10' : ''
                    }`}
                    style={{
                      zIndex: 20 + index
                    }}
                  >
                    {/* Header: cost & type */}
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-display uppercase tracking-wider text-stone-500">
                        {card.type}
                      </span>
                      <div className="flex items-center gap-0.5 text-xs font-bold text-amber-400 bg-stone-900 border border-stone-850 px-1 py-0.2 rounded">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>{card.cost}</span>
                      </div>
                    </div>

                    {/* Middle title */}
                    <div className="my-1.5 flex-1 flex flex-col justify-center items-center text-center">
                      <div className="p-0.5 px-2 rounded bg-stone-900/60 text-[9px] text-stone-400 font-mono italic w-full">
                        {card.rarity.toUpperCase()}
                      </div>
                      <h4 className="text-xs font-bold text-stone-100 mt-1.5 tracking-wide font-display w-full truncate" title={card.name}>
                        {card.name}
                      </h4>
                      {card.tags && card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 justify-center mt-1 max-w-full">
                          {card.tags.map(t => (
                            <span key={t} className="text-[7.5px] px-1 py-px font-mono rounded bg-stone-900 border border-stone-800 text-stone-300 uppercase">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer description */}
                    <div className="mt-auto border-t border-stone-900/60 pt-1">
                      <div className="text-[8.5px] font-mono text-[#c2965e]/80 truncate block mb-px">
                        {card.recommendArchetype || "일반"}
                      </div>
                      <p className="text-[9.5px] text-stone-300 font-serif leading-tight line-clamp-3">
                        {card.description}
                      </p>
                    </div>
                  </button>
                );
              })}

              {hand.length === 0 && (
                <div className="py-12 text-center text-xs text-stone-500 font-serif bg-stone-950/30 border border-dashed border-amber-900/10 rounded-xl w-full">
                  현재 들고 있는 연대기 카드가 존재하지 않습니다. 신속히 '턴 종료' 버튼을 가르십시오.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* 4. CHOOSE REWARD DRAFT WIN SCREEN */}
      {phase === 'reward' && (
        <div id="reward_screen" className="bg-[#110e0b] border-2 border-[#c2965e]/30 rounded-xl p-8 max-w-lg mx-auto text-center space-y-6 animate-fadeIn shadow-2xl relative">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />

          <div className="space-y-2">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-full w-fit mx-auto border border-amber-500/20">
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold font-display text-[#d4af37] tracking-widest">여정 보상 수여</h3>
            <p className="text-xs text-stone-400 font-serif">
              전투 종료 공로로 전술 가방에 인입할 하나의 고귀한 전술 카드를 모집하십시오.
            </p>
          </div>

          {/* Draft Options Cards */}
          <div className="grid grid-cols-1 gap-4 pt-2">
            {draftOptions.map((card) => (
              <button
                id={`draft_option_${card.id}`}
                key={card.id}
                onClick={() => handleChooseDraftCard(card)}
                className="vintage-panel hover:border-[#d4af37] p-4 rounded-lg flex items-center justify-between text-left group transition-all duration-300 relative cursor-pointer"
              >
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-display bg-stone-900 text-stone-400 px-1.5 py-0.2 rounded">
                      {card.rarity}
                    </span>
                    <strong className="text-stone-200 text-sm font-display">{card.name}</strong>
                  </div>
                  <p className="text-xs text-stone-400 font-serif">{card.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-amber-400 font-display font-semibold flex items-center gap-1 bg-stone-900/60 p-1.5 px-3 rounded border border-stone-850/60">
                    <Zap className="w-3.5 h-3.5 fill-amber-500/10" />
                    <span>소모 마나: {card.cost}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-900 flex justify-between items-center">
            <span className="text-[11px] text-stone-500 font-serif italic">대안책: 덱의 간결함을 위해 수여 조정을 건너뛸 수 있습니다.</span>
            <button
              onClick={handleSkipDraft}
              className="py-1.5 px-4 bg-stone-900 hover:bg-stone-850 text-stone-300 font-display text-xs rounded border border-stone-800 transition-colors cursor-pointer"
            >
              선택 건너뛰기 (Skip)
            </button>
          </div>
        </div>
      )}

      {/* 5. ROAD SANCTUARY / CAMPFIRE REST HOUSE */}
      {phase === 'campfire' && (
        <div id="road_sanctuary_campfire" className="vintage-panel p-8 rounded-xl max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold font-display text-[#d4af37] tracking-widest">성역의 새벽빛 샘터</h3>
            <p className="text-xs text-stone-400 font-serif">
              신성한 지층수가 흘러 무장 해제를 허용하는 조용한 정화원입니다. 이 안식처에서 영웅의 재정비를 수립하십시오.
            </p>
          </div>

          {!hasVisitedCampOrShopNode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Option 1: Rejuvenate */}
              <button
                onClick={handleCampfireHeal}
                className="vintage-panel-gold hover:border-emerald-500/50 p-6 rounded-lg text-left space-y-4 cursor-pointer transition-all duration-300"
              >
                <div className="p-3 bg-emerald-950 text-emerald-400 rounded-full w-fit border border-emerald-800/30">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-[#d4af37] font-display font-bold text-base">생명수의 아지랑이 침전 (Rejuvenate)</h4>
                <p className="text-xs text-stone-300 font-serif leading-relaxed">
                  치유의 지층 침전을 마셔 무결하게 전체 체력의 <strong className="text-emerald-400">40% 수치 ({Math.floor(stats.maxHp * 0.4)} HP)</strong>를 전설 회복합니다.
                </p>
              </button>

              {/* Option 2: Transcendence */}
              <div
                className="vintage-panel-gold p-6 rounded-lg text-left space-y-4"
              >
                <div className="p-3 bg-amber-950 text-amber-400 rounded-full w-fit border border-amber-800/40">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-[#d4af37] font-display font-bold text-base">무상 귀속 제련식 (Transcend)</h4>
                <p className="text-xs text-stone-300 font-serif leading-relaxed">
                  보관 중인 임의의 일반 등급 하위 전술 카드 중 단 1장만을 수수료 없이 영구 무상 업그레이드합니다.
                </p>

                {/* Card select grid inside camp option 2 */}
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pt-2">
                  {deck.filter(c => !c.upgraded).map(card => (
                    <button
                      key={card.id}
                      onClick={() => handleCampfireFreeForge(card.id)}
                      className="w-full p-2 bg-stone-900 hover:bg-stone-850 hover:border-[#d4af37] border border-stone-800 rounded text-xs flex justify-between items-center text-stone-300 font-serif"
                    >
                      <span>{card.name}</span>
                      <span className="text-[10px] font-display text-[#c2965e]">여제련 장착하기 →</span>
                    </button>
                  ))}
                  {deck.filter(c => !c.upgraded).length === 0 && (
                    <span className="text-[10px] text-stone-500 font-serif block italic">모든 카드가 완전히 업그레이드 상태입니다.</span>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-6 space-y-4 bg-stone-900/30 rounded border border-dashed border-stone-800">
              <p className="text-xs text-stone-300 font-serif">
                성소의 은총 작용 절차가 마무리되었습니다. 새로운 여정 관문으로 나아가십시오.
              </p>
              <button
                onClick={advanceStagePath}
                className="py-2.5 px-6 bg-[#d4af37] hover:bg-[#ebd074] text-slate-950 font-display text-xs rounded font-bold cursor-pointer transition-all"
              >
                여정 속행하기 (Proceed)
              </button>
            </div>
          )}
        </div>
      )}

      {/* 6. SCRIPTIORIUM EVENT PHASER */}
      {phase === 'event' && currentEventResult && (
        <div id="archivist_event_room" className="vintage-panel p-8 rounded-xl max-w-2xl mx-auto space-y-6 animate-fadeIn">
          <div className="text-center space-y-2 border-b border-amber-900/20 pb-4">
            <span className="text-[10px] font-display text-[#c2965e]/60 tracking-widest uppercase">역사의 소용돌이 고딕이벤트</span>
            <h3 className="text-2xl font-bold font-display text-[#d4af37] tracking-wider">{currentEventResult.title}</h3>
          </div>

          <div className="p-5 bg-stone-950/65 rounded-lg border border-stone-900 text-stone-200 text-xs font-serif leading-relaxed italic shadow-inner">
            " {currentEventResult.description} "
          </div>

          {!currentEventResult.resolved ? (
            <div className="space-y-3 pt-2">
              {currentEventResult.choices.map((choice, idx) => (
                <button
                  id={`event_choice_${idx}`}
                  key={idx}
                  onClick={choice.action}
                  className="w-full text-left p-4 rounded bg-stone-900 hover:bg-stone-850 hover:border-[#d4af37] border border-stone-800 text-xs font-serif text-stone-300 transition-all cursor-pointer flex justify-between items-center group"
                >
                  <span className="group-hover:text-stone-100">{choice.text}</span>
                  <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6 pt-4 border-t border-stone-900">
              <p className="text-xs text-stone-300 font-serif leading-relaxed italic text-emerald-400">
                {currentEventResult.outcomeText}
              </p>
              <div className="text-right">
                <button
                  onClick={() => {
                    setCurrentEventResult(null);
                    advanceStagePath();
                  }}
                  className="py-2.5 px-6 bg-[#d4af37] hover:bg-[#ebd074] text-slate-950 font-display text-xs font-bold rounded cursor-pointer transition-all"
                >
                  사태 종결 및 길 마감 →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. MIDNIGHT MERCHANT CARAVAN & RUNE ALCHEMY HOUSE */}
      {phase === 'shop' && (
        <div id="midnight_merchant_caravan" className="space-y-6 w-full flex-1">
          <div className="vintage-panel p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold font-[#d4af37] font-display text-[#d4af37] tracking-widest">룬 융질 및 어둠의 마차 용병상</h3>
              <p className="text-xs text-stone-400 font-serif mt-1">
                골드를 지불하고 최정상 등급의 신비 카드를 등용하거나 보유 하위 카드를 제단에 연금술 제련하십시오.
              </p>
            </div>
            <button
              onClick={advanceStagePath}
              className="py-2.5 px-6 bg-[#d4af37] hover:bg-[#ebd074] text-slate-950 font-display text-xs font-bold rounded-lg transition-all shadow shrink-0 self-start md:self-center cursor-pointer"
            >
              정비 일람 마감 및 퇴장
            </button>
          </div>

          {alchemyMessage && (
            <div className="p-3.5 bg-emerald-950/20 text-emerald-400 border border-emerald-900 rounded-lg text-xs font-serif text-center">
              {alchemyMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Purchase Segment (4 rare cards) */}
            <div className="lg:col-span-2 vintage-panel p-6 rounded-xl space-y-4">
              <h4 className="text-xs font-display tracking-widest text-[#c2965e] uppercase font-bold border-b border-amber-900/20 pb-2">
                용병 상단 계약 진열장 (Available Cards)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shopCards.map(card => {
                  const cost = card.goldCost || 60;
                  const canAfford = stats.gold >= cost;

                  return (
                    <div 
                      key={card.id} 
                      className="p-4 rounded-lg bg-stone-900 border border-stone-850 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[8px] font-display border border-stone-600 text-stone-450 bg-stone-950 px-1 py-0.1 bg-black rounded">
                            {card.rarity}
                          </span>
                          <strong className="text-stone-200 font-display text-xs">{card.name}</strong>
                        </div>
                        <p className="text-[11px] text-stone-400 font-serif mt-1 leading-tight line-clamp-2">{card.description}</p>
                      </div>

                      <button
                        onClick={() => handleBuyShopCard(card)}
                        disabled={!canAfford}
                        className="py-2 px-3 bg-stone-850 hover:bg-[#d4af37] hover:text-slate-950 disabled:opacity-30 disabled:pointer-events-none text-amber-400 text-xs font-display font-medium rounded border border-amber-500/20 shrink-0 select-none cursor-pointer"
                      >
                        {cost}골드
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Alchemy service (Upgrade & Runes & Removal) */}
            <div id="alchemy_service_panel" className="vintage-panel p-6 rounded-xl space-y-6">
              <div>
                <h4 className="text-xs font-display tracking-widest text-[#c2965e] uppercase font-bold border-b border-amber-900/20 pb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                  <span>마법공학 룬 제련식 (Rune Fuses)</span>
                </h4>
                <p className="text-[11px] text-stone-400 font-serif mt-1">
                  소유 카드 중 하나에 강경한 고대 룬을 용질시켜 성능 한계를 고정 증폭합니다.
                </p>
              </div>

              {!alchemyTargetCardId ? (
                <div className="space-y-3">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-serif">융질 대상 전술 카드 선택</label>
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                    {deck.map(card => (
                      <button
                        key={card.id}
                        onClick={() => {
                          setAlchemyTargetCardId(card.id);
                          setAlchemyMessage(null);
                        }}
                        className="w-full text-left p-2 rounded bg-stone-900/65 hover:bg-stone-850 hover:border-[#d4af37] border border-stone-800 text-xs font-serif text-stone-300 flex justify-between cursor-pointer"
                      >
                        <span>{card.name}</span>
                        <span className="text-[10px] text-stone-500 italic">선택 장입</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-900 text-xs font-serif text-stone-400">
                    <span className="text-[#c2965e] font-display font-bold block mb-1">정화의 유골 소멸식</span>
                    덱에서 타오르는 하위 저질 카드 1장을 완전히 탈삭제합니다. (상단 타격/수비 제거 추천, 비용: 50골드)
                    <div className="flex flex-wrap gap-1 mt-2">
                      {deck.map(c => (
                        <button
                          key={c.id}
                          onClick={() => handleRemoveCardInShop(c.id)}
                          className="px-2 py-1 bg-stone-950 text-rose-400 hover:bg-red-950 hover:text-stone-100 border border-stone-800 rounded text-[10px] cursor-pointer"
                        >
                          {c.name.split(' (')[0]} 소멸 (-50G)
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-900 pb-2">
                    <span className="text-xs text-stone-400 font-serif">선택된 대상:</span>
                    <strong className="text-stone-200 text-xs font-display">
                      {deck.find(c => c.id === alchemyTargetCardId)?.name}
                    </strong>
                  </div>

                  {/* 4 Custom Runes */}
                  <div className="space-y-2.5">
                    
                    {/* Rune of Cataclysm */}
                    <button
                      onClick={() => handleApplyRuneToCard(alchemyTargetCardId, 'cataclysm')}
                      className="w-full p-2.5 bg-stone-950 hover:bg-stone-900 hover:border-red-500/50 rounded border border-stone-850 text-left text-xs text-stone-300 cursor-pointer"
                    >
                      <div className="flex justify-between font-display font-bold text-red-400">
                        <span>☄️ 재앙의 공허 룬 (Cataclysm)</span>
                        <span>60골드</span>
                      </div>
                      <p className="text-[10px] text-stone-450 font-serif mt-0.5">공격 데미지를 고밀도 팽창하여 수치를 고정 <strong className="text-red-400">+5</strong> 증가시킵니다.</p>
                    </button>

                    {/* Rune of Aegis */}
                    <button
                      onClick={() => handleApplyRuneToCard(alchemyTargetCardId, 'aegis')}
                      className="w-full p-2.5 bg-stone-950 hover:bg-stone-900 hover:border-blue-500/50 rounded border border-stone-850 text-left text-xs text-stone-300 cursor-pointer"
                    >
                      <div className="flex justify-between font-display font-bold text-blue-400">
                        <span>🛡️ 이지스의 수장 룬 (Aegis Shield)</span>
                        <span>50골드</span>
                      </div>
                      <p className="text-[10px] text-stone-450 font-serif mt-0.5">방어막 배리어 성능을 보강하여 방어도를 고정 <strong className="text-blue-400">+4</strong> 영구 수여합니다.</p>
                    </button>

                    {/* Rune of Ascension */}
                    <button
                      onClick={() => handleApplyRuneToCard(alchemyTargetCardId, 'ascension')}
                      className="w-full p-2.5 bg-stone-950 hover:bg-stone-900 hover:border-amber-500/50 rounded border border-stone-850 text-left text-xs text-stone-300 cursor-pointer"
                    >
                      <div className="flex justify-between font-display font-bold text-amber-400">
                        <span>🚀 영의 승천 룬 (Ascension)</span>
                        <span>75골드</span>
                      </div>
                      <p className="text-[10px] text-stone-450 font-serif mt-0.5">마나 소각 작용을 줄여 가용 소모 에너지를 <strong className="text-[#d4af37]">-1</strong> 감쇠합니다. (최소 0)</p>
                    </button>

                    {/* Rune of Vitality */}
                    <button
                      onClick={() => handleApplyRuneToCard(alchemyTargetCardId, 'vitality')}
                      className="w-full p-2.5 bg-stone-950 hover:bg-stone-900 hover:border-emerald-500/50 rounded border border-stone-850 text-left text-xs text-stone-300 cursor-pointer"
                    >
                      <div className="flex justify-between font-display font-bold text-emerald-400">
                        <span>💖 자양의 재생 룬 (Vitality)</span>
                        <span>55골드</span>
                      </div>
                      <p className="text-[10px] text-stone-450 font-serif mt-0.5">치유적 피막을 형성하여 HP 회복력을 고정 <strong className="text-emerald-400">+4</strong> 추가 보정합니다.</p>
                    </button>

                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => setAlchemyTargetCardId(null)}
                      className="text-[11px] text-stone-500 hover:text-stone-300 font-serif underline cursor-pointer"
                    >
                      장입 취소하고 목록으로 복귀
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* 8. GAME OVER OUTCOME LAYOUT */}
      {phase === 'gameover' && (
        <div id="gameover_screen" className="vintage-panel-gold max-w-lg mx-auto p-8 text-center space-y-6 relative overflow-hidden animate-fadeIn border-t-4 border-t-red-650">
          <div className="absolute top-0 inset-x-0 h-1 bg-red-650" />
          
          <div className="space-y-2">
            <div className="p-3 bg-red-950 text-red-500 rounded-full w-fit mx-auto border border-red-800/40">
              <Skull className="w-10 h-10 animate-pulse" />
            </div>
            <h2 id="gameover_title" className="text-2xl font-bold font-display text-rose-500 tracking-widest">여정의 사절 (Mission Failed)</h2>
            <p id="gameover_subtitle" className="text-xs text-stone-400 font-serif italic">
              심연 원정에 도전한 영웅이 치명적인 가로막이 타격에 무너져 묘비가 세워졌습니다.
            </p>
          </div>

          <div className="p-5 bg-stone-950/70 rounded-lg border gold-border text-left text-xs font-serif space-y-2.5 shadow-inner leading-relaxed">
            <h4 className="text-center font-display font-bold text-[#d4af37] border-b border-stone-900 pb-2 uppercase tracking-widest">
              최종 영위 분석 서고
            </h4>
            <div className="flex justify-between">
              <span>원정 영웅 서명:</span> 
              <strong className="text-stone-200">{playerName}</strong>
            </div>
            <div className="flex justify-between">
              <span>도달 성채 단계:</span> 
              <strong className="text-[#d4af37]">심연 {currentStage}층 도달</strong>
            </div>
            <div className="flex justify-between">
              <span>소지 수거 금색:</span> 
              <strong className="text-yellow-500">{stats.gold}골드</strong>
            </div>
            <div className="flex justify-between">
              <span>잔여 보관 덱 크기:</span> 
              <strong className="text-indigo-400">{deck.length}장</strong>
            </div>
            <div className="flex justify-between">
              <span>클락 누수 시간:</span> 
              <strong className="text-orange-400 font-mono">{formatTime(elapsedSeconds)}</strong>
            </div>
            <div className="flex justify-between">
              <span>무결 공세 승리수:</span> 
              <strong className="text-[#d4af37]">{stats.perfBattles}회</strong>
            </div>
            <div className="flex justify-between border-t border-stone-900 pt-2.5 mt-2 font-display text-sm text-[#d4af37] font-black">
              <span>사후 최종 가치 평가:</span>
              <span>{stats.score + Math.floor(stats.gold / 2)} Glory Point</span>
            </div>
          </div>

          <p className="text-xs text-stone-400 font-serif">
            수거한 업적 명예를 ' Hall of Legends ' 전당 장벽에 기명하고 영구 박제하십시오.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
               id="submit_score_btn"
              onClick={handleSubmitHighScore}
              disabled={scoreSubmitted}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 text-slate-950 bg-[#d4af37] disabled:opacity-40 hover:bg-[#ebd074] font-display font-bold rounded text-xs tracking-wider uppercase shadow cursor-pointer active:scale-95"
            >
              <Trophy className="w-4 h-4 text-slate-950 fill-current" />
              <span>{scoreSubmitted ? "기명 등록됨" : "전설에 기명 등록"}</span>
            </button>

            <button
              id="restart_adventure_btn"
              onClick={() => {
                setPhase('menu');
                setScoreSubmitted(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-stone-950 hover:bg-stone-900 text-stone-300 font-display text-xs border border-stone-850 rounded tracking-wider uppercase cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>시작 전각으로 회군</span>
            </button>
          </div>
        </div>
      )}

      {/* 9. VICTORY SAGA SENSORY SCREEN */}
      {phase === 'victory' && (
        <div id="victory_screen" className="vintage-panel-gold max-w-lg mx-auto p-8 text-center space-y-6 relative overflow-hidden animate-fadeIn border-t-4 border-t-[#d4af37]">
          <div className="absolute -top-10 -left-10 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl" />
          
          <div className="space-y-2">
            <div className="p-4 bg-amber-500/15 text-amber-500 rounded-full w-fit mx-auto border border-amber-500/30">
              <Crown className="w-12 h-12 text-[#d4af37] animate-bounce" />
            </div>
            <h2 id="victory_title" className="text-3xl font-bold font-display text-[#d4af37] tracking-widest">SAGA CLEARED!</h2>
            <p id="victory_subtitle" className="text-xs text-emerald-400 font-serif italic font-bold">
              성채의 위협을 전술적으로 무찌르고 여정을 완치 개선 명인 반열에 복원했습니다!
            </p>
          </div>

          <div className="p-5 bg-stone-950/70 rounded-lg border gold-border text-left text-xs font-serif space-y-2.5 shadow-inner leading-relaxed">
            <h4 className="text-center font-display font-bold text-[#d4af37] border-b border-stone-900 pb-2 uppercase tracking-widest">
              영광스러운 개선 연대기 기록집
            </h4>
            <div className="flex justify-between">
              <span>종결 영웅 서명:</span> 
              <strong className="text-stone-200">{playerName}</strong>
            </div>
            <div className="flex justify-between">
              <span>관문 정벌 상태:</span> 
              <strong className="text-emerald-400">여정 완벽 은퇴 (심연 {currentStage}층 완료)</strong>
            </div>
            <div className="flex justify-between">
              <span>개선 금색 잔량:</span> 
              <strong className="text-yellow-500">{stats.gold}골드</strong>
            </div>
            <div className="flex justify-between">
              <span>보직 전술 카드집:</span> 
              <strong className="text-indigo-400">{deck.length}장</strong>
            </div>
            <div className="flex justify-between">
              <span>전술 토과 시간:</span> 
              <strong className="text-orange-400 font-mono">{formatTime(elapsedSeconds)}</strong>
            </div>
            <div className="flex justify-between">
              <span>무결 공세 극치전:</span> 
              <strong className="text-[#d4af37]">{stats.perfBattles}회</strong>
            </div>
            <div className="flex justify-between border-t border-stone-900 pt-2.5 mt-2 font-display text-sm text-[#d4af37] font-black">
              <span>귀속 종결 명예 가치:</span>
              <span>{stats.score + Math.floor(stats.gold / 2)} Glory Point</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              id="sub_high_score_victory_btn"
              onClick={handleSubmitHighScore}
              disabled={scoreSubmitted}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 text-slate-950 bg-[#d4af37] disabled:opacity-40 hover:bg-[#ebd074] font-display font-bold rounded text-xs tracking-wider uppercase shadow cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-slate-950 fill-current" />
              <span>{scoreSubmitted ? "명예 헌상 완료" : "명예의 전당 등록"}</span>
            </button>

            <button
              id="lobby_btn"
              onClick={() => {
                setPhase('menu');
                setScoreSubmitted(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-stone-950 hover:bg-stone-900 text-stone-300 font-display text-xs border border-stone-850 rounded tracking-wider uppercase cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>로비 사원 입구 회군</span>
            </button>
          </div>
        </div>
      )}

      {/* RENDER MASTER IN-PAGE TAB SPECIFIC LEADBOARD VIEW FOR APP PARENT */}
      {showLeaderboardTab && (
        <div id="antique_integrated_leaderboard" className="vintage-panel p-8 rounded-xl max-w-4xl mx-auto space-y-6 animate-fadeIn">
          <div className="text-center space-y-2 border-b border-amber-900/20 pb-4">
            <span className="text-[10px] font-display text-amber-500/60 tracking-widest uppercase">The Chamber of Chronicled Victors</span>
            <h3 className="text-3xl font-bold font-display text-[#d4af37] tracking-wider flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 text-[#d4af37] fill-amber-500/10" />
              <span>전설 명인 도전자 대명장</span>
            </h3>
            <p className="text-xs text-stone-400 font-serif italic">
              아래 목록은 룬공학 연대기를 무찌르고 심연의 흑요석 관문을 강습한 역사적 수장들의 순위표입니다.
            </p>
          </div>

          {/* Ranking Board Grid columns table with antique headings */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-serif border-collapse">
              <thead>
                <tr className="border-b-2 border-amber-900/30 text-[#c2965e] font-display uppercase tracking-widest text-[11px]">
                  <th className="py-3 px-4">서열 (Rank)</th>
                  <th className="py-3 px-4">용맹 영웅 성명 (Hero)</th>
                  <th className="py-3 px-4 text-center">도달 돌파 구역 (Stage)</th>
                  <th className="py-3 px-4 text-center">인입 덱 규모 (Deck Size)</th>
                  <th className="py-3 px-4 text-center">정벌 서명 연도 (Date)</th>
                  <th className="py-3 px-4 text-right pr-6">최종 헌정 명예 (Score)</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`border-b border-stone-900/60 transition-colors ${
                      item.isPlayer ? 'bg-amber-950/15 text-stone-100 font-bold' : 'text-stone-300 hover:bg-stone-900/20'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-display">
                      <div className="flex items-center gap-2">
                        {index === 0 ? <Crown className="w-4 h-4 text-[#d4af37] animate-pulse" /> : null}
                        <span>{index + 1}위</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.isPlayer ? (
                        <span className="text-amber-400 select-all tracking-wide">{item.name} (아군 도전자)</span>
                      ) : (
                        <span className="text-stone-300 capitalize">{item.name}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[#d4af37]">{item.stageCleared} / 30</td>
                    <td className="py-3.5 px-4 text-center text-indigo-400">{item.deckSize}장</td>
                    <td className="py-3.5 px-4 text-center text-stone-500 font-mono text-[10px]">{item.date}</td>
                    <td className="py-3.5 px-4 text-right pr-6 font-display font-black text-amber-500 text-sm">
                      {item.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-900">
            <button
              onClick={() => setShowLeaderboardTab(false)}
              className="py-2.5 px-6 bg-stone-900 hover:bg-stone-850 text-stone-300 rounded border border-stone-800 font-display text-xs cursor-pointer"
            >
              로비 대성문 퇴장하기
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
