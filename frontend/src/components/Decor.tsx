/** Organic background shapes inspired by the OSDA slides: soft blobs + hand-drawn lines. */
export function Decor({ variant = 'a' }: { variant?: 'a' | 'b' }) {
  return (
    <div className="blobs" aria-hidden="true">
      {variant === 'a' ? (
        <>
          <span className="blob" style={{ width: 420, height: 380, top: -140, left: -160 }} />
          <span className="blob b2" style={{ width: 360, height: 420, bottom: -200, right: -120 }} />
          <svg className="squiggle" style={{ top: 20, right: 0, width: 520, height: 260 }} viewBox="0 0 520 260">
            <path d="M10 30c120 10 210 60 300 120s160 80 200 60" />
            <path d="M60 10c110 20 180 70 260 130s150 90 190 90" />
          </svg>
          <svg className="squiggle" style={{ bottom: 0, left: 0, width: 320, height: 300 }} viewBox="0 0 320 300">
            <path d="M0 40c90 40 160 120 200 200s50 60 70 60" />
          </svg>
        </>
      ) : (
        <>
          <span className="blob b2" style={{ width: 300, height: 280, top: -120, right: -80 }} />
          <span className="blob" style={{ width: 260, height: 300, bottom: -160, left: -100 }} />
          <svg className="squiggle" style={{ bottom: 10, right: 20, width: 280, height: 220 }} viewBox="0 0 280 220">
            <path d="M270 10c-40 60-90 100-150 130S30 190 10 215" />
          </svg>
        </>
      )}
    </div>
  );
}
