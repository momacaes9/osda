import { useLanguage } from '@/i18n/LanguageContext';
import { REFERENCES, type CarbonResult } from '@/data/carbon';
import { carbonCategories, profiles } from '@/data/content';

export function CarbonResultView({ result }: { result: CarbonResult }) {
  const { t, language } = useLanguage();
  const c = t.calc;
  const locale = language === 'pt' ? 'pt-BR' : 'en-US';
  const tonnes = result.totalKg / 1000;
  const fmtT = (v: number) => v.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const profile = profiles[result.profile] ?? profiles.balanced;

  const categories = Object.entries(result.byCategory).toSorted((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...categories.map(([, v]) => v), 1);

  const comparisons = [
    { label: c.you, value: tonnes, you: true },
    { label: c.brazil, value: REFERENCES.brazil },
    { label: c.world, value: REFERENCES.world },
    { label: c.target, value: REFERENCES.target2030 },
  ];
  const maxCmp = Math.max(...comparisons.map((x) => x.value), 1);
  const money =
    language === 'pt'
      ? `R$ ${result.potentialSavingMoney.brl.toLocaleString('pt-BR')}`
      : `US$ ${result.potentialSavingMoney.usd.toLocaleString('en-US')}`;

  return (
    <>
      <div className="result-grid">
        <div className="card profile-card">
          <span className="kicker">{c.profile}</span>
          <h2>{profile.name[language]}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>{profile.text[language]}</p>
        </div>
        <div className="card">
          <span className="kicker">{c.result}</span>
          <div className="footprint-big">
            {fmtT(tonnes)}<small>{c.perYear}</small>
          </div>
          <div className="bars">
            {comparisons.map((x) => (
              <div className="bar-row" key={x.label}>
                <span>{x.label}</span>
                <span className="track"><span className={`fill ${x.you ? 'you' : ''}`} style={{ width: `${(x.value / maxCmp) * 100}%`, display: 'block' }} /></span>
                <span className="val">{fmtT(x.value)} t</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <span className="kicker">{c.breakdown}</span>
        <div className="bars">
          {categories.map(([key, kg]) => (
            <div className="bar-row" key={key}>
              <span>{carbonCategories[key]?.[language] ?? key}</span>
              <span className="track"><span className="fill you" style={{ width: `${(kg / maxCat) * 100}%`, display: 'block' }} /></span>
              <span className="val">{fmtT(kg / 1000)} t</span>
            </div>
          ))}
        </div>
      </div>

      {result.potentialSavingKg > 0 && (
        <div className="card saving-card">
          <span className="kicker">{c.saving}</span>
          <p style={{ margin: 0 }}>
            {c.savingText} <strong>{fmtT(result.potentialSavingKg / 1000)} t CO2e</strong> {c.perYearShort} {c.andSave}{' '}
            <strong>{money}</strong> {c.perYearShort}.
          </p>
        </div>
      )}
    </>
  );
}
