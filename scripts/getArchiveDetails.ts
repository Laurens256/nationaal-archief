const selectElement: HTMLSelectElement = document.querySelector('select')!;

const parser = new DOMParser();

const getArchive = async () => {
	const record: string = selectElement.value;

	try {
		const data = await fetch(
			`https://service.archief.nl/gaf/oai/!open_oai.OAIHandler?verb=ListRecords&set=${record}&metadataPrefix=oai_ead`
		);
		const xml = parser.parseFromString(await data.text(), 'text/xml');
		if (xml.getElementsByTagName('error').length > 0) {
			throw new Error('error while fetching data');
		}

		return getOnlineFileFraction(xml);
	} catch (error) {
		console.log(error);
		return { fraction: [], fractionOf: [] };
	}
};

const getOnlineFileFraction = (
	xml: XMLDocument
): { fraction: Element[]; fractionOf: Element[] } => {
	// haalt alle bestanden op die een level hebben van 'file', zorgt ervoor dat kopjes en dergelijke niet worden meegenomen
	const allFiles = Array.from(xml.getElementsByTagName('c')).filter(
		(file) => file.getAttribute('level') === 'file'
	);

	let onlineFiles: Element[] = [];
	let offlineFiles: Element[] = [];
	allFiles.forEach((file) => {
		const dao = file.getElementsByTagName('dao');
		if (dao.length > 0) {
			onlineFiles.push(file);
		} else {
			offlineFiles.push(file);
		}
	});
	return { fraction: onlineFiles, fractionOf: allFiles };
};

export { getArchive };
