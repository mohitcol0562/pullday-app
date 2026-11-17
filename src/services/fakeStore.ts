// Stands in for a real in-app-purchase SDK during the mock-data phase.
// Simulates the network latency and occasional failure of a real store,
// without talking to Apple/Google or any real payment provider.
const PURCHASE_DELAY_MS = 1200;
const FAILURE_RATE = 0.2;

export type FakeStoreResult = 'succeeded' | 'failed';

export function runFakePurchase(signal: { cancelled: boolean }): Promise<FakeStoreResult> {
  return new Promise(resolve => {
    setTimeout(() => {
      if (signal.cancelled) {
        return;
      }
      resolve(Math.random() < FAILURE_RATE ? 'failed' : 'succeeded');
    }, PURCHASE_DELAY_MS);
  });
}
