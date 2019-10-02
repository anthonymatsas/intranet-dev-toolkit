import db from '../../../../helpers/db';

const getSetting = (settingName, dataElement) => {
	return new Promise(function (resolve, reject) {
		var gotResults = false;
		db.table("settings")
			.toArray()
			.then(settings => {
				for (var i in settings) {
					if (settings[i].type === settingName) {
						if (dataElement) {
							resolve(settings[i].data[dataElement]);
						} else {
							resolve(settings[i].data);
						}
					}
				}

				if (! settings.lengh) {
					resolve([]);
				}
			})
			.catch(error => {
				console.log(error);
			})
			.finally(() => {
			});
	});
}

export {
	getSetting,
};
