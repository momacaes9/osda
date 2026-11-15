import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { aiService } from '@/services/aiService';
import type { ChatMessage } from '@/services/types';
import { Logo } from './Logo';

const STORAGE_KEY = 'osda.chat';

function loadHistory(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

/** Opens the floating chat and sends a message from anywhere in the app. */
// eslint-disable-next-line react-refresh/only-export-components
export function askChat(message: string) {
  window.dispatchEvent(new CustomEvent('osda:chat', { detail: message }));
}

export function ChatBot({ embedded = false }: { embedded?: boolean }) {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(embedded);
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore */
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setError(false);
    setLoading(true);
    try {
      const answer = await aiService.chat(next, language);
      setMessages((m) => [...m, { role: 'assistant', content: answer }]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (embedded) return;
    const handler = (e: Event) => {
      setOpen(true);
      void send((e as CustomEvent<string>).detail);
    };
    window.addEventListener('osda:chat', handler);
    return () => window.removeEventListener('osda:chat', handler);
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  if (!open) {
    return (
      <button className="chat-fab" aria-label={t.chat.open} onClick={() => setOpen(true)}>
        <span aria-hidden="true">💬</span>
      </button>
    );
  }

  return (
    <section className={embedded ? 'chat chat-embedded' : 'chat chat-floating'} aria-label={t.chat.title}>
      <div className="chat-header">
        <Logo size={34} />
        <div>
          <strong>{t.chat.title}</strong>
          <span className="muted small">{t.chat.subtitle}</span>
        </div>
        <div className="chat-actions">
          {messages.length > 0 && (
            <button className="link-btn" onClick={() => setMessages([])}>{t.chat.clear}</button>
          )}
          {!embedded && (
            <button className="icon-btn" aria-label={t.chat.close} onClick={() => setOpen(false)}>✕</button>
          )}
        </div>
      </div>

      <div className="chat-messages" ref={listRef}>
        <div className="msg assistant">{t.chat.welcome}</div>
        {messages.length === 0 && (
          <div className="suggestions">
            {t.chat.suggestions.map((s) => (
              <button key={s} className="chip" onClick={() => void send(s)}>{s}</button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>{m.content}</div>
        ))}
        {loading && (
          <div className="msg assistant typing" aria-label="…">
            <span /><span /><span />
          </div>
        )}
        {error && <div className="msg error">{t.chat.error}</div>}
      </div>

      <form className="chat-input" onSubmit={onSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chat.placeholder}
          maxLength={2000}
          aria-label={t.chat.placeholder}
        />
        <button className="btn btn-primary" disabled={loading || !input.trim()}>{t.chat.send}</button>
      </form>
    </section>
  );
}
