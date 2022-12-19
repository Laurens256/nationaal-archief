// dit zorgt voor een flash van unstyled content dus doen we niet
// import '../styles/style.css'

const archiefLink = 'https://www.nationaalarchief.nl/onderzoeken/archief/';

// prettier-ignore
const archiveEntries = ['1.04.01','1.04.02','2.01.27.01','2.01.27.02','2.01.27.03','2.01.27.04','2.01.27.05','2.01.27.06','2.01.27.07','3.02.33','1.04.17','1.04.18.01','1.04.18.02','1.04.18.03','1.04.19','1.04.20','1.04.21','1.11.06.11','1.01.02','1.01.19.02','1.01.50','1.10.29','1.10.35.02','1.10.53','1.10.94','2.21.176','3.01.04.01','3.01.09','3.01.14','3.01.18','3.01.19','3.01.22','3.01.25','3.01.26','3.20.57','1.01.46','1.01.47.04','1.01.47.05','1.01.47.11','1.01.47.17','1.01.47.19','1.01.47.21','1.01.47.22','1.01.47.29','1.01.47.40','1.10.11.02','2.21.004.04','1.10.10','1.10.13','1.10.31','1.10.39','1.10.46','1.10.48','1.10.57','1.10.59','1.10.69','1.10.83','3.20.16','3.20.52','1.10.03','1.10.05.05','1.10.32','1.11.06.03','2.21.046','1.10.05.01','1.10.05.02','1.10.05.03','1.10.05.04','1.10.23','1.10.30','1.10.45','1.10.67','1.10.75.01','1.10.78','1.10.79','1.10.82','1.10.86','1.10.100','1.10.106','1.11.06.04','2.21.006.48','2.21.004.21','2.21.006.49','2.21.010','2.21.040','2.21.317','1.04.23','1.11.01.01','1.13.04','1.13.24','2.21.007.58','4.VEL','4.VELH','4.AANW','4.OBPV','4.MIKO','4.TOPO','2.21.021','2.21.153','2.21.204','2.21.271','2.21.317','4.JSF','4.VMF'];

const selectElement: HTMLSelectElement = document.querySelector('select')!;

const buildSelect = () => {
	archiveEntries.forEach((entry) => {
		const option = document.createElement('option');
		option.value = entry;
		option.textContent = entry;
		selectElement.appendChild(option);
	});
};

buildSelect();

const getArchive = () => {
	const record: string = selectElement.value;

	const req = new XMLHttpRequest();
	req.open(
		'GET',
		`https://service.archief.nl/gaf/oai/!open_oai.OAIHandler?verb=ListRecords&set=${record}&metadataPrefix=oai_ead`
	);
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
	allFiles = Array.from(xml.getElementsByTagName('c')).filter(
		(file) => file.getAttribute('level') === 'file'
	);

	let onlineFiles: Element[] = [];
	let offlineFiles: Element[] = [];
	allFiles.forEach((file) => {
		// console.log(file);
		const dao = file.getElementsByTagName('dao');
		const unitDate = file.getElementsByTagName('unitdate');
		if (unitDate.length > 0) {
			console.log(unitDate[0].textContent);
		}
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
	const percentage: number = parseFloat(((fraction / allFiles.length) * 100).toFixed(2));

	if (bar && percentageText && mainElement && fullFraction && anchorElement) {
		bar.style.width = percentage + '%';
		percentageText.textContent = percentage.toLocaleString() + '%';
		fullFraction.textContent = `(${fraction} / ${fractionOf})`;
		anchorElement.setAttribute('href', archiefLink + selectElement.value);
		anchorElement.textContent = selectElement.value;

		if (timePeriod) {
		} else {
		}
		mainElement.classList.add('data-loaded');
	}
};

selectElement.addEventListener('change', getArchive);

getArchive();
