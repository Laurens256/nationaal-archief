// dit zorgt voor een flash van unstyled content dus doen we niet
// import '../styles/style.css'
import { getArchive, getOnlineFileFraction } from './getArchiveDetails';
import { updateVisualisation, errorVisualisation } from './updateVisualisation';
import { getYearsFromString, filterByYear } from './yearFilter';

// prettier-ignore
const archiveEntries = ['1.04.01','1.04.02','2.01.27.01','2.01.27.02','2.01.27.03','2.01.27.04','2.01.27.05','2.01.27.06','2.01.27.07','3.02.33','1.04.17','1.04.18.01','1.04.18.02','1.04.18.03','1.04.19','1.04.20','1.04.21','1.11.06.11','1.01.02','1.01.19.02','1.01.50','1.10.29','1.10.35.02','1.10.53','1.10.94','2.21.176','3.01.04.01','3.01.09','3.01.14','3.01.18','3.01.19','3.01.22','3.01.25','3.01.26','3.20.57','1.01.46','1.01.47.04','1.01.47.05','1.01.47.11','1.01.47.17','1.01.47.19','1.01.47.21','1.01.47.22','1.01.47.29','1.01.47.40','1.10.11.02','2.21.004.04','1.10.10','1.10.13','1.10.31','1.10.39','1.10.46','1.10.48','1.10.57','1.10.59','1.10.69','1.10.83','3.20.16','3.20.52','1.10.03','1.10.05.05','1.10.32','1.11.06.03','2.21.046','1.10.05.01','1.10.05.02','1.10.05.03','1.10.05.04','1.10.23','1.10.30','1.10.45','1.10.67','1.10.75.01','1.10.78','1.10.79','1.10.82','1.10.86','1.10.100','1.10.106','1.11.06.04','2.21.006.48','2.21.004.21','2.21.006.49','2.21.010','2.21.040','2.21.317','1.04.23','1.11.01.01','1.13.04','1.13.24','2.21.007.58','4.VEL','4.VELH','4.AANW','4.OBPV','4.MIKO','4.TOPO','2.21.021','2.21.153','2.21.204','2.21.271','2.21.317','4.JSF','4.VMF'];

const selectElement = document.querySelector('select') as HTMLSelectElement;
const minYearSpan = document.querySelector('.minyear') as HTMLSpanElement;
const maxYearSpan = document.querySelector('.maxyear') as HTMLSpanElement;
const undatedSpan = document.querySelector('.undatedcounter') as HTMLSpanElement;

const yearFrom = document.querySelector('label:first-of-type input') as HTMLInputElement;
const yearTo = document.querySelector('label:last-of-type input') as HTMLInputElement;
const submitYearFilter = document.querySelector('.submityearfilter') as HTMLButtonElement;
const clearYearFilter = document.querySelector('.clearyearfilter') as HTMLButtonElement;

let fullDataset: Element[] = [];
let currentData: { fraction: Element[]; fractionOf: Element[] };

(() => {
	archiveEntries.forEach((entry) => {
		const option = document.createElement('option');
		option.value = entry;
		option.textContent = entry;
		selectElement.appendChild(option);
	});
})();

const changeArchive = async () => {
	currentData = await getArchive();

	if (currentData.fraction.length === 0 && currentData.fractionOf.length === 0) {
		errorVisualisation();
	} else {
		fullDataset = currentData.fractionOf;
		setMinMaxYears(currentData.fractionOf);
		updateVisualisation(currentData.fraction.length, currentData.fractionOf.length);
	}
};

const setMinMaxYears = (data: Element[]) => {
	let minYear: number = NaN;
	let maxYear: number = NaN;
	data.forEach((file) => {
		const years = getYearsFromString(file);
		if (years.fileYearStart && years.fileYearEnd) {
			if (years.fileYearStart < minYear || isNaN(minYear)) {
				minYear = years.fileYearStart;
			}
			if (years.fileYearEnd > maxYear || isNaN(maxYear)) {
				maxYear = years.fileYearEnd;
			}
		}
	});

	minYearSpan.textContent = minYear.toString();
	maxYearSpan.textContent = maxYear.toString();
	yearFrom.min = minYear.toString();
	yearFrom.max = maxYear.toString();
	yearTo.min = minYear.toString();
	yearTo.max = maxYear.toString();
};

const chooseYearRange = () => {
	if (
		!yearFrom.value ||
		!yearTo.value ||
		Number(yearFrom.value) > Number(yearTo.value) ||
		Number(yearFrom.value) < Number(yearFrom.min) ||
		Number(yearTo.value) < Number(yearFrom.min) ||
		Number(yearFrom.value) > Number(yearFrom.max) ||
		Number(yearTo.value) > Number(yearFrom.max)
	) {
		return;
	}

	const startYear = Number(yearFrom.value);
	const endYear = Number(yearTo.value);
	const data = filterByYear(startYear, endYear, fullDataset);

	const datasetByYear = getOnlineFileFraction(data.filteredFiles);

	updateVisualisation(datasetByYear.fraction.length, datasetByYear.fractionOf.length, {
		startYear: startYear,
		endYear: endYear
	});
	undatedSpan.textContent = data.exludedFiles.length.toString();
};

const refreshYears = () => {
	yearFrom.value = '';
	yearTo.value = '';
	updateVisualisation(currentData.fraction.length, currentData.fractionOf.length);
};

selectElement.addEventListener('change', changeArchive);
submitYearFilter.addEventListener('click', chooseYearRange);
clearYearFilter.addEventListener('click', refreshYears);

changeArchive();
