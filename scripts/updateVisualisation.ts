const mainElement: HTMLElement = document.querySelector('main.visualisation-container')!;
const bar: HTMLElement = document.querySelector('.bar')!;
const percentageText: HTMLElement = document.querySelector('.percentage-text')!;
const fullFraction: HTMLElement = document.querySelector('.full-fraction')!;
const linkToArchive: HTMLAnchorElement = document.querySelector('.archivelink')!;

const yearRangeText = document.querySelector('.yearrange') as HTMLElement;

const archiefLink = 'https://www.nationaalarchief.nl/onderzoeken/archief/';

const updateVisualisation = (
	fraction: number,
	fractionOf: number,
	archiveId: string,
	yearRange?: { startYear: number; endYear: number }
) => {
	// berekent online percentage, 0 als er geen files zijn of iets anders fout gaat
	const percentage: number = parseFloat(((fraction / fractionOf) * 100).toFixed(2)) || 0;

	if (bar && percentageText && mainElement && fullFraction && linkToArchive) {
		bar.style.width = percentage + '%';
		percentageText.textContent = percentage.toLocaleString() + '%';
		fullFraction.textContent = `(${fraction} / ${fractionOf})`;
		linkToArchive.setAttribute('href', archiefLink + archiveId);
		linkToArchive.textContent = archiveId;

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
