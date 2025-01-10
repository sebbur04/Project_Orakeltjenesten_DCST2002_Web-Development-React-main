-- Removed all foreign keys (constraints) for testing purposes

CREATE TABLE Pages(
    id INT NOT NULL AUTO_INCREMENT,
    name TEXT,
    num_views INT,
    PRIMARY KEY(id)
);


CREATE TABLE Versionlog(
    id INT NOT NULL AUTO_INCREMENT,
    pageid INT NOT NULL,
    name TEXT,
    content TEXT,
    userid INT,
    date DATETIME, -- DATE format is '2001-11-20 13:15:30'
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
    bio TEXT,
    permid INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Comments(
    id INT NOT NULL AUTO_INCREMENT,
    userid INT,
    date DATETIME, -- DATE format is '2001-11-20 13:15:30'
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
    userid INT,
    alterpages BOOLEAN,
    deletepages BOOLEAN,
    versions BOOLEAN,
    allcomments BOOLEAN,
    tags BOOLEAN,
    users BOOLEAN,
    PRIMARY KEY(id)
);