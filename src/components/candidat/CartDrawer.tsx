import React from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { 
  X, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  ArrowUpDown,
  UserCheck,
  Lock
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProceedToAuthOrForm: () => void;
}

export const CartDrawer: React.FC<Props> = ({ isOpen, onClose, onProceedToAuthOrForm }) => {
  const { cart, removeFromCart, clearCart, subjects, user } = useDoctorat();

  if (!isOpen) return null;

  const cartSubjects = cart.map(id => subjects.find(s => s.id === id)).filter(Boolean);
  const isConforme = cart.length > 0 && cart.length <= 3;
  const isExceeded = cart.length > 3;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Mon Panier de Sujets
              </h2>
              <p className="text-xs text-slate-500">
                Règle UML CED : Maximum 3 sujets autorisés
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conformity Check Banner directly linked to UML decision */}
        <div className="px-5 py-3 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600">Statut de conformité du panier :</span>
            <span className="font-mono font-bold text-slate-900">
              {cart.length} / 3 sujets
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                cart.length === 0 
                  ? 'w-0' 
                  : cart.length <= 3 
                    ? 'bg-emerald-500' 
                    : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, (cart.length / 3) * 100)}%` }}
            />
          </div>

          {isExceeded && (
            <div className="mt-2.5 p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong>Panier non conforme (&gt; 3 sujets) !</strong>
                <p className="mt-0.5">Le diagramme d'activité requiert l'étape : <em>"Plateforme GCD : Modifier le panier"</em>. Veuillez retirer un sujet avant de poursuivre.</p>
              </div>
            </div>
          )}

          {cart.length === 0 && (
            <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500">
              Votre panier est actuellement vide. Parcourez le catalogue et ajoutez jusqu'à 3 sujets de thèse.
            </div>
          )}

          {isConforme && (
            <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Panier conforme (1 à 3 sujets). Vous pouvez passer à l'étape suivante.</span>
            </div>
          )}
        </div>

        {/* Subjects list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cartSubjects.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-1 opacity-50 mb-3" />
              <p className="text-sm font-medium text-slate-600">Aucun sujet sélectionné</p>
              <p className="text-xs text-slate-400 mt-1">Cliquez sur « Ajouter au panier » sur une offre de thèse.</p>
            </div>
          ) : (
            cartSubjects.map((subject, index) => {
              if (!subject) return null;
              return (
                <div 
                  key={subject.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">
                        Vœu prioritaire n°{index + 1}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(subject.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                      title="Modifier le panier (Retirer ce sujet)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    {subject.titre}
                  </h3>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[200px]">{subject.laboratoire}</span>
                    <span className="font-medium text-slate-700">{subject.directeurThese}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
          {cart.length > 0 && (
            <div className="flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={clearCart}
                className="hover:text-rose-600 transition-colors underline"
              >
                Vider le panier
              </button>
              <span>{user ? `Connecté : ${user.prenom} ${user.nom}` : 'Non connecté'}</span>
            </div>
          )}

          <button
            onClick={() => {
              onClose();
              onProceedToAuthOrForm();
            }}
            disabled={!isConforme}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors ${
              isConforme
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>
              {!user ? 'Valider le panier & Vérifier le compte' : 'Continuer vers le dépôt de dossier'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="text-[11px] text-center text-slate-400">
            Étape suivante : Contrôle compte existant ou inscription candidat
          </p>
        </div>

      </div>
    </div>
  );
};
