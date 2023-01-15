// regular expression to find numbers with length of 4 in string
const regex = /\d{4}/g;

const getYearsFromString = (file: Element) => {
	// haalt door middel van regexp het hoogste en laatste jaartal op uit unitdate
	const unitDate = file.getElementsByTagName('unitdate');
	let fileYearStart: number = NaN;
	let fileYearEnd: number = NaN;

	if (unitDate.length > 0) {
		let n: number | RegExpExecArray | null = NaN;

		if (unitDate[0].textContent) {
			// zolang er regex matches zijn, blijf met checken of ze hoger of lager zijn dan huidige start en end
			while ((n = regex.exec(unitDate[0].textContent)) !== null) {
				n = Number(n[0]);
				if (n < fileYearStart || isNaN(fileYearStart)) {
					fileYearStart = Number(n);
				}
				if (n > fileYearEnd || isNaN(fileYearEnd)) {
					fileYearEnd = Number(n);
				}
			}
		}
	}
	return { fileYearStart: fileYearStart, fileYearEnd: fileYearEnd };
};

const filterByYear = (
	startYear: number,
	endYear: number,
	dataset: Element[]
): Element[] => {
	// filteredfiles is een array van alle files die binnen de range vallen
	const filteredFiles: Element[] = [];

	dataset.forEach((file) => {
		const fileYearStart = Number(file.getAttribute('minyear'));
		const fileYearEnd = Number(file.getAttribute('maxyear'));

		// code voor wanneer unitdates in ISO-8601 formaat staan
		// const unitDate = file
		// .getElementsByTagName('unitdate')[0]
		// ?.textContent?.replace(/\*/g, '');

		// let fileYearEnd: number = NaN;
		// let fileYearStart: number = NaN;

		// if (unitDate) {
		// 	try {
		// 		fileYearStart = Number(JSON.parse(unitDate)['lte'].split('-')[0]);
		// 		fileYearEnd = Number(JSON.parse(unitDate)['gte'].split('-')[0]);
		// 	} catch {
		// 		fileYearStart = Number(unitDate?.split('T')[0]);
		// 		fileYearEnd = Number(unitDate?.split('T')[0]);
		// 	}
		// }

		if (
			!isNaN(fileYearStart) &&
			!isNaN(fileYearEnd) &&
			fileYearStart <= endYear &&
			fileYearEnd >= startYear
		) {
			filteredFiles.push(file);
		}
	});
	return filteredFiles;
};

const getUndated = (files: Element[]): number => {
	let undated = 0;
	files.forEach((file) => {
		// code voor wanneer unitdates in ISO-8601 formaat staan
		// const unitDate = file
		// .getElementsByTagName('unitdate')[0]
		// ?.textContent?.replace(/\*/g, '');

		// let minYear: number = NaN;
		// let maxYear: number = NaN;

		// if (unitDate) {
		// 	try {
		// 		fileYearStart = Number(JSON.parse(unitDate)['lte'].split('-')[0]);
		// 		fileYearEnd = Number(JSON.parse(unitDate)['gte'].split('-')[0]);
		// 	} catch {
		// 		fileYearStart = Number(unitDate?.split('T')[0]);
		// 		fileYearEnd = Number(unitDate?.split('T')[0]);
		// 	}
		// }

		const minYear = Number(file.getAttribute('minyear'));
		const maxYear = Number(file.getAttribute('maxyear'));
		if (isNaN(minYear) || isNaN(maxYear)) undated++;
	});
	return undated;
};

export { getYearsFromString, filterByYear, getUndated };
