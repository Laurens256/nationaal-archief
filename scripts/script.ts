// dit zorgt voor een flash van unstyled content dus doen we niet
// import "../styles/style.css"

const archiefLink = 'https://www.nationaalarchief.nl/onderzoeken/archief/';
let loading: boolean = false;

const getArchive = () => {
	const record: string = selectElement.value;

	const req = new XMLHttpRequest;
	req.open('GET', `https://service.archief.nl/gaf/oai/!open_oai.OAIHandler?verb=ListRecords&set=${record}&metadataPrefix=oai_ead`);
	req.responseType = 'document';
	req.overrideMimeType('text/xml');


	req.onload = () => {
		if (req.readyState === req.DONE && req.status === 200) {
			console.log(req.response);
			if (req.response.getElementsByTagName('error').length > 0) {
				req.onerror!(req.response);
				return;
			}
			getOnlineFileFraction(req.response);
		}
	};

	req.onerror = () => {
		loading = false;
		document.querySelector('main.visualisation-container')!.classList.add('data-error');
	};
	req.send();
};

const getOnlineFileFraction = (xml: XMLDocument) => {
	let onlineFileCount: number = 0;
	// haalt alle bestanden op die een level hebben van 'file', zorgt ervoor dat kopjes en dergelijke niet worden meegenomen (nog navragen)
	const allFiles: Element[] = Array.from(xml.getElementsByTagName('c')).filter(file => file.getAttribute('level') === 'file');
	console.log(allFiles);
	allFiles.forEach(file => {
		const dao = file.getElementsByTagName('dao');
		if (dao.length > 0) {
			onlineFileCount++;
		}
	});
	showVisualisation(onlineFileCount, allFiles);
};



const mainElement: HTMLElement = document.querySelector('main.visualisation-container')!;
const bar: HTMLElement = document.querySelector('.bar')!;
const percentageText: HTMLElement = document.querySelector('.percentage-text')!;
const fullFraction: HTMLElement = document.querySelector('.full-fraction')!;
const anchorElement: HTMLAnchorElement = document.querySelector('a')!;

const showVisualisation = (onlineFileCount: number, allFiles: Element[]) => {
	const percentage: number = parseFloat((onlineFileCount / allFiles.length * 100).toFixed(2));

	if (bar && percentageText && mainElement && fullFraction && anchorElement) {
		bar.style.width = percentage + '%';
		percentageText.textContent = percentage.toLocaleString() + '%';
		fullFraction.textContent = `(${onlineFileCount} / ${allFiles.length})`;
		anchorElement.setAttribute('href', archiefLink + selectElement.value);
		mainElement.classList.add('data-loaded');
	}
};

const selectElement: HTMLSelectElement = document.querySelector('select')!;
selectElement.addEventListener('change', getArchive);

getArchive();