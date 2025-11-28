import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-950 bg-opacity-60 hover:bg-green-600 border border-green-700 hover:border-green-500 transition-colors text-white">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-green-950 bg-opacity-90 backdrop-blur-md border border-green-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-green-600 transition-colors first:rounded-t-lg last:rounded-b-lg ${
              i18n.language === language.code ? 'bg-green-600 text-white' : 'text-green-200'
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {i18n.language === language.code && (
              <span className="ml-auto text-green-300">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;