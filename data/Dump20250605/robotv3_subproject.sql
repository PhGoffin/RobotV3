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
-- Table structure for table `subproject`
--

DROP TABLE IF EXISTS `subproject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subproject` (
  `subprojectID` int NOT NULL AUTO_INCREMENT,
  `projectID` int NOT NULL,
  `subproject` varchar(20) NOT NULL,
  `Comment` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdby` varchar(20) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updatedby` varchar(20) NOT NULL,
  `updated` varchar(20) NOT NULL,
  `position` varchar(20) NOT NULL,
  PRIMARY KEY (`subprojectID`,`projectID`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subproject`
--

LOCK TABLES `subproject` WRITE;
/*!40000 ALTER TABLE `subproject` DISABLE KEYS */;
INSERT INTO `subproject` VALUES (1,1,'Pre-award','','goffipl','01/03/2024','goffipl','08/03/2024','1'),(2,1,'Post-award','','goffipl','01/03/2024','goffipl','07/03/2024','2'),(3,2,'CRIS Sanity','Sanity tests for CRIS','goffipl','01/03/2024','paricat','24/05/2024','1'),(6,2,'The Lab','A place to test new scenarios','goffipl','01/03/2024','goffipl','03/04/2024','3'),(9,1,'Funds Reservation','Funds Reservation','goffipl','01/03/2024','goffipl','04/06/2024','3'),(12,1,'The Lab','Just for testing purpose','goffipl','03/04/2024','goffipl','03/04/2024','5'),(13,2,'CRIS Contract','CRIS Contract','goffipl','14/05/2024','goffipl','14/05/2024','2'),(14,1,'Sanity','Sanity check','goffipl','30/07/2024','goffipl','30/07/2024','4'),(15,85,'Call for Proposal','Call for Proposal management','goffipl','05/08/2024','goffipl','05/08/2024','1'),(16,84,'Contractors','Contractors management','goffipl','05/08/2024','goffipl','05/08/2024','1'),(17,85,'The Labs','A place to test new scenarios','goffipl','05/08/2024','goffipl','05/08/2024','4'),(18,84,'The Labs','A place to test new scenarios','goffipl','30/08/2024','goffipl','30/08/2024','3'),(19,85,'Sanity','Sanity check','goffipl','23/09/2024','goffipl','23/09/2024','3'),(21,84,'Sanity','Sanity check','goffipl','22/11/2024','goffipl','22/11/2024','2'),(22,86,'Labs','Labs to practice tests','goffipl','23/01/2025','goffipl','23/01/2025','1'),(23,87,'Cart','Buy veg & fruits','goffipl','21/04/2025','goffipl','23/04/2025','1'),(24,88,'Labs','Testing the new backend','goffipl','21/05/2025','goffipl','21/05/2025','1');
/*!40000 ALTER TABLE `subproject` ENABLE KEYS */;
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
