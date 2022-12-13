// dit zorgt voor een flash van unstyled content dus doen we niet
// import "../styles/style.css"

const req = new XMLHttpRequest;
req.open('GET', 'https://service.archief.nl/gaf/oai/!open_oai.OAIHandler?verb=ListRecords&set=2.01.27.01&metadataPrefix=oai_ead');
// req.open('GET', 'https://service.archief.nl/gaf/oai/!open_oai.OAIHandler?verb=ListRecords&set=2.05.170&metadataPrefix=oai_ead');
req.responseType = 'document';
req.overrideMimeType('text/xml');


req.onload = () => {
	if (req.readyState === req.DONE && req.status === 200) {
		console.log(req.response);
		if(req.response.getElementsByTagName('error').length > 0) {
			req.onerror!(req.response);
			return;
		}
		getOnlineFileFraction(req.response);
	}
};

req.onerror = () => {
	document.querySelector('main.visualisation-container')!.classList.add('data-error');
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
}

const showVisualisation = (onlineFileCount: number, allFiles: Element[]) => {
	const percentage: number = parseFloat((onlineFileCount / allFiles.length * 100).toFixed(2));

	const mainElement: HTMLElement = document.querySelector('main.visualisation-container')!;
	const bar: HTMLElement = document.querySelector('.bar')!;
	const percentageText: HTMLElement = document.querySelector('.percentage-text')!;
	const fullFraction: HTMLElement = document.querySelector('.full-fraction')!;

	if (bar && percentageText && mainElement && fullFraction) {
		bar.style.width = percentage + '%';
		percentageText.textContent = percentage.toLocaleString() + '%';
		fullFraction.textContent = `(${onlineFileCount} / ${allFiles.length})`;
		mainElement.classList.add('data-loaded');
	}
};

req.send();