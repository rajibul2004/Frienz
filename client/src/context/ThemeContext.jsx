import { createContext, useState, useContext, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'synthwave';
  });

  useEffect(() => {
    // Remove all theme classes
    const root = document.documentElement;
    root.classList.remove('forest', 'synthwave', 'midnight', 'milky', 'aqua', 'luxury');
    
    // Add selected theme class
    root.classList.add(theme);
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const themes = ['forest', 'synthwave', 'midnight', 'milky', 'aqua', 'luxury'];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};