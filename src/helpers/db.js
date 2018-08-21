import Dexie from 'dexie';

const db = new Dexie('intranet');

db.version(3).stores({
	customers: '++id, &name, credentials, connection, web, modifiedDateTime, createdDateTime',
	dashboard: '++id, title, description, link, modifiedDateTime, &createdDateTime',
	settings: '++id, type, data, modifiedDateTime, &createdDateTime',
	snippets: '++id, title, snippet, modifiedDateTime, &createdDateTime',
	time: '++id, customer, time, description, taskDate, complete, billable, modifiedDateTime, completedDateTime, &createdDateTime',
});

export default db;
