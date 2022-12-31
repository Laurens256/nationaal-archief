// regular expression to find numbers with length of 4 in string
const regex = /\d{4}/g;

const getYearsFromString = (file: Element) => {
	// haalt door middle van regexp het hoogste en laatste jaartal op uit unitdate
	const unitDate = file.getElementsByTagName('unitdate');
	let fileYearStart: number = NaN;
	let fileYearEnd: number = NaN;

	if (unitDate.length > 0) {
		let n: number | RegExpExecArray | null;

		if (unitDate[0].textContent) {
			// zolang er regex matches zijn, blijf met checken of ze hoger of lager zijn dan huidige start en end
			while ((n = regex.exec(unitDate[0].textContent)) !== null) {
				n = Number(n[0]);
				if (n < fileYearStart || !fileYearStart) {
					fileYearStart = Number(n);
				}
				if (n > fileYearEnd || !fileYearEnd) {
					fileYearEnd = Number(n);
				}
			}
		}
	}
	return { fileYearStart: fileYearStart, fileYearEnd: fileYearEnd };
};

const filterByYear = (startYear: number, endYear: number, dataset: Element[]) => {
	// filteredfiles is een array van alle files die binnen de range vallen
	const filteredFiles: Element[] = [];
	// excludedfiles zijn alle files die geen datum hebben of waarvan de datum niet gevonden kan worden (vanwege aparte formatting)
	const exludedFiles: Element[] = [];

	dataset.forEach((file) => {
		const fileYearStart = getYearsFromString(file).fileYearStart;
		const fileYearEnd = getYearsFromString(file).fileYearEnd;
		if (Number.isNaN(fileYearEnd) || Number.isNaN(fileYearStart)) {
			exludedFiles.push(file);
		} else if (fileYearStart >= startYear && fileYearEnd <= endYear) {
			filteredFiles.push(file);
		}
	});
	return { filteredFiles: filteredFiles, exludedFiles: exludedFiles };
};

export { filterByYear };
