-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: robotv3
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dictionaryheader`
--

DROP TABLE IF EXISTS `dictionaryheader`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dictionaryheader` (
  `dictionaryheaderID` int NOT NULL AUTO_INCREMENT,
  `projectID` int NOT NULL,
  `code` varchar(40) NOT NULL,
  `comment` varchar(80) NOT NULL,
  `position` varchar(20) NOT NULL,
  `active` int NOT NULL,
  PRIMARY KEY (`dictionaryheaderID`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dictionaryheader`
--

LOCK TABLES `dictionaryheader` WRITE;
/*!40000 ALTER TABLE `dictionaryheader` DISABLE KEYS */;
INSERT INTO `dictionaryheader` VALUES (7,1,'@URL','All the links to the applications (in all the environments)','1',1),(9,1,'@OPSYS','Generic dictionary','2',1),(10,1,'@PORTFOLIO','All the Portfolio elements','3',1),(12,1,'@PLAN CONTRACT','Definition of the elements for the Planned contract','4',1),(14,2,'@CRIS','','2',1),(15,2,'@URL','All the CRIS URL','1',1),(17,1,'@COMPASS','Dictionary for COMPASS eSubmission and Green','9',1),(18,1,'@SYGMA','Dictionary for the ePROC SYGMA Tools','10',1),(19,1,'@FUNDS RESERVATION','Dictionary for the funds reservation','8',1),(20,1,'@RFS','Dictionary for the request for service','5',1),(21,1,'@F&T_Portal','Dictionary for the F&T Portal','6',1),(22,1,'@PRE-AWARD','Pre-award dictionary','7',1),(23,1,'@WAREHOUSE','Dictionary for the Warehouse on Confluence','11',1),(24,1,'@SANITY','Dictionary for the Sanity check','12',1),(25,85,'@PROSPECT','Generic dictionary for the PROSPECT Application','1',1),(26,85,'@URL','URLs for the PROSPECT application','3',1),(27,84,'@URL','URLs for the PADOR application','2',1),(28,84,'@PADOR','Generic dictionary for PADOR','1',1),(29,85,'@CALL','Dictionary for the Calls','5',1),(30,85,'@TRANSLATION','Translation of the words','4',1),(31,84,'@ORGANISATION','Dictionary for the organisation','3',1),(32,85,'@WAREHOUSE','Dictionary for the Prospect Warehouse','7',1),(33,85,'@EU PORTAL','EU Funding & Tenders Portal','6',1),(35,85,'@PROSPECT EXTERNAL','Dictionary for the Prospect External','2',1),(36,86,'@URL','Links to Demo','1',1),(37,86,'@TOOLSQA','Xpath on the form Tools QA','3',1),(38,86,'@TUTO','Xpath on the form for Tutorials point','4',1),(40,87,'@URL','','1',1),(41,87,'@Shop','Elements of the shop website','2',1),(42,88,'@URL','All the links to the application','1',1),(43,88,'@Store','All xpath/css for the fake webstore','2',1),(44,88,'@Shop','Vegetables & Fruits shop','3',1),(45,88,'@Practice','Practice webpage','4',1),(46,88,'@Java','','5',1);
/*!40000 ALTER TABLE `dictionaryheader` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-05 14:53:10
