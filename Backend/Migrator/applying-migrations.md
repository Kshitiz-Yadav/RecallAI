# Entity Framework Core: Add and Revert Migrations

## ✅ Add Migration

To add a new Migration, first update the domain objects and the DB Context.
This command then creates migration files and stores them in the `Data/Migrations` folder. Run it from within the `Backend/API` folder.

```bash
dotnet ef migrations add <MigrationName> --output-dir Data/Migrations
```

## 🔄 Remove Migration

Use this command to revert the last migration:

```bash
dotnet ef migrations remove
```