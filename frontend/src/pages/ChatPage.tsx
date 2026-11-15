import { ChatBot } from '@/components/ChatBot';

export function ChatPage() {
  return (
    <section className="section">
      <div className="container narrow">
        <ChatBot embedded />
      </div>
    </section>
  );
}
