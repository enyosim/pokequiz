import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Trophy, Timer, Check, X, HelpCircle, ArrowLeft, Map, Star, Book, BarChart2, Moon, Sun, Heart, Diamond, Skull, ArrowRight, Share2, Copy, Lightbulb, Volume2, Shield, Zap, Cloud, Flame, Hexagon, Grid, Circle, Square, Layout } from 'lucide-react';

// --- SONIDOS ---
const SFX = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  tick: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3'
};

// --- ESTILOS CSS ---
const customStyles = `
  @keyframes popIn {
    0% { transform: scale(0.8) translateY(20px); opacity: 0; }
    60% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  .animate-pop-in {
    animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  
  @keyframes floatUpFade {
    0% { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-50px) scale(1.2); }
  }
  .animate-float-up-fade {
    animation: floatUpFade 0.8s ease-out forwards;
  }
`;

// --- COLORES DE TIPOS (CLASES TAILWIND) ---
const TYPE_CLASSES = {
  normal: 'bg-stone-400 border-stone-500', 
  fire: 'bg-orange-500 border-orange-600', 
  water: 'bg-blue-500 border-blue-600', 
  grass: 'bg-green-500 border-green-600',
  electric: 'bg-yellow-400 border-yellow-500', 
  ice: 'bg-cyan-300 border-cyan-400', 
  fighting: 'bg-red-700 border-red-800', 
  poison: 'bg-purple-500 border-purple-600',
  ground: 'bg-amber-600 border-amber-700', 
  flying: 'bg-indigo-400 border-indigo-500', 
  psychic: 'bg-pink-500 border-pink-600', 
  bug: 'bg-lime-500 border-lime-600',
  rock: 'bg-yellow-700 border-yellow-800', 
  ghost: 'bg-violet-700 border-violet-800', 
  dragon: 'bg-indigo-600 border-indigo-700', 
  steel: 'bg-slate-400 border-slate-500',
  dark: 'bg-slate-700 border-slate-800', 
  fairy: 'bg-pink-400 border-pink-500'
};

// --- COLORES DE TIPOS (HEX para Modo Tipo) ---
const TYPE_HEX = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', steel: '#B7B7CE',
  dark: '#705746', fairy: '#D685AD'
};

// --- TRADUCCIONES DE TIPOS ---
const TYPE_NAMES = {
  normal: { es: 'Normal', en: 'Normal', pt: 'Normal' },
  fire: { es: 'Fuego', en: 'Fire', pt: 'Fogo' },
  water: { es: 'Agua', en: 'Water', pt: 'Água' },
  grass: { es: 'Planta', en: 'Grass', pt: 'Grama' },
  electric: { es: 'Eléctrico', en: 'Electric', pt: 'Elétrico' },
  ice: { es: 'Hielo', en: 'Ice', pt: 'Gelo' },
  fighting: { es: 'Lucha', en: 'Fighting', pt: 'Lutador' },
  poison: { es: 'Veneno', en: 'Poison', pt: 'Venenoso' },
  ground: { es: 'Tierra', en: 'Ground', pt: 'Terrestre' },
  flying: { es: 'Volador', en: 'Flying', pt: 'Voador' },
  psychic: { es: 'Psíquico', en: 'Psychic', pt: 'Psíquico' },
  bug: { es: 'Bicho', en: 'Bug', pt: 'Inseto' },
  rock: { es: 'Roca', en: 'Rock', pt: 'Pedra' },
  ghost: { es: 'Fantasma', en: 'Ghost', pt: 'Fantasma' },
  dragon: { es: 'Dragón', en: 'Dragon', pt: 'Dragão' },
  steel: { es: 'Acero', en: 'Steel', pt: 'Aço' },
  dark: { es: 'Siniestro', en: 'Dark', pt: 'Sombrio' },
  fairy: { es: 'Hada', en: 'Fairy', pt: 'Fada' }
};

// --- IDIOMAS ---
const I18N = {
  es: {
    title: '¿Quién es ese Pokémon?',
    subtitle: 'Modo Arcade',
    play: 'JUGAR AHORA',
    modeSelect: 'Modo de Juego',
    difficulty: 'Adivinar Pokémon',
    special: 'Desafío de Tipos',
    region: 'Por Región',
    score: 'PUNTOS',
    bonus: 'BONUS',
    multiplier: 'MULTIPLICADOR',
    streak: 'RACHA',
    hits: 'ACIERTOS',
    time: 'Tiempo',
    correct: '¡Correcto!',
    wrong: '¡Incorrecto!',
    next: 'Siguiente',
    exit: 'Salir',
    viewData: 'Ver Pokédex',
    loading: 'Buscando...',
    height: 'Altura',
    weight: 'Peso',
    type: 'Tipo',
    abilities: 'Habilidades',
    gameOver: '¡JUEGO TERMINADO!',
    finalScore: 'Resultado Final',
    tryAgain: 'Reintentar',
    menu: 'Menú Principal',
    share: 'Compartir',
    copied: '¡Copiado!',
    hint: 'Pista',
    listen: 'Escuchar',
    best: 'Mejor',
    mode: 'Modo',
    modes: { easy: 'Fácil', medium: 'Intermedio', expert: 'Difícil', typeQuiz: 'Maestro de Tipos' },
    modeDesc: { 
        easy: 'Generaciones\n1 y 2', 
        medium: 'Generaciones\n1 a 5', 
        expert: 'Todas las\nGeneraciones',
        typeQuiz: 'Identifica el\ntipo correcto'
    }
  },
  en: {
    title: "Who's That Pokémon?",
    subtitle: 'Arcade Mode',
    play: 'PLAY NOW',
    modeSelect: 'Game Mode',
    difficulty: 'Guess Pokémon',
    special: 'Type Challenge',
    region: 'By Region',
    score: 'SCORE',
    bonus: 'BONUS',
    multiplier: 'MULTIPLIER',
    streak: 'STREAK',
    hits: 'HITS',
    time: 'Time',
    correct: 'Correct!',
    wrong: 'Wrong!',
    next: 'Next Level',
    exit: 'Exit',
    viewData: 'View Pokédex',
    loading: 'Searching...',
    height: 'Height',
    weight: 'Weight',
    type: 'Type',
    abilities: 'Abilities',
    gameOver: 'GAME OVER!',
    finalScore: 'Final Score',
    tryAgain: 'Try Again',
    menu: 'Main Menu',
    share: 'Share',
    copied: 'Copied!',
    hint: 'Hint',
    listen: 'Listen',
    best: 'Best',
    mode: 'Mode',
    modes: { easy: 'Easy', medium: 'Medium', expert: 'Hard', typeQuiz: 'Type Master' },
    modeDesc: { easy: 'Generations\n1 & 2', medium: 'Generations\n1 to 5', expert: 'All\nGenerations', typeQuiz: 'Identify the\ncorrect type' }
  },
  pt: {
    title: 'Quem é esse Pokémon?',
    subtitle: 'Modo Arcade',
    play: 'JOGAR AGORA',
    modeSelect: 'Modo de Jogo',
    difficulty: 'Adivinhar Pokémon',
    special: 'Desafio de Tipos',
    region: 'Por Região',
    score: 'PONTOS',
    bonus: 'BÔNUS',
    multiplier: 'MULTIPLICADOR',
    streak: 'SEQUÊNCIA',
    hits: 'ACERTOS',
    time: 'Tempo',
    correct: 'Correto!',
    wrong: 'Ah não! Era',
    next: 'Próximo',
    exit: 'Sair',
    viewData: 'Ver Pokédex',
    loading: 'Procurando...',
    height: 'Altura',
    weight: 'Peso',
    type: 'Tipo',
    abilities: 'Habilidades',
    gameOver: 'FIM DE JOGO!',
    finalScore: 'Pontuação Final',
    tryAgain: 'Tentar Novamente',
    menu: 'Menu Principal',
    share: 'Compartilhar',
    copied: 'Copiado!',
    hint: 'Dica',
    listen: 'Ouvir',
    best: 'Melhor',
    mode: 'Modo',
    modes: { easy: 'Fácil', medium: 'Médio', expert: 'Difícil', typeQuiz: 'Mestre dos Tipos' },
    modeDesc: { easy: 'Gerações\n1 e 2', medium: 'Gerações\n1 a 5', expert: 'Todas as\nGerações', typeQuiz: 'Identifique o\ntipo correto' }
  }
};

// --- CONFIGURACIÓN ---
const API_URL = 'https://pokeapi.co/api/v2';
const MAX_LIVES = 3; 
const START_LIVES = 3;

const MODES = {
  GUESS_WHO: [
    { id: 'easy', stars: 1, range: [1, 251] },
    { id: 'medium', stars: 2, range: [1, 649] },
    { id: 'expert', stars: 3, range: [1, 1010] },
  ],
  SPECIAL: [
    { id: 'typeQuiz', icon: Grid, range: [1, 1010], color: 'text-indigo-600' }
  ],
  REGIONS: [
    { id: 'kanto', name: 'Kanto', range: [1, 151], textColor: 'text-red-600' },
    { id: 'johto', name: 'Johto', range: [152, 251], textColor: 'text-yellow-600' },
    { id: 'hoenn', name: 'Hoenn', range: [252, 386], textColor: 'text-green-600' },
    { id: 'sinnoh', name: 'Sinnoh', range: [387, 493], textColor: 'text-blue-500' },
    { id: 'unova', name: 'Unova', range: [494, 649], textColor: 'text-slate-800 dark:text-slate-200' },
    { id: 'kalos', name: 'Kalos', range: [650, 721], textColor: 'text-pink-500' },
    { id: 'alola', name: 'Alola', range: [722, 809], textColor: 'text-orange-500' },
    { id: 'galar', name: 'Galar', range: [810, 905], textColor: 'text-rose-600' },
    { id: 'paldea', name: 'Paldea', range: [906, 1010], textColor: 'text-purple-600' },
  ]
};

// Helper para obtener región por ID
const getRegionName = (id) => {
    if (id <= 151) return "Kanto";
    if (id <= 251) return "Johto";
    if (id <= 386) return "Hoenn";
    if (id <= 493) return "Sinnoh";
    if (id <= 649) return "Unova";
    if (id <= 721) return "Kalos";
    if (id <= 809) return "Alola";
    if (id <= 905) return "Galar";
    return "Paldea";
};

// --- UTILS ---
const audioCache = {};
const playAudio = (url, volume = 0.5) => {
  try {
    let audio = audioCache[url];
    if (!audio) { audio = new Audio(url); audioCache[url] = audio; }
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (e) {}
};
    // --- COMPONENTES ---

const AnimButton = ({ onClick, children, className = "", disabled = false, style, ...props }) => (
  <button 
    onClick={(e) => { playAudio(SFX.click, 0.3); if (onClick) onClick(e); }} 
    disabled={disabled} 
    style={style}
    className={`transform transition-all duration-150 active:scale-95 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const JuicyButton = ({ onClick, children, className, variant = 'primary', icon: Icon, disabled = false }) => {
  const baseStyle = "relative overflow-hidden font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 py-3 w-full transition-all";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30 hover:shadow-green-500/50",
    secondary: "bg-slate-700 text-white shadow-slate-900/30 hover:bg-slate-600",
    outline: "bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600",
    outlineDark: "bg-slate-800 text-slate-300 border-2 border-slate-700 hover:border-slate-500 hover:text-white",
    pokedex: "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800"
  };
  return (
    <AnimButton onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={20} strokeWidth={2.5} />}
      <span className="relative z-10">{children}</span>
    </AnimButton>
  );
};

const TypeBadge = ({ type, lang }) => {
  const typeName = TYPE_NAMES[type] ? TYPE_NAMES[type][lang] : type;
  const colorClass = TYPE_CLASSES[type] || 'bg-gray-400 border-gray-500';

  return (
    <span className={`${colorClass} text-white px-3 py-1 rounded-full text-xs font-bold uppercase border shadow-sm`}>
      {typeName}
    </span>
  );
};

const LivesDisplay = ({ lives, maxLives }) => (
  <div className="flex gap-1.5 p-2 bg-black/5 dark:bg-white/5 rounded-full backdrop-blur-sm transition-colors">
    {[...Array(maxLives)].map((_, i) => (
      <div key={i} className="relative">
        <Heart size={26} className={`transition-all duration-500 ${i < lives ? 'fill-pink-500 text-pink-500 drop-shadow-md scale-100' : 'fill-slate-300 dark:fill-slate-600 text-slate-300 dark:text-slate-600 opacity-50 scale-75'}`} />
      </div>
    ))}
  </div>
);

const StatBlock = ({ label, value, colorClass, isDark }) => (
    <div className="flex flex-col items-center w-full">
        <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60 ${isDark ? 'text-white' : 'text-slate-800'}`}>{label}</span>
        <div className="h-10 flex items-center justify-center relative w-full">
             <span className={`text-4xl font-black leading-none tracking-tighter ${colorClass}`}>{value}</span>
        </div>
    </div>
);

const MultiplierDisplay = ({ streak, isDark, label }) => {
  let mult = 1;
  let colorClass = "text-blue-400"; 

  if (streak >= 30) { mult = 5; colorClass = "text-red-500"; }
  else if (streak >= 20) { mult = 4; colorClass = "text-purple-500"; }
  else if (streak >= 10) { mult = 3; colorClass = "text-yellow-500"; }
  else if (streak >= 5) { mult = 2; colorClass = "text-green-500"; }

  return (
    <div className="flex flex-col items-center w-full">
        <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60 ${isDark ? 'text-white' : 'text-slate-800'}`}>{label}</span>
        <div className="h-10 flex items-center justify-center relative w-full">
            <span className={`text-4xl font-black leading-none tracking-tighter ${colorClass}`}>x{mult}</span>
        </div>
    </div>
  );
};

// LOADING SCREEN
const LoadingScreen = ({ isDark, text }) => {
    const loadingMons = [25, 1, 4, 7, 133, 52, 54, 175, 39, 6];
    const randomMon = loadingMons[Math.floor(Math.random() * loadingMons.length)];
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomMon}.png`;

    return (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="animate-bounce-soft">
                 <img src={imgUrl} alt="Loading..." className={`w-24 h-24 pixelated opacity-80 ${isDark ? 'brightness-125' : ''}`} />
            </div>
            <p className={`mt-4 text-sm font-bold tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'} animate-pulse`}>{text}</p>
        </div>
    );
}

const PokemonDetails = ({ pokemon, onClose, isDark, texts, lang }) => {
  if (!pokemon) return null;
  const mainType = pokemon.types[0] || 'normal';
  const gradients = {
      normal: 'from-stone-400 to-stone-600', fire: 'from-orange-500 to-red-600', water: 'from-blue-500 to-cyan-600',
      grass: 'from-green-500 to-emerald-700', electric: 'from-yellow-400 to-amber-500', ice: 'from-cyan-300 to-blue-400',
      fighting: 'from-red-700 to-red-900', poison: 'from-purple-500 to-fuchsia-700', ground: 'from-amber-600 to-yellow-800',
      flying: 'from-indigo-300 to-indigo-500', psychic: 'from-pink-500 to-rose-600', bug: 'from-lime-500 to-green-700',
      rock: 'from-yellow-700 to-stone-700', ghost: 'from-purple-800 to-indigo-900', dragon: 'from-indigo-600 to-violet-800',
      steel: 'from-slate-400 to-slate-600', dark: 'from-slate-700 to-black', fairy: 'from-pink-300 to-rose-400'
  };
  const headerGradient = gradients[mainType] || 'from-gray-500 to-gray-700';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className={`animate-pop-in rounded-[2rem] shadow-2xl max-w-sm w-full overflow-hidden relative ${isDark ? 'bg-slate-900 text-slate-100 ring-1 ring-slate-700' : 'bg-white text-slate-800'}`}>
        <div className={`bg-gradient-to-br ${headerGradient} h-24 relative flex items-center justify-center overflow-hidden`}>
             <AnimButton onClick={onClose} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 p-2 rounded-full text-white z-10">
                <X size={20} />
            </AnimButton>
        </div>
        <div className="px-6 pb-8 relative">
            <div className={`w-36 h-36 mx-auto -mt-20 rounded-full p-2 shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} relative z-20`}>
                <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'} overflow-hidden`}>
                    <img src={pokemon.image} alt={pokemon.name} className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                </div>
            </div>
            <div className="mt-4 text-center">
                {pokemon.cry && (
                    <div className="flex justify-center mb-3">
                        <AnimButton onClick={() => playAudio(pokemon.cry, 0.8)} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
                            <Volume2 size={16} /> {texts.listen}
                        </AnimButton>
                    </div>
                )}
                <h2 className="text-3xl font-black capitalize tracking-tight mb-2 flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-slate-400 text-2xl font-bold">#{String(pokemon.id).padStart(3, '0')}</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
                        {pokemon.name}
                    </span>
                </h2>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {/* FIX: Badges con colores */}
                    {pokemon.types.map(t => <TypeBadge key={t} type={t} lang={lang} />)}
                </div>
                <div className={`grid grid-cols-2 gap-3 mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-transparent'} `}>
                        <p className="text-[10px] uppercase font-bold opacity-70 mb-1">{texts.height}</p>
                        <p className="font-bold text-xl">{pokemon.height / 10} m</p>
                    </div>
                    <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-transparent'}`}>
                        <p className="text-[10px] uppercase font-bold opacity-70 mb-1">{texts.weight}</p>
                        <p className="font-bold text-xl">{pokemon.weight / 10} kg</p>
                    </div>
                </div>
                {pokemon.flavorText && (
                    <div className={`p-5 rounded-2xl text-sm italic mb-4 leading-relaxed shadow-inner text-left ${isDark ? 'bg-indigo-900/20 border border-indigo-500/30 text-indigo-200' : 'bg-blue-50 border border-blue-100 text-blue-800'}`}>
                        "{pokemon.flavorText}"
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
      // --- APP PRINCIPAL ---

export default function App() {
  const [lang, setLang] = useState('es');
  const [isDark, setIsDark] = useState(false);
  const [gameState, setGameState] = useState('menu');
  const [gameMode, setGameMode] = useState(null); 
  const [showDetails, setShowDetails] = useState(false);
  
  const [solvedHistory, setSolvedHistory] = useState(new Set());
  const [missedQueue, setMissedQueue] = useState([]);
  const [lastMissedId, setLastMissedId] = useState(null);
  const [nextRoundData, setNextRoundData] = useState(null);
  
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES); 
  const [maxLives, setMaxLives] = useState(MAX_LIVES);
  
  const [highScore, setHighScore] = useState(0);
  const [healAnim, setHealAnim] = useState(false);
  const [damageAnim, setDamageAnim] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [penaltyAnim, setPenaltyAnim] = useState(false);
  const [pointsAnim, setPointsAnim] = useState({ show: false, amount: 0 });
  const [isTimeout, setIsTimeout] = useState(false);
  
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [options, setOptions] = useState([]); 
  const [correctOption, setCorrectOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const timerRef = useRef(null);
  const tickAudioRef = useRef(null);
  const t = I18N[lang];

  const getRandomId = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const getMultiplier = (currentStreak) => {
      if (currentStreak >= 30) return 5;
      if (currentStreak >= 20) return 4;
      if (currentStreak >= 10) return 3;
      if (currentStreak >= 5) return 2;
      return 1;
  };
  
  const getMultiplierColor = (mult) => {
      switch(mult) {
          case 5: return "text-red-500";
          case 4: return "text-purple-500";
          case 3: return "text-yellow-500";
          case 2: return "text-green-500";
          default: return "text-blue-400";
      }
  };

  const fetchRoundData = useCallback(async (range, history, isTypeMode) => {
    if (!range) return null;
    const [min, max] = range;
    let id, attempts = 0;
    do { id = getRandomId(min, max); attempts++; } while (history.has(id) && attempts < 100);

    try {
        const [correctSpecies, correctPokemon] = await Promise.all([
            fetch(`${API_URL}/pokemon-species/${id}`).then(r => r.json()),
            fetch(`${API_URL}/pokemon/${id}`).then(r => r.json())
        ]);

        const getTransName = (s) => {
            if (!s || !s.names) return capitalize(s.name);
            const n = s.names.find(n => n.language.name === lang);
            return n ? n.name : capitalize(s.name);
        };

        const flavorEntry = correctSpecies.flavor_text_entries.find(f => f.language.name === lang) || correctSpecies.flavor_text_entries.find(f => f.language.name === 'en');

        const pokemon = {
            id: correctPokemon.id,
            name: getTransName(correctSpecies),
            image: correctPokemon.sprites.other['official-artwork'].front_default || correctPokemon.sprites.front_default,
            types: correctPokemon.types.map(t => t.type.name),
            height: correctPokemon.height,
            weight: correctPokemon.weight,
            region: getRegionName(correctPokemon.id),
            flavorText: flavorEntry ? flavorEntry.flavor_text.replace(/[\f\n\r]/g, ' ') : '',
            cry: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${correctPokemon.id}.ogg`
        };

        let roundOptions = [];
        let correctVal = "";

        if (isTypeMode) {
             const allTypes = Object.keys(TYPE_HEX);
             const correctTypes = pokemon.types.sort();
             correctVal = correctTypes.join('-');
             const generated = new Set([correctVal]);

             while (generated.size < 4) {
                 const count = Math.random() > 0.7 ? 2 : 1;
                 const randomTypes = [];
                 while(randomTypes.length < count) {
                     const type = allTypes[Math.floor(Math.random() * allTypes.length)];
                     if (!randomTypes.includes(type)) randomTypes.push(type);
                 }
                 const signature = randomTypes.sort().join('-');
                 if (!generated.has(signature)) generated.add(signature);
             }
             
             roundOptions = Array.from(generated).map(sig => ({
                 label: sig, 
                 value: sig, 
                 types: sig.split('-')
             })).sort(() => Math.random() - 0.5);

        } else {
             // MODO CLASICO
             correctVal = pokemon.name;
             const distractors = new Set();
             while (distractors.size < 3) {
                 const distId = getRandomId(min, max);
                 if (distId !== id) distractors.add(distId);
             }
             const distData = await Promise.all([...distractors].map(dId => fetch(`${API_URL}/pokemon-species/${dId}`).then(r => r.json())));
             const distNames = distData.map(d => getTransName(d));
             roundOptions = [pokemon.name, ...distNames].map(n => ({ label: n, value: n })).sort(() => Math.random() - 0.5);
        }

        const img = new Image();
        img.src = pokemon.image;

        return { pokemon, options: roundOptions, correctValue: correctVal };
    } catch (e) { return null; }
  }, [lang]);

  const startGame = (mode) => {
      setGameMode(mode);
      const isTypeMode = mode.id === 'typeQuiz';
      
      setScore(0);
      setStreak(0);
      setLives(START_LIVES); 
      setSolvedHistory(new Set());
      setNextRoundData(null);
      setCurrentPokemon(null);
      
      if (timerRef.current) clearTimeout(timerRef.current);
      setTimeLeft(isTypeMode ? 15 : 10);

      setGameState('loading');
      
      const tryStart = () => {
          fetchRoundData(mode.range, new Set(), isTypeMode).then(data => {
              if (data) {
                  setCurrentPokemon(data.pokemon);
                  setOptions(data.options);
                  setCorrectOption(data.correctValue);
                  setGameState('playing');
              } else {
                  setTimeout(tryStart, 1000);
              }
          });
      };
      tryStart();
  };

  const loadNewRound = async () => {
      if (!gameMode) return;
      const isTypeMode = gameMode.id === 'typeQuiz';
      
      if (timerRef.current) clearTimeout(timerRef.current);
      setTimeLeft(isTypeMode ? 15 : 10);
      
      setGameState('loading');
      setImageLoaded(false);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowDetails(false);
      setHintUsed(false);
      setDamageAnim(false);
      setPenaltyAnim(false);
      setPointsAnim({ show: false, amount: 0 });
      setIsTimeout(false);

      let data;
      if (nextRoundData) {
          data = nextRoundData;
          setNextRoundData(null);
      } else {
          data = await fetchRoundData(gameMode.range, solvedHistory, isTypeMode);
      }

      if (data) {
          setCurrentPokemon(data.pokemon);
          setOptions(data.options);
          setCorrectOption(data.correctValue);
          setGameState('playing');
      } else {
           setTimeout(loadNewRound, 1000);
      }
  };

  useEffect(() => {
      tickAudioRef.current = new Audio(SFX.tick);
      tickAudioRef.current.volume = 0.4;
  }, []);

  useEffect(() => {
      if (currentPokemon && gameMode && !nextRoundData && lives > 0) {
          const nextHistory = new Set(solvedHistory);
          nextHistory.add(currentPokemon.id);
          const isTypeMode = gameMode.id === 'typeQuiz';
          
          const timer = setTimeout(() => {
              fetchRoundData(gameMode.range, nextHistory, isTypeMode).then(data => {
                  if (data) setNextRoundData(data);
              });
          }, 1500);
          return () => clearTimeout(timer);
      }
  }, [currentPokemon, gameMode, nextRoundData, lives, solvedHistory, fetchRoundData]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      if (tickAudioRef.current) {
          tickAudioRef.current.currentTime = 0;
          tickAudioRef.current.play().catch(() => {});
      }
      timerRef.current = setTimeout(() => {
          setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleGuess(null);
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameState]);

  const handleHint = () => {
      const isTypeMode = gameMode.id === 'typeQuiz';
      
      if (!isTypeMode && score >= 100 && !hintUsed) {
          setScore(s => s - 100);
          setHintUsed(true);
          setPenaltyAnim(true);
          setTimeout(() => setPenaltyAnim(false), 1000);
      }
      else if (isTypeMode && !hintUsed && lives === MAX_LIVES) {
          setHintUsed(true);
          const wrongOptions = options.filter(o => {
              return o.value !== correctOption; 
          });
          const toRemove = wrongOptions.slice(0, 2).map(o => o.value);
          setOptions(prev => prev.map(o => toRemove.includes(o.value) ? { ...o, hidden: true } : o));
      }
  };

  const handleGuess = (optionValue) => {
    clearTimeout(timerRef.current);
    
    if (optionValue === null) {
        setSelectedOption(null);
        setIsCorrect(false);
        setStreak(0);
        setLives(l => l - 1);
        setDamageAnim(true);
        setGameState('revealed');
        return;
    }

    setSelectedOption(optionValue); 
    const isWin = optionValue === correctOption;

    setIsCorrect(isWin);
    
    if (isWin) {
        setSolvedHistory(prev => new Set(prev).add(currentPokemon.id));
        
        if (gameMode.id === 'typeQuiz') {
             setStreak(s => {
                 const newStreak = s + 1;
                 if (newStreak % 3 === 0 && lives < MAX_LIVES) { 
                     setLives(l => l + 1);
                     setHealAnim(true);
                     setTimeout(() => setHealAnim(false), 1500);
                 }
                 return newStreak;
             });
        } else {
            const bonus = timeLeft * 10;
            const mult = getMultiplier(streak + 1);
            const pts = Math.round((100 + bonus) * mult);
            setScore(s => s + pts);
            setPointsAnim({ show: true, amount: pts });
            setTimeout(() => setPointsAnim({ show: false, amount: 0 }), 1000);
            
            setStreak(s => {
                 const newStreak = s + 1;
                 if (newStreak % 3 === 0 && lives < MAX_LIVES) { 
                     setLives(l => l + 1);
                     setHealAnim(true);
                     setTimeout(() => setHealAnim(false), 1500);
                 }
                 return newStreak;
            });
        }
    } else {
        setStreak(0);
        setLives(l => l - 1);
        setDamageAnim(true);
    }
    setGameState('revealed');
  };

  const handleNext = () => {
      if (lives <= 0) {
          if (score > highScore) setHighScore(score);
          setGameState('gameOver');
          playAudio(SFX.click);
      } else {
          loadNewRound();
      }
  };

  const handleShare = async () => {
      const msg = `${t.title} - ${gameMode.id === 'typeQuiz' ? streak + ' ' + t.hits : score + ' PTS'}`;
      try { await navigator.clipboard.writeText(msg); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000); } catch (err) {}
  };

  const bgClass = isDark ? 'bg-slate-950' : 'bg-slate-100';
  const cardClass = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-white';
  const textClass = isDark ? 'text-slate-100' : 'text-slate-800';
  const isTypeMode = gameMode?.id === 'typeQuiz';
  const isGameOverPending = lives <= 0 && gameState === 'revealed';

  return (
    <div className={`h-[100dvh] w-screen ${bgClass} font-sans transition-colors duration-500 overflow-hidden relative select-none flex flex-col`}>
      <style>{customStyles}</style>
      {healAnim && <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in zoom-in"><Heart size={200} className="text-pink-500 fill-pink-500 drop-shadow-2xl" /></div>}

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 p-4 z-50 flex items-center justify-between h-20 max-w-2xl mx-auto w-full">
          <div className="w-12">
             {/* FIX: Botón Atrás SOLO visible si NO estamos en el menú */}
             {gameState !== 'menu' && (
                 <AnimButton disabled={isGameOverPending} onClick={() => setGameState(gameState === 'playing' || gameState === 'revealed' ? 'gameOver' : 'menu')} className={`p-3 rounded-full shadow-lg ${isGameOverPending ? 'scale-0' : ''} ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-500'}`}><ArrowLeft size={24} /></AnimButton>
             )}
          </div>
          <div className="flex-1 flex justify-center">{(gameState === 'playing' || gameState === 'revealed') && <LivesDisplay lives={lives} maxLives={MAX_LIVES} damaged={damageAnim} />}</div>
          <div className="w-12 flex justify-end"><AnimButton onClick={() => setIsDark(!isDark)} className={`p-3 rounded-full shadow-lg ${isDark ? 'bg-slate-800 text-yellow-400' : 'bg-white text-slate-600'}`}>{isDark ? <Sun size={20} /> : <Moon size={20} />}</AnimButton></div>
      </header>

      {showDetails && <PokemonDetails pokemon={currentPokemon} onClose={() => setShowDetails(false)} isDark={isDark} lang={lang} texts={t} />}

      <main className="flex-1 w-full max-w-lg mx-auto flex flex-col pt-20 pb-4 px-4 h-full relative z-10">
          
          {/* --- MENU --- */}
          {gameState === 'menu' && (
            <div className="flex-1 flex flex-col items-center justify-center relative">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" alt="logo" className="w-32 h-32 mb-6 animate-bounce-slow drop-shadow-2xl mx-auto"/>
                <div>
                    <h1 className={`text-4xl font-black tracking-tighter mb-8 ${textClass} text-center`}>{t.title}</h1>
                    <p className={`text-lg font-medium opacity-60 ${textClass} text-center`}>{t.subtitle}</p>
                </div>
                <div className="flex justify-center gap-4 my-6">
                    {[{ code: 'es', flag: '🇪🇸' }, { code: 'en', flag: '🇺🇸' }, { code: 'pt', flag: '🇧🇷' }].map(l => (
                        <AnimButton key={l.code} onClick={() => setLang(l.code)} className={`p-3 rounded-2xl transition-all w-20 border-2 shadow-sm ${lang === l.code ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110' : `bg-white/50 backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700' : 'border-slate-200 hover:bg-white'} opacity-70 hover:opacity-100`}`}>
                            <span className="text-3xl filter drop-shadow-sm">{l.flag}</span>
                        </AnimButton>
                    ))}
                </div>
                <JuicyButton onClick={() => setGameState('modeSelect')} variant="primary" icon={Play} className="w-full text-xl">{t.play}</JuicyButton>
            </div>
          )}

          {/* MODE SELECT */}
          {gameState === 'modeSelect' && (
            <div className="w-full flex-1 flex flex-col animate-in slide-in-from-right-4 p-2 overflow-y-auto no-scrollbar">
                <h2 className={`text-2xl font-bold ${textClass} text-center mb-6`}>{t.modeSelect}</h2>
                
                <div className="space-y-8 pb-8">
                    {/* CLASICO */}
                    <div>
                        <div className={`flex items-center gap-2 mb-3 font-bold uppercase text-xs tracking-wider opacity-60 ${isDark ? 'text-white' : 'text-slate-800'}`}><BarChart2 size={14} /> {t.difficulty}</div>
                        <div className="grid grid-cols-3 gap-3">
                            {MODES.GUESS_WHO.map(mode => (
                                <AnimButton key={mode.id} onClick={() => startGame(mode)} className={`aspect-square bg-white hover:border-blue-200 rounded-2xl shadow-md flex flex-col items-center justify-center p-3 text-center border-2 border-transparent ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                                    <div className="flex mb-1 scale-75">{[...Array(mode.stars)].map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-current" />)}</div>
                                    <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.modes[mode.id]}</span>
                                    <span className="text-[10px] font-bold text-slate-400 mt-1 leading-tight whitespace-pre-line">{t.modeDesc[mode.id]}</span>
                                </AnimButton>
                            ))}
                        </div>
                    </div>
                    {/* NUEVO: MODO ESPECIAL */}
                    <div>
                        <div className={`flex items-center gap-2 mb-3 font-bold uppercase text-xs tracking-wider opacity-60 ${isDark ? 'text-white' : 'text-slate-800'}`}><Star size={14} /> {t.special}</div>
                        <div className="grid grid-cols-3 gap-3">
                             {MODES.SPECIAL.map(mode => (
                                <AnimButton key={mode.id} onClick={() => startGame(mode)} className={`aspect-square bg-white hover:border-blue-200 rounded-2xl shadow-md flex flex-col items-center justify-center p-2 text-center border-2 border-transparent ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                                    {/* Use safe icons from map above if possible, or default */}
                                    <mode.icon size={24} className={`mb-1 ${mode.color}`} />
                                    <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.modes[mode.id]}</span>
                                    <span className="text-[10px] text-slate-400 whitespace-pre-line mt-1">{t.modeDesc[mode.id]}</span>
                                </AnimButton>
                            ))}
                        </div>
                    </div>
                    {/* REGIONES */}
                    <div>
                        <div className={`flex items-center gap-2 mb-3 font-bold uppercase text-xs tracking-wider opacity-60 ${isDark ? 'text-white' : 'text-slate-800'}`}><Map size={14} /> {t.region}</div>
                        <div className="grid grid-cols-3 gap-3">
                            {MODES.REGIONS.map(mode => (
                                <AnimButton key={mode.id} onClick={() => startGame(mode)} className={`aspect-square bg-white hover:border-blue-200 rounded-2xl shadow-md flex flex-col items-center justify-center p-2 text-center border-2 border-transparent ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                                    {/* FIX: Color UNOVA manual para que se vea */}
                                    <span className={`text-lg font-black uppercase ${mode.id === 'unova' && isDark ? 'text-white' : mode.textColor}`}>{mode.name}</span>
                                </AnimButton>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          )}

          {/* GAMEPLAY */}
      {(gameState === 'playing' || gameState === 'revealed') && (
             <div className="flex-1 flex flex-col justify-between gap-4 h-full">
                 
                 {/* HUD */}
                 <div className="grid grid-cols-3 items-end px-2 shrink-0 relative z-20">
                    {isTypeMode ? (
                        <div className="col-span-3 flex justify-center">
                            <StatBlock label={t.hits} value={streak} colorClass="text-indigo-500" isDark={isDark} />
                        </div>
                    ) : (
                        <>
                            <StatBlock label={t.score} value={score} colorClass={isDark ? 'text-white' : 'text-slate-800'} isDark={isDark} />
                            
                            {/* CENTER: BONUS */}
                            <div className="flex flex-col items-center w-full">
                                <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.bonus}</span>
                                <div className="h-10 flex items-center justify-center relative w-full">
                                    {gameState === 'playing' && !pointsAnim.show && !penaltyAnim && <span className={`text-4xl font-black tracking-tighter text-cyan-400 animate-pulse ${isDark ? 'text-cyan-300' : ''}`}>+{timeLeft * 10}</span>}
                                    {pointsAnim.show && <span className="text-4xl font-black tracking-tighter text-green-500 animate-float-up-fade absolute">+{pointsAnim.amount}</span>}
                                    {penaltyAnim && <span className="text-4xl font-black tracking-tighter text-red-500 animate-float-up-fade absolute">-100</span>}
                                </div>
                            </div>

                            <StatBlock label={t.multiplier.split(' ')[0]} value={`x${getMultiplier(streak + 1)}`} colorClass={getMultiplierColor(getMultiplier(streak + 1))} isDark={isDark} />
                        </>
                    )}
                 </div>

                 {/* CARD */}
                 <div className={`flex-1 rounded-[2.5rem] shadow-xl border-4 relative flex flex-col transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'} min-h-0 mb-2 overflow-hidden`}>
                     <div className={`relative flex-1 min-h-0 flex flex-col items-center justify-center p-4 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
                         
                         {/* TIMER - FIX: COLOR TEXT FOR DARK MODE */}
                         {gameState === 'playing' && (
                             <div className={`absolute top-4 right-4 flex items-center gap-1 font-mono text-xl font-bold z-20 opacity-50 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                 {timeLeft}<Timer size={16}/>
                             </div>
                         )}

                         {/* HINT BUTTON */}
                         {gameState === 'playing' && !hintUsed && (
                            (!isTypeMode && score >= 100) || (isTypeMode && lives === MAX_LIVES)
                         ) && (
                             <div className="absolute top-4 left-4 z-20">
                                 <AnimButton onClick={handleHint} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full shadow-lg font-bold text-xs flex items-center gap-1" title={t.hint}>
                                     <Lightbulb size={14} /> {t.hint}
                                 </AnimButton>
                             </div>
                         )}

                         {/* IMAGE AREA */}
                         {currentPokemon && (
                             <div className="relative flex flex-col items-center justify-center h-full w-full z-10">
                                 <img 
                                     key={currentPokemon.id}
                                     src={currentPokemon.image} 
                                     alt="Who?" 
                                     onLoad={() => { setImageLoaded(true); if (gameState === 'loading') setGameState('playing'); }} 
                                     className={`w-40 h-40 object-contain drop-shadow-2xl transition-all duration-500 ${isTypeMode || gameState === 'revealed' ? 'filter-none scale-110' : `brightness-0 opacity-80 ${isDark ? 'invert' : ''}`} ${!imageLoaded ? 'opacity-0' : ''}`}
                                 />
                                 {/* INFO EXTRA EN MODO TIPO */}
                                 {isTypeMode && (
                                     <div className="mt-4 text-center animate-in fade-in slide-in-from-bottom-4">
                                         <p className="text-xs font-bold text-slate-400">#{String(currentPokemon.id).padStart(3,'0')} — {currentPokemon.region}</p>
                                         <h2 className={`text-2xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{currentPokemon.name}</h2>
                                     </div>
                                 )}
                             </div>
                         )}

                         {/* HINT DISPLAY FOR CLASSIC MODE (FIXED) */}
                         {!isTypeMode && hintUsed && currentPokemon && (
                            <div className="absolute bottom-4 z-20 flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                                {currentPokemon.types.map(t => <TypeBadge key={t} type={t} lang={lang} />)}
                            </div>
                         )}
                     </div>

                     {/* PROGRESS BAR - VISIBLE ALWAYS */}
                     <div className={`w-full h-2 shrink-0 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div 
                            className={`h-full rounded-r-full ${timeLeft === (isTypeMode ? 15 : 10) ? 'transition-none' : 'transition-all duration-1000 ease-linear'} ${timeLeft <= 3 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500'}`} 
                            style={{ width: gameState === 'playing' ? `${(timeLeft / (isTypeMode ? 15 : 10)) * 100}%` : '0%' }}
                        ></div>
                     </div>

                     {/* OPTIONS GRID */}
                     <div className={`p-4 relative shrink-0 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                         <div className="grid grid-cols-2 gap-3 h-40">
                             {options.map((option, idx) => {
                                 if (option.hidden) return <div key={idx}></div>; 

                                 const isRevealed = gameState === 'revealed';
                                 let btnStyle = "";
                                 let content = null;

                                 if (isTypeMode) {
                                     // BOTONES DE COLORES (TIPO)
                                     const typesArray = option.types; 
                                     
                                     const type1 = TYPE_HEX[typesArray[0]];
                                     const type2 = typesArray[1] ? TYPE_HEX[typesArray[1]] : type1;
                                     const background = typesArray.length > 1 
                                        ? `linear-gradient(135deg, ${type1} 50%, ${type2} 50%)` 
                                        : type1;
                                     
                                     const typeLabel = typesArray.map(t => TYPE_NAMES[t][lang]).join(' / ');

                                     // FIX: Bordes blancos por defecto en modo Tipo - SIN OPACIDAD
                                     btnStyle = `h-full rounded-xl border-4 transition-transform active:scale-95 shadow-sm flex items-center justify-center ${isRevealed ? '' : 'hover:scale-105'}`;
                                     
                                     if (isRevealed) {
                                         if (option.value === correctOption) btnStyle = `h-full rounded-xl border-4 border-green-500 ring-4 ring-green-200 z-10 scale-105 flex items-center justify-center filter-none`;
                                         else if (option.value === selectedOption) btnStyle += " border-red-500 filter-none"; 
                                         else btnStyle += " border-white/50"; 
                                     } else {
                                         btnStyle += " border-white"; // Borde blanco por defecto
                                     }

                                     content = (
                                         <div className={btnStyle} style={{ background }}>
                                             {/* Texto blanco con sombra para contraste en cualquier fondo */}
                                             <span className="text-white font-black uppercase drop-shadow-md text-sm text-center px-2">{typeLabel}</span>
                                         </div>
                                     );
                                 } else {
                                     // BOTONES DE TEXTO (Clásico)
                                     btnStyle = isDark ? "bg-slate-800 text-slate-200 border-slate-700" : "bg-white text-slate-600 border-slate-200";
                                     let icon = null;
                                     if (isRevealed) {
                                        if (option.value === correctOption) { btnStyle = "bg-green-500 text-white border-green-600"; icon = <Check size={16}/>; }
                                        else if (option.value === selectedOption) { btnStyle = "bg-red-500 text-white border-red-600"; icon = <X size={16}/>; }
                                        else btnStyle = isDark ? "bg-slate-800 text-white border-slate-700 opacity-100" : "bg-white text-slate-600 border-slate-200 opacity-100"; // Sin opacidad baja
                                     }
                                     
                                     // FIX: FORCED WHITE TEXT IN DARK MODE FOR OPTIONS
                                     const textColor = isDark ? 'text-white font-black' : 'text-slate-600';

                                     content = (
                                        <div className={`h-full px-2 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2 ${btnStyle} ${textColor}`}>
                                            {icon}<span className="truncate">{option.label}</span>
                                        </div>
                                     );
                                 }

                                 return (
                                     <AnimButton key={idx} disabled={isRevealed} onClick={() => handleGuess(option.value)} className="w-full h-full">
                                         {content}
                                     </AnimButton>
                                 );
                             })}
                         </div>
                     </div>
                 </div>

                 {/* FOOTER ACTIONS */}
                 <div className="h-20 shrink-0 w-full flex items-center justify-center">
                    {gameState === 'revealed' && (
                         <div className="w-full flex gap-3 animate-in slide-in-from-bottom-2 fade-in">
                            <JuicyButton onClick={() => setShowDetails(true)} variant="pokedex" icon={Book}>{t.viewData}</JuicyButton>
                            <JuicyButton onClick={() => {
                                if (lives <= 0) { setGameState('gameOver'); playAudio(SFX.click); }
                                else { loadNewRound(); }
                            }} variant="secondary" icon={ArrowRight}>{lives > 0 ? t.next : t.exit}</JuicyButton>
                         </div>
                    )}
                 </div>
             </div>
          )}
          
          {/* GAME OVER SCREEN */}
          {gameState === 'gameOver' && (
              <div className="flex-1 flex flex-col items-center justify-start animate-in zoom-in pt-4 w-full">
                  <div className="text-center mb-4"><h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-orange-600">{t.gameOver}</h1></div>
                  <div className={`flex-grow w-full p-8 rounded-[2.5rem] text-center mb-6 flex flex-col justify-center shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                      <p className="text-xs font-bold uppercase opacity-50 mb-2">{isTypeMode ? t.hits : t.finalScore}</p>
                      <p className={`text-7xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{isTypeMode ? streak : score}</p>
                  </div>
                  <div className="w-full flex flex-col gap-3 pb-4">
                      <div className="flex gap-3"><JuicyButton onClick={() => startGame(gameMode)} variant="primary" icon={Play}>{t.tryAgain}</JuicyButton><JuicyButton onClick={handleShare} variant="success" icon={Share2}>{t.share}</JuicyButton></div>
                      <JuicyButton onClick={() => setGameState('menu')} variant="outline">{t.menu}</JuicyButton>
                  </div>
              </div>
          )}
      </main>
    </div>
  );
}
