const visualisationContainer: HTMLElement = document.querySelector(
	'section.visualisation-container'
)!;
const onlineProgressBar: HTMLElement = document.querySelector('.online-progress-bar')!;

const offlineProgressBar: HTMLElement = document.querySelector('.offline-progress-bar')!;

const percentageText: HTMLElement = document.querySelector('.percentage-text')!;
const writtenFraction: HTMLElement = document.querySelector('.full-fraction')!;

const yearRangeText = document.querySelector('.yearrange') as HTMLElement;

const updateVisualisation = (
	fraction: number,
	fractionOf: number,
	yearRange?: { startYear: number, endYear: number }
) => {
	// berekent online percentage, 0 als er geen files zijn of iets anders fout gaat
	const percentage: number = parseFloat(((fraction / fractionOf) * 100).toFixed(0)) || 0;

	if (
		onlineProgressBar &&
		offlineProgressBar &&
		percentageText &&
		visualisationContainer &&
		writtenFraction
	) {
		onlineProgressBar.style.width = percentage + '%';
		offlineProgressBar.style.width = 100 - percentage + '%';
		percentageText.textContent = percentage.toLocaleString() + '%';
		writtenFraction.textContent = `(${fraction} / ${fractionOf})`;

		onlineProgressBar.classList.remove('textlabel', 'iconlabel');
		offlineProgressBar.classList.remove('textlabel', 'iconlabel');
		if (percentage < 35) {
			offlineProgressBar.classList.add('textlabel');
			if (percentage > 5) {
				onlineProgressBar.classList.add('iconlabel');
			}
		} else if (percentage > 65) {
			onlineProgressBar.classList.add('textlabel');
			if (percentage < 95) {
				offlineProgressBar.classList.add('iconlabel');
			}
		} else {
			onlineProgressBar.classList.add('textlabel');
			offlineProgressBar.classList.add('textlabel');
		}

		if (yearRangeText && yearRange) {
			if (yearRange.startYear === yearRange.endYear) {
				yearRangeText.textContent = ` uit ${yearRange.startYear}`;
			} else {
				yearRangeText.textContent = ` tussen ${yearRange.startYear} - ${yearRange.endYear}`;
			}
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
