export function maximumBy<Element, Value>(
  elements: Array<Element>,
  compareFn: (x: Element, y: Element) => number,
): Element | undefined {
  if (elements.length === 0) {
    return undefined;
  }

  let maximumElement = elements[0];

  for (const element of elements) {
    if (compareFn(maximumElement, element) < 0) {
      maximumElement = element;
    }
  }

  return maximumElement;
}
