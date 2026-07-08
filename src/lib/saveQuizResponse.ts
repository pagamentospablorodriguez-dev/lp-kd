import { supabase } from './supabase';
import { QuizAnswers } from '../App';

interface CheckoutInfo {
  planId: string;
  planName?: string;
  planPrice?: string;
  checkoutUrl?: string;
}

/**
 * Salva (ou atualiza, se o email já existir) todas as respostas do quiz.
 * Chamado no momento em que a pessoa termina o quiz e informa o email.
 * Fire-and-forget: nunca trava a navegação do usuário, mesmo se falhar.
 */
export function saveQuizCompletion(answers: QuizAnswers) {
  if (!answers.email) return;

  supabase
    .from('quiz_responses')
    .upsert(
      {
        email: answers.email,
        role: answers.role ?? null,
        time_since_loss: answers.timeSinceLoss ?? null,
        child_age: answers.childAge ?? null,
        child_name: answers.childName ?? null,
        what_miss_most: answers.whatMissMost ?? null,
        child_personality: answers.childPersonality ?? null,
        shared_moments: answers.sharedMoments ?? null,
        last_words: answers.lastWords ?? null,
        connection_type: answers.connectionType ?? null,
        frequency: answers.frequency ?? null,
        parent_age: answers.parentAge ?? null,
        raw_answers: answers,
        status: 'quiz_completed',
      },
      { onConflict: 'email' }
    )
    .then(({ error }) => {
      if (error) console.error('[saveQuizCompletion] erro ao salvar:', error.message);
    });
}

/**
 * Atualiza a linha da pessoa com o plano que ela clicou no paywall.
 * Chamado no momento do clique no botão de compra, antes do redirect.
 */
export function saveCheckoutClick(email: string, plan: CheckoutInfo) {
  if (!email) return;

  supabase
    .from('quiz_responses')
    .upsert(
      {
        email,
        selected_plan_id: plan.planId,
        selected_plan_name: plan.planName ?? null,
        selected_plan_price: plan.planPrice ?? null,
        checkout_url: plan.checkoutUrl ?? null,
        checkout_clicked_at: new Date().toISOString(),
        status: 'checkout_clicked',
      },
      { onConflict: 'email' }
    )
    .then(({ error }) => {
      if (error) console.error('[saveCheckoutClick] erro ao salvar:', error.message);
    });
}
