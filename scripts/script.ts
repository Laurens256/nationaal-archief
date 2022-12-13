const req = new XMLHttpRequest;
req.open('GET', 'https://service.archief.nl/gaf/oai/!open_oai.OAIHandler?verb=ListRecords&set=2.01.27.01&metadataPrefix=oai_ead');
// req.open('GET', 'https://service.archief.nl/gaf/oai/!open_oai.OAIHandler?verb=ListRecords&set=2.05.170&metadataPrefix=oai_ead');
req.responseType = 'document';
req.overrideMimeType('text/xml');


req.onload = () => {
	if (req.readyState === req.DONE && req.status === 200) {
		console.log(req.response);
		getOnlineFilePercent(req.response);
	}
};

const getOnlineFilePercent = (xml: XMLDocument) => {
	const allFiles = Array.from(xml.getElementsByTagName('c')).filter(file => file.getAttribute('level') === 'file');
	console.log(allFiles);
	let onlineFileCount = 0;
	allFiles.forEach(file => {
		const dao = file.getElementsByTagName('dao');
		if (dao.length > 0) {
			onlineFileCount++;
		}
	});
	console.log(Math.round(onlineFileCount / allFiles.length * 100));
}

req.send();
