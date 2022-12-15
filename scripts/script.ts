// dit zorgt voor een flash van unstyled content dus doen we niet
// import "../styles/style.css"

const archiefLink = 'https://www.nationaalarchief.nl/onderzoeken/archief/';

const getArchive = () => {
	const record: string = selectElement.value;

	const req = new XMLHttpRequest;
	req.open('GET', `https://service.archief.nl/gaf/oai/!open_oai.OAIHandler?verb=ListRecords&set=${record}&metadataPrefix=oai_ead`);
	req.responseType = 'document';
	req.overrideMimeType('text/xml');


	req.onload = () => {
		if (req.readyState === req.DONE && req.status === 200) {
			if (req.response.getElementsByTagName('error').length > 0) {
				req.onerror!(req.response);
				return;
			}
			getOnlineFileFraction(req.response);
		}
	};

	req.onerror = () => {
		console.error('error');
		document.querySelector('main.visualisation-container')!.classList.add('data-error');
	};

	req.send();
};

let allFiles: Element[] = [];

const getOnlineFileFraction = (xml: XMLDocument) => {
	// haalt alle bestanden op die een level hebben van 'file', zorgt ervoor dat kopjes en dergelijke niet worden meegenomen (nog navragen)
	allFiles = Array.from(xml.getElementsByTagName('c')).filter(file => file.getAttribute('level') === 'file');

	let onlineFiles: Element[] = [];
	let offlineFiles: Element[] = [];
	allFiles.forEach(file => {
		const dao = file.getElementsByTagName('dao');
		if (dao.length > 0) {
			onlineFiles.push(file);
		} else {
			offlineFiles.push(file);
		}
	});
	updateVisualisation(onlineFiles.length, allFiles.length);
};



const mainElement: HTMLElement = document.querySelector('main.visualisation-container')!;
const bar: HTMLElement = document.querySelector('.bar')!;
const percentageText: HTMLElement = document.querySelector('.percentage-text')!;
const fullFraction: HTMLElement = document.querySelector('.full-fraction')!;
const anchorElement: HTMLAnchorElement = document.querySelector('a')!;

const updateVisualisation = (fraction: number, fractionOf: number, timePeriod?: any) => {
	const percentage: number = parseFloat((fraction / allFiles.length * 100).toFixed(2));

	if (bar && percentageText && mainElement && fullFraction && anchorElement) {
		bar.style.width = percentage + '%';
		percentageText.textContent = percentage.toLocaleString() + '%';
		fullFraction.textContent = `(${fraction} / ${fractionOf})`;
		anchorElement.setAttribute('href', archiefLink + selectElement.value);

		if (timePeriod) {

		} else {
			
		}
		mainElement.classList.add('data-loaded');
	}
};

const filterByYear = () => {
	const yearFromValue: string = yearFrom.value;
	const yearToValue: string = yearTo.value;
	if (!yearFromValue || !yearToValue) return;

	const filteredFiles: Element[] = allFiles.filter(file => {
		let date: any = file.getElementsByTagName('unitdate');
		if (date.length > 0) {
			date = date[0].textContent;
		}
		console.log(date);
		if (date) {
			// const dateValue: number = parseInt(date.substring(0, 4));
			return date >= parseInt(yearFromValue) && date <= parseInt(yearToValue);
		} else {
			return;
		}
	});
	console.log(filteredFiles);

	console.log(yearFromValue, yearToValue);
};

const selectElement: HTMLSelectElement = document.querySelector('select')!;
selectElement.addEventListener('change', getArchive);

const yearFrom: HTMLInputElement = document.querySelector('.dates label:first-of-type input[type="number"]')!;
const yearTo: HTMLInputElement = document.querySelector('.dates label:last-of-type input[type="number"]')!;
yearTo.value = new Date().getFullYear().toString();

// yearFrom.addEventListener('change', filterByYear);
// yearTo.addEventListener('change', filterByYear);

getArchive();