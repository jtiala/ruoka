var translations = {
	fi: {
		closed: 'Suljettu',
		menuUnavailable: 'Menu ei saatavissa.',
		menuDownloadError: 'Menua ei voitu ladata.'
	},
	en: {
		closed: 'Closed',
		menuUnavailable: 'Menu unavailable.',
		menuDownloadError: 'Menu could not be downloaded.'
	}
}

var translate = function(name, language) {
	if (translations[language] instanceof Object && typeof translations[language][name] == 'string') {
		return translations[language][name];
	}

	return name;
};
