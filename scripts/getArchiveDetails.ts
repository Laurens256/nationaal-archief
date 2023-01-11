import { getYearsFromString } from './yearFilter';

const getArchiveData = async (
	archiveId: string
): Promise<{
	fraction: Element[];
	fractionOf: Element[];
}> => {
	try {
		const parser = new DOMParser();
		const data = await fetch(
			`https://service.archief.nl/gaf/oai/!open_oai.OAIHandler?verb=ListRecords&set=${archiveId}&metadataPrefix=oai_ead`
		);
		const dirtyXml = parser.parseFromString(await data.text(), 'text/xml');
		if (dirtyXml.getElementsByTagName('error').length > 0) {
			throw new Error('error while fetching data');
		}

		// haal alle files c level tags op (files)
		const xmlFiles: Element[] = Array.from(dirtyXml.getElementsByTagName('c')).filter(
			(file) => file.getAttribute('level') === 'file'
		);

		// voeg min en max jaar toe aan alle files
		xmlFiles.forEach((file) => {
			file.setAttribute('minyear', getYearsFromString(file).fileYearStart.toString());
			file.setAttribute('maxyear', getYearsFromString(file).fileYearEnd.toString());
		});

		// haal alle files op en bereken deel wat online beschikbaar is
		return getOnlineFileFraction(xmlFiles);
	} catch (error) {
		console.log(error);
		return { fraction: [], fractionOf: [] };
	}
};

const getOnlineFileFraction = (
	xml: Element[]
): { fraction: Element[]; fractionOf: Element[] } => {
	let onlineFiles: Element[] = [];

	xml.forEach((file) => {
		const dao = file.getElementsByTagName('dao');
		if (dao.length > 0) {
			onlineFiles.push(file);
		}
	});
	return { fraction: onlineFiles, fractionOf: xml };
};

export { getArchiveData, getOnlineFileFraction };
