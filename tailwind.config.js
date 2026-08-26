/** ============================================================
 *  Config do Tailwind — usada APENAS no build opcional de produção
 *  (veja "Build opcional" no README.md).
 *  Deve espelhar o `tailwind.config` inline do index.html.
 *  ============================================================ */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        viva:     '#2C5450', // verde âncora
        nude:     '#C9A47E', // nude dourado (destaques)
        cream:    '#F7F2EC', // off-white quente (seções claras)
        sage:     '#7A9691', // verde claro secundário
        mist:     '#E9EFEC', // lavagem clara de sage
        graphite: '#33322F', // texto longo
        whats:    '#25D366'  // verde WhatsApp (exclusivo dos botões)
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Cormorant Fallback"', 'Georgia', 'serif'],
        sans:  ['Montserrat', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px -14px rgba(44,84,80,.25)',
        lift: '0 18px 40px -18px rgba(44,84,80,.35)'
      },
      maxWidth: { content: '1180px' },
      screens: { xs: '400px' }
    }
  },
  plugins: []
};
