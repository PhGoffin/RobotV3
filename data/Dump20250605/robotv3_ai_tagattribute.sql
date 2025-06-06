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
-- Table structure for table `ai_tagattribute`
--

DROP TABLE IF EXISTS `ai_tagattribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_tagattribute` (
  `tagattributeID` int NOT NULL AUTO_INCREMENT,
  `projectID` int NOT NULL,
  `trainingID` int NOT NULL,
  `tagelementID` int NOT NULL,
  `level` int NOT NULL,
  `pathID` int NOT NULL,
  `pathValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `attributeID` int NOT NULL,
  `value` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `original` varchar(300) NOT NULL,
  `position` varchar(20) NOT NULL,
  `active` int NOT NULL,
  PRIMARY KEY (`tagattributeID`)
) ENGINE=InnoDB AUTO_INCREMENT=12068 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_tagattribute`
--

LOCK TABLES `ai_tagattribute` WRITE;
/*!40000 ALTER TABLE `ai_tagattribute` DISABLE KEYS */;
INSERT INTO `ai_tagattribute` VALUES (11746,88,359,773,0,518,'Root',53,'INPUT','INPUT','1',1),(11747,88,359,773,0,518,'Root',54,'submit','submit','2',1),(11748,88,359,773,0,518,'Root',55,'login','login','3',0),(11749,88,359,773,0,518,'Root',56,'login','login','4',0),(11750,88,359,773,0,518,'Root',57,'true','true','5',1),(11751,88,359,773,0,518,'Root',58,'false','false','6',0),(11752,88,359,773,0,518,'Root',59,'??','btn btn-block login-btn','7',1);
/*!40000 ALTER TABLE `ai_tagattribute` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-05 14:53:03
