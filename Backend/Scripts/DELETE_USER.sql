BEGIN;

-- Get the user row (id + email) once
CREATE TEMP TABLE temp_user AS SELECT "Id","Email" FROM "Users" WHERE "Id" = 48;

-- Delete dependent/related data
DELETE FROM "ChatHistory"
WHERE "UserId" IN (SELECT "Id" FROM temp_user);

DELETE FROM "Files"
WHERE "UserId" IN (SELECT "Id" FROM temp_user);

DELETE FROM "UserLimits"
WHERE "UserId" IN (SELECT "Id" FROM temp_user);

DELETE FROM "LicenseKeys"
WHERE "UserId" IN (SELECT "Id" FROM temp_user);

DELETE FROM "UserAccountVerification"
WHERE "Email" IN (SELECT "Email" FROM temp_user);

-- Finally delete the user
DELETE FROM "Users"
WHERE "Id" IN (SELECT "Id" FROM temp_user);

COMMIT;