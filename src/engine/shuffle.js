/**
 * Fisher-Yates shuffle — returns a new shuffled array, never mutates input.
 * @param {Array} arr
 * @returns {Array}
 */
export function shuffle(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
