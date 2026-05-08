import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Plus, Share2, Copy, Check, ChevronRight, ArrowLeft, Sparkles,
  BarChart3, ListChecks, X, BookOpen, Hash, Minus, Trophy,
  RefreshCw, Flag, Trash2, Star, MessageCircle
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis,
  YAxis, LabelList
} from 'recharts';

import {
  TEAMS, TEAM_PLAYERS, STICKERS_PER_TEAM, FWC_STICKERS, SPECIAL_SECTIONS,
  CONF_LABELS, CONF_ORDER, GROUP_ORDER, TOTAL_STICKERS,
  generateCode, stickerKey, getStickerInfo, getStickerStatus,
  teamProgress, sectionProgress, totalProgress,
} from './data.js';

import {
  loadAlbum, saveAlbum, subscribeAlbum, applyUpdates,
  loadMyAlbums, saveMyAlbums,
} from './firebase.js';

// ============================ APP ============================

export default function App() {
  const [view, setView] = useState({ name: 'home' });
  const [myAlbums, setMyAlbums] = useState([]);
  const [albumData, setAlbumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      const list = await loadMyAlbums();
      setMyAlbums(list);
      setLoading(false);
    })();
  }, []);

  // Inscrição em tempo real (Firestore onSnapshot)
  const activeCode = view.name !== 'home' ? view.code : null;
  useEffect(() => {
    if (!activeCode) return;
    const unsubscribe = subscribeAlbum(
      activeCode,
      (data) => setAlbumData(data),
      (err) => showToast('Erro ao sincronizar')
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCode]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const createAlbum = useCallback(async (name) => {
    const code = generateCode();
    const album = {
      code, name: name.trim() || 'Álbum Copa 2026',
      stickers: {}, createdAt: Date.now(), updatedAt: Date.now(),
    };
    const ok = await saveAlbum(code, album);
    if (!ok) { showToast('Erro ao criar álbum'); return; }
    const newList = [{ code, name: album.name, joinedAt: Date.now() }, ...myAlbums];
    await saveMyAlbums(newList);
    setMyAlbums(newList);
    setAlbumData(album);
    setView({ name: 'overview', code });
    showToast('Álbum criado! Compartilhe o código.');
  }, [myAlbums, showToast]);

  const joinAlbum = useCallback(async (rawCode) => {
    const code = rawCode.trim().toUpperCase();
    if (code.length < 4) { showToast('Código inválido'); return false; }
    const data = await loadAlbum(code);
    if (!data) { showToast('Álbum não encontrado'); return false; }
    if (!myAlbums.find(a => a.code === code)) {
      const newList = [{ code, name: data.name, joinedAt: Date.now() }, ...myAlbums];
      await saveMyAlbums(newList);
      setMyAlbums(newList);
    }
    setAlbumData(data);
    setView({ name: 'overview', code });
    showToast('Conectado ao álbum!');
    return true;
  }, [myAlbums, showToast]);

  const removeFromMyList = useCallback(async (code) => {
    const newList = myAlbums.filter(a => a.code !== code);
    await saveMyAlbums(newList);
    setMyAlbums(newList);
    showToast('Removido da sua lista');
  }, [myAlbums, showToast]);

  const updateStickers = useCallback(async (updates) => {
    if (!view.code) return;
    setSyncing(true);
    // Atualização otimista — UI responde imediatamente
    setAlbumData(prev => {
      if (!prev) return prev;
      const next = { ...prev, stickers: { ...prev.stickers } };
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null) delete next.stickers[k];
        else next.stickers[k] = v;
      });
      return next;
    });
    await applyUpdates(view.code, updates);
    setSyncing(false);
    // O onSnapshot vai trazer o estado canônico em seguida
  }, [view.code]);

  const refreshAlbum = useCallback(async () => {
    if (!view.code) return;
    setSyncing(true);
    const data = await loadAlbum(view.code);
    if (data) setAlbumData(data);
    setSyncing(false);
  }, [view.code]);

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
        .anim-slideup { animation: slideUp 0.3s ease-out; }
        .anim-pop { animation: pop 0.25s ease-out; }
        .display-font { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
        .paper-bg {
          background-color: #f5efe1;
          background-image:
            radial-gradient(at 30% 20%, rgba(212, 164, 55, 0.08) 0px, transparent 50%),
            radial-gradient(at 80% 70%, rgba(13, 53, 32, 0.04) 0px, transparent 50%);
        }
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <div className="paper-bg min-h-screen">
        <div className="grain absolute inset-0 pointer-events-none opacity-60" />
        <div className="relative max-w-md mx-auto pb-24">
          {loading ? <LoadingScreen />
            : view.name === 'home' ? (
              <HomeScreen myAlbums={myAlbums} onCreate={createAlbum} onJoin={joinAlbum}
                onOpen={(code) => { setAlbumData(null); setView({ name: 'overview', code }); }}
                onRemove={removeFromMyList} />
            )
            : !albumData ? <LoadingScreen msg="Carregando álbum..." />
            : view.name === 'overview' ? (
              <OverviewScreen album={albumData} syncing={syncing}
                onBack={() => setView({ name: 'home' })}
                onNavigate={(v) => setView(v)} onRefresh={refreshAlbum} showToast={showToast} />
            )
            : view.name === 'teams' ? (
              <TeamsListScreen album={albumData}
                onBack={() => setView({ name: 'overview', code: view.code })}
                onSelect={(teamCode) => setView({ name: 'team', code: view.code, teamCode })} />
            )
            : view.name === 'team' ? (
              <TeamDetailScreen album={albumData} teamCode={view.teamCode}
                onBack={() => setView({ name: 'teams', code: view.code })}
                onUpdate={updateStickers} />
            )
            : view.name === 'section' ? (
              <SectionDetailScreen album={albumData} secId={view.secId}
                onBack={() => setView({ name: 'overview', code: view.code })}
                onUpdate={updateStickers} />
            )
            : view.name === 'missing' ? (
              <MissingScreen album={albumData} initialTab={view.tab || 'missing'}
                onBack={() => setView({ name: 'overview', code: view.code })}
                showToast={showToast} />
            ) : null}
        </div>

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 anim-slideup">
            <div className="px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg"
                 style={{ background: '#0d3520' }}>{toast}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================ TELAS ============================

function LoadingScreen({ msg = 'Carregando...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-6xl anim-pop">⚽</div>
      <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#0d3520' }}>{msg}</p>
    </div>
  );
}

function HomeScreen({ myAlbums, onCreate, onJoin, onOpen, onRemove }) {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newName, setNewName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  return (
    <div className="px-5 pt-6">
      <div className="rounded-3xl overflow-hidden mb-6 relative shadow-xl"
           style={{ background: 'linear-gradient(135deg, #0d3520 0%, #1a5634 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 30px, rgba(255,255,255,0.1) 30px, rgba(255,255,255,0.1) 60px)'
        }} />
        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#d4a437' }} />
            <span className="text-xs uppercase tracking-widest font-bold" style={{ color: '#d4a437' }}>
              FIFA World Cup 2026
            </span>
          </div>
          <h1 className="display-font text-5xl text-white leading-none mb-1">ÁLBUM<br/>DA COPA</h1>
          <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Colecione, compartilhe, complete.
          </p>
          <div className="flex flex-wrap gap-3 mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <span className="flex items-center gap-1"><Trophy size={12} style={{color:'#d4a437'}}/> 48 seleções</span>
            <span className="flex items-center gap-1"><Sparkles size={12} style={{color:'#d4a437'}}/> {TOTAL_STICKERS} figurinhas</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={() => { setShowCreate(true); setShowJoin(false); }}
                className="rounded-2xl p-4 text-left transition-transform active:scale-95 shadow-md"
                style={{ background: '#0d3520', color: 'white' }}>
          <Plus size={22} style={{ color: '#d4a437' }} />
          <div className="display-font text-2xl mt-2 leading-none">CRIAR</div>
          <div className="text-xs mt-1 opacity-75">Novo álbum</div>
        </button>
        <button onClick={() => { setShowJoin(true); setShowCreate(false); }}
                className="rounded-2xl p-4 text-left transition-transform active:scale-95 shadow-md border-2"
                style={{ background: 'white', borderColor: '#0d3520', color: '#0d3520' }}>
          <Hash size={22} style={{ color: '#d4a437' }} />
          <div className="display-font text-2xl mt-2 leading-none">ENTRAR</div>
          <div className="text-xs mt-1 opacity-75">Com código</div>
        </button>
      </div>

      {showCreate && (
        <div className="anim-slideup mb-6 rounded-2xl p-4 shadow-md" style={{ background: 'white', border: '1px solid #e8dfc8' }}>
          <label className="text-xs uppercase tracking-widest font-bold block mb-2" style={{ color: '#0d3520' }}>
            Nome do álbum
          </label>
          <input value={newName} onChange={e => setNewName(e.target.value)}
                 placeholder="Ex: Álbum dos Amigos"
                 className="w-full px-4 py-3 rounded-xl text-base outline-none"
                 style={{ background: '#f5efe1', color: '#0d3520', border: '1px solid #e8dfc8' }} />
          <div className="flex gap-2 mt-3">
            <button onClick={() => { onCreate(newName); setShowCreate(false); setNewName(''); }}
                    className="flex-1 py-3 rounded-xl font-bold text-white" style={{ background: '#0d3520' }}>
              Criar álbum
            </button>
            <button onClick={() => { setShowCreate(false); setNewName(''); }}
                    className="px-4 py-3 rounded-xl font-bold" style={{ background: '#f5efe1', color: '#0d3520' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showJoin && (
        <div className="anim-slideup mb-6 rounded-2xl p-4 shadow-md" style={{ background: 'white', border: '1px solid #e8dfc8' }}>
          <label className="text-xs uppercase tracking-widest font-bold block mb-2" style={{ color: '#0d3520' }}>
            Código do álbum
          </label>
          <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                 placeholder="Ex: ABC123" maxLength={8}
                 className="w-full px-4 py-3 rounded-xl text-base outline-none uppercase tracking-widest font-bold"
                 style={{ background: '#f5efe1', color: '#0d3520', border: '1px solid #e8dfc8' }} />
          <div className="flex gap-2 mt-3">
            <button onClick={async () => {
                      const ok = await onJoin(joinCode);
                      if (ok) { setShowJoin(false); setJoinCode(''); }
                    }}
                    className="flex-1 py-3 rounded-xl font-bold text-white" style={{ background: '#0d3520' }}>
              Entrar
            </button>
            <button onClick={() => { setShowJoin(false); setJoinCode(''); }}
                    className="px-4 py-3 rounded-xl font-bold" style={{ background: '#f5efe1', color: '#0d3520' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="display-font text-2xl leading-none" style={{ color: '#0d3520' }}>MEUS ÁLBUNS</h2>
          <span className="text-xs font-bold opacity-60" style={{ color: '#0d3520' }}>{myAlbums.length}</span>
        </div>

        {myAlbums.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: 'white', border: '2px dashed #e8dfc8' }}>
            <BookOpen size={36} className="mx-auto mb-3 opacity-30" style={{ color: '#0d3520' }} />
            <p className="text-sm font-semibold" style={{ color: '#0d3520' }}>Você ainda não tem álbuns</p>
            <p className="text-xs mt-1 opacity-60" style={{ color: '#0d3520' }}>Crie um novo ou entre com um código</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myAlbums.map(a => (
              <AlbumListItem key={a.code} album={a} onOpen={() => onOpen(a.code)} onRemove={() => onRemove(a.code)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AlbumListItem({ album, onOpen, onRemove }) {
  const [showRemove, setShowRemove] = useState(false);
  return (
    <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: 'white', border: '1px solid #e8dfc8' }}>
      <button onClick={onOpen} className="w-full p-4 flex items-center gap-3 text-left active:bg-yellow-50 transition-colors">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: '#0d3520' }}>⚽</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold truncate" style={{ color: '#0d3520' }}>{album.name}</div>
          <div className="text-xs font-mono mt-0.5 tracking-wider" style={{ color: '#8a7a4f' }}>#{album.code}</div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); setShowRemove(s => !s); }} className="p-2 rounded-lg" style={{ color: '#8a7a4f' }}>
          {showRemove ? <X size={18}/> : <ChevronRight size={18} />}
        </button>
      </button>
      {showRemove && (
        <div className="px-4 pb-4 anim-slideup">
          <button onClick={onRemove}
                  className="w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background: '#fde8e8', color: '#c1272d' }}>
            <Trash2 size={14}/> Remover da minha lista
          </button>
        </div>
      )}
    </div>
  );
}

function OverviewScreen({ album, syncing, onBack, onNavigate, onRefresh, showToast }) {
  const [showShare, setShowShare] = useState(false);
  const stats = useMemo(() => totalProgress(album), [album]);
  const pct = stats.total > 0 ? Math.round((stats.have / stats.total) * 100) : 0;
  const fwcStats = useMemo(() => sectionProgress(album, 'FWC', 19), [album]);

  const confData = useMemo(() => {
    const map = {};
    CONF_ORDER.forEach(c => { map[c] = { conf: c, have: 0, total: 0 }; });
    TEAMS.forEach(t => {
      const p = teamProgress(album, t.code);
      map[t.conf].have += p.have; map[t.conf].total += p.total;
    });
    return Object.values(map).filter(d => d.total > 0).map(d => ({
      ...d, label: CONF_LABELS[d.conf],
      pct: d.total > 0 ? Math.round((d.have / d.total) * 100) : 0,
    }));
  }, [album]);

  const pieData = [
    { name: 'Coladas',   value: stats.have,    color: '#0d3520' },
    { name: 'Faltantes', value: stats.missing, color: '#e8dfc8' },
  ];

  return (
    <div className="px-5 pt-4">
      <Header title={album.name} subtitle={`#${album.code}`} onBack={onBack} action={
        <button onClick={onRefresh} className="p-2 rounded-full" style={{ background: 'white' }}>
          <RefreshCw size={18} style={{ color: '#0d3520' }} className={syncing ? 'animate-spin' : ''} />
        </button>
      } />

      <button onClick={() => setShowShare(true)}
              className="w-full mb-5 rounded-2xl p-4 flex items-center gap-3 shadow-sm active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #d4a437 0%, #b8861f 100%)' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.25)' }}>
          <Share2 size={18} className="text-white" />
        </div>
        <div className="flex-1 text-left">
          <div className="display-font text-lg leading-none text-white">CONVIDAR AMIGOS</div>
          <div className="text-xs text-white opacity-90 mt-1">Compartilhe o código para colecionar juntos</div>
        </div>
        <ChevronRight size={20} className="text-white" />
      </button>

      <div className="rounded-3xl p-5 mb-5 relative overflow-hidden shadow-md" style={{ background: 'white', border: '1px solid #e8dfc8' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold opacity-60" style={{ color: '#0d3520' }}>Progresso total</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="display-font text-6xl leading-none" style={{ color: '#0d3520' }}>{pct}</span>
              <span className="display-font text-2xl" style={{ color: '#d4a437' }}>%</span>
            </div>
            <p className="text-xs mt-1 font-semibold" style={{ color: '#0d3520' }}>
              {stats.have} de {stats.total} figurinhas
            </p>
          </div>
          <div className="w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={42} startAngle={90} endAngle={-270} stroke="none">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop: '1px solid #f0e8d2' }}>
          <Stat label="Coladas" value={stats.have} color="#0d3520" />
          <Stat label="Faltantes" value={stats.missing} color="#c1272d" />
          <Stat label="Repetidas" value={stats.dupes} color="#d4a437" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <NavCard icon={<Flag size={20} />} title="SELEÇÕES"
                 subtitle={`${TEAMS.length} times · 960 cromos`}
                 onClick={() => onNavigate({ name: 'teams', code: album.code })} />
        <NavCard icon={<Star size={20} />} title="FWC ESPECIAIS"
                 subtitle={`${fwcStats.have}/19 coladas`}
                 onClick={() => onNavigate({ name: 'section', code: album.code, secId: 'FWC' })} />
        <NavCard icon={<ListChecks size={20} />} title="FALTANTES" subtitle="Lista para trocar"
                 onClick={() => onNavigate({ name: 'missing', code: album.code })} highlight />
        <NavCard icon={<BarChart3 size={20} />} title="REPETIDAS" subtitle={`${stats.dupes} para trocar`}
                 onClick={() => onNavigate({ name: 'missing', code: album.code, tab: 'dupes' })} />
      </div>

      <div className="mb-3 px-1">
        <h3 className="display-font text-xl leading-none" style={{ color: '#0d3520' }}>POR CONFEDERAÇÃO</h3>
      </div>
      <div className="rounded-2xl p-4 mb-5 shadow-sm" style={{ background: 'white', border: '1px solid #e8dfc8' }}>
        <div style={{ height: confData.length * 38 + 20 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={confData} layout="vertical" margin={{ top: 5, right: 35, bottom: 5, left: 0 }}>
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis type="category" dataKey="label" width={80}
                     tick={{ fontSize: 11, fontWeight: 700, fill: '#0d3520' }}
                     axisLine={false} tickLine={false} />
              <Bar dataKey="pct" fill="#0d3520" radius={[0, 6, 6, 0]} barSize={16}>
                <LabelList dataKey="pct" position="right" formatter={(v) => `${v}%`}
                           style={{ fontSize: 11, fontWeight: 700, fill: '#0d3520' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-center text-xs opacity-50 font-semibold" style={{ color: '#0d3520' }}>
        🔄 Sincroniza em tempo real entre celulares
      </div>

      {showShare && <ShareModal album={album} onClose={() => setShowShare(false)} showToast={showToast} />}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="text-center">
      <div className="display-font text-3xl leading-none" style={{ color }}>{value}</div>
      <div className="text-xs uppercase tracking-wide font-semibold opacity-60 mt-1" style={{ color: '#0d3520' }}>{label}</div>
    </div>
  );
}

function NavCard({ icon, title, subtitle, onClick, highlight }) {
  return (
    <button onClick={onClick} className="rounded-2xl p-4 text-left shadow-sm active:scale-95 transition-transform"
            style={{
              background: highlight ? '#0d3520' : 'white',
              color: highlight ? 'white' : '#0d3520',
              border: highlight ? 'none' : '1px solid #e8dfc8',
            }}>
      <div style={{ color: highlight ? '#d4a437' : '#0d3520' }}>{icon}</div>
      <div className="display-font text-xl mt-2 leading-none">{title}</div>
      <div className="text-xs mt-1 opacity-70">{subtitle}</div>
    </button>
  );
}

function ShareModal({ album, onClose, showToast }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(album.code);
      setCopied(true);
      showToast('Código copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch { showToast('Não foi possível copiar'); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(13, 53, 32, 0.6)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-t-3xl p-6 anim-slideup" style={{ background: '#f5efe1' }}>
        <div className="w-12 h-1 mx-auto mb-5 rounded-full" style={{ background: '#cdc4ad' }} />
        <h3 className="display-font text-3xl leading-none mb-1" style={{ color: '#0d3520' }}>COMPARTILHAR ÁLBUM</h3>
        <p className="text-sm mb-6 opacity-70" style={{ color: '#0d3520' }}>
          Quem tiver este código poderá editar o álbum junto com você.
        </p>
        <div className="rounded-2xl p-6 mb-4 text-center" style={{ background: '#0d3520' }}>
          <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: '#d4a437' }}>Código do álbum</p>
          <div className="display-font text-6xl text-white tracking-widest leading-none">{album.code}</div>
        </div>
        <button onClick={handleCopy} className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mb-2"
                style={{ background: '#d4a437', color: '#0d3520' }}>
          {copied ? <><Check size={18}/> Copiado!</> : <><Copy size={18}/> Copiar código</>}
        </button>
        <button onClick={onClose} className="w-full py-3 rounded-2xl font-bold" style={{ background: 'transparent', color: '#0d3520' }}>
          Fechar
        </button>
      </div>
    </div>
  );
}

function Header({ title, subtitle, onBack, action }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <button onClick={onBack} className="p-2 rounded-full active:scale-90 transition-transform"
              style={{ background: 'white', border: '1px solid #e8dfc8' }}>
        <ArrowLeft size={18} style={{ color: '#0d3520' }} />
      </button>
      <div className="flex-1 min-w-0">
        <div className="display-font text-2xl leading-none truncate" style={{ color: '#0d3520' }}>{title}</div>
        {subtitle && <div className="text-xs font-mono mt-1 tracking-wider opacity-60" style={{ color: '#0d3520' }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function TeamsListScreen({ album, onBack, onSelect }) {
  // filter format: 'TODAS' | 'CONF:<id>' | 'GRP:<letter>'
  const [filter, setFilter] = useState('TODAS');
  const filtered = useMemo(() => {
    if (filter === 'TODAS') return TEAMS;
    if (filter.startsWith('CONF:')) {
      const c = filter.slice(5);
      return TEAMS.filter(t => t.conf === c);
    }
    if (filter.startsWith('GRP:')) {
      const g = filter.slice(4);
      return TEAMS.filter(t => t.group === g);
    }
    return TEAMS;
  }, [filter]);

  const filters = [
    { id: 'TODAS', label: 'Todas' },
    ...CONF_ORDER.map(c => ({ id: `CONF:${c}`, label: CONF_LABELS[c] })),
    ...GROUP_ORDER.map(g => ({ id: `GRP:${g}`, label: `Grupo ${g}` })),
  ];

  return (
    <div className="px-5 pt-4">
      <Header title="SELEÇÕES" subtitle={`${TEAMS.length} times · 20 figurinhas cada`} onBack={onBack} />

      <div className="overflow-x-auto -mx-5 px-5 mb-4 pb-1 no-scrollbar">
        <div className="flex gap-2 w-max">
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
                    className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap"
                    style={{
                      background: filter === f.id ? '#0d3520' : 'white',
                      color: filter === f.id ? 'white' : '#0d3520',
                      border: '1px solid ' + (filter === f.id ? '#0d3520' : '#e8dfc8'),
                    }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(team => {
          const p = teamProgress(album, team.code);
          const pct = p.total > 0 ? Math.round((p.have / p.total) * 100) : 0;
          const complete = p.total > 0 && p.have === p.total;
          return (
            <button key={team.code} onClick={() => onSelect(team.code)}
                    className="w-full rounded-2xl p-4 flex items-center gap-3 shadow-sm active:scale-95 transition-transform"
                    style={{ background: 'white', border: '1px solid ' + (complete ? '#d4a437' : '#e8dfc8') }}>
              <div className="text-3xl shrink-0">{team.flag}</div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="font-bold truncate" style={{ color: '#0d3520' }}>{team.name}</div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: '#f0e8d2', color: '#8a7a4f' }}>
                    GRUPO {team.group}
                  </span>
                  {team.host && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: '#d4a437', color: '#0d3520' }}>SEDE</span>
                  )}
                  {complete && <Trophy size={14} style={{ color: '#d4a437' }} />}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#f0e8d2' }}>
                    <div className="h-full rounded-full transition-all"
                         style={{ width: `${pct}%`, background: complete ? '#d4a437' : '#0d3520' }} />
                  </div>
                  <span className="text-xs font-bold tabular-nums" style={{ color: '#0d3520' }}>{p.have}/{p.total}</span>
                </div>
              </div>
              {p.dupes > 0 && (
                <div className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0" style={{ background: '#fef3d7', color: '#8a6a1f' }}>
                  +{p.dupes}
                </div>
              )}
              <ChevronRight size={16} style={{ color: '#0d3520' }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TeamDetailScreen({ album, teamCode, onBack, onUpdate }) {
  const team = TEAMS.find(t => t.code === teamCode);
  const p = teamProgress(album, teamCode);
  const pct = p.total > 0 ? Math.round((p.have / p.total) * 100) : 0;

  if (!team) {
    return (
      <div className="px-5 pt-4">
        <Header title="Seleção" onBack={onBack} />
        <p className="text-sm" style={{ color: '#0d3520' }}>Seleção não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-4">
      <Header title={team.name}
              subtitle={`Grupo ${team.group} · ${CONF_LABELS[team.conf]}`}
              onBack={onBack} />

      <div className="rounded-3xl p-5 mb-5 relative overflow-hidden shadow-md"
           style={{ background: 'linear-gradient(135deg, #0d3520 0%, #1a5634 100%)' }}>
        <div className="flex items-center gap-4">
          <div className="text-7xl">{team.flag}</div>
          <div className="flex-1">
            <div className="display-font text-3xl leading-none text-white">{p.have}/{p.total}</div>
            <div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#d4a437' }}>{pct}% completo</div>
            {p.dupes > 0 && <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>{p.dupes} repetidas</div>}
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: '#d4a437' }} />
        </div>
      </div>

      <div className="text-xs font-bold uppercase tracking-widest mb-3 px-1 opacity-60" style={{ color: '#0d3520' }}>
        Toque para alternar · Use −/+ para repetidas
      </div>

      <div className="rounded-xl p-3 mb-3 text-[11px] flex items-start gap-2"
           style={{ background: '#fff7e0', border: '1px solid #f0d98a', color: '#7a5a1f' }}>
        <span aria-hidden="true">⚠️</span>
        <span>
          <b>#1</b> é o escudo metalizado · <b>#13</b> é o time posado, exclusivo dos pacotinhos do McDonald's.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {Array.from({ length: STICKERS_PER_TEAM }, (_, i) => i + 1).map(num => {
          const key = stickerKey(teamCode, num);
          const status = getStickerStatus(album, key);
          const info = getStickerInfo(teamCode, num);
          return (
            <StickerCard key={num} number={num} name={info.name} tag={info.tag} tagColor={info.tagColor}
                         count={status.count}
                         onChange={(newCount) => onUpdate({ [key]: newCount === 0 ? null : { count: newCount } })} />
          );
        })}
      </div>
    </div>
  );
}

function StickerCard({ number, name, tag, tagColor, count, onChange }) {
  const collected = count > 0;
  const dupes = count > 1 ? count - 1 : 0;
  const handleTap = () => onChange(collected ? 0 : 1);
  const dec = (e) => { e.stopPropagation(); if (count > 0) onChange(count - 1); };
  const inc = (e) => { e.stopPropagation(); onChange(count + 1); };

  return (
    <div onClick={handleTap}
         className="rounded-xl overflow-hidden shadow-sm active:scale-95 transition-transform cursor-pointer relative"
         style={{
           background: collected ? '#0d3520' : 'white',
           border: '2px ' + (collected ? 'solid #0d3520' : 'dashed #cdc4ad'),
           minHeight: 110,
         }}>
      {dupes > 0 && (
        <div className="absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full anim-pop z-10"
             style={{ background: '#d4a437', color: '#0d3520' }}>
          +{dupes}
        </div>
      )}
      <div className="absolute top-1 left-1 text-[9px] font-mono font-bold tabular-nums px-1.5 py-0.5 rounded"
           style={{
             background: collected ? 'rgba(255,255,255,0.15)' : '#f0e8d2',
             color: collected ? '#d4a437' : '#8a7a4f',
           }}>
        #{String(number).padStart(2, '0')}
      </div>
      <div className="px-2 pt-7 pb-2 flex flex-col items-center justify-center text-center"
           style={{ minHeight: 75, color: collected ? 'white' : '#0d3520' }}>
        <div className="text-[11px] font-bold leading-tight clamp-2 px-1" style={{ minHeight: 28 }}>
          {name}
        </div>
        {tag && (
          <div className="text-[8px] uppercase tracking-wider font-bold mt-1.5 px-1.5 py-0.5 rounded"
               style={{
                 background: tagColor || (collected ? '#d4a437' : '#f0e8d2'),
                 color: tagColor ? '#fff' : (collected ? '#0d3520' : '#8a7a4f'),
               }}>
            {tag}
          </div>
        )}
        {collected && !tag && <Check size={12} className="mt-1" style={{ color: '#d4a437' }} />}
      </div>
      <div className="flex border-t" style={{ borderColor: collected ? 'rgba(255,255,255,0.15)' : '#f0e8d2' }}>
        <button onClick={dec} disabled={count === 0}
                className="flex-1 py-1.5 flex items-center justify-center disabled:opacity-30"
                style={{ color: collected ? 'white' : '#0d3520' }}>
          <Minus size={12} />
        </button>
        <div className="px-2 py-1.5 text-[10px] font-bold tabular-nums flex items-center"
             style={{ color: collected ? '#d4a437' : '#8a7a4f', minWidth: 28, justifyContent: 'center' }}>
          {count > 0 ? `${count}x` : '—'}
        </div>
        <button onClick={inc} className="flex-1 py-1.5 flex items-center justify-center"
                style={{ color: collected ? 'white' : '#0d3520' }}>
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}

function SectionDetailScreen({ album, secId, onBack, onUpdate }) {
  const section = SPECIAL_SECTIONS.find(s => s.id === secId);
  if (!section) {
    return (
      <div className="px-5 pt-4">
        <Header title="Seção" onBack={onBack} />
        <p className="text-sm" style={{ color: '#0d3520' }}>Seção não encontrada.</p>
      </div>
    );
  }
  const p = sectionProgress(album, secId, section.count);
  const pct = p.total > 0 ? Math.round((p.have / p.total) * 100) : 0;

  const groups = useMemo(() => {
    const result = { OFICIAL: [], MASCOTE: [], SEDE: [], MOMENTO: [] };
    for (let i = 1; i <= section.count; i++) {
      const info = getStickerInfo(secId, i);
      if (result[info.tag]) result[info.tag].push({ num: i, info });
    }
    return result;
  }, [secId, section.count]);

  const groupTitles = {
    OFICIAL: 'Símbolos Oficiais',
    MASCOTE: 'Mascotes',
    SEDE:    'Países-Sede',
    MOMENTO: 'Momentos Históricos',
  };

  return (
    <div className="px-5 pt-4">
      <Header title={section.name} subtitle={section.desc} onBack={onBack} />
      <div className="rounded-3xl p-5 mb-5 relative overflow-hidden shadow-md"
           style={{ background: 'linear-gradient(135deg, #0d3520 0%, #1a5634 100%)' }}>
        <div className="flex items-center gap-4">
          <div className="text-6xl">{section.icon}</div>
          <div className="flex-1">
            <div className="display-font text-3xl leading-none text-white">{p.have}/{p.total}</div>
            <div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#d4a437' }}>{pct}% completo</div>
            {p.dupes > 0 && <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>{p.dupes} repetidas</div>}
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#d4a437' }} />
        </div>
      </div>

      <div className="space-y-5">
        {Object.entries(groups).map(([groupKey, items]) => {
          if (items.length === 0) return null;
          return (
            <div key={groupKey}>
              <h3 className="display-font text-lg leading-none mb-2 px-1 flex items-center gap-2" style={{ color: '#0d3520' }}>
                {groupTitles[groupKey]}
                <span className="text-xs font-bold opacity-50">({items.length})</span>
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {items.map(({ num, info }) => {
                  const key = stickerKey(secId, num);
                  const status = getStickerStatus(album, key);
                  return (
                    <StickerCard key={num} number={num} name={info.name} tag={info.tag} tagColor={info.tagColor}
                                 count={status.count}
                                 onChange={(newCount) => onUpdate({ [key]: newCount === 0 ? null : { count: newCount } })} />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MissingScreen({ album, onBack, showToast, initialTab = 'missing' }) {
  const [tab, setTab] = useState(initialTab);

  const { missingByGroup, dupesByGroup, totalMissing, totalDupes } = useMemo(() => {
    const missingByGroup = {};
    const dupesByGroup = {};
    let totalMissing = 0, totalDupes = 0;

    TEAMS.forEach(team => {
      const miss = [], dup = [];
      for (let i = 1; i <= STICKERS_PER_TEAM; i++) {
        const s = getStickerStatus(album, stickerKey(team.code, i));
        const info = getStickerInfo(team.code, i);
        if (s.count === 0) miss.push({ num: i, name: info.name, tag: info.tag });
        if (s.count > 1) dup.push({ num: i, name: info.name, tag: info.tag, count: s.count - 1 });
      }
      if (miss.length) missingByGroup[team.code] = { name: team.name, flag: team.flag, items: miss };
      if (dup.length) dupesByGroup[team.code] = { name: team.name, flag: team.flag, items: dup };
      totalMissing += miss.length;
      totalDupes += dup.reduce((s, d) => s + d.count, 0);
    });

    SPECIAL_SECTIONS.forEach(sec => {
      const miss = [], dup = [];
      for (let i = 1; i <= sec.count; i++) {
        const s = getStickerStatus(album, stickerKey(sec.id, i));
        const info = getStickerInfo(sec.id, i);
        if (s.count === 0) miss.push({ num: i, name: info.name, tag: info.tag });
        if (s.count > 1) dup.push({ num: i, name: info.name, tag: info.tag, count: s.count - 1 });
      }
      if (miss.length) missingByGroup[sec.id] = { name: sec.name, flag: sec.icon, items: miss };
      if (dup.length) dupesByGroup[sec.id] = { name: sec.name, flag: sec.icon, items: dup };
      totalMissing += miss.length;
      totalDupes += dup.reduce((s, d) => s + d.count, 0);
    });

    return { missingByGroup, dupesByGroup, totalMissing, totalDupes };
  }, [album]);

  const buildText = () => {
    let text = `📒 *${album.name}*\n#${album.code}\n\n`;
    const groups = tab === 'missing' ? missingByGroup : dupesByGroup;
    text += tab === 'missing'
      ? `🔍 *FIGURINHAS QUE PRECISO* (${totalMissing})\n\n`
      : `🔄 *REPETIDAS PARA TROCAR* (${totalDupes})\n\n`;
    Object.entries(groups).forEach(([code, g]) => {
      text += `${g.flag} *${g.name}*\n`;
      g.items.forEach(it => {
        const suffix = tab === 'dupes' && it.count > 1 ? ` (${it.count}x)` : '';
        const tag = it.tag ? ` [${it.tag}]` : '';
        const prefix = code === 'FWC' ? `FWC-${it.num}` : String(it.num).padStart(2, '0');
        text += `  ${prefix} ${it.name}${tag}${suffix}\n`;
      });
      text += `\n`;
    });
    return text.trim();
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(buildText());
      showToast('Lista copiada!');
    } catch { showToast('Não foi possível copiar'); }
  };

  const handleShare = async () => {
    const text = buildText();
    if (navigator.share) {
      try { await navigator.share({ title: 'Minha lista do álbum', text }); return; } catch {}
    }
    handleCopy();
  };

  const groups = tab === 'missing' ? missingByGroup : dupesByGroup;
  const isEmpty = Object.keys(groups).length === 0;

  return (
    <div className="px-5 pt-4">
      <Header title="LISTAS"
              subtitle={tab === 'missing' ? 'Figurinhas faltantes' : 'Figurinhas repetidas'}
              onBack={onBack} />

      <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-2xl" style={{ background: 'white', border: '1px solid #e8dfc8' }}>
        <button onClick={() => setTab('missing')}
                className="py-2.5 rounded-xl font-bold text-sm transition-all"
                style={{ background: tab === 'missing' ? '#0d3520' : 'transparent', color: tab === 'missing' ? 'white' : '#0d3520' }}>
          Faltantes <span className="opacity-70">({totalMissing})</span>
        </button>
        <button onClick={() => setTab('dupes')}
                className="py-2.5 rounded-xl font-bold text-sm transition-all"
                style={{ background: tab === 'dupes' ? '#0d3520' : 'transparent', color: tab === 'dupes' ? 'white' : '#0d3520' }}>
          Repetidas <span className="opacity-70">({totalDupes})</span>
        </button>
      </div>

      {!isEmpty && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button onClick={handleCopy}
                  className="py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm"
                  style={{ background: 'white', color: '#0d3520', border: '1px solid #e8dfc8' }}>
            <Copy size={16}/> Copiar
          </button>
          <button onClick={handleShare}
                  className="py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm text-white"
                  style={{ background: '#0d3520' }}>
            <MessageCircle size={16}/> Compartilhar
          </button>
        </div>
      )}

      {isEmpty ? (
        <div className="rounded-2xl p-8 text-center" style={{ background: 'white', border: '2px dashed #e8dfc8' }}>
          <Trophy size={36} className="mx-auto mb-3" style={{ color: '#d4a437' }} />
          <p className="font-bold" style={{ color: '#0d3520' }}>
            {tab === 'missing' ? 'Nenhuma figurinha faltando!' : 'Nenhuma repetida no momento'}
          </p>
          <p className="text-xs mt-1 opacity-60" style={{ color: '#0d3520' }}>
            {tab === 'missing' ? 'Álbum completo, parabéns!' : 'Você ainda não tem repetidas para trocar'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(groups).map(([code, g]) => (
            <div key={code} className="rounded-2xl p-4 shadow-sm" style={{ background: 'white', border: '1px solid #e8dfc8' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{g.flag}</span>
                <span className="font-bold flex-1" style={{ color: '#0d3520' }}>{g.name}</span>
                <span className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{
                        background: tab === 'missing' ? '#fde8e8' : '#fef3d7',
                        color: tab === 'missing' ? '#c1272d' : '#8a6a1f',
                      }}>
                  {tab === 'missing' ? g.items.length : g.items.reduce((s, d) => s + d.count, 0)}
                </span>
              </div>
              <div className="space-y-1">
                {g.items.map((it, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm py-1"
                       style={{ borderTop: i > 0 ? '1px solid #f5efe1' : 'none', paddingTop: i > 0 ? 6 : 0 }}>
                    <span className="font-mono font-bold tabular-nums text-xs px-1.5 py-0.5 rounded shrink-0"
                          style={{ background: '#f5efe1', color: '#8a7a4f', minWidth: 38, textAlign: 'center' }}>
                      {code === 'FWC' ? `FWC-${it.num}` : String(it.num).padStart(2, '0')}
                    </span>
                    <span className="flex-1 truncate" style={{ color: '#0d3520' }}>{it.name}</span>
                    {it.tag && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0"
                            style={{ background: '#f0e8d2', color: '#8a7a4f' }}>{it.tag}</span>
                    )}
                    {tab === 'dupes' && it.count > 1 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                            style={{ background: '#d4a437', color: '#0d3520' }}>{it.count}x</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
