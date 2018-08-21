import db from '../../../../helpers/db';

export default function(settingName, dataElement) {
	return new Promise(function (resolve, reject) {
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
			});
	});
};
