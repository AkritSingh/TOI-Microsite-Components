import analyticsWrapper from './analyticsWrapper';

export default function gaWrapper(...args) {
  analyticsWrapper('gaAndGrx', ...args);
}
