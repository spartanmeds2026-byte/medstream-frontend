import localForage from "localforage"
const dbName = "s9Consulting"

// Create table 1 in databaseName
export const persistFormio = localForage.createInstance({
	name: dbName,
	storeName: "FormPersist",
	description: "Save Form local before submit",
})
