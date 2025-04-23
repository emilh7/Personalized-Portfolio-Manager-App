
USE InvestmentDB;

DROP TABLE IF EXISTS HasInfo;
DROP TABLE IF EXISTS List;
DROP TABLE IF EXISTS ModerateActivity;
DROP TABLE IF EXISTS Buy;
DROP TABLE IF EXISTS Sell;
DROP TABLE IF EXISTS Transaction;
DROP TABLE IF EXISTS BankAccount;
DROP TABLE IF EXISTS User;

DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS PerformanceChart;
DROP TABLE IF EXISTS Commodities;
DROP TABLE IF EXISTS Bonds;
DROP TABLE IF EXISTS StocksCompany;
DROP TABLE IF EXISTS Assets;
DROP TABLE IF EXISTS Portfolio;

CREATE TABLE User (
	UserID INT NOT NULL PRIMARY KEY,
    Username VARCHAR(150) NULL,
	Pass INT NOT NULL,
	Email VARCHAR(100) NOT NULL
);

CREATE TABLE Admin (
	AdminID INT NOT NULL PRIMARY KEY,
	Pass INT NOT NULL
);

CREATE TABLE BankAccount (
	AccountID INT NOT NULL PRIMARY KEY,
	UserID INT NOT NULL,
	Balance DECIMAL(15,2),
	FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE ModerateActivity (
	UserID INT NOT NULL,
	AdminID INT NOT NULL,
	PRIMARY KEY (UserID, AdminID),
	FOREIGN KEY (UserID) REFERENCES User(UserID),
	FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
);

CREATE TABLE Portfolio (
	PortfolioID INT NOT NULL PRIMARY KEY,
	Balance DECIMAL(15,2)
);

CREATE TABLE Transaction (
	TransactionID INT NOT NULL PRIMARY KEY,
	Amount DECIMAL(15,2) NOT NULL,
	Type VARCHAR(50) NOT NULL,
	PortfolioID INT NOT NULL,
	FOREIGN KEY (PortfolioID) REFERENCES Portfolio(PortfolioID)
);

CREATE TABLE Buy (
	TransactionID INT NOT NULL PRIMARY KEY,
	AccountID INT NOT NULL,
	FOREIGN KEY (TransactionID) REFERENCES Transaction(TransactionID),
	FOREIGN KEY (AccountID) REFERENCES BankAccount(AccountID)
);


CREATE TABLE Sell (
	TransactionID INT NOT NULL PRIMARY KEY,
	AccountID INT NOT NULL ,
	FOREIGN KEY (TransactionID) REFERENCES Transaction(TransactionID),
	FOREIGN KEY (AccountID) REFERENCES BankAccount(AccountID)
);

CREATE TABLE Assets (
	AssetID INT NOT NULL PRIMARY KEY,
	AssetType VARCHAR(50) NOT NULL,
	AssetName VARCHAR(100) NOT NULL ,
	MarketValue DECIMAL(15,2) NOT NULL ,
	PortfolioID INT NOT NULL ,
	Quantity INT NOT NULL ,
	FOREIGN KEY (PortfolioID) REFERENCES Portfolio(PortfolioID)
);

CREATE TABLE Commodities (
	AssetID INT NOT NULL PRIMARY KEY,
	FOREIGN KEY (AssetID) REFERENCES Assets(AssetID)
);

CREATE TABLE Bonds (
	AssetID INT NOT NULL PRIMARY KEY,
	FOREIGN KEY (AssetID) REFERENCES Assets(AssetID)
);

CREATE TABLE StocksCompany (
	AssetID INT NOT NULL PRIMARY KEY,
	FOREIGN KEY (AssetID) REFERENCES Assets(AssetID)
);

CREATE TABLE PerformanceChart (
    ChartID INT AUTO_INCREMENT PRIMARY KEY,
    AssetID INT NOT NULL,
    MetricValue DECIMAL(15,4) NOT NULL,
    Timestamp DATETIME NOT NULL,
    FOREIGN KEY (AssetID) REFERENCES Assets(AssetID)
);

CREATE TABLE List (
	AssetID INT NOT NULL ,
	AdminID INT NOT NULL ,
	PRIMARY KEY (AssetID, AdminID),
	FOREIGN KEY (AssetID) REFERENCES Assets(AssetID),
	FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
);

CREATE TABLE HasInfo (
	AssetID  INT NOT NULL ,
	PortfolioID INT NOT NULL ,
	PRIMARY KEY (AssetID, PortfolioID),
	FOREIGN KEY (AssetID) REFERENCES Assets(AssetID),
	FOREIGN KEY (PortfolioID) REFERENCES Portfolio(PortfolioID)
);

INSERT INTO User (UserID, Username, Email, Pass) VALUES
(1, 'user1', 'alice@example.com', 1234),
(2, 'user2', 'bob@example.com', 1234),
(3, 'user3', 'carol@example.com', 1234),
(4, 'user4', 'david@example.com' ,1234),
(5, 'user5', 'eva@example.com', 1234);

INSERT INTO Admin (AdminID, Pass) VALUES
(101, 4321),
(102, 4321),
(103, 4321),
(104, 4321),
(105, 4321);

INSERT INTO BankAccount (AccountID, UserID, Balance) VALUES
(5001, 1, 10000.00),
(5002, 2, 7500.00),
(5003, 3, 5600.00),
(5004, 4, 8200.00),
(5005, 5, 4300.00);

INSERT INTO ModerateActivity (UserID, AdminID) VALUES
(1, 101),
(2, 102),
(3, 103),
(4, 104),
(5, 105);

INSERT INTO Portfolio (PortfolioID, Balance) VALUES
(3001, 3505.00),
(3002, 45758.75),
(3003, 5000.00),
(3004, 6000.00),
(3005, 5763.60);

INSERT INTO Transaction (TransactionID, Amount, Type, PortfolioID) VALUES
(8001, 3500.00, 'Buy', 3001),
(8002, 5000.00, 'Sell', 3002),
(8003, 2700.00, 'Buy', 3003),
(8004, 4200.00, 'Sell', 3004),
(8005, 3100.00, 'Buy', 3005);

INSERT INTO Buy (TransactionID, AccountID) VALUES
(8001, 5001),
(8003, 5003),
(8005, 5005);

INSERT INTO Sell (TransactionID, AccountID) VALUES
(8002, 5002),
(8004, 5004);

INSERT INTO Assets (AssetID, AssetType, AssetName, MarketValue, PortfolioID, Quantity) VALUES
(9001, 'Bond', 'US10Y', 1000.00, 3003, 5),
(9002, 'Commodity', 'Gold', 2000.00, 3004, 3),
(9003, 'Stock', 'AAPL', 175.25, 3001, 20),
(9004, 'Stock', 'GOOGL', 2850.50, 3002, 10),
(9005, 'Stock', 'AMZN', 3450.75, 3002, 5),
(9006, 'Stock', 'TSLA', 720.45, 3005, 8);

INSERT INTO StocksCompany (AssetID) VALUES (9003), (9004), (9005), (9006);
INSERT INTO Bonds (AssetID) VALUES (9001);
INSERT INTO Commodities (AssetID) VALUES (9002);


INSERT INTO PerformanceChart (AssetID, MetricValue, Timestamp)
VALUES
(9003, 175.25, '2025-04-17 10:00:00');

INSERT INTO List (AssetID, AdminID) VALUES
(9001, 101),
(9002, 101),
(9003, 101),
(9004, 101),
(9005, 101),
(9006, 101);

ALTER TABLE `User`
ADD COLUMN `Username` VARCHAR(150) NULL
  AFTER `UserID`;

UPDATE `User`
  SET `Username` = CONCAT('user', UserID);


ALTER TABLE `User`
MODIFY COLUMN `Username` VARCHAR(150) NOT NULL;

ALTER TABLE `User`
ADD UNIQUE INDEX `ux_user_username` (`Username`);

