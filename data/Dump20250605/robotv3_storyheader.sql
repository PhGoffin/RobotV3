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
-- Table structure for table `storyheader`
--

DROP TABLE IF EXISTS `storyheader`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storyheader` (
  `storyheaderID` int NOT NULL AUTO_INCREMENT,
  `subprojectID` int NOT NULL,
  `label` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `comment` varchar(80) DEFAULT NULL,
  `position` varchar(20) NOT NULL,
  `active` int NOT NULL,
  `createdby` varchar(20) DEFAULT NULL,
  `created` varchar(20) DEFAULT NULL,
  `updatedby` varchar(20) DEFAULT NULL,
  `updated` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`storyheaderID`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storyheader`
--

LOCK TABLES `storyheader` WRITE;
/*!40000 ALTER TABLE `storyheader` DISABLE KEYS */;
INSERT INTO `storyheader` VALUES (1,1,'Create a SEA-2023 Contract','Create a specific contract: SEA-2023','1',1,'goffipl','01/03/2024','goffipl','14/06/2024'),(2,1,'Create a Direct Contract','Create a direct contract','2',1,'goffipl','01/03/2024','goffipl','08/03/2024'),(3,1,'Compass Opening Date','Reset the opening date','3',2,'goffipl','01/03/2024','goffipl','08/04/2024'),(5,3,'CRIS Sanity Check','CRIS Sanity Check','1',1,'goffipl','27/03/2024','goffipl','27/03/2024'),(6,12,'My first story','A very simple story without the need of a real webpage','1',1,'goffipl','03/04/2024','goffipl','03/04/2024'),(7,1,'SYGMA Substract Days','Using the ePROC SYGMA Tools Console to substract days to a contract','4',1,'goffipl','26/04/2024','goffipl','26/04/2024'),(8,13,'CTR Budget Contract','Create a CTR Budget Contract','1',1,'goffipl','14/05/2024','goffipl','14/05/2024'),(9,9,'Funds Reservation','Funds reservation story','1',1,'goffipl','27/05/2024','goffipl','27/05/2024'),(10,15,'Search for a specific Call','Search for a specific call','2',1,'goffipl','05/08/2024','goffipl','19/08/2024'),(11,14,'Sanity check','Sanity check on OPSYS','1',1,'goffipl','07/08/2024','goffipl','07/08/2024'),(12,15,'Create a Direct call','Create a Direct call','3',1,'goffipl','20/08/2024','goffipl','05/09/2024'),(13,16,'Create Organisation','Create a new organisation','1',1,'goffipl','30/08/2024','goffipl','30/08/2024'),(14,15,'Create an Indirect call','Create an Indirect call','4',1,'goffipl','05/09/2024','goffipl','05/09/2024'),(15,15,'Create a Twinning call','Create a twinning call','5',1,'goffipl','05/09/2024','goffipl','18/09/2024'),(16,15,'Create an Operating grant','Create an Operating grant','6',1,'goffipl','06/09/2024','goffipl','06/09/2024'),(17,15,'Warehouse','Manage info into the warehouse','11',1,'goffipl','17/09/2024','goffipl','13/11/2024'),(18,19,'PROSPECT Sanity Check','Sanity Check for PROSPECT ','1',1,'goffipl','23/09/2024','goffipl','23/09/2024'),(20,15,'Submit Offer','Submit offers','7',1,'goffipl','21/10/2024','goffipl','21/10/2024'),(21,15,'Submission Closure','Close the submission period','8',1,'goffipl','30/10/2024','goffipl','30/10/2024'),(23,15,'Evaluate Offers','Evaluate the offers','10',1,'goffipl','31/10/2024','goffipl','31/10/2024'),(24,15,'Update Deadlines','Update/Approve deadlines date/time','9',1,'goffipl','05/11/2024','goffipl','06/11/2024'),(25,21,'Sanity Check','Sanity Check on PADOR','1',1,'goffipl','22/11/2024','goffipl','22/11/2024'),(26,17,'Story test','a simple story','1',1,'goffipl','26/11/2024','goffipl','26/11/2024'),(27,15,'Batch','Batch process','1',1,'goffipl','28/11/2024','goffipl','28/11/2024'),(28,17,'Simple test','simple test','2',1,'goffipl','11/12/2024','goffipl','11/12/2024'),(29,17,'Test Performance','Test Performance','3',1,'goffipl','12/12/2024','goffipl','12/12/2024'),(30,22,'ToolsQA','Practice on a form','1',1,'goffipl','24/01/2025','goffipl','24/01/2025'),(32,23,'Without promo code','Buy Products without Promo code','1',1,'goffipl','21/04/2025','goffipl','22/04/2025'),(33,23,'Use valid promo code','Use a valid promo code','2',1,'goffipl','21/04/2025','goffipl','21/04/2025'),(34,23,'Use invalid promo code','Use an invalid promo code','3',1,'goffipl','21/04/2025','goffipl','21/04/2025'),(35,24,'Test Parameters','Slow down the tests','1',1,'goffipl','23/05/2025','goffipl','23/05/2025'),(36,24,'Store Vegetables & Fruits','Store to buy Vegetables and Fruits ','2',1,'goffipl','23/05/2025','goffipl','23/05/2025'),(38,24,'Java Docs','','3',1,'goffipl','05/06/2025','goffipl','05/06/2025');
/*!40000 ALTER TABLE `storyheader` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-05 14:53:05
