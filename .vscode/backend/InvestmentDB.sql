
USE InvestmentDB;

CREATE TABLE User (
	UserID INT NOT NULL PRIMARY KEY,
	Name VARCHAR(100) NOT NULL,
	Email VARCHAR(100) NOT NULL
);
CREATE TABLE Admin (
	AdminID INT NOT NULL PRIMARY KEY
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

INSERT INTO User (UserID, Name, Email) VALUES
(1, 'Alice Smith', 'alice@example.com'),
(2, 'Bob Johnson', 'bob@example.com'),
(3, 'Carol Lee', 'carol@example.com'),
(4, 'David Chen', 'david@example.com'),
(5, 'Eva Martin', 'eva@example.com');

INSERT INTO Admin (AdminID) VALUES
(101),
(102),
(103),
(104),
(105);

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
(3001, 20000.00),
(3002, 15000.00),
(3003, 17000.00),
(3004, 9500.00),
(3005, 13400.00);

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
