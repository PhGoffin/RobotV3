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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `workspaceID` int NOT NULL,
  `login` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(80) NOT NULL,
  `firstName` varchar(40) NOT NULL,
  `lastName` varchar(40) NOT NULL,
  `email` varchar(80) NOT NULL,
  `superuser` int DEFAULT NULL,
  `active` int NOT NULL DEFAULT '1',
  `createdby` varchar(20) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updatedby` varchar(20) NOT NULL,
  `updated` varchar(20) NOT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,1,'goffipl','$2b$10$Kyb7y8f4EDKaVlFLVY6Dwu7LMozyCoMLwrb3ISDmx1jiJ8yx4aXgO','Philippe','Goffin','artcomputer123@gmail.com',1,1,'goffipl','01/03/2024','goffipl','08/03/2024'),(4,1,'paricat','$2b$10$RyUTFzfBgVdbgMVHX5HpQOn9tAfBrDbJNmy9yUVoB/7Gq51x5Wvde','Cathy','Paris','paricat123@gmail.com',0,1,'goffipl','01/03/2024','goffipl','07/03/2024'),(8,1,'roberto','$2b$10$CTqY5lTdv9rwV8P8mbc2O.8TxOO3MqYxSMlnPCygQ6nUCXICH967K','Roberto','Liva','liva@gmail.com',0,1,'goffipl','01/03/2024','goffipl','07/03/2024'),(81,1,'giacomo','$2b$10$TrlrNiLTP8IqDJ6v53DuiuSZN0sGvQ.J7pcI5RDk4PWJBiDImeboG','Giacomo','Terrazzani','gt@gmail.com',0,1,'goffipl','01/03/2024','goffipl','07/03/2024'),(105,1,'geidieg','$2b$10$FLkBvEdcQaHTsxjEJ8v.se141pGuNDYcjkPAvqyokqfl6yVAhMhYa','Diego','Geilfus','dummy@gmail.com',0,1,'goffipl','08/04/2024','goffipl','08/04/2024');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
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
