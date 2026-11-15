import { useState } from 'react';
import { IconPlay } from './Icons';

/** Shows a thumbnail and only loads the YouTube player after a click (privacy + speed). */
export function LiteYouTube({ id, title, playLabel }: { id: string; title: string; playLabel: string }) {
  const [active, setActive] = useState(false);
  return (
    <div className="video-frame">
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" width={480} height={360} />
          <button className="video-play" onClick={() => setActive(true)} aria-label={`${playLabel}: ${title}`}>
            <IconPlay />
          </button>
        </>
      )}
    </div>
  );
}
