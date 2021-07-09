CREATE DATABASE board_db;

CREATE USER 'board_user'@'%' IDENTIFIED BY 'skkutest';

GRANT ALL PRIVILEGES ON board_db.* TO 'board_user'@'%';

FLUSH PRIVILEGES;

CREATE TABLE board_db.t_user (
	uid INT(11) NOT NULL AUTO_INCREMENT,
	login_id VARCHAR(50) NOT NULL DEFAULT '',
	login_pwd VARCHAR(50) NOT NULL DEFAULT '',
	user_name VARCHAR(100) NOT NULL DEFAULT '',
	email VARCHAR(100) NOT NULL DEFAULT '',
	cdate TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	PRIMARY KEY (uid),
	UNIQUE INDEX login_id (login_id)
);

CREATE TABLE board_db.t_board (
	bid INT(11) NOT NULL AUTO_INCREMENT,
	user_id VARCHAR(50) NOT NULL DEFAULT '',
	user_name VARCHAR(100) NOT NULL DEFAULT '',
	title VARCHAR(100) NOT NULL DEFAULT '',
	content TEXT,
	cdate TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	PRIMARY KEY (bid)
);

INSERT INTO board_db.t_user (login_id, login_pwd, user_name, email) VALUES ('test', 'test1234', 'test user', 'test@test.com');