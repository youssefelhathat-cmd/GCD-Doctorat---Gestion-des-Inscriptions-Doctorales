import React from 'react';
import { ThesisSubject } from '../../types';
import { useDoctorat } from '../../context/DoctoratContext';
import { X, Building2, User, Mail, Award, CheckCircle2, ShoppingBag, BookOpen } from 'lucide-react';

interface Props {
  subject: ThesisSubject | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const SubjectDetailModal: React.FC<Props> = ({ subject, onClose, onOpenCart }) => {
  const { cart, addToCart } = useDoctorat();

  if (!subject) return null;

  const isInCart = cart.includes(subject.id);

  const handleAdd = () => {
    const res = addToCart(subject.id);
    if (res.success) {
      onOpenCart();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 font-mono">
              <span className="font-semibold text-slate-700">{subject.code}</span>
              <span>·</span>
              <span>{subject.discipline}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {subject.titre}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Encadrement et Laboratoire */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Laboratoire d'accueil</p>
                <p className="text-slate-600 mt-0.5">{subject.laboratoire}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Directeur de thèse</p>
                <p className="text-slate-600 mt-0.5">{subject.directeurThese}</p>
                {subject.coDirecteur && (
                  <p className="text-slate-500 text-[11px]">Co-directeur : {subject.coDirecteur}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-2.5 sm:col-span-2">
              <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Financement & Type de contrat</p>
                <p className="text-emerald-700 font-medium mt-0.5">{subject.financement}</p>
              </div>
            </div>
          </div>

          {/* Résumé du projet */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Résumé scientifique du projet de recherche
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg p-4">
              {subject.resume}
            </p>
          </div>

          {/* Objectifs attendus */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Objectifs de la thèse & Livrables
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {subject.objectifs.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prérequis */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Profil recherché & Prérequis académiques
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              {subject.prerequis.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Mots-clés */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Mots-clés de recherche
            </h3>
            <div className="flex flex-wrap gap-2 text-xs text-slate-600">
              {subject.motsCles.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-100 rounded text-slate-700 font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Mail className="w-3.5 h-3.5" />
            <span>Contact : {subject.emailContact}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={handleAdd}
              disabled={isInCart}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-colors ${
                isInCart
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isInCart ? 'Déjà dans votre panier' : 'Ajouter au panier'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
