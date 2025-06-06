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
-- Table structure for table `ai_selector`
--

DROP TABLE IF EXISTS `ai_selector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_selector` (
  `selectorID` int NOT NULL AUTO_INCREMENT,
  `projectID` int NOT NULL,
  `name` varchar(40) NOT NULL,
  `endTag` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `comment` varchar(80) DEFAULT NULL,
  `position` varchar(20) NOT NULL,
  `active` int NOT NULL,
  PRIMARY KEY (`selectorID`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_selector`
--

LOCK TABLES `ai_selector` WRITE;
/*!40000 ALTER TABLE `ai_selector` DISABLE KEYS */;
INSERT INTO `ai_selector` VALUES (1,1,'Button','ux-button|button','Label of the button','1',1),(2,1,'Menu','div','Name of the menu','2',1),(3,1,'Sub Menu','span','Name of the sub menu','3',1),(4,1,'Input Field','input|textarea','Name of the label of the field','4',1),(5,1,'Right Input Field','input|textarea','Name of the label of the field','5',1),(6,1,'Calendar','input','Name of the calendar field','6',1),(7,1,'Listbox','select|input','Label of the listbox','7',1),(8,1,'Display Field','div|span','Label of the field','8',1),(9,1,'Right Display Field','input','Label of the field','9',1),(10,1,'Navigation','div|span','Name of the navigation menu','10',1),(11,1,'Navigation Icon','span','Name of the navigation menu','11',1),(12,1,'Table','table|div','Name of a column in the header','12',1),(13,1,'Radio Checkbox','label|input','Name of the radio or checkbox','13',1),(14,1,'Text Editor','div','Label of the field','14',1),(15,1,'Title','h5|div|uxpanelheader','Text of the title','15',1),(16,1,'Card','a','Reference of the card','16',1),(33,2,'Button','button|input|div','Label of the button','1',1),(34,2,'Menu','div','Label of the menu','2',1),(35,2,'Sub Menu','a','Label of the sub menu','3',1),(36,2,'Input Field','input|textarea','Label of the field','4',1),(37,2,'Right Input Field','input','Right label of the field','5',1),(38,2,'Listbox','select','Label of the listbox','6',1),(39,2,'Display Field','input|a','Label of the field','7',1),(40,2,'Right Display Field','input','Right label of the field','8',1),(41,2,'Navigation','div|span','Name of the navigation menu','9',1),(42,2,'Tab','td|div','Name of the tab','10',1),(43,2,'Table','table','Name of a header in the table','11',1),(44,2,'Section','td','Name of the section','12',1),(45,1,'Test','ux-button|button','To test the new pattern','17',1),(46,85,'Button','button|input|div','Label of the button','1',1),(47,85,'Menu','a','Label of the menu','2',1),(48,85,'Sub Menu','a','Label of the sub menu','3',1),(49,85,'Input Field','input|textarea','Label of the field','4',1),(50,85,'Right Input Field','input','Right label of the field','5',1),(51,85,'Listbox','select','Label of the listbox','6',1),(52,85,'Display Field','input|a','Label of the field','8',1),(53,85,'Right Display Field','input','Right label of the field','9',1),(54,85,'Navigation','div|span','Name of the navigation menu','10',1),(55,85,'Tab','td|div','Name of the tab','11',1),(56,85,'Table','table','Name of a header in the table','12',1),(57,85,'Section','td','Name of the section','13',1),(58,85,'Title','h2|h3','Title of a screen','14',1),(59,85,'Criteria','input|select','Search criteria','15',1),(60,85,'Radio Checkbox','input','Radio Checkbox','7',1),(62,84,'Button','button|input|div','Label of the button','1',1),(63,84,'Menu','a','Label of the menu','2',1),(64,84,'Sub Menu','a','Label of the sub menu','3',1),(65,84,'Input Field','input|textarea','Label of the field','4',1),(66,84,'Right Input Field','input','Right label of the field','5',1),(67,84,'Listbox','a','Anchor on the listbox','6',1),(68,84,'Display Field','input|a','Label of the field','7',1),(69,84,'Right Display Field','input','Right label of the field','8',1),(70,84,'Navigation','div|span','Name of the navigation menu','9',1),(71,84,'Tab','td|div','Name of the tab','10',1),(72,84,'Table','table','Name of a header in the table','11',1),(73,84,'Section','td','Name of the section','12',1),(74,84,'Title','h2|h3','Title of the screen','13',1),(75,84,'Criteria','input|select','Criteria in the form','14',1),(76,84,'Radio Checkbox','input','Radio button or Checkbox','15',1),(77,88,'Button','button|input|div','Label of the button','1',1),(78,88,'Menu','div','Label of the menu','2',1),(80,88,'Input Field','input|textarea','Label of the field','4',1),(82,88,'Listbox','select','Label of the listbox','6',1),(87,88,'Table','table','Name of a header in the table','11',1),(89,87,'Button','button|input|div','Label of the button','1',1),(90,87,'Menu','div','Label of the menu','2',1),(91,87,'Sub Menu','a','Label of the sub menu','3',1),(92,87,'Input Field','input|textarea','Label of the field','4',1),(93,87,'Right Input Field','input','Right label of the field','5',1),(94,87,'Listbox','select','Label of the listbox','6',1),(95,87,'Display Field','input|a','Label of the field','7',1),(96,87,'Right Display Field','input','Right label of the field','8',1),(97,87,'Navigation','div|span','Name of the navigation menu','9',1),(98,87,'Tab','td|div','Name of the tab','10',1),(99,87,'Table','table','Name of a header in the table','11',1),(100,87,'Section','td','Name of the section','12',1);
/*!40000 ALTER TABLE `ai_selector` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-05 14:53:09
