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
-- Table structure for table `userproject`
--

DROP TABLE IF EXISTS `userproject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userproject` (
  `userprojectID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `workspaceID` int NOT NULL,
  `projectID` int NOT NULL,
  `roleID` int NOT NULL,
  `preference` int NOT NULL,
  `createdby` varchar(20) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updatedby` varchar(20) NOT NULL,
  `updated` varchar(20) NOT NULL,
  PRIMARY KEY (`userprojectID`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userproject`
--

LOCK TABLES `userproject` WRITE;
/*!40000 ALTER TABLE `userproject` DISABLE KEYS */;
INSERT INTO `userproject` VALUES (1,2,1,1,3,10,'goffipl','01/03/2024','goffipl','05/08/2024'),(2,2,1,2,2,20,'goffipl','01/03/2024','goffipl','05/08/2024'),(3,4,1,1,3,99,'goffipl','01/03/2024','goffipl','27/03/2024'),(27,4,1,2,3,1,'goffipl','01/03/2024','goffipl','07/03/2024'),(37,8,1,2,1,99,'goffipl','01/03/2024','goffipl','07/03/2024'),(38,8,1,1,1,1,'goffipl','01/03/2024','goffipl','07/03/2024'),(41,105,1,1,1,1,'goffipl','08/04/2024','goffipl','08/04/2024'),(42,2,1,84,3,2,'goffipl','05/08/2024','goffipl','05/08/2024'),(43,2,1,85,3,1,'goffipl','05/08/2024','goffipl','05/08/2024'),(44,2,1,86,3,99,'goffipl','23/01/2025','goffipl','23/01/2025'),(46,2,1,88,3,99,'goffipl','21/05/2025','goffipl','21/05/2025'),(47,4,1,88,3,99,'goffipl','02/06/2025','goffipl','02/06/2025');
/*!40000 ALTER TABLE `userproject` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-05 14:53:04
