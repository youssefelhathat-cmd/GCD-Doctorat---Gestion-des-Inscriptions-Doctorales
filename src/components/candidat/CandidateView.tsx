import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { ThesisSubject } from '../../types';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  BookOpen, 
  Building2, 
  User, 
  Award, 
  FileText,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { SubjectDetailModal } from './SubjectDetailModal';
import { CartDrawer } from './CartDrawer';
import { AuthModal } from './AuthModal';
import { ApplicationFormModal } from './ApplicationFormModal';
import { CandidateDashboard } from './CandidateDashboard';

export const CandidateView: React.FC = () => {
  const { 
    subjects, 
    cart, 
    addToCart, 
    user, 
    applications 
  } = useDoctorat();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<ThesisSubject | null>(null);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAppFormOpen, setIsAppFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'tracking'>('catalog');

  const userApplications = applications.filter(a => 
    user && (a.candidatId === user.id || a.email.toLowerCase() === user.email.toLowerCase())
  );

  const disciplines = Array.from(new Set(subjects.map(s => s.discipline)));
  const publishedSubjects = subjects.filter(s => s.status === 'confirme_ced');

  const filteredSubjects = publishedSubjects.filter(s => {
    const matchSearch = 
      s.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.directeurThese.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.laboratoire.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.motsCles.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchDiscipline = selectedDiscipline === 'all' || s.discipline === selectedDiscipline;
    return matchSearch && matchDiscipline;
  });

  const handleProceedFromCart = () => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setIsAppFormOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAppFormOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Clean University Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Campagne Doctorale 2026/2027</span>
            <span>·</span>
            <span className="text-emerald-800 font-semibold">Inscriptions Ouvertes</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Offres de Thèses de Doctorat
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Catalogue officiel des sujets de recherche du CEDoc · Sélection ordonnée de 1 à 3 choix
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {userApplications.length > 0 && (
            <button
              onClick={() => setActiveTab(activeTab === 'catalog' ? 'tracking' : 'catalog')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>{activeTab === 'catalog' ? 'Suivre mon dossier' : 'Consulter le catalogue'}</span>
            </button>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mon Panier de Vœux</span>
            <span className="ml-0.5 px-1.5 py-0.5 bg-slate-800 rounded text-[11px] font-mono font-medium text-emerald-400">
              {cart.length}/3
            </span>
          </button>
        </div>
      </div>

      {/* Main Switcher between Catalog and Candidature Tracking */}
      {activeTab === 'tracking' && userApplications.length > 0 ? (
        <CandidateDashboard 
          application={userApplications[0]} 
          onBackToCatalog={() => setActiveTab('catalog')} 
        />
      ) : (
        <div className="space-y-5">
          
          {/* Search & Filter bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Rechercher par titre de sujet, directeur de thèse, laboratoire, mot-clé..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={selectedDiscipline}
                  onChange={e => setSelectedDiscipline(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none bg-white font-medium text-slate-700"
                >
                  <option value="all">Toutes les disciplines ({publishedSubjects.length})</option>
                  {disciplines.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Filter tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-slate-600 scrollbar-none">
              <button
                onClick={() => setSelectedDiscipline('all')}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDiscipline === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Tous ({publishedSubjects.length})
              </button>
              {disciplines.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDiscipline(d)}
                  className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedDiscipline === d ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              <strong>{filteredSubjects.length}</strong> sujet(s) disponible(s) pour candidature
            </span>
            <span>
              Sélection actuelle : <strong className="font-mono text-slate-800">{cart.length} / 3 vœux</strong>
            </span>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSubjects.map(subject => {
              const isInCart = cart.includes(subject.id);
              return (
                <div
                  key={subject.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2 font-mono">
                      <span className="font-semibold text-slate-700">{subject.code}</span>
                      <span className="text-[11px] font-sans font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {subject.discipline}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-sm font-bold text-slate-900 leading-snug">
                      {subject.titre}
                    </h2>

                    {/* Summary */}
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {subject.resume}
                    </p>

                    {/* Meta info */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{subject.directeurThese}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{subject.laboratoire}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:col-span-2 text-emerald-800 font-medium">
                        <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{subject.financement}</span>
                      </div>
                    </div>

                    {/* Keywords */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {subject.motsCles.slice(0, 3).map((kw, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedSubject(subject)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Fiche détaillée</span>
                    </button>

                    <button
                      onClick={() => {
                        const res = addToCart(subject.id);
                        if (!res.success) {
                          alert(res.message);
                        }
                      }}
                      disabled={isInCart}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isInCart
                          ? 'bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isInCart ? 'Dans mon panier' : 'Ajouter à mes vœux'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSubjects.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Aucun sujet trouvé</p>
              <p className="text-xs text-slate-500 mt-1">Modifiez vos critères de recherche ou réinitialisez les filtres.</p>
            </div>
          )}

        </div>
      )}

      {/* Modals */}
      <SubjectDetailModal
        subject={selectedSubject}
        onClose={() => setSelectedSubject(null)}
        onOpenCart={() => {
          setSelectedSubject(null);
          setIsCartOpen(true);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToAuthOrForm={handleProceedFromCart}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <ApplicationFormModal
        isOpen={isAppFormOpen}
        onClose={() => setIsAppFormOpen(false)}
        onSubmitted={() => {
          setActiveTab('tracking');
        }}
      />

    </div>
  );
};
