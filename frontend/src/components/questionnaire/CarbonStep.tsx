import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaire } from './QuestionnaireManager';
import { useLanguage } from '@/i18n/LanguageContext';
import { QuestionnaireService } from '@/services/questionnaireService';
import { calculateCarbon, LIMITS, type CarFuel, type CarbonInputs, type Grid } from '@/data/carbon';
import { IconBag, IconCar, IconHome, IconPlane } from '@/components/Icons';

type NumericKey = keyof typeof LIMITS;

function Slider({ id, label, unit, value, onChange, hint }: {
  id: NumericKey; label: string; unit: string; value: number; onChange: (v: number) => void; hint?: string;
}) {
  const [min, max, step] = LIMITS[id];
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div className="slider-row">
      <label htmlFor={id}>
        <span>{label}</span>
        <output htmlFor={id}>{value} {unit}</output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--fill' as string]: `${fill}%` }}
      />
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

function Chips<T extends string>({ label, options, value, onChange }: {
  label: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="slider-row" role="group" aria-label={label}>
      <span className="label">{label}</span>
      <div className="chips">
        {options.map((o) => (
          <button key={o.value} type="button" className="chip" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const STEPS = ['transport', 'travel', 'home', 'foodShopping'] as const;
const STEP_ICONS = [IconCar, IconPlane, IconHome, IconBag];

export function CarbonStep() {
  const { carbon, setCarbon, answers, setPhase } = useQuestionnaire();
  const { t, language } = useLanguage();
  const c = t.calc;
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // derived during render — no effect needed
  const live = calculateCarbon(carbon, answers[4]);
  const tonnes = (live.totalKg / 1000).toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const set = <K extends keyof CarbonInputs>(k: K) => (v: CarbonInputs[K]) => setCarbon(k, v);
  const StepIcon = STEP_ICONS[step];
  const isLast = step === STEPS.length - 1;
  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      const result = await QuestionnaireService.submit(answers, language, carbon);
      navigate(`/questionnaire-answer/${result.id}`);
    } catch (e) {
      setError((e as Error).message || t.errors.generic);
      setSaving(false);
    }
  };

  const fuels: CarFuel[] = ['none', 'gasoline', 'ethanol', 'diesel', 'hybrid', 'electric'];
  const grids: Grid[] = ['brazil', 'world'];

  return (
    <>
      <div className="part-label"><span>{c.part2}</span><span>2 / 2</span></div>
      <div className="card question-card">
        <div className="calc-head">
          <div>
            <span className="badge"><StepIcon size={14} /> {c[STEPS[step]]}</span>
            <h2 className="question-title">{c[STEPS[step]]}</h2>
          </div>
          <div className="live-meter" aria-live="polite">
            <span>{c.estimate}</span>
            <strong>{tonnes}</strong>
            <span>{c.perYear}</span>
          </div>
        </div>

        <div className="sliders">
          {step === 0 && (
            <>
              <Chips
                label={c.carFuel}
                value={carbon.carFuel}
                onChange={set('carFuel')}
                options={fuels.map((f) => ({ value: f, label: c.fuels[f] }))}
              />
              {carbon.carFuel !== 'none' && (
                <Slider id="carKmPerWeek" label={c.carKm} unit={c.units.km} value={carbon.carKmPerWeek} onChange={set('carKmPerWeek')} />
              )}
              <Slider id="transitHoursPerWeek" label={c.transit} unit={c.units.h} value={carbon.transitHoursPerWeek} onChange={set('transitHoursPerWeek')} />
            </>
          )}
          {step === 1 && (
            <>
              <Slider id="shortFlightsPerYear" label={c.shortFlights} unit={c.units.trips} value={carbon.shortFlightsPerYear} onChange={set('shortFlightsPerYear')} />
              <Slider id="longFlightsPerYear" label={c.longFlights} unit={c.units.trips} value={carbon.longFlightsPerYear} onChange={set('longFlightsPerYear')} />
            </>
          )}
          {step === 2 && (
            <>
              <Chips label={c.grid} value={carbon.grid} onChange={set('grid')} options={grids.map((g) => ({ value: g, label: c.grids[g] }))} />
              <Slider id="electricityKwhPerMonth" label={c.kwh} unit={c.units.kwh} value={carbon.electricityKwhPerMonth} onChange={set('electricityKwhPerMonth')} hint={c.kwhHint} />
              <Slider id="gasCylindersPerYear" label={c.gas} unit={c.units.cyl} value={carbon.gasCylindersPerYear} onChange={set('gasCylindersPerYear')} />
            </>
          )}
          {step === 3 && (
            <>
              <Slider id="redMeatMealsPerWeek" label={c.redMeat} unit={c.units.meals} value={carbon.redMeatMealsPerWeek} onChange={set('redMeatMealsPerWeek')} />
              <Slider id="whiteMeatMealsPerWeek" label={c.whiteMeat} unit={c.units.meals} value={carbon.whiteMeatMealsPerWeek} onChange={set('whiteMeatMealsPerWeek')} />
              <Slider id="newClothesPerMonth" label={c.clothes} unit={c.units.items} value={carbon.newClothesPerMonth} onChange={set('newClothesPerMonth')} />
              <Slider id="electronicsPerYear" label={c.electronics} unit={c.units.items} value={carbon.electronicsPerYear} onChange={set('electronicsPerYear')} />
            </>
          )}
        </div>

        <div className="progress-meta">
          <span className="accent">{c.step} {step + 1} {t.q.of} {STEPS.length}</span>
          <span className="muted">{progress}% {t.q.complete}</span>
        </div>
        <div className="progress" aria-hidden="true">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {error && <p className="form-error" style={{ marginTop: 16 }}>{error}</p>}

        <div className="question-nav">
          <button className="btn btn-ghost" onClick={() => (step === 0 ? setPhase('habits') : setStep(step - 1))}>
            ‹ {t.q.previous}
          </button>
          {isLast ? (
            <button className="btn btn-primary" onClick={submit} disabled={saving}>
              {saving ? t.q.saving : t.q.finish}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
              {t.q.next} ›
            </button>
          )}
        </div>
      </div>
      <p className="muted small" style={{ marginTop: 14 }}>{c.methodText}</p>
    </>
  );
}
