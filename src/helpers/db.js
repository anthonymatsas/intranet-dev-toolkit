import Dexie from 'dexie';

const db = new Dexie('intranet');

db.version(3).stores({
	customers: '++id, &name, credentials, connection, web, modifiedDateTime, createdDateTime',
	dashboard: '++id, title, description, link, modifiedDateTime, &createdDateTime',
	settings: '++id, type, data, modifiedDateTime, &createdDateTime',
	snippets: '++id, title, snippet, modifiedDateTime, &createdDateTime',
	time: '++id, customer, time, description, taskDate, complete, billable, modifiedDateTime, completedDateTime, &createdDateTime',
});

db.version(31).stores({
	customers: '++id, &name, credentials, connection, web, modifiedDateTime, createdDateTime',
	dashboard: '++id, title, description, link, modifiedDateTime, &createdDateTime',
	settings: '++id, type, data, modifiedDateTime, &createdDateTime',
	snippets: '++id, title, snippet, modifiedDateTime, &createdDateTime',
	time: '++id, customer, time, description, taskDate, complete, billable, modifiedDateTime, completedDateTime, &createdDateTime',
}).upgrade(transaction => {
	return transaction.time.toCollection().modify(task => {
		task.completedDateTime = task.createdDateTime;
	});
});

db.version(32).stores({
	customers: '++id, &name, credentials, connection, web, modifiedDateTime, createdDateTime',
	dashboard: '++id, title, description, link, modifiedDateTime, &createdDateTime',
	settings: '++id, type, data, modifiedDateTime, &createdDateTime',
	snippets: '++id, title, snippet, modifiedDateTime, &createdDateTime',
	time: '++id, customer, time, actualTime, description, taskDate, complete, billable, modifiedDateTime, completedDateTime, &createdDateTime',
}).upgrade(transaction => {
	return transaction.time.toCollection().modify(task => {
		task.actualTime = task.time;
	});
});

export default db;
