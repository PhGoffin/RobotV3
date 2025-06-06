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
-- Table structure for table `ruleheader`
--

DROP TABLE IF EXISTS `ruleheader`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ruleheader` (
  `ruleheaderID` int NOT NULL AUTO_INCREMENT,
  `rule` varchar(40) NOT NULL,
  `projectID` int NOT NULL,
  `comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `position` varchar(20) NOT NULL,
  `active` int NOT NULL,
  `createdby` varchar(20) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updatedby` varchar(20) NOT NULL,
  `updated` varchar(20) NOT NULL,
  PRIMARY KEY (`ruleheaderID`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ruleheader`
--

LOCK TABLES `ruleheader` WRITE;
/*!40000 ALTER TABLE `ruleheader` DISABLE KEYS */;
INSERT INTO `ruleheader` VALUES (1,'StoryError',1,'Manage the number of error on a story','13',1,'goffipl','01/03/2024','goffipl','07/03/2024'),(2,'ManageError',1,'Rule to manage the errors','14',1,'goffipl','01/03/2024','goffipl','07/03/2024'),(24,'Login ECAS',1,'ECAS Login for OPSYS','1',1,'goffipl','01/03/2024','goffipl','26/04/2024'),(25,'setCalendar',1,'Set a value into a calendar','9',1,'goffipl','01/03/2024','goffipl','07/03/2024'),(26,'SelectListbox',1,'A generic method to select a value in a listbox','10',1,'goffipl','01/03/2024','goffipl','07/03/2024'),(27,'Dummy Test Rules',1,'Test some functions without the need to call a real application','16',1,'goffipl','01/03/2024','goffipl','08/03/2024'),(28,'set Textarea',1,'Generic rule to set a value in a textarea field','12',1,'goffipl','01/03/2024','goffipl','07/03/2024'),(29,'SelectListboxV2',1,'Another generic method to select a value in a listbox','11',1,'goffipl','01/03/2024','goffipl','07/03/2024'),(30,'Login CRIS',2,'ECAS Login for CRIS','1',1,'goffipl','25/03/2024','goffipl','25/03/2024'),(31,'Take a print screen on  specific slot',2,'The slot is defined in the first parameter: 1 to 5','2',1,'goffipl','25/03/2024','goffipl','25/03/2024'),(32,'Login Compass',1,'Login for Compass eSubmisson','2',1,'goffipl','03/04/2024','goffipl','03/04/2024'),(33,'COMPASS Reference',1,'Create a reference for COMPASS','15',1,'goffipl','03/04/2024','goffipl','03/04/2024'),(37,'SelectListbox',2,'A generic method to select a value in a listbox. $P1= Label, $P2= Value','3',1,'goffipl','01/03/2024','goffipl','15/05/2024'),(38,'Claim a task',1,'Claim a task','4',1,'goffipl','30/05/2024','goffipl','30/05/2024'),(39,'Goto Task Page',1,'Depending of the data DirectLink open the URL or the dashboard','3',1,'goffipl','31/05/2024','goffipl','31/05/2024'),(40,'Extract Reference Number',1,'Extract the reference number of a Request for Service: SEA-2023-1234 = 1234','17',1,'goffipl','14/06/2024','goffipl','14/06/2024'),(41,'Define Upload',1,'Get information on the document to upload if necessary','5',1,'goffipl','28/06/2024','goffipl','28/06/2024'),(43,'Identify Company',1,'Identify the company based on the full name','6',1,'goffipl','28/06/2024','goffipl','28/06/2024'),(44,'Expert Rate',1,'Rate of Expert based on his category ($P1) --> $ExperFee + $ManagementFee','7',1,'goffipl','03/07/2024','goffipl','03/07/2024'),(45,'Extract Submission Reference Number',1,'Extract the Submision number of an offer','18',1,'goffipl','05/07/2024','goffipl','05/07/2024'),(46,'Evaluate Offer',1,'Process to evaluate an offer','8',1,'goffipl','05/07/2024','goffipl','05/07/2024'),(47,'DependencyVersion',1,'Extract the version of a dependency in the raw data','19',1,'goffipl','31/07/2024','goffipl','31/07/2024'),(48,'Test Rule',1,'A simple rule','20',1,'goffipl','31/07/2024','goffipl','31/07/2024'),(49,'Login ECAS',85,'ECAS Login for PROSPECT','1',1,'goffipl','01/03/2024','goffipl','05/08/2024'),(50,'Login ECAS',84,'ECAS Login for PADOR','1',1,'goffipl','01/03/2024','goffipl','05/08/2024'),(51,'Not on Monday',85,'Select a date (today + $P1). If date is Monday, add one day. result in $Date','2',1,'goffipl','08/08/2024','goffipl','22/08/2024'),(52,'Evaluation score',85,'Compute the score for a specific topic position. $P1 = max score/points/sequence','3',1,'goffipl','09/08/2024','goffipl','09/08/2024'),(53,'Search Book',85,'Select a value in the search book ($P1 = criteria for Input field)','4',1,'goffipl','21/08/2024','goffipl','21/08/2024'),(54,'Easy Rule',85,'A simple rule to be embeded into another rule','9',1,'goffipl','22/08/2024','goffipl','22/08/2024'),(55,'Blocking Error',85,'Manage bloking errors: $P1: Error code  - result in $BlockingError','7',1,'goffipl','22/08/2024','goffipl','23/08/2024'),(56,'Format Upload Document',85,'Format the filename: $P1: Title of the document $P2: Language $P3: file extension (.pdf)','6',1,'goffipl','23/08/2024','goffipl','23/08/2024'),(57,'SelectListbox',84,'Select a value ($P2) from a list with a label ($P1)','2',1,'goffipl','30/08/2024','goffipl','30/08/2024'),(58,'Tree selector',84,'$P1: Full code $P2: level (1 to 3)','3',1,'goffipl','02/09/2024','goffipl','02/09/2024'),(59,'Extract Version',85,'Extract the version for the string','10',1,'goffipl','23/09/2024','goffipl','23/09/2024'),(60,'Take a print screen in a specific slot',85,'Take a print screen in a specific slot','11',1,'goffipl','23/09/2024','goffipl','23/09/2024'),(61,'External Blocking Error',85,'Manage bloking errors: $P1: Error code  - result in $BlockingError','8',1,'goffipl','27/09/2024','goffipl','27/09/2024'),(62,'Call a scenario',85,'Call a scenario from a rule','12',1,'goffipl','24/10/2024','goffipl','24/10/2024'),(63,'Evaluate Offer Router',85,'Call the right scenario to evaluate the offer depending of the Title of the offer in $P1','13',1,'goffipl','25/10/2024','goffipl','25/10/2024'),(64,'Extract Last Name',85,'Extract the last name of the full name','5',1,'goffipl','28/10/2024','goffipl','28/10/2024'),(65,'Extract Version',84,'Extract the version for the string','4',1,'goffipl','23/09/2024','goffipl','23/09/2024'),(66,'Take a print screen in a specific slot',84,'Take a print screen in a specific slot','5',1,'goffipl','23/09/2024','goffipl','23/09/2024');
/*!40000 ALTER TABLE `ruleheader` ENABLE KEYS */;
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
