import { toast } from 'sonner';

export function notifyNewEpoch(params: { duelName?: string; epochNumber?: number }) {
  const title = 'New Battle Started';
  const msg = params.duelName
    ? `${params.duelName} — Epoch ${params.epochNumber ?? ''}`
    : `Epoch ${params.epochNumber ?? ''} has started`;
  toast.info(msg || title, { richColors: true });
}

export function notifyEpochSettled(params: {
  duelName?: string;
  epochNumber?: number;
  winnerLabel?: string;
}) {
  const msg = params.duelName
    ? `${params.duelName} — Epoch ${params.epochNumber ?? ''} settled • Winner: ${params.winnerLabel ?? '—'}`
    : `Epoch ${params.epochNumber ?? ''} settled • Winner: ${params.winnerLabel ?? '—'}`;
  toast.success(msg, { richColors: true });
}

export function notifyBetPlacedSuccess(params: { sideLabel: string; amount: number }) {
  toast.success(`Bet placed: ${params.amount} on ${params.sideLabel}`, { richColors: true });
}

export function notifyBetPlacedFail(params: { error?: string }) {
  toast.error(`Bet failed${params.error ? `: ${params.error}` : ''}`, { richColors: true });
}

export function notifyBetOutcome(params: { won: boolean; amount: number; sideLabel: string }) {
  if (params.won) {
    toast.success(`You won! ${params.amount} on ${params.sideLabel}`, { richColors: true });
  } else {
    toast(`You lost ${params.amount} on ${params.sideLabel}`, { richColors: true });
  }
}

export function notifySocketError(message: string) {
  toast.error(`Connection error: ${message}`);
}


