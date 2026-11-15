import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';
import { GlitterCursor } from '@/components/GlitterCursor';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Home } from '@/pages/Home';

// Route-level code splitting: only the home page ships in the first bundle
const AuthPage = lazy(() => import('@/pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const QuestionnairePage = lazy(() => import('@/pages/QuestionnairePage').then((m) => ({ default: m.QuestionnairePage })));
const QuestionnaireAnswerPage = lazy(() =>
  import('@/pages/QuestionnaireAnswerPage').then((m) => ({ default: m.QuestionnaireAnswerPage })),
);
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const ChatPage = lazy(() => import('@/pages/ChatPage').then((m) => ({ default: m.ChatPage })));

const fallback = (
  <section className="section page-center">
    <div className="spinner" aria-label="Loading" />
  </section>
);

function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main>
        <Suspense fallback={fallback}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage mode="login" key="login" />} />
            <Route path="/register" element={<AuthPage mode="register" key="register" />} />
            <Route path="/questionnaire" element={<QuestionnairePage />} />
            <Route path="/questionnaire-answer/:id" element={<QuestionnaireAnswerPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      {pathname !== '/chat' ? <ChatBot /> : null}
      <GlitterCursor />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
