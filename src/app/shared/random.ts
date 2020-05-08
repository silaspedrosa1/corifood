export function sampleArray(array: any[]) {
  const indexFloat = Math.random() * array.length;
  const roundedIndex = Math.floor(indexFloat);
  return array[roundedIndex];
}

export function sampleInRange(start: number, end: number) {
  const diff = end - start;
  const offset = Math.random() * diff;
  const roundedOffset = Math.floor(offset);
  return start + roundedOffset;
}
