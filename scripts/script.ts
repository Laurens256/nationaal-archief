// dit zorgt voor een flash van unstyled content dus doen we niet
// import '../styles/style.css'
import { getArchiveData, getOnlineFileFraction } from './getArchiveDetails';
import { updateVisualisation, errorVisualisation } from './updateVisualisation';
import { filterByYear, getUndated } from './yearFilter';

// prettier-ignore
const archiveEntries = ['1.04.01','1.04.02','2.01.27.01','2.01.27.02','2.01.27.03','2.01.27.04','2.01.27.05','2.01.27.06','2.01.27.07','3.02.33','1.04.17','1.04.18.01','1.04.18.02','1.04.18.03','1.04.19','1.04.20','1.04.21','1.11.06.11','1.01.02','1.01.19.02','1.01.50','1.10.29','1.10.35.02','1.10.53','1.10.94','2.21.176','3.01.04.01','3.01.09','3.01.14','3.01.18','3.01.19','3.01.22','3.01.25','3.01.26','3.20.57','1.01.46','1.01.47.04','1.01.47.05','1.01.47.11','1.01.47.17','1.01.47.19','1.01.47.21','1.01.47.22','1.01.47.29','1.01.47.40','1.10.11.02','2.21.004.04','1.10.10','1.10.13','1.10.31','1.10.39','1.10.46','1.10.48','1.10.57','1.10.59','1.10.69','1.10.83','3.20.16','3.20.52','1.10.03','1.10.05.05','1.10.32','1.11.06.03','2.21.046','1.10.05.01','1.10.05.02','1.10.05.03','1.10.05.04','1.10.23','1.10.30','1.10.45','1.10.67','1.10.75.01','1.10.78','1.10.79','1.10.82','1.10.86','1.10.100','1.10.106','1.11.06.04','2.21.006.48','2.21.004.21','2.21.006.49','2.21.010','2.21.040','1.04.23','1.11.01.01','1.13.04','1.13.24','2.21.007.58','4.VEL','4.VELH','4.AANW','4.OBPV','4.MIKO','4.TOPO','2.21.021','2.21.153','2.21.204','2.21.271','2.21.317','4.JSF','4.VMF'];

const params = new URLSearchParams(location.search);
const archiveId = params.get('id')!;

if (!archiveId) {
	window.location.href = `${window.location.pathname}?id=${archiveEntries[0]}`;
}

const undatedSpan: HTMLSpanElement = document.querySelector('.undated-counter')!;
const maxYearRangeText = document.querySelector('.year-range-label') as HTMLElement;

const yearFilterForm: HTMLFormElement = document.querySelector('form')!;
const yearFilterInput: HTMLInputElement = document.querySelector(
	'.year-filter-form #year-filter'
)!;
const clearYearFilter: HTMLButtonElement = document.querySelector('.clearyearfilter')!;

const linkSection = document.querySelector('.linksection') as HTMLButtonElement;

let currentData: { fraction: Element[]; fractionOf: Element[] };
let archiveYearRange = { min: NaN, max: NaN };

const buildArchiveLinks = () => {
	archiveEntries.forEach((entry) => {
		const anchorElement = document.createElement('a');
		anchorElement.href = `${window.location.pathname}?id=${entry}`;
		anchorElement.textContent = entry;
		// regex om alle punten uit archief id weg te halen
		anchorElement.classList.add(`_${entry.replace(/\./g, '')}`);
		linkSection.appendChild(anchorElement);
	});
};
// buildArchiveLinks();
document.querySelector(`._${archiveId.replace(/\./g, '')}`)?.classList.add('current');

const getArchive = async () => {
	currentData = await getArchiveData(archiveId);

	if (currentData.fraction.length === 0 && currentData.fractionOf.length === 0) {
		errorVisualisation();
	} else {
		setMinMaxYears(currentData.fractionOf);
		updateVisualisation(currentData.fraction.length, currentData.fractionOf.length);

		maxYearRangeText.innerHTML = `tussen <strong>${archiveYearRange.min}</strong> en <strong>${archiveYearRange.max}</strong>`;
		const undated = getUndated(currentData.fractionOf);
		if (undated > 0) {
			undatedSpan.innerHTML = `Let op: <strong>${undated.toString()}</strong> van de archiefbestanden zijn ongedateerd.`;
		}
	}
};

const setMinMaxYears = (data: Element[]) => {
	let minYear: number = NaN;
	let maxYear: number = NaN;
	data.forEach((file) => {
		const fileMinYear = Number(file.getAttribute('minyear'));
		const fileMaxYear = Number(file.getAttribute('maxyear'));

		if (fileMinYear < minYear || isNaN(minYear)) {
			minYear = fileMinYear;
		}
		if (fileMaxYear > maxYear || isNaN(maxYear)) {
			maxYear = fileMaxYear;
		}
	});

	if (!isNaN(minYear) && !isNaN(maxYear)) {
		archiveYearRange = { min: minYear, max: maxYear };
		yearFilterInput.placeholder = `Tussen: ${minYear}-${maxYear}`
		// genereert een random range tussen min en max voor de gein lol
		// const halfRange = Math.round((maxYear - minYear) / 2);
		// yearFilterInput.placeholder = `Bijv: ${Math.floor(
		// 	Math.random() * (maxYear - halfRange - minYear + 1) + minYear
		// )}-${Math.floor(
		// 	Math.random() * (maxYear - halfRange - minYear + 1) + minYear + halfRange
		// )}`;
	}
};

const chooseYearRange = (startYear: number, endYear: number) => {
	const filteredFiles = filterByYear(startYear, endYear, currentData.fractionOf);
	const onlineFilteredFiles = getOnlineFileFraction(filteredFiles);

	clearYearFilter.classList.add('active');
	updateVisualisation(
		onlineFilteredFiles.fraction.length,
		onlineFilteredFiles.fractionOf.length,
		{
			startYear: startYear,
			endYear: endYear
		}
	);
};

const refreshYears = () => {
	yearFilterInput.value = '';
	clearYearFilter.classList.remove('active');
	updateVisualisation(currentData.fraction.length, currentData.fractionOf.length);
};

const validateUserFilter = (e: SubmitEvent) => {
	e.preventDefault();

	let startYear = NaN;
	let endYear = NaN;
	// regex filtert alles behalve 0-9, - / | \ en spatie en vervangt het met een leeg karakter
	const userInput = yearFilterInput.value.replace(/[^0-9-/|\\ ]/g, '');

	try {
		startYear = Number(userInput);
		endYear = Number(userInput);
		if (isNaN(startYear) || isNaN(endYear)) {
			throw new Error();
		}
	} catch {
		try {
			// regex split op - / | \ en spatie en filtert de lege strings eruit
			const yearArray = userInput.split(/[-/|\\ ]/g).filter((el) => el !== '');

			startYear = Number(yearArray[0]);
			endYear = Number(yearArray[1]);
			if (isNaN(startYear) || isNaN(endYear)) {
				throw new Error();
			}
		} catch {
			return;
		}
	}

	if (
		startYear > endYear ||
		startYear < archiveYearRange.min ||
		endYear > archiveYearRange.max ||
		startYear > archiveYearRange.max ||
		endYear < archiveYearRange.min
	) {
		return;
	}
	if (startYear == endYear) {
		yearFilterInput.value = startYear.toString();
	} else {
		yearFilterInput.value = `${startYear}-${endYear}`;
	}
	chooseYearRange(startYear, endYear);
};

yearFilterForm.addEventListener('submit', validateUserFilter);
clearYearFilter.addEventListener('click', refreshYears);

getArchive();
