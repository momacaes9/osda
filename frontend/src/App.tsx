import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';
import { Home } from '@/pages/Home';
import { AuthPage } from '@/pages/AuthPage';
import { QuestionnairePage } from '@/pages/QuestionnairePage';
import { QuestionnaireAnswerPage } from '@/pages/QuestionnaireAnswerPage';
import { Dashboard } from '@/pages/Dashboard';
import { ChatPage } from '@/pages/ChatPage';

function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="app">
      <Header />
      <main>
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
      </main>
      <Footer />
      {pathname !== '/chat' && <ChatBot />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
