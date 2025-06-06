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
-- Table structure for table `suiteheader`
--

DROP TABLE IF EXISTS `suiteheader`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suiteheader` (
  `suiteheaderID` int NOT NULL AUTO_INCREMENT,
  `subprojectID` int NOT NULL,
  `label` varchar(40) NOT NULL,
  `comment` varchar(80) DEFAULT NULL,
  `position` varchar(20) NOT NULL,
  `active` int NOT NULL,
  `createdby` varchar(20) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updatedby` varchar(20) NOT NULL,
  `updated` varchar(20) NOT NULL,
  PRIMARY KEY (`suiteheaderID`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suiteheader`
--

LOCK TABLES `suiteheader` WRITE;
/*!40000 ALTER TABLE `suiteheader` DISABLE KEYS */;
INSERT INTO `suiteheader` VALUES (3,1,'Create a planned contract','Creation + prepare procedure','1',1,'goffipl','01/03/2024','goffipl','08/03/2024'),(4,1,'Create an offer','Accept the invitation + creation of the offer','2',1,'goffipl','01/03/2024','goffipl','08/03/2024'),(10,3,'CRIS Sanity','Perform a sanity check on CRIS','1',1,'goffipl','25/03/2024','goffipl','25/03/2024'),(11,12,'Increase Test 2 + 5','Add the scenario 2 and 3','1',1,'goffipl','03/04/2024','goffipl','03/04/2024'),(12,9,'Operational Initiation','Operational Initiation: Edit FR + Approve','1',1,'goffipl','04/06/2024','goffipl','04/06/2024'),(13,9,'Financial Initiation','Financial Initiation','2',1,'goffipl','05/06/2024','goffipl','05/06/2024'),(15,1,'Opening Date','Change the opening date in Compass','3',1,'goffipl','05/07/2024','goffipl','05/07/2024'),(16,14,'Sanity Check with notification','Opsys sanity check with a notification','1',1,'goffipl','02/08/2024','goffipl','02/08/2024'),(17,19,'PROSPECT Sanity','Sanity check on Prospect','1',1,'goffipl','23/09/2024','goffipl','23/09/2024'),(18,15,'Offer FA_OAC_Rejected_Overdue','Offer FA_OAC_Rejected_Overdue','1',1,'goffipl','22/10/2024','goffipl','22/10/2024'),(19,15,'Offer FA_TEC_Rej_insuffic_fin','Offer FA_TEC_Rej_insuffic_fin','2',1,'goffipl','22/10/2024','goffipl','22/10/2024'),(20,15,'Offer EL_VER_Reserve_list_excluded','Offer EL_VER_Reserve_list_excluded','3',1,'goffipl','22/10/2024','goffipl','22/10/2024'),(21,15,'Offer EL_VER_Reserve_list','EL_VER_Reserve_list','4',1,'goffipl','22/10/2024','goffipl','22/10/2024'),(22,15,'Offer EL_VER_Rejected','EL_VER_Rejected','5',1,'goffipl','22/10/2024','goffipl','22/10/2024'),(23,15,'Offer FA_TEC_Reserve_list_under_15000','FA_TEC_Reserve_list_under_15000','6',1,'goffipl','22/10/2024','goffipl','22/10/2024'),(24,15,'Offer FA_TEC_Reserve_list_above_15000','FA_TEC_Reserve_list_above_15000','7',1,'goffipl','22/10/2024','goffipl','22/10/2024'),(25,15,'Offer FA_TEC_Reserve_list_above_60000','FA_TEC_Reserve_list_above_60000','8',1,'goffipl','22/10/2024','goffipl','22/10/2024'),(26,15,'Offer FA_TEC_Reserve_list_below_60000','FA_TEC_Reserve_list_below_60000','9',1,'goffipl','22/10/2024','goffipl','22/10/2024'),(27,15,'Offer ACN_OAC_Rejected','ACN_OAC_Rejected','10',1,'goffipl','22/10/2024','goffipl','22/10/2024'),(28,17,'BatchSuite','A simple suite to use in a batch','1',1,'goffipl','15/11/2024','goffipl','15/11/2024'),(29,21,'Prospect Sanity','Sanity on Prospect','1',1,'goffipl','22/11/2024','goffipl','22/11/2024'),(30,17,'TestSuite','Just a test','2',1,'goffipl','26/11/2024','goffipl','26/11/2024'),(31,22,'ToolsQA','Setup + Execution','1',1,'goffipl','24/01/2025','goffipl','24/01/2025');
/*!40000 ALTER TABLE `suiteheader` ENABLE KEYS */;
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
