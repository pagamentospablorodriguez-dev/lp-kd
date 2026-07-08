import { useState } from 'react';
import QuizPage from './pages/QuizPage';
import PaywallPage from './pages/PaywallPage';
export type QuizAnswers = {
  role?: string;
  timeSinceLoss?: string;
  childAge?: string;
  childName?: string;
  childGender?: string;
  whatMissMost?: string[];
  childPersonality?: string[];
  sharedMoments?: string;
  lastWords?: string;
  connectionType?: string[];
  frequency?: string;
  parentAge?: string;
  email?: string;
};
export type AppPage = 'quiz' | 'paywall';
export default function App() {
  const [page, setPage] = useState<AppPage>('quiz');
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const goToPaywall = (finalAnswers: QuizAnswers) => {
    setAnswers(finalAnswers);
    setPage('paywall');
    window.scrollTo(0, 0);
  };
  return (
    <>
      {page === 'quiz' && <QuizPage onComplete={goToPaywall} />}
      {page === 'paywall' && <PaywallPage answers={answers} />}
    </>
  );
}
