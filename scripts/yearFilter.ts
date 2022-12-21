// regular expression to find numbers with length of 4 in string
const regex = /\d{4}/g;

const filterByYear = (startYear: number, endYear: number, dataset: Element[]) => {
	const filteredData = dataset.filter((file) => {
		const unitDate = file.getElementsByTagName('unitdate');

		if (unitDate.length > 0) {
			let n;
			let fileYearStart!: number;
			let fileYearEnd!: number;

			if (unitDate[0].textContent) {
				console.log(file);
				while ((n = regex.exec(unitDate[0].textContent)) !== null) {
					n = Number(n[0]);
					if (n < fileYearStart || !fileYearStart) {
						fileYearStart = n;
					}
					if (n > fileYearEnd || !fileYearEnd) {
						fileYearEnd = n;
					}
				}
			}
			console.log(fileYearStart, fileYearEnd);
		}

		// const yearNumber = Number(year);

		// return yearNumber >= startYear && yearNumber <= endYear;
	});
	console.log(filteredData);
};

export { filterByYear };
