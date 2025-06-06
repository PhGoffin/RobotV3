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
-- Table structure for table `suite`
--

DROP TABLE IF EXISTS `suite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suite` (
  `suiteID` int NOT NULL AUTO_INCREMENT,
  `suiteheaderID` int NOT NULL,
  `scenarioID` int NOT NULL,
  `comment` varchar(80) DEFAULT NULL,
  `position` varchar(20) NOT NULL,
  `active` int NOT NULL,
  PRIMARY KEY (`suiteID`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suite`
--

LOCK TABLES `suite` WRITE;
/*!40000 ALTER TABLE `suite` DISABLE KEYS */;
INSERT INTO `suite` VALUES (11,3,10,'Create a planned contract','1',1),(12,3,7,'Prepare a planned contract','2',1),(16,10,35,'Setup the sanity check on STAGING','3',1),(17,10,23,'Sanity Check on a specific environment: STAGING','4',1),(18,10,33,'Setup the sanity check: PRODUCTION','1',1),(20,10,23,'Sanity Check on a specific environment: PRODUCTION','2',1),(21,11,44,'Scenario 2: Increase $Test by 1','1',1),(22,11,45,'Scenario 3: Increase $Test by 1 + 5','2',1),(23,12,71,'Operational Initiation','1',1),(24,12,73,'Operational Initiation Approve','2',1),(25,13,75,'Financial Initiation','1',1),(26,13,76,'Financial Initiation Approve','2',1),(27,15,38,'COMPASS eSubmission to close Offer Period','1',1),(28,15,52,'Compass Green to prepare the opening','2',1),(29,16,98,'Sanity check on INT','2',1),(30,16,95,'Sanity check on ACC','1',1),(31,17,144,'Setup the sanity check on Production','1',1),(32,17,142,'Sanity Check on a specific environment','2',1),(33,17,143,'Setup the sanity check on Acceptance','5',1),(34,17,142,'Sanity Check on a specific environment','6',1),(35,18,152,'Set up for the submission of an offer: #FA_OAC_Rejected_Overdue','1',1),(36,18,149,'Submit an offer on EU Funding & Tenders Portal','2',1),(37,19,155,'Set up for the submission of an offer: #FA_TEC_Rej_insuffic_fin','1',1),(38,19,149,'Submit an offer on EU Funding & Tenders Portal','2',1),(39,20,156,'Set up for the submission of an offer: #EL_VER_Reserve_list_excluded','1',1),(40,20,149,'Submit an offer on EU Funding & Tenders Portal','2',1),(41,21,157,'Set up for the submission of an offer: #EL_VER_Reserve_list','1',1),(42,21,149,'Submit an offer on EU Funding & Tenders Portal','2',1),(43,22,158,'Set up for the submission of an offer: #EL_VER_Rejected','1',1),(44,22,149,'Submit an offer on EU Funding & Tenders Portal','2',1),(46,23,159,'Set up for the submission of an offer: #FA_TEC_Reserve_list_under_15000','1',1),(47,23,149,'Submit an offer on EU Funding & Tenders Portal','2',1),(49,24,160,'Set up for the submission of an offer: #FA_TEC_Reserve_list_above_15000','1',1),(50,24,149,'Submit an offer on EU Funding & Tenders Portal','2',1),(52,25,161,'Set up for the submission of an offer: #FA_TEC_Reserve_list_above_60000','1',1),(53,25,149,'Submit an offer on EU Funding & Tenders Portal','2',1),(55,26,162,'Set up for the submission of an offer: #FA_TEC_Reserve_list_below_60000','1',1),(56,26,149,'Submit an offer on EU Funding & Tenders Portal','2',1),(58,27,163,'Set up for the submission of an offer: #ACN_OAC_Rejected','1',1),(59,27,149,'Submit an offer on EU Funding & Tenders Portal','2',1),(60,28,180,'Small scenario to use in a batch','1',1),(61,28,181,'Small scenario to use in a batch','2',1),(62,17,189,'Setup the sanity check on TEST','3',1),(63,17,142,'Sanity Check on a specific environment','4',1),(64,29,192,'Setup the sanity check on Production','1',1),(65,29,193,'Sanity Check on a specific environment','2',1),(66,29,191,'Setup the sanity check on ACCEPTANCE','3',1),(67,29,193,'Sanity Check on a specific environment','4',1),(68,29,190,'Setup the sanity check on TEST','5',1),(69,29,193,'Sanity Check on a specific environment','6',1),(70,30,105,'First test with PROSPECT','1',1),(71,31,215,'Setup for the scenario Tools QA Form','1',1),(72,31,214,'Practice automated tests on form','2',1);
/*!40000 ALTER TABLE `suite` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-05 14:53:07
