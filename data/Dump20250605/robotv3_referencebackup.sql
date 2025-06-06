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
-- Table structure for table `referencebackup`
--

DROP TABLE IF EXISTS `referencebackup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referencebackup` (
  `backupID` int NOT NULL AUTO_INCREMENT,
  `backupheaderID` int NOT NULL,
  `code` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `comment` varchar(80) DEFAULT NULL,
  `position` varchar(20) NOT NULL,
  `active` int NOT NULL,
  PRIMARY KEY (`backupID`)
) ENGINE=InnoDB AUTO_INCREMENT=524 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referencebackup`
--

LOCK TABLES `referencebackup` WRITE;
/*!40000 ALTER TABLE `referencebackup` DISABLE KEYS */;
INSERT INTO `referencebackup` VALUES (91,10,'**','** Contract references','no comment 123','3',2),(92,10,'PC Ref','\'PC-403761\'','Plan Contract Reference','7',1),(93,10,'**','Dataset','','1',2),(94,10,'Dataset','SEA-2023','Dataset to test the SEA-2023','2',1),(95,10,'ProCat','Specific','Specific or Global contract','5',1),(96,10,'ProRef','SEA-2023','Procedure of the contract','6',1),(97,10,'RfSRef','SEA-2023-2336','Reference of the Request for service','8',1),(98,10,'EU Amount','300','EU Amount Roberto','9',1),(99,10,'Error Nb','0','','10',1),(100,10,'Scenario Name','Create a Planned Contract in OPSYS','Name of the current scenario','4',1),(101,10,' StoryError',' 11','','11',1),(102,10,' STORY',' STOP','','12',1),(103,10,'Title','\'MyWorkplace default\'','Title of the screen','13',1),(202,15,'**','** Contract references','no comment 123','3',2),(203,15,'PC Ref','PC-403761','Plan Contract Reference','8',1),(204,15,'**','Dataset','','1',2),(205,15,'Dataset','SEA-2023','Dataset to test the SEA-2023','2',1),(206,15,'ProCat','Specific','Specific or Global contract','5',1),(207,15,'Procedure Type','SEA-2023','Procedure of the contract','6',1),(208,15,'RfSRef','SEA-2023-2336','Reference of the Request for service','9',1),(209,15,'EU Amount','1000','EU Amount','10',1),(210,15,'Error Nb','0','','11',1),(211,15,'Scenario Name','Multiply by 10','Name of the current story','4',1),(212,15,' STORY',' STOP','','12',1),(213,15,'Title','MyWorkplace default','Title of the screen','13',1),(214,15,'Test','7','','14',1),(215,15,'Suite Name','Suite Test','Name of the current suite','15',1),(216,15,'Story Name','Multiply by 10','Name of the current story','16',1),(217,15,'RuleWizard','','temporary wizard save','17',1),(218,15,'Story Last 4','10','last execution of the story (success)','18',1),(219,15,'Suite Error 8','<N/A>','Position in the suite in case of error','19',1),(220,15,'Suite Error 0','<N/A>','Position in the suite in case of error','20',1),(221,15,'Story Status 1/4','OK=11=0=','Position in the story (Success)','21',1),(222,15,'Story Last 1','3=23','Last story executed','22',1),(223,15,'TEST Status','1','Test OK','23',1),(224,15,'Story Last 12','6=22','Last story executed','24',1),(225,15,'Story Status 12/6','ERROR=22=0=','Position in the story (Error)','25',1),(226,15,'Suite Error 11','<N/A>','Position in the suite in case of error','26',1),(227,15,'Procedure Number','24775','Numeric part of the reference','7',1),(228,15,'Execution Status','0','Error during the execution of the Test','27',1),(229,15,'Story Status 1/3','OK=23=0=','Position in the story (Success)','28',1),(482,23,'**','** Contract references','no comment 123','3',2),(483,23,'PC Ref','PC-406959','Plan Contract Reference','9',1),(484,23,'**','Dataset','','1',2),(485,23,'Dataset','SEA-2023 Lot 1','Dataset to be used for the test','2',1),(486,23,'ProCat','Specific','Specific or Global contract','5',1),(487,23,'Procedure Type','SEA-2023','Procedure of the contract','6',1),(488,23,'RfSRef','SEA-2023-2336','Reference of the Request for service','10',1),(489,23,'EU Amount','11000','Max EU Amount','11',1),(490,23,'Error Nb','0','','12',1),(491,23,'Scenario Name','Prepare the Procedure','Name of the current scenario','4',1),(492,23,' STORY',' STOP','','17',1),(493,23,'Title','MyWorkplace default','Title of the screen','16',1),(494,23,'Test','1','Dummy Test','15',1),(495,23,'Suite Name','Suite Test','Name of the current suite','18',1),(496,23,'Story Name','3. Launch the Workflow','Name of the current story','19',1),(497,23,'RuleWizard','','temporary wizard save','20',1),(498,23,'Story Last 4','10','last execution of the story (success)','21',1),(499,23,'Suite Error 8','<N/A>','Position in the suite in case of error','22',1),(500,23,'Suite Error 0','<N/A>','Position in the suite in case of error','23',1),(501,23,'Story Status 1/4','OK=11=0=','Position in the story (Success)','24',1),(502,23,'Story Last 1','7=24','Last story executed','25',1),(503,23,'TEST Status','1','Test OK','26',1),(504,23,'Story Last 12','6=22','Last story executed','27',1),(505,23,'Story Status 12/6','ERROR=22=0=','Position in the story (Error)','28',1),(506,23,'Suite Error 11','<N/A>','Position in the suite in case of error','29',1),(507,23,'Procedure Number','26056','Procedure number of the contract','7',1),(508,23,'Execution Status','1','Test OK','30',1),(509,23,'Story Status 1/3','OK=23=0=','Position in the story (Success)','31',1),(510,23,'Emergency Stop','0','Emergency stop: 1 or 0','32',1),(511,23,'AI Analysis12','15=Title=Tasks=Tasks=2=39=To test a function in OPSYS','Last story executed','33',1),(512,23,'Contract Number','123456','Reference of the Contract number (E.g.: 30001234)','8',1),(513,23,'Subtract Days','5','Enter the number of day(s) to subtract to the contract','14',1),(514,23,'Error Info','Unknown error detected','Error detected during the execution','13',1),(515,23,'Story Status 1/7','ERROR=24=0=','Position in the story (Error)','34',1),(516,23,'AI Analysis_12','7=Listbox=Grant Type==2=39=To test a function in OPSYS Acceptance=false=2','Last AI Dashboard parameters','35',1),(517,23,'Environment','ACC','Environment to be used for the test','36',1),(518,23,'Story Status 9/9','OK=29=0=','Position in the story (Success)','37',1),(519,23,'Story Last 9','9=30','Last story executed','38',1),(520,23,'AI Analysis_9','15=Title=Funds Reservation==2===true=0','Last AI Dashboard parameters','39',1),(521,23,'Funds Reservation Reference','JAG.SUM.59615N','Reference of the Funds Reservation','40',1),(522,23,'Funds Reservation Status','Draft','Status of the Funds Reservation','41',1),(523,23,'AI Analysis_1','1=Button===2===false=0','Last AI Dashboard parameters','9999',1);
/*!40000 ALTER TABLE `referencebackup` ENABLE KEYS */;
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
