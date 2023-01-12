const visualisationContainer: HTMLElement = document.querySelector(
	'section.visualisation-container'
)!;
const onlineProgressBar: HTMLElement = document.querySelector('.online-progress-bar')!;
const percentageText: HTMLElement = document.querySelector('.percentage-text')!;
const writtenFraction: HTMLElement = document.querySelector('.full-fraction')!;
const linkToArchive: HTMLAnchorElement = document.querySelector('.archivelink')!;

const yearRangeText = document.querySelector('.yearrange') as HTMLElement;

const archiveLink = 'https://www.nationaalarchief.nl/onderzoeken/archief/';

const updateVisualisation = (
	fraction: number,
	fractionOf: number,
	archiveId: string,
	yearRange?: { startYear: number; endYear: number }
) => {
	// berekent online percentage, 0 als er geen files zijn of iets anders fout gaat
	const percentage: number = parseFloat(((fraction / fractionOf) * 100).toFixed(2)) || 0;

	if (
		onlineProgressBar &&
		percentageText &&
		visualisationContainer &&
		writtenFraction &&
		linkToArchive
	) {
		onlineProgressBar.style.width = percentage + '%';
		percentageText.textContent = percentage.toLocaleString() + '%';
		writtenFraction.textContent = `(${fraction} / ${fractionOf})`;
		linkToArchive.setAttribute('href', archiveLink + archiveId);
		linkToArchive.textContent = archiveId;

		if (yearRangeText && yearRange) {
			yearRangeText.textContent = ` tussen ${yearRange.startYear} - ${yearRange.endYear}`;
		} else if (yearRangeText) {
			yearRangeText.textContent = '';
		}

		visualisationContainer.classList.add('data-loaded');
	}
};

const errorVisualisation = () => {
	visualisationContainer.classList.add('data-error');
};

export { updateVisualisation, errorVisualisation };
