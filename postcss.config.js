const postcssViewportFallback = () => ({
  postcssPlugin: 'postcss-viewport-fallback',
  Declaration(decl) {
    const fallback = decl.value.replace(
      /(-?(?:\d+\.\d+|\d+|\.\d+))\s*(dvh|svh|lvh)(?![a-zA-Z])/g,
      '$1vh'
    );
    if (fallback !== decl.value) {
      decl.cloneBefore({ value: fallback });
    }
  },
});
postcssViewportFallback.postcss = true;

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-viewport-fallback': postcssViewportFallback(),
  },
};
