// Tailwind 設定：掃描 index.html 內所有 class（含 JS 樣板字串）
const path = require('path');

module.exports = {
  content: [path.join(__dirname, '..', 'index.html')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif'],
      },
    },
  },
};
