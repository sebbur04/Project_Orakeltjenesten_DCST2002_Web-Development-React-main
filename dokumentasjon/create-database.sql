CREATE TABLE Pages(
    id INT NOT NULL AUTO_INCREMENT,
    name TEXT,
    num_views INT,
    PRIMARY KEY(id)
);

-- DATE format er '2001-11-20 13:15:30'
CREATE TABLE Versionlog(
    id INT NOT NULL AUTO_INCREMENT,
    pageid INT NOT NULL,
    name TEXT,
    content TEXT,
    userid INT,
    date DATETIME,
    changelog TEXT,
    version INT,
    PRIMARY KEY(id)
);



CREATE TABLE Users(
    id INT NOT NULL AUTO_INCREMENT,
    username TEXT,
    hashed_password BLOB,
    salt BLOB,
    avatar TEXT,
    PRIMARY KEY(id)
);

CREATE TABLE Comments(
    id INT NOT NULL AUTO_INCREMENT,
    userid INT,
    date DATETIME,
    pageid INT,
    content TEXT,
    PRIMARY KEY(id)
);

CREATE TABLE Tags(
    id INT NOT NULL AUTO_INCREMENT,
    name TEXT,
    PRIMARY KEY(id)
);

CREATE TABLE PageTags(
    pageid INT NOT NULL,
    tagid INT NOT NULL,
    PRIMARY KEY(pageid, tagid)
);

CREATE TABLE Permissions(
    id INT NOT NULL AUTO_INCREMENT,
    alterpages BOOLEAN,
    deletepages BOOLEAN,
    versions BOOLEAN,
    allcomments BOOLEAN,
    tags BOOLEAN,
    users BOOLEAN,
    PRIMARY KEY(id)
);

-- Alter table setninger for å legge til relasjonene mellom tabellene.
ALTER TABLE Versionlog ADD FOREIGN KEY(userid) REFERENCES Users(id), ADD FOREIGN KEY(pageid) REFERENCES Pages(id);

ALTER TABLE Comments ADD FOREIGN KEY(userid) REFERENCES Users(id), ADD FOREIGN KEY(pageid) REFERENCES Pages(id);

ALTER TABLE PageTags ADD FOREIGN KEY(pageid) REFERENCES Pages(id), ADD FOREIGN KEY(tagid) REFERENCES Tags(id);

ALTER TABLE Users ADD FOREIGN KEY(permid) REFERENCES Permissions(id)


-- Eksempeldata, rekkefølge på Insert er ekstremt viktig pga. foreign keys.
INSERT INTO Users(username, password) VALUES("admin", "admin");
INSERT INTO Users(username, password) VALUES("test", "test");

INSERT INTO Versionlog(pageid, content, userid, date, changelog) VALUES(1, "Hello", 1, "2024-10-18 13:15:30", "La til Hello");

INSERT INTO Versionlog(pageid, content, userid, date, changelog) VALUES(1, "Hello World", 1, "2024-10-19 13:15:30", "La til World");

INSERT INTO Tags(name) VALUES("Kode");
INSERT INTO Tags(name) VALUES("Norsk");

INSERT INTO Pages(name, versionid, num_views) VALUES("Javascript", 2, 4);

INSERT INTO PageTags(pageid, tagid) VALUES(1,1);

INSERT INTO Comments(userid, date, pageid, content) VALUES(1, "2024-10-19 13:15:30", 1, "Denne var bra");

SELECT v.* FROM Versionlog v, Pages p 
WHERE v.version = (SELECT MAX(version) FROM Versionlog;) AND v.version id = p.id;

--
---- REELE DATA TIL PROSJEKTET SOM ER IMPLEMENTERT I DATABASEN
--
-- Reele data til prosjektet - Med kategorier/tags til forskjellige wiki pages 

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.Tags (id, name)
VALUES (1, 'Prosjektor');

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.Tags (id, name)
VALUES (2, 'Printer');

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.Tags (id, name)
VALUES (3, 'Student PC');

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.Tags (id, name)
VALUES (4, 'Ansatt PC');

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.Tags (id, name)
VALUES (5, 'Eksamen');

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.Tags (id, name)
VALUES (6, 'Nettverk');



-- PAGES MED REELE DATA

UPDATE fs_dcst2002_1_admin_prosjekt12de.Pages t
SET t.name = 'Koble prosjektor til PC'
WHERE t.id = 1;

UPDATE fs_dcst2002_1_admin_prosjekt12de.Pages t
SET t.name = 'Bruke prosjektor verktøy i forelesingssal'
WHERE t.id = 2;

UPDATE fs_dcst2002_1_admin_prosjekt12de.Pages t
SET t.name = 'Hvordan bruke NTNU Print '
WHERE t.id = 3;

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.Pages (id, num_views, name)
VALUES (4, 0, 'Hvordan sette opp Microsoft Authenticator');

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.Pages (id, num_views, name)
VALUES (5, 0, 'Hvordan logge inn på NTNU administrert PC');

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.Pages (id, num_views, name)
VALUES (6, 0, 'Hvordan laste ned SEB - Safe Exam Browser');

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.Pages (id, num_views, name)
VALUES (7, 0, 'Hvordan koble til EDUROAM - Campus Nettverk');

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.Pages (id, num_views, name)
VALUES (8, 0, 'Hvordan bruke NTNU VPN - Cisco AnyConnect');

--  Linking table in SQL between PageID and TagID

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.PageTags (pageid, tagid)
VALUES (1, 1);

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.PageTags (pageid, tagid)
VALUES (2, 1);

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.PageTags (pageid, tagid)
VALUES (3, 2);

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.PageTags (pageid, tagid)
VALUES (4, 3);

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.PageTags (pageid, tagid)
VALUES (5, 4);

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.PageTags (pageid, tagid)
VALUES (6, 5);

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.PageTags (pageid, tagid)
VALUES (7, 6);

INSERT INTO fs_dcst2002_1_admin_prosjekt12de.PageTags (pageid, tagid)
VALUES (8, 6);
