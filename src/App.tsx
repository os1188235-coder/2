/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Play, 
  Trophy, 
  Sword, 
  Crown,
  Scroll,
  User,
  ShieldAlert,
  FlameKindling
} from 'lucide-react';
import GameScreen from './components/GameScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'hall_of_fame'>('game');

  return (
    <div 
      id="application_root" 
      className="min-h-screen parchment-bg text-stone-200 flex flex-col font-serif selection:bg-amber-600/30 selection:text-amber-100 antialiased"
    >
      {/* EXQUISITE MEDIEVAL MASTERHEADER */}
      <header 
        id="antique_mast_header" 
        className="vintage-panel border-b-2 gold-border sticky top-0 z-40 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo Name & Antique Seal */}
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 rounded-lg border-2 border-amber-500/80 shadow-[0_0_15px_rgba(194,150,94,0.3)] shrink-0">
              <Sword className="w-6 h-6 text-amber-400 rotate-45" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-650 ring-2 ring-amber-500/50" />
            </div>
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-xl sm:text-2xl font-black font-display tracking-widest text-[#d4af37] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  카드 로그 (Card Rogue)
                </span>
                <span className="text-[10px] uppercase font-display bg-amber-950/80 text-amber-400 border border-amber-600/55 px-2 py-0.5 rounded tracking-widest">
                  고대연대기 에디션
                </span>
              </div>
              <p className="text-xs text-stone-400 font-serif italic mt-0.5">
                The Gothic-Noir Roguelike Deckbuilding Campaign
              </p>
            </div>
          </div>

          {/* Luxury Gothic Tab Controls */}
          <nav id="antique_tabs_navigation" className="flex items-center gap-3">
            <button
              id="header_tab_game"
              onClick={() => setActiveTab('game')}
              className={`relative flex items-center gap-3 px-5 py-2.5 rounded border transition-all duration-300 font-display text-sm tracking-wider uppercase ${
                activeTab === 'game'
                  ? 'bg-gradient-to-b from-stone-850 to-stone-900 text-[#d4af37] border-[#d4af37] shadow-[0_0_20px_rgba(194,150,94,0.25)] font-semibold'
                  : 'text-stone-400 bg-stone-900/30 border-transparent hover:text-stone-200 hover:border-amber-900/40'
              }`}
            >
              <FlameKindling className={`w-4 h-4 shrink-0 transition-colors ${activeTab === 'game' ? 'text-amber-500' : 'text-[#c2965e]/60'}`} />
              <span>끝없는 성채 (Play Game)</span>
              {activeTab === 'game' && <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#d4af37]" />}
            </button>

            <button
              id="header_tab_hof"
              onClick={() => setActiveTab('hall_of_fame')}
              className={`relative flex items-center gap-3 px-5 py-2.5 rounded border transition-all duration-300 font-display text-sm tracking-wider uppercase ${
                activeTab === 'hall_of_fame'
                  ? 'bg-gradient-to-b from-stone-850 to-stone-900 text-[#d4af37] border-[#d4af37] shadow-[0_0_20px_rgba(194,150,94,0.25)] font-semibold'
                  : 'text-stone-400 bg-stone-900/30 border-transparent hover:text-stone-200 hover:border-amber-900/40'
              }`}
            >
              <Trophy className={`w-4 h-4 shrink-0 transition-colors ${activeTab === 'hall_of_fame' ? 'text-amber-500' : 'text-[#c2965e]/60'}`} />
              <span>전설 명예의 전당 (Hall of Fame)</span>
              {activeTab === 'hall_of_fame' && <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#d4af37]" />}
            </button>
          </nav>

        </div>
      </header>

      {/* CORE DISPLAY WORKSPACE */}
      <main id="antique_workspace" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <div id="antique_game_viewport" className="w-full h-full flex-1">
          <GameScreen activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </main>

      {/* ANCHOR METICS INFO */}
      <footer 
        id="antique_footer" 
        className="vintage-panel border-t-2 gold-border py-4 text-xs text-stone-500 text-center font-serif mt-12"
      >
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500/60" />
            <span>© 2026 카드 로그: 심연의 연대기. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-amber-500/50">
            <span>The Eternal Sanctuary Status: ONLINE</span>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-600 shadow-[0_0_8px_#c2965e] animate-pulse" />
            <span>• Vintage Gothic Edition v2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
