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
-- Table structure for table `ai_attribute`
--

DROP TABLE IF EXISTS `ai_attribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_attribute` (
  `attributeID` int NOT NULL AUTO_INCREMENT,
  `projectID` int NOT NULL,
  `name` varchar(40) NOT NULL,
  `first` int NOT NULL,
  `intermediate` int NOT NULL,
  `last` int NOT NULL,
  `comment` varchar(80) DEFAULT NULL,
  `position` varchar(20) NOT NULL,
  `active` int NOT NULL,
  PRIMARY KEY (`attributeID`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_attribute`
--

LOCK TABLES `ai_attribute` WRITE;
/*!40000 ALTER TABLE `ai_attribute` DISABLE KEYS */;
INSERT INTO `ai_attribute` VALUES (53,88,'tagName',3,3,3,'Initial version from 15/04/2024','1',1),(54,88,'type',5,1,5,'Initial version from 15/04/2024','2',1),(55,88,'id',1,1,1,'Initial version from 15/04/2024','3',0),(56,88,'name',1,1,1,'Initial version from 15/04/2024','4',0),(57,88,'display',1,1,1,'Initial version from 15/04/2024','5',1),(58,88,'disabled',1,1,1,'Initial version from 15/04/2024','6',0),(59,88,'class',1,1,1,'Initial version from 15/04/2024','7',1);
/*!40000 ALTER TABLE `ai_attribute` ENABLE KEYS */;
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
