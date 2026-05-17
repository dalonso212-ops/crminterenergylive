@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { @apply box-border; }

  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    @apply bg-slate-50 text-navy-900 antialiased;
    background-color: #F0F4FF;
  }

  /* Scrollbar */
  ::-webkit-scrollbar       { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #BFDBFE; border-radius: 9999px; }
  ::-webkit-scrollbar-thumb:hover { background: #93C5FD; }

  /* Selección */
  ::selection { background: #DBEAFE; color: #1E40AF; }
}

@layer utilities {
  .scrollbar-thin { scrollbar-width: thin; scrollbar-color: #BFDBFE transparent; }

  /* Sombra NIBA */
  .shadow-niba { box-shadow: 0 1px 4px rgba(11,31,58,.08), 0 4px 16px rgba(11,31,58,.06); }
  .shadow-niba-lg { box-shadow: 0 8px 32px rgba(11,31,58,.14), 0 2px 8px rgba(11,31,58,.08); }

  /* Glass nav effect */
  .glass-nav {
    background: rgba(11, 31, 58, 0.97);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  /* Texto gradient azul */
  .text-gradient {
    background: linear-gradient(135deg, #60A5FA, #2563EB);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Animaciones */
  .animate-fade-in  { animation: fadeIn  .2s ease-out both; }
  .animate-slide-up { animation: slideUp .25s ease-out both; }
}

@keyframes fadeIn  { from { opacity: 0 }                          to { opacity: 1 } }
@keyframes slideUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
