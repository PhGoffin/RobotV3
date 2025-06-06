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
-- Table structure for table `datasetheader`
--

DROP TABLE IF EXISTS `datasetheader`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `datasetheader` (
  `datasetheaderID` int NOT NULL AUTO_INCREMENT,
  `subprojectID` int NOT NULL,
  `code` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `position` varchar(20) NOT NULL,
  `active` int NOT NULL,
  PRIMARY KEY (`datasetheaderID`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datasetheader`
--

LOCK TABLES `datasetheader` WRITE;
/*!40000 ALTER TABLE `datasetheader` DISABLE KEYS */;
INSERT INTO `datasetheader` VALUES (1,1,'#DATA','Generic dataset','2',1),(8,1,'#SEA-2023 Lot 1','Dataset for the contracts SEA-2023 Lot 1','3',1),(17,1,'#PHIL','created by: goffipl','5',1),(18,3,'#DATA','Generic Data for CRIS','1',1),(20,3,'#SANITY','Data concerning the Sanity check','2',1),(21,12,'#DATA','Generic Data for the Lab','1',1),(22,13,'#CTR Budget','Dataset for the CTR Budget Contract','2',1),(23,13,'#Generic','Generic dataset to store common data like the environment for the tests','1',1),(24,6,'#Generic','Generic dataset','1',1),(25,6,'#CTR Budget','Dataset for the test CTR Budget','2',1),(26,9,'#DATA','Generic Data to be used for the test','1',1),(27,9,'#FundsReservation','','2',1),(30,1,'#Contractors','Definition of the contractors','4',1),(31,1,'#PEOPLE','people: Generic last name and first name ','1',1),(32,12,'#SEA-2023 Lot 1','Dataset for the contracts SEA-2023 Lot 1','2',1),(33,14,'#DATA','Generic dataset','1',1),(34,17,'#Test','Data for a sample test','1',1),(36,15,'#TEST','Data for sample test','1',1),(37,15,'#DIRECT Lot','Direct management with Lot(s)','3',1),(40,18,'#TEST','Dataset for the tests','1',1),(41,16,'#Organisation 1','Fake organisation 1','1',1),(42,15,'#DIRECT Without Lot','Direct management without Lot','4',1),(43,15,'#INDIRECT Lot','Indirect management with Lot(s) (publication only)','6',1),(44,15,'#INDIRECT Without Lot','Indirect management without Lot(s) (Publication only)','7',1),(45,15,'#TWINNING','Twinning (publication only)','8',1),(46,15,'#OPERATING Lot','Operating grant with Lot(s) (publication only)','9',1),(47,15,'#OPERATING Without Lot','Operating grant without Lot(s) (publication only)','10',1),(48,15,'#TWINNING DATA','Twinning (publication only)','12',1),(49,15,'#OPERATING DATA','Operating grant with Lot(s) (publication only)','13',1),(50,15,'#INDIRECT DATA','Indirect management with Lot(s) (publication only)','14',1),(51,15,'#WAREHOUSE','Data for the process of the warehouse','11',1),(52,15,'#DIRECT DATA','Direct management with Lot(s)','15',1),(53,19,'#SANITY','Data for the sanity check','1',1),(54,15,'#DIRECT Offer','Data to sumbmit an offer','5',1),(55,15,'#DIRECT RESTRICTED DATA NO LOTS','Direct management Restricted without Lots','16',1),(56,15,'#FA_OAC_Rejected_Overdue','Data to sumbmit an offer','20',1),(57,15,'#FA_TEC_Rej_insuffic_fin','Data to sumbmit an offer','21',1),(58,15,'#EL_VER_Reserve_list_excluded','Data to sumbmit an offer','22',1),(59,15,'#EL_VER_Reserve_list','Data to sumbmit an offer','23',1),(61,15,'#EL_VER_Rejected','Data to sumbmit an offer','24',1),(62,15,'#FA_TEC_Reserve_list_under_15000','Data to sumbmit an offer','25',1),(63,15,'#FA_TEC_Reserve_list_above_15000','Data to sumbmit an offer','26',1),(64,15,'#FA_TEC_Reserve_list_above_60000','Data to sumbmit an offer','27',1),(65,15,'#FA_TEC_Reserve_list_below_60000','Data to sumbmit an offer','28',1),(66,15,'#ACN_OAC_Rejected','Data to sumbmit an offer','29',1),(67,15,'#DIRECT RESTRICTED DATA ONE LOT','Direct management Restricted with one Lot','17',1),(74,15,'#BATCH','Dataset to execute scenarios in a batch','2',1),(75,17,'#BATCH','Dataset to execute scenarios in a batch','2',1),(76,14,'#BATCH','Dataset to execute scenarios in a batch','2',1),(77,21,'#SANITY','Data for the sanity check','1',1),(80,15,'#DIRECT OPEN DATA NO LOTS','Direct management Open without Lots','18',1),(82,15,'#DIRECT DEV RESTRICTED DATA NO LOTS','Direct management Restricted without Lots','19',1),(83,22,'#ToolQA01','Data set 01 for the form Tools QA','1',1),(84,23,'#My Cart_WithoutPromo','List of veg & fruits to buy without promo code','1',1),(85,23,'#My Cart_Promo','List of veg & fruits to buy with promo code','2',1),(86,23,'#My Cart_Invalid Promo','List of veg & fruits to buy with invalid promo code','3',1),(87,24,'#My Cart_WithoutPromo','List of veg & fruits to buy without promo code','1',1),(88,24,'#My Cart_Promo','List of veg & fruits to buy with promo code','2',1),(89,24,'#My Cart_Invalid Promo','List of veg & fruits to buy with invalid promo code','3',1);
/*!40000 ALTER TABLE `datasetheader` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-05 14:53:06
