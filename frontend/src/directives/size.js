const createSizeBinding = (name, prop) => ({
  name,
  handler: (el, binding) => {
    el.style[prop] = `${binding.value}rem`;
  }
});

export const size = createSizeBinding('mb', 'marginBottom');
export const mr = createSizeBinding('mr', 'marginRight');
export const ml = createSizeBinding('ml', 'marginLeft');
export const p = createSizeBinding('p', 'padding');
