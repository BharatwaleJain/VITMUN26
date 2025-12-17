db = db.getSiblingDB("admin");
const ADMIN_USER = process.env.MONGO_INITDB_ROOT_USERNAME;
const ADMIN_PWD = process.env.MONGO_INITDB_ROOT_PASSWORD;
if (!ADMIN_USER || !ADMIN_PWD) {
    throw new Error("Mongo root credentials not provided");
}
try {
    db.createUser({
        user: ADMIN_USER,
        pwd: ADMIN_PWD,
        roles: [{ role: "root", db: "admin" }]
    });
    print("Root user created successfully");
} catch (e) {
    print("Root user already exists, skipping creation");
}
db = db.getSiblingDB("delegateallotments");
const collections = ["external", "internal", "delegations"];
const existingCollections = db.getCollectionNames();
collections.forEach((name) => {
    if (!existingCollections.includes(name)) {
        db.createCollection(name);
        print(`Collection '${name}' created successfully`);
    } else {
        print(`Collection '${name}' already exists, skipping creation`);
    }
});
print("Database and collections setup completed successfully");