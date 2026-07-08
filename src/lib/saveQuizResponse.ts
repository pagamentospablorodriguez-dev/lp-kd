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
    .rpc('save_quiz_completion', {
      p_email: answers.email,
      p_role: answers.role ?? null,
      p_time_since_loss: answers.timeSinceLoss ?? null,
      p_child_age: answers.childAge ?? null,
      p_child_name: answers.childName ?? null,
      p_what_miss_most: answers.whatMissMost ?? null,
      p_child_personality: answers.childPersonality ?? null,
      p_shared_moments: answers.sharedMoments ?? null,
      p_last_words: answers.lastWords ?? null,
      p_connection_type: answers.connectionType ?? null,
      p_frequency: answers.frequency ?? null,
      p_parent_age: answers.parentAge ?? null,
      p_raw_answers: answers,
    })
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
    .rpc('save_checkout_click', {
      p_email: email,
      p_plan_id: plan.planId,
      p_plan_name: plan.planName ?? null,
      p_plan_price: plan.planPrice ?? null,
      p_checkout_url: plan.checkoutUrl ?? null,
    })
    .then(({ error }) => {
      if (error) console.error('[saveCheckoutClick] erro ao salvar:', error.message);
    });
}
