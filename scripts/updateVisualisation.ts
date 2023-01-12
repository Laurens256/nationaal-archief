const visualisationContainer: HTMLElement = document.querySelector(
	'section.visualisation-container'
)!;
const onlineProgressBar: HTMLElement = document.querySelector('.online-progress-bar')!;
const onlineProgressBarLabel: HTMLElement = document.querySelector(
	'.online-progress-bar span:last-of-type'
)!;
const offlineProgressBar: HTMLElement = document.querySelector('.offline-progress-bar')!;
const offlineProgressBarLabel: HTMLElement = document.querySelector(
	'.offline-progress-bar span:last-of-type'
)!;
const percentageText: HTMLElement = document.querySelector('.percentage-text')!;
const writtenFraction: HTMLElement = document.querySelector('.full-fraction')!;

const yearRangeText = document.querySelector('.yearrange') as HTMLElement;

const updateVisualisation = (
	fraction: number,
	fractionOf: number,
	yearRange?: { startYear: number; endYear: number }
) => {
	// berekent online percentage, 0 als er geen files zijn of iets anders fout gaat
	const percentage: number = parseFloat(((fraction / fractionOf) * 100).toFixed(2)) || 0;

	if (
		onlineProgressBar &&
		offlineProgressBar &&
		percentageText &&
		visualisationContainer &&
		writtenFraction
	) {
		onlineProgressBar.style.width = percentage + '%';
		offlineProgressBar.style.width = 100 - percentage + '%';
		offlineProgressBar.style.left = percentage + '%';
		percentageText.textContent = percentage.toLocaleString() + '%';
		writtenFraction.textContent = `(${fraction} / ${fractionOf})`;

		if (percentage < 35) {
			onlineProgressBarLabel.textContent = '';
		} else if (percentage > 65) {
			offlineProgressBarLabel.textContent = '';
		}

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
