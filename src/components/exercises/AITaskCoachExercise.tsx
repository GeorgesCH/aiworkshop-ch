// src/components/exercises/AITaskCoachExercise.tsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * AITaskCoachExercise
 * - 8 étapes guidées pour analyser les tâches et identifier les quick wins IA
 * - Scoring (6 critères, 0–5), bar de progression, export JSON
 * - Lead magnet (nom + email) -> status 'lead_captured'
 * - Persistance locale (localStorage) + callbacks externes
 */

type Status = "in_progress" | "completed" | "lead_captured";

export interface AITaskCoachExerciseProps {
  /** Clé locale pour persister automatiquement (localStorage). Par défaut: 'ai-task-coach' */
  storageKey?: string;
  /** Données initiales à pré-remplir */
  initialData?: Record<string, any>;
  /** Callback à chaque sauvegarde manuelle (bouton "Enregistrer le progrès") */
  onSave?: (data: Record<string, any>, status: Status) => void | Promise<void>;
  /** Callback à chaque changement de statut (completed / lead_captured) */
  onStatusChange?: (status: Status, data: Record<string, any>) => void | Promise<void>;
  /** Classes CSS optionnelles (ex: Tailwind) */
  className?: string;
}

export default function AITaskCoachExercise({
  storageKey = "ai-task-coach",
  initialData,
  onSave,
  onStatusChange,
  className,
}: AITaskCoachExerciseProps) {
  // ----- State -----
  const [currentStep, setCurrentStep] = useState<number>(1); // 1..8
  const [status, setStatus] = useState<Status>("in_progress");
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<Record<string, any>>(() => {
    // Load from localStorage if exists, else initialData
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    return initialData || {};
  });

  // ----- Derived helpers -----
  const val = (key: string, fallback = "") =>
    (data?.[key] ?? fallback) as string;

  const setVal = (key: string, value: any) =>
    setData((d) => ({ ...d, [key]: value }));

  const parse0to5 = (n: any) => {
    const v = Number(n);
    if (!Number.isFinite(v)) return 0;
    return Math.max(0, Math.min(5, v));
  };

  const candidateScore = (i: 1 | 2 | 3) => {
    const rep = parse0to5(val(`candidate${i}_rep`));
    const clarity = parse0to5(val(`candidate${i}_clarity`));
    const data = parse0to5(val(`candidate${i}_data`));
    const risk = parse0to5(val(`candidate${i}_riskTolerance`));
    const freq = parse0to5(val(`candidate${i}_freq`));
    const collab = parse0to5(val(`candidate${i}_collab`));
    return rep + clarity + data + risk + freq + collab;
  };

  const totals = useMemo(
    () => [1, 2, 3].map((i) => candidateScore(i as 1 | 2 | 3)),
    [data]
  );
  const bestIndex = totals.indexOf(Math.max(...totals)) + 1; // 1-based

  // Progress: count required fields
  const requiredKeys = useMemo(
    () => [
      "tasks_list",
      "time_traps",
      "candidate1_name",
      "candidate1_rep",
      "candidate1_clarity",
      "candidate1_data",
      "candidate1_riskTolerance",
      "candidate1_freq",
      "candidate1_collab",
      "privacy_notes",
      "context_tools",
      "quick_wins",
      "adoption_plan",
      "kpis_before",
      "kpis_after",
    ],
    []
  );

  const progress = useMemo(() => {
    const completedCount = requiredKeys.filter(
      (k) => (val(k) || "").toString().trim().length > 0
    ).length;
    const totalCount = requiredKeys.length;
    return Math.round((completedCount / totalCount) * 100);
  }, [requiredKeys, data]);

  // Auto-persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {}
  }, [data, storageKey]);

  // ----- Actions -----
  const insertQuickWinsTemplate = () => {
    const template =
      `• Assistant d'écriture: modèles de réponses, synthèse d'emails, ton pro\n` +
      `• Synthèse de réunions: plan d'actions (3 actions, responsable, échéance)\n` +
      `• Analyse légère de données: tendances + 3 recommandations\n` +
      `• Préparation de contenu: plan détaillé + checklist qualité\n` +
      `• Recherche guidée: veille rapide avec 3 sources fiables`;
    setVal("quick_wins", template);
  };

  const generateAdoptionPlan = () => {
    const c1 = val("candidate1_name", "Tâche 1");
    const c2 = val("candidate2_name", "Tâche 2");
    const plan =
      `S1 – Cadrage: choisir ${c1} et ${c2}, fixer objectifs (temps gagné), créer 3 prompts.\n` +
      `S2 – Prototype: tester sur 3 occurrences, journal de bord (résultat, correction, temps).\n` +
      `S3 – Pilote: partager avec 1–2 collègues, règles qualité & confidentialité.\n` +
      `S4 – Standardisation: bibliothèque de prompts, checklist, mini-guide interne.`;
    setVal("adoption_plan", plan);
  };

  const exportJSON = () => {
    try {
      const payload = {
        exercise: "ai-task-coach",
        created_at: new Date().toISOString(),
        status,
        data,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-task-coach-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export impossible.");
    }
  };

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      await Promise.resolve(onSave(data, status));
      setIsSaving(false);
    } else {
      // Sans backend: juste un feedback
      alert("Progrès enregistrés localement ✅");
    }
  };

  const setStatusAndNotify = async (s: Status) => {
    setStatus(s);
    if (onStatusChange) await Promise.resolve(onStatusChange(s, data));
  };

  const handleComplete = async () => {
    if (progress < 70) {
      alert("Merci de compléter davantage de sections avant de terminer (≥ 70%).");
      return;
    }
    await setStatusAndNotify("completed");
    alert("Exercice terminé avec succès 🎉");
  };

  const handleLeadSubmit = async () => {
    const name = val("lead_name");
    const email = val("lead_email");
    if (!name || !email) {
      alert("Indiquez votre prénom et votre email pour recevoir vos recommandations.");
      return;
    }
    setVal("lead_captured_at", new Date().toISOString());
    await setStatusAndNotify("lead_captured");
    alert("Super ! Vos recommandations personnalisées sont prêtes ✅");
  };

  // ----- UI bits -----
  const StepHeader: React.FC<{ num: number; title: string; emoji?: string }> = ({
    num,
    title,
    emoji,
  }) => (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
        {num}
      </div>
      <h4 className="text-lg font-semibold flex items-center gap-2">
        {emoji ? <span>{emoji}</span> : null}
        {title}
      </h4>
    </div>
  );

  const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{children}</label>
  );

  const SectionCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 shadow-sm">
      {children}
    </div>
  );

  // ----- Render -----
  return (
    <div className={["w-full max-w-4xl mx-auto", className].filter(Boolean).join(" ")}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Exercice Coach IA – Analyse des tâches</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Cartographiez vos tâches, repérez les quick wins IA et repartez avec un mini-plan d’adoption + recommandations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={[
              "text-xs px-2 py-1 rounded border",
              status === "completed"
                ? "bg-green-100 text-green-700 border-green-200"
                : status === "lead_captured"
                ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                : "bg-gray-100 text-gray-700 border-gray-200",
            ].join(" ")}
          >
            {status === "completed"
              ? "Terminé"
              : status === "lead_captured"
              ? "Lead capturé"
              : "En cours"}
          </span>
          <span className="text-xs px-2 py-1 rounded border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            {progress}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded mb-6 overflow-hidden">
        <div
          className={`h-2 bg-blue-600 transition-all duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-8">
        {/* Step 1 */}
        {currentStep === 1 && (
          <SectionCard>
            <StepHeader num={1} title="Votre semaine en photo" emoji="🎯" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Listez 5–7 tâches récurrentes. Ajoutez temps/semaine, fréquence, charge mentale, plaisir, nature (standardisé vs créatif).
            </p>
            <textarea
              className="mt-3 w-full min-h-[140px] p-3 rounded border bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700"
              placeholder="Ex. Rédiger comptes rendus (3h/sem, hebdo, charge élevée, plaisir moyen, standardisé)…"
              value={val("tasks_list")}
              onChange={(e) => setVal("tasks_list", e.target.value)}
            />
          </SectionCard>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <SectionCard>
            <StepHeader num={2} title="Les vrais irritants" emoji="🧠" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Choisissez 2 tâches qui consomment le plus (temps/énergie) et expliquez pourquoi.
            </p>
            <textarea
              className="mt-3 w-full min-h-[120px] p-3 rounded border bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700"
              placeholder="Ex. Emailing client: volume + copier/coller. Reporting: données éparpillées + multiples validations."
              value={val("time_traps")}
              onChange={(e) => setVal("time_traps", e.target.value)}
            />
          </SectionCard>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <SectionCard>
            <StepHeader num={3} title="Score de compatibilité IA (jusqu’à 3 tâches)" emoji="💡" />
            <div className="space-y-5 mt-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-md border border-gray-200 dark:border-gray-700 p-3">
                  <div className="grid md:grid-cols-2 gap-3 items-center">
                    <input
                      className="w-full p-2 rounded border bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700"
                      placeholder={`Nom de la tâche ${i}`}
                      value={val(`candidate${i}_name`)}
                      onChange={(e) => setVal(`candidate${i}_name`, e.target.value)}
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Score total:{" "}
                      <span className="font-semibold">{candidateScore(i as 1 | 2 | 3)}</span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3 mt-3">
                    <NumberField
                      label="Répétitivité (0–5)"
                      value={val(`candidate${i}_rep`)}
                      onChange={(v) => setVal(`candidate${i}_rep`, v)}
                    />
                    <NumberField
                      label="Clarté du résultat (0–5)"
                      value={val(`candidate${i}_clarity`)}
                      onChange={(v) => setVal(`candidate${i}_clarity`, v)}
                    />
                    <NumberField
                      label="Données dispo (0–5)"
                      value={val(`candidate${i}_data`)}
                      onChange={(v) => setVal(`candidate${i}_data`, v)}
                    />
                    <NumberField
                      label="Tolérance au risque (0–5)"
                      value={val(`candidate${i}_riskTolerance`)}
                      onChange={(v) => setVal(`candidate${i}_riskTolerance`, v)}
                    />
                    <NumberField
                      label="Fréquence/urgence (0–5)"
                      value={val(`candidate${i}_freq`)}
                      onChange={(v) => setVal(`candidate${i}_freq`, v)}
                    />
                    <NumberField
                      label="Collaboration (0–5)"
                      value={val(`candidate${i}_collab`)}
                      onChange={(v) => setVal(`candidate${i}_collab`, v)}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-500">
                ≥ 13 = opportunité forte · 8–12 = moyenne · ≤ 7 = faible
              </p>
            </div>
          </SectionCard>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <SectionCard>
            <StepHeader num={4} title="Données & confidentialité" emoji="📘" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Décrivez types de données, sensibilité, stockage, anonymisation possible, cadre/accord.
            </p>
            <textarea
              className="mt-3 w-full min-h-[120px] p-3 rounded border bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700"
              placeholder="Ex. Données clients (moyenne), dans CRM, anonymisation partielle possible, usage interne validé."
              value={val("privacy_notes")}
              onChange={(e) => setVal("privacy_notes", e.target.value)}
            />
          </SectionCard>
        )}

        {/* Step 5 */}
        {currentStep === 5 && (
          <SectionCard>
            <StepHeader num={5} title="Contexte & outils actuels" emoji="👥" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Indiquez outils, contraintes IT/juridique, langues, budget, niveau.
            </p>
            <textarea
              className="mt-3 w-full min-h-[120px] p-3 rounded border bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700"
              placeholder="Ex. Google Workspace, Slack; politique données stricte; FR/EN; budget 20–50€/mois; niveau débutant."
              value={val("context_tools")}
              onChange={(e) => setVal("context_tools", e.target.value)}
            />
          </SectionCard>
        )}

        {/* Step 6 */}
        {currentStep === 6 && (
          <SectionCard>
            <StepHeader num={6} title="Quick wins (≤ 30 min)" emoji="⚡" />
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="px-3 py-2 rounded border bg-gray-50 hover:bg-gray-100 border-gray-200 text-sm"
                onClick={insertQuickWinsTemplate}
              >
                Insérer un exemple
              </button>
            </div>
            <textarea
              className="mt-3 w-full min-h-[120px] p-3 rounded border bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700"
              placeholder="Notez 2–3 idées concrètes à tester cette semaine."
              value={val("quick_wins")}
              onChange={(e) => setVal("quick_wins", e.target.value)}
            />
          </SectionCard>
        )}

        {/* Step 7 */}
        {currentStep === 7 && (
          <SectionCard>
            <StepHeader num={7} title="Plan d’adoption (4 semaines)" emoji="🗓️" />
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="px-3 py-2 rounded border bg-gray-50 hover:bg-gray-100 border-gray-200 text-sm"
                onClick={generateAdoptionPlan}
              >
                Générer un plan
              </button>
            </div>
            <textarea
              className="mt-3 w-full min-h-[140px] p-3 rounded border bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700"
              placeholder="Décrivez vos étapes S1→S4: cadrage, prototype, pilote, standardisation."
              value={val("adoption_plan")}
              onChange={(e) => setVal("adoption_plan", e.target.value)}
            />
          </SectionCard>
        )}

        {/* Step 8 */}
        {currentStep === 8 && (
          <SectionCard>
            <StepHeader num={8} title="Indicateurs de succès" emoji="✅" />
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <LabeledInput
                label="Heures/sem AVANT (ex. 6)"
                type="number"
                min={0}
                step="0.1"
                value={val("kpis_before")}
                onChange={(e) => setVal("kpis_before", e.target.value)}
              />
              <LabeledInput
                label="Heures/sem APRÈS (ex. 3.5)"
                type="number"
                min={0}
                step="0.1"
                value={val("kpis_after")}
                onChange={(e) => setVal("kpis_after", e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">
              Gain estimé:{" "}
              {(() => {
                const before = Number(val("kpis_before")) || 0;
                const after = Number(val("kpis_after")) || 0;
                const gained = Math.max(0, before - after);
                return `${gained.toFixed(1)} h/sem ≈ ${(gained * 52).toFixed(
                  0
                )} h/an`;
              })()}
            </p>
          </SectionCard>
        )}

        {/* Lead magnet */}
        <SectionCard>
          <h3 className="text-xl font-semibold">Recevez vos recommandations personnalisées</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Entrez vos coordonnées et obtenez votre snapshot: tâches prioritaires, quick wins & checklist confidentialité.
          </p>
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <LabeledInput
              label="Prénom"
              placeholder="Votre prénom"
              value={val("lead_name")}
              onChange={(e) => setVal("lead_name", e.target.value)}
            />
            <LabeledInput
              label="Email professionnel"
              placeholder="prenom@entreprise.com"
              type="email"
              value={val("lead_email")}
              onChange={(e) => setVal("lead_email", e.target.value)}
            />
          </div>

          {/* Snapshot preview */}
          {val("lead_name") && val("lead_email") ? (
            <div className="mt-4 rounded-md border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/40">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                Aperçu de votre snapshot
              </div>
              <div className="text-sm">
                Tâche prioritaire suggérée:{" "}
                <span className="font-medium">
                  {val(`candidate${bestIndex}_name`, "—")}
                </span>{" "}
                (score {totals[bestIndex - 1] || 0})
              </div>
              <div className="text-sm">
                Prochain pas: testez un quick win cette semaine et mesurez le temps avant/après.
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLeadSubmit}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Voir mes recommandations
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded border bg-white hover:bg-gray-50 border-gray-200 text-sm disabled:opacity-60"
            >
              {isSaving ? "Enregistrement…" : "Enregistrer le progrès"}
            </button>
            <button
              type="button"
              onClick={exportJSON}
              className="px-4 py-2 rounded border bg-white hover:bg-gray-50 border-gray-200 text-sm"
            >
              Exporter (JSON)
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className="px-4 py-2 rounded border bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              {status === "completed" ? "Terminé" : "Marquer comme terminé"}
            </button>
          </div>
        </SectionCard>

        {/* Step navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={currentStep <= 1}
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            className="px-4 py-2 rounded border bg-white hover:bg-gray-50 border-gray-200 text-sm disabled:opacity-50"
          >
            Étape précédente
          </button>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Étape {currentStep} / 8
          </div>
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.min(8, s + 1))}
            disabled={currentStep >= 8}
            className="px-4 py-2 rounded border bg-white hover:bg-gray-50 border-gray-200 text-sm disabled:opacity-50"
          >
            Étape suivante
          </button>
        </div>

        {/* Completed banner */}
        {status === "completed" && (
          <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800">
            <div className="font-semibold mb-1">Bravo !</div>
            <div className="text-sm">
              Votre exercice est terminé. Surveillez votre boîte mail pour le récapitulatif.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Small UI helpers (single-file) ---------- */

function LabeledInput({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className={["flex flex-col gap-1", className].filter(Boolean).join(" ")}>
      {label ? (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      ) : null}
      <input
        {...props}
        className={[
          "w-full p-2 rounded border bg-white dark:bg-gray-950",
          "border-gray-200 dark:border-gray-700",
          props.className || "",
        ].join(" ")}
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel>{label}</FieldLabel>
      <input
        type="number"
        min={0}
        max={5}
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full p-2 rounded border bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700"
      />
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
      {children}
    </label>
  );
}