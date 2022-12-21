// import { updateVisualisation } from './updateVisualisation';

const selectElement: HTMLSelectElement = document.querySelector('select')!;

const getArchive = async () => {
	try {
		const data: { fraction: Element[]; fractionOf: Element[] } = await new Promise(
			(resolve, reject) => {
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
						}
						const filesFraction = getOnlineFileFraction(req.response);
						resolve(filesFraction);
					}
				};

				req.onerror = () => reject(req.response);
				req.send();
			}
		);

		return data;
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
