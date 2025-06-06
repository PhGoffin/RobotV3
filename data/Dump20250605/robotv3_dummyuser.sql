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
-- Table structure for table `dummyuser`
--

DROP TABLE IF EXISTS `dummyuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dummyuser` (
  `dummyuserID` int NOT NULL AUTO_INCREMENT,
  `projectID` int NOT NULL,
  `dummy` varchar(40) NOT NULL,
  `user` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `extraInfo` varchar(80) DEFAULT NULL,
  `crypted` int NOT NULL,
  `password` varchar(80) NOT NULL,
  `position` varchar(20) NOT NULL,
  `active` int NOT NULL,
  `createdby` varchar(20) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updatedby` varchar(20) NOT NULL,
  `updated` varchar(20) NOT NULL,
  PRIMARY KEY (`dummyuserID`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dummyuser`
--

LOCK TABLES `dummyuser` WRITE;
/*!40000 ALTER TABLE `dummyuser` DISABLE KEYS */;
INSERT INTO `dummyuser` VALUES (3,1,'Cathy','goffipl',NULL,1,'5b90073303ea9e5a162d6e9f9d2172b4bb615863726a7d974dfdc9b1544acf35','1',1,'goffipl','01/03/2024','goffipl','08/07/2024'),(4,1,'SuperUser','goffipl','Philippe',1,'323ec57a90a40dc4617d6f7dca6c4a5df06cf83cdfd3fe1ea9164115593680e2','2',1,'goffipl','01/03/2024','goffipl','06/01/2025'),(5,1,'External1','w0501059',NULL,0,'JtKcsr97_119','5',1,'goffipl','01/03/2024','goffipl','07/03/2024'),(6,1,'goffipl','goffipl','Philippe',1,'323ec57a90a40dc4617d6f7dca6c4a5df06cf83cdfd3fe1ea9164115593680e2','3',1,'goffipl','01/03/2024','goffipl','06/01/2025'),(11,2,'SuperUser','goffipl',NULL,1,'323ec57a90a40dc4617d6f7dca6c4a5df06cf83cdfd3fe1ea9164115593680e2','1',1,'goffipl','25/03/2024','goffipl','06/01/2025'),(12,2,'Philippe','goffipl',NULL,1,'323ec57a90a40dc4617d6f7dca6c4a5df06cf83cdfd3fe1ea9164115593680e2','2',1,'goffipl','25/03/2024','goffipl','06/01/2025'),(13,2,'Cathy','paricat',NULL,0,'Enter a password','4',1,'paricat','27/03/2024','paricat','27/03/2024'),(14,1,'Compass','goffipl',NULL,0,'Digit.2023','4',1,'goffipl','03/04/2024','goffipl','03/04/2024'),(15,2,'goffipl','goffipl','Philippe',1,'323ec57a90a40dc4617d6f7dca6c4a5df06cf83cdfd3fe1ea9164115593680e2','3',1,'goffipl','08/04/2024','goffipl','06/01/2025'),(16,1,'w0501075_ACC','w0501075','',0,'S1kbM5a9gehNP3','6',1,'goffipl','29/05/2024','goffipl','09/07/2024'),(17,1,'w0501075_INT','w0501075','',0,'JtKcsr97_130','7',1,'goffipl','29/05/2024','goffipl','29/05/2024'),(18,1,'OVA','w0501064','',0,'JtKcsr97_123','8',1,'goffipl','01/07/2024','goffipl','01/07/2024'),(19,1,'FIA','w0501057','',0,'E8TViZ0TRd5lIW','9',1,'goffipl','01/07/2024','goffipl','01/07/2024'),(20,1,'AO','w0501068','',0,'JtKcsr97_124','10',1,'goffipl','01/07/2024','goffipl','01/07/2024'),(21,1,'External1','w0501059','',0,'JtKcsr97_128','11',1,'goffipl','01/07/2024','goffipl','01/07/2024'),(22,1,'External2','w0501060','',0,'JtKcsr97_130','12',1,'goffipl','01/07/2024','goffipl','01/07/2024'),(23,1,'External3','n00dwns4','INTPA.R5.TESTING@gmail.com',0,'x55.R5.2023','13',1,'goffipl','01/07/2024','goffipl','01/07/2024'),(24,1,'External4','n002f2d5','',0,'JtKcsr97_119','14',1,'goffipl','01/07/2024','goffipl','01/07/2024'),(25,85,'goffipl','goffipl','Philippe',1,'323ec57a90a40dc4617d6f7dca6c4a5df06cf83cdfd3fe1ea9164115593680e2','1',1,'goffipl','05/08/2024','goffipl','06/01/2025'),(26,84,'goffipl','goffipl','Philippe',1,'323ec57a90a40dc4617d6f7dca6c4a5df06cf83cdfd3fe1ea9164115593680e2','1',1,'goffipl','05/08/2024','goffipl','06/01/2025'),(27,84,'PADOR1','pador.user1@gmail.com','',0,'**','2',1,'goffipl','03/09/2024','goffipl','03/09/2024'),(28,84,'PADOR2','pador.user2@gmail.com','',0,'**','3',1,'goffipl','03/09/2024','goffipl','03/09/2024'),(29,84,'PADOR3','pador.user3@gmail.com','',0,'**','4',1,'goffipl','03/09/2024','goffipl','03/09/2024'),(30,85,'Artcomputer','artcomputer123@gmail.com','',0,'StPeket123','2',1,'goffipl','27/09/2024','goffipl','27/09/2024'),(31,85,'ProxyUser','goffipl','ps-lux-usr.cec.eu.int:8012',1,'d97079f2537de5b2da752286e726f1a7','4',1,'goffipl','30/09/2024','goffipl','30/09/2024'),(32,2,'Proxy User','goffipl','ps-lux-usr.cec.eu.int:8012',1,'d97079f2537de5b2da752286e726f1a7','5',1,'goffipl','01/10/2024','goffipl','01/10/2024'),(33,84,'ProxyUser','goffipl','ps-lux-usr.cec.eu.int:8012',1,'235e4d0d2ee6761685c46364e60b6f0e9d9c32274071fc0e6c8dfda373a1278a','5',1,'goffipl','22/11/2024','goffipl','22/11/2024'),(34,85,'INTPAR5EXT','inpaext@gmail.com','',0,'DummyProspectUser123','3',1,'goffipl','16/01/2025','goffipl','16/01/2025'),(35,88,'goffipl','artcomputer123@gmail.com','',1,'5ccf91e687e3dde09f76c1fe8b1d2e17','1',1,'goffipl','21/05/2025','goffipl','21/05/2025');
/*!40000 ALTER TABLE `dummyuser` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-05 14:53:08
