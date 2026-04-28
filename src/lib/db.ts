import { Dexie, type EntityTable } from "dexie";
import type { Task } from "./types";

const db = new Dexie("SweatMateDB") as Dexie & {
    tasks: EntityTable<Task, 'id'>
};

db.version(1).stores({
    tasks: 'id, title, createdAt, doneAt'
});

export default db;
