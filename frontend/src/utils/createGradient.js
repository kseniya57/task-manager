export default (canvas, colors, h) => {
  const gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, h);
  const multiplier = 1 / (colors.length - 1);
  colors.forEach((color, index) => {
    gradient.addColorStop(index * multiplier, color);
  });
  return gradient;
};
