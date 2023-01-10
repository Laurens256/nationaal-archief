const mainElement = document.querySelector('main.visualisation-container') as HTMLElement;
const bar = document.querySelector('.bar') as HTMLElement;
const percentageText = document.querySelector('.percentage-text') as HTMLElement;
const fullFraction = document.querySelector('.full-fraction') as HTMLElement;
const anchorElement = document.querySelector('a') as HTMLAnchorElement;

const yearRangeText = document.querySelector('.yearrange') as HTMLElement;

const selectElement: HTMLSelectElement = document.querySelector('select')!;
const archiefLink = 'https://www.nationaalarchief.nl/onderzoeken/archief/';

const updateVisualisation = (
	fraction: number,
	fractionOf: number,
	yearRange?: { startYear: number; endYear: number }
) => {
	console.log(fractionOf, fraction);
	const percentage: number = parseFloat(((fraction / fractionOf) * 100).toFixed(2)) || 0;

	if (bar && percentageText && mainElement && fullFraction && anchorElement) {
		console.log(percentage);
		bar.style.width = percentage + '%';
		percentageText.textContent = percentage.toLocaleString() + '%';
		fullFraction.textContent = `(${fraction} / ${fractionOf})`;
		anchorElement.setAttribute('href', archiefLink + selectElement.value);
		anchorElement.textContent = selectElement.value;

		if (yearRangeText && yearRange) {
			yearRangeText.textContent = ` tussen ${yearRange.startYear} - ${yearRange.endYear}`;
		} else if (yearRangeText) {
			yearRangeText.textContent = '';
		}

		mainElement.classList.add('data-loaded');
	}
};

const errorVisualisation = () => {
	mainElement.classList.add('data-error');
};

export { updateVisualisation, errorVisualisation };
