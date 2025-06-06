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
-- Table structure for table `ai_natural`
--

DROP TABLE IF EXISTS `ai_natural`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_natural` (
  `naturalID` int NOT NULL AUTO_INCREMENT,
  `naturalheaderID` int NOT NULL,
  `code` varchar(80) NOT NULL,
  `language` varchar(2) NOT NULL,
  `label` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `comment` varchar(80) DEFAULT NULL,
  `position` varchar(20) NOT NULL,
  `active` int NOT NULL,
  PRIMARY KEY (`naturalID`)
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_natural`
--

LOCK TABLES `ai_natural` WRITE;
/*!40000 ALTER TABLE `ai_natural` DISABLE KEYS */;
INSERT INTO `ai_natural` VALUES (3,1,'_the','EN','*','Reject The','1',1),(4,1,'_a','EN','*',' ','2',1),(6,1,'_need','EN','*','*','4',1),(7,1,'_to','EN','*','*','5',1),(8,2,'_detect','EN','#detectGUI','*','1',1),(9,2,'_find','EN','#detectGUI','*','2',1),(10,3,'_field','EN','<field>','*','1',1),(11,3,'_list','EN','<list>','*','9',1),(13,3,'_checkbox','EN','<checkbox>','*','14',1),(16,3,'_radio','EN','<radio>','*','18',1),(17,3,'_radiobutton','EN','<radio>','*','19',1),(18,3,'_before','EN','<before>','*','25',1),(19,3,'_after','EN','<after>','*','26',1),(20,3,'_input','EN','<input>','*','2',1),(21,3,'_<input><field>','EN','&element:Input Field','*','5',1),(22,3,'_<field>','EN','&element:Input Field','*','4',1),(23,3,'_hidden','EN','<hidden>','*','6',1),(24,3,'_<input>','EN','&element:Input Field','*','3',1),(25,3,'_<hidden><field>','EN','&element:hidden Field','*','8',1),(26,3,'_<hidden>','EN','&element:Hidden Field','*','7',1),(27,3,'_no','EN','<no>','*','27',1),(28,3,'_wait','EN','<wait>','*','28',1),(29,3,'_<no><wait>','EN','&before:0','*','36',1),(30,2,'_click','EN','<click>','*','4',1),(31,1,'_on','EN','*','*','6',1),(32,3,'_if','EN','&condition:start','*','38',1),(33,3,'_then','EN','&condition:end','*','40',1),(34,3,'_equal','EN','&condition:==','*','41',1),(35,3,'_different','EN','&condition:!=','*','42',1),(36,3,'_or','EN','&condition:||','*','44',1),(37,3,'_greater','EN','&condition:>','*','45',1),(38,3,'_smaller','EN','&condition:>','*','46',1),(39,1,'_,','EN','*','Remove comma','8',1),(40,1,'_is','EN','*','*','9',1),(41,3,'_not','EN','&condition:!','Not','43',1),(42,1,'_of','EN','*','*','7',1),(43,3,'_position','EN','<position>','Position','48',1),(44,3,'_first','EN','<first>','first (position)','50',1),(45,3,'_second','EN','<second>','second (position)','51',1),(46,3,'_third','EN','<third>','third (position)','52',1),(47,3,'_<first><position>','EN','&position:1','first position','55',1),(48,3,'_<second><position>','EN','&position:2','second position','56',1),(49,3,'_<third><position>','EN','&position:3','third position','57',1),(50,3,'_<position>','EN','&position','Position','49',1),(51,3,'_<wait>','EN','&wait','*','29',1),(52,3,'_<dictionary>','EN','&dictionary','Dictionary','60',1),(53,3,'_waiting','EN','<waiting>','*','30',1),(54,3,'_<wait><after>','EN','&wait','*','34',1),(55,3,'_<wait><before>','EN','&before','*','32',1),(56,3,'_<after>','EN','&wait','*','35',1),(57,3,'_<waiting><before>','EN','&before','*','33',1),(58,3,'_<waiting>','EN','&before','*','31',1),(59,2,'_get','EN','<get>','*','7',1),(60,2,'_data','EN','<data>','*','10',1),(61,2,'_<get><data>','EN','#getData','*','11',1),(62,2,'_reference','EN','<reference>','*','13',1),(63,2,'_<get><reference>','EN','#getReference','*','14',1),(64,2,'_set','EN','<set>','*','8',1),(65,2,'_<set><reference>','EN','#setReference','*','15',1),(66,2,'_<set><data>','EN','#setData','*','12',1),(67,3,'_value','EN','<value>','*','61',1),(68,3,'_comment','EN','&comment','*','63',1),(70,2,'_<set>','EN','#setVariable','*','19',1),(72,2,'_go','EN','#url','*','20',1),(74,2,'_speak','EN','#speak','*','22',1),(75,2,'_say','EN','#speak','*','24',1),(76,2,'_tell','EN','#speak','*','25',1),(77,2,'_pause','EN','#pause','*','26',1),(78,2,'_link','EN','<url>','*','31',1),(79,2,'_url','EN','<url>','*','33',1),(80,2,'_<get><url>','EN','#getUrl','*','34',1),(81,2,'_skip','EN','<skip>','*','36',1),(82,2,'_describe','EN','<describe>','*','37',1),(83,2,'_<skip><it>','EN','#skipIt','*','41',1),(84,2,'_test','EN','<it>','*','39',1),(85,2,'_tests','EN','<it>','*','40',1),(86,3,'_when','EN','&expression:start','*','37',1),(87,3,'_then','EN','&condition:end','*','47',1),(88,2,'_it','EN','<it>','*','38',1),(89,2,'_<skip><describe>','EN','#skipDescribe','*','42',1),(90,2,'_open','EN','#url','*','21',1),(91,2,'_dummy','EN','<dummy>','*','43',1),(92,2,'_information','EN','<information>','*','44',1),(93,2,'_<dummy><information>','EN','#dummyExtraInfo','*','48',1),(94,2,'_info','EN','<information>','*','45',1),(95,2,'_login','EN','<login>','*','46',1),(96,2,'_user','EN','<login>','*','47',1),(97,2,'_<dummy><login>','EN','#dummyLogin','*','49',1),(98,2,'_rule','EN','#rule','*','50',1),(99,2,'_wait','EN','<wait>','*','51',1),(100,2,'_for','EN','<for>','*','53',1),(101,2,'_<wait><for>','EN','#waitFor','*','54',1),(102,2,'_exist','EN','<exist>','*','56',1),(103,2,'_existence','EN','<exist>','*','57',1),(104,3,'_<if>','EN','&condition:start','*','39',1),(105,2,'_<exist>','EN','#isExist','*','58',1),(106,2,'_if','EN','<if>','*','55',1),(107,2,'_<if><exist>','EN','#isExist','*','59',1),(108,2,'_value','EN','<value>','*','60',1),(109,2,'_<set><value>','EN','#setValue','*','61',1),(110,2,'_cell','EN','<cell>','*','3',1),(111,2,'_<click><cell>','EN','#clickCell','*','6',1),(112,2,'_<click>','EN','#click','*','5',1),(113,2,'_dictionary','EN','<dictionary>','*','62',1),(114,2,'_translate','EN','#dictionary','*','63',1),(115,2,'_<get><dictionary>','EN','#dictionary','*','64',1),(118,2,'_little','EN','<little>','*','27',1),(119,2,'_<wait><little>','EN','#pause','*','28',1),(120,3,'_<checkbox>','EN','&element:Radio Checkbox','*','15',1),(121,3,'_<checkbox><field>','EN','&element:Radio Checkbox','*','16',1),(122,3,'_<field><checkbox>','EN','&element:Radio Checkbox','*','17',1),(123,3,'_<radio>','EN','&element:Radio Checkbox','*','20',1),(124,3,'_<radio><field>','EN','&element:Radio Checkbox','*','21',1),(125,3,'_<field><radio>','EN','&element:Radio Checkbox','*','22',1),(126,3,'_<list>','EN','&element:Listbox','*','11',1),(127,3,'_listbox','EN','<list>','*','10',1),(128,3,'_<list><field>','EN','&element:Listbox','*','12',1),(129,3,'_<field><list>','EN','&element:Listbox','*','13',1),(130,3,'_<fourth><position>','EN','&position:4','fourth position','58',1),(131,3,'_fourth','EN','<fourth>','fourth (position)','53',1),(132,3,'_fifth','EN','<fifth>','fifth (position)','54',1),(133,3,'_<fifth><position>','EN','&position:5','fifth position','59',1),(134,2,'_speaking','EN','#speak','*','23',1),(135,2,'_store','EN','<store>','*','16',1),(136,2,'_<store>','EN','#setReference','*','17',1),(137,2,'_<store><reference>','EN','#setReference','*','18',1),(139,2,'_during','EN','<during>','*','52',1),(140,2,'_<wait><during>','EN','#pause','*','29',1),(141,2,'_current','EN','<current>','*','30',1),(143,2,'_webpage','EN','<url>','*','32',1),(144,2,'_<get><current><url>','EN','#getUrl','*','35',1),(145,2,'_debug','EN','#debug','*','65',1),(146,2,'_message','EN','<message>','*','66',1),(147,2,'_print','EN','<print>','*','68',1),(148,2,'_screen','EN','<screen>','*','69',1),(149,2,'_<print><screen>','EN','#printScreen','*','70',1),(150,3,'_<value>','EN','&codevalue','*','62',1),(151,2,'_<message>','EN','#message','*','67',1),(152,2,'_reset','EN','<set>','*','9',1),(153,3,'_button','EN','<button>','*','23',1),(154,3,'_<button>','EN','&element:Button','*','24',1),(155,2,'_start','EN','<start>','Start a timer','71',1),(156,2,'_timer','EN','<timer>','start / stop a timer','73',1),(157,2,'_stop','EN','<stop>','Stop a timer','72',1),(158,2,'_<start><timer>','EN','#startTimer','Start a timer with a topic','74',1),(159,2,'_<stop><timer>','EN','#stopTimer','Stop a timer with an environment and a topic','75',1);
/*!40000 ALTER TABLE `ai_natural` ENABLE KEYS */;
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
