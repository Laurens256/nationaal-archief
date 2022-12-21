const mainElement: HTMLElement = document.querySelector('main.visualisation-container')!;
const bar: HTMLElement = document.querySelector('.bar')!;
const percentageText: HTMLElement = document.querySelector('.percentage-text')!;
const fullFraction: HTMLElement = document.querySelector('.full-fraction')!;
const anchorElement: HTMLAnchorElement = document.querySelector('a')!;

const selectElement: HTMLSelectElement = document.querySelector('select')!;
const archiefLink = 'https://www.nationaalarchief.nl/onderzoeken/archief/';

const updateVisualisation = (fraction: number, fractionOf: number) => {
	const percentage: number = parseFloat(((fraction / fractionOf) * 100).toFixed(2));

	if (bar && percentageText && mainElement && fullFraction && anchorElement) {
		bar.style.width = percentage + '%';
		percentageText.textContent = percentage.toLocaleString() + '%';
		fullFraction.textContent = `(${fraction} / ${fractionOf})`;
		anchorElement.setAttribute('href', archiefLink + selectElement.value);
		anchorElement.textContent = selectElement.value;

		mainElement.classList.add('data-loaded');
	}
};

const errorVisualisation = () => {
	mainElement.classList.add('data-error');
};

export { updateVisualisation, errorVisualisation };
