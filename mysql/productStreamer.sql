CREATE DATABASE  IF NOT EXISTS `liveloot` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `liveloot`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: liveloot
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `slug` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_UNIQUE` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Tastiera','Tastiere meccaniche, membrane, wireless e da gaming','tastiera'),(2,'Stream Deck','Pannelli di controllo programmabili per flussi, macro e automazioni','stream-deck'),(3,'Mouse','Mouse da gaming e da ufficio, cablati e wireless','mouse'),(4,'Monitor','Monitor gaming e professionali, vari formati e refresh rate','monitor'),(5,'WebCam','Webcam per streaming, videoconferenze e contenuti','webcam'),(6,'Sedie Gaming','Sedute ergonomiche progettate per sessioni di gioco prolungate','sedie-gaming'),(7,'Cuffie','Cuffie e headset con microfono per streaming e gaming','cuffie'),(8,'Tappetini da gaming','Tappetini grandi e piccoli, con superfici ottimizzate per sensori','tappetini-da-gaming'),(9,'Computer Fisso Gaming','PC desktop assemblati o preconfigurati per il gaming','computer-fisso-gaming'),(10,'Computer Portatile Gaming','Laptop da gaming con GPU dedicate e raffreddamento avanzato','computer-portatile-gaming');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `number` varchar(12) NOT NULL,
  `address` varchar(255) NOT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_order`
--

DROP TABLE IF EXISTS `product_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_order` (
  `product_id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_quantity` int DEFAULT NULL,
  `product_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`product_id`,`order_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `product_order_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `product_order_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_order`
--

LOCK TABLES `product_order` WRITE;
/*!40000 ALTER TABLE `product_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL,
  `category_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text,
  `image` varchar(512) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_UNIQUE` (`slug`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Tastiera Meccanica RGB','KeyForge',79.99,'Switch meccanici, retroilluminazione RGB, connessione USB','uploads/Tastiera Meccanica RGB.jpg',NULL),(2,1,'Tastiera Wireless Slim','SlimKeys',49.90,'Layout compatto, connettività Bluetooth','uploads/Tastiera Wireless Slim.png',NULL),(3,1,'Tastiera Tenkeyless','ProType',69.50,'Formato senza tastierino numerico, switch tattili','uploads/Tastiera Tenkeyless.jpg',NULL),(4,1,'Tastiera Gaming RGB','GamerTone',129.00,'Macro programmabili, poggiapolsi rimovibile','uploads/tastiera rgb.jpg',NULL),(5,1,'Tastiera Ergonomica','ErgoBoard',99.00,'Design ergonomico, riduce affaticamento delle mani','uploads/Tastiera Ergonomica.jpg',NULL),(6,2,'Elgato Stream Deck Neo 8 Tasti Personalizzabili','Elgato',94.94,'8 tasti programmabili, 2 touch point; controlla app e velocizza flussi di lavoro','uploads/Elgato Stream Deck Neo 8 Tasti Personalizzabili.png',NULL),(7,2,'Stream Deck Mini 4','Elgato',79.00,'4 tasti programmabili, compatto','uploads/Stream Deck Mini 4.jpg',NULL),(8,2,'Macro Pad 12','MacroLab',59.90,'12 tasti personalizzabili, retroilluminazione','uploads/Macro Pad 12.jpg',NULL),(9,2,'Control Pad Pro','StreamPro',129.00,'Schermo OLED, tasti sensibili al tocco','uploads/Control Pad Pro.png',NULL),(10,2,'Deck Keyboard','KeyDeck',139.00,'Tastiera ibrida con tasti macro','uploads/Deck Keyboard.png',NULL),(11,3,'Mouse Gaming Wired','Raptor',39.99,'Sensore ottico ad alta precisione, DPI regolabile','uploads/Mouse Gaming Wired.png',NULL),(12,3,'Mouse Wireless Ergonomico','ComfortMouse',54.90,'Connessione Bluetooth/USB, batteria lunga durata','uploads/Mouse Wireless Ergonomico.png',NULL),(13,3,'Mouse FPS Pro','Shot',69.90,'Design leggero, sensore ad alta precisione','uploads/Mouse FPS Pro.jpg',NULL),(14,3,'Mouse RGB Multi','Glow',29.90,'RGB personalizzabile, tasti programmabili','uploads/Mouse RGB Multi.jpg',NULL),(15,3,'Mouse Travel','PortaMouse',19.90,'Compatto per viaggi, connessione USB-C','uploads/Mouse Travel.jpg',NULL),(16,4,'Monitor 27" 144Hz','ViewPro',249.00,'IPS, 144Hz, 1ms MPRT','uploads/Monitor 27 144Hz.jpg',NULL),(17,4,'Monitor UltraWide 34"','WideView',499.00,'3440x1440, curvo','uploads/Monitor UltraWide 34.jpg',NULL),(18,4,'Monitor 24" 75Hz','OfficeView',129.00,'Buona scelta per lavoro e streaming','uploads/Monitor 24 75Hz.jpg',NULL),(19,4,'Monitor 240Hz','ProSpeed',599.00,'Esports grade, basso input lag','uploads/Monitor 240Hz.jpg',NULL),(20,4,'Monitor 4K 60Hz','UltraPix',399.00,'4K per creazione contenuti','uploads/Monitor 4K 60Hz.png',NULL),(21,5,'WebCam Full HD','CamPro',69.90,'1080p, microfono integrato','uploads/WebCam Full HD.jpg',NULL),(22,5,'WebCam 4K','ClearCam',149.00,'4K, autofocus','uploads/WebCam 4K.png',NULL),(23,5,'WebCam Compact','MiniCam',39.90,'Compatta, plug and play','uploads/WebCam Compact.png',NULL),(24,5,'WebCam with Ring','LightCam',89.00,'Ring light integrato','uploads/WebCam with Ring.jpg',NULL),(25,5,'WebCam PTZ','ProPTZ',329.00,'Pan-Tilt-Zoom per studi','uploads/WebCam PTZ.jpg',NULL),(26,6,'Sedia Gaming Ergonomica','SeatMax',199.00,'Supporto lombare, regolazioni multiple','uploads/Sedia Gaming Ergonomica.png',NULL),(27,6,'Poltrona Racer','RaceSeat',249.00,'Stile racing, imbottitura premium','uploads/Poltrona Racer.jpg',NULL),(28,6,'Sedia Mesh Comfort','AirSeat',179.00,'Schienale in mesh traspirante','uploads/Sedia Mesh Comfort.jpg',NULL),(29,6,'Sedia Reclinabile','RelaxPro',299.00,'Reclinabile fino a 180°, poggiapiedi','uploads/Sedia Reclinabile.jpg',NULL),(30,6,'Sedia Budget','EasySeat',99.00,'Economica ma confortevole','uploads/Sedia Budget.jpg',NULL),(31,7,'Cuffie Gaming con Mic','SoundWave',89.90,'Surround, microfono rimovibile','uploads/Cuffie Gaming con Mic.jpg',NULL),(32,7,'Headset Wireless','FreeSound',129.00,'Wireless, batteria lunga','uploads/Headset Wireless.jpg',NULL),(33,7,'Cuffie In Ear Gaming','EarPro',39.90,'Auricolari con microfono in-line','uploads/Cuffie In Ear Gaming.jpg',NULL),(34,7,'Cuffie OverEar Studio','StudioSound',149.00,'Audio bilanciato per creazione contenuti','uploads/Cuffie OverEar Studio.jpg',NULL),(35,7,'Cuffie Budget','ValueAudio',24.90,'Soluzione economica per entry-level','uploads/Cuffie Budget.jpg',NULL),(36,8,'Tappetino XL','PadMax',24.90,'Superficie ottimizzata per sensori, bordo cucito','uploads/Tappetino XL.jpg',NULL),(37,8,'Tappetino Rigido','HardPad',34.90,'Superficie rigida per scorrevolezza','uploads/Tappetino Rigido.jpg',NULL),(38,8,'Tappetino RGB','Glow',44.90,'Illuminazione RGB integrata','uploads/Tappetino RGB.jpg',NULL),(39,8,'Tappetino da Viaggio','TravelMat',14.90,'Compatto e arrotolabile','uploads/Tappetino da Viaggio.png',NULL),(40,8,'Tappetino Large+','ProPad',39.90,'Copre tastiera e mouse','uploads/Tappetino Large+.jpg',NULL),(41,9,'PC Gaming Desktop','PowerRig',1299.00,'GPU dedicata, CPU ad alte prestazioni, raffreddamento avanzato','uploads/PC Gaming Desktop.jpg',NULL),(42,9,'Mini PC Gaming','MiniGamer',899.00,'Compatto ma potente','uploads/Mini PC Gaming.png',NULL),(43,9,'Workstation+Gaming','ProWork',1899.00,'Per content creator e gaming','uploads/Workstation+Gaming.jpg',NULL),(44,9,'PC RGB Edition','LightRig',1099.00,'Design con RGB, ottime prestazioni','uploads/PC RGB Edition.jpg',NULL),(45,9,'PC Entry Gaming','StarterPC',699.00,'Soluzione entry-level per gaming 1080p','uploads/PC Entry Gaming.jpeg',NULL),(46,10,'Laptop Gaming 15"','BladeNote',1499.00,'GPU mobile dedicata, display 144Hz','uploads/Laptop Gaming 15.jpg',NULL),(47,10,'Laptop Gaming 17"','BigPlay',1899.00,'Schermo grande, raffreddamento avanzato','uploads/Laptop Gaming 17.jpg',NULL),(48,10,'Ultrabook Gaming','SlimGamer',1299.00,'Design sottile con GPU dedicata','uploads/Ultrabook Gaming.jpg',NULL),(49,10,'Laptop eSports','EsportPro',2199.00,'Componenti top per competitive gaming','uploads/Laptop eSports.jpg',NULL),(50,10,'Laptop Budget Gaming','ValueGamer',799.00,'Buone prestazioni per budget contenuto','uploads/Laptop Budget Gaming.jpg',NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'liveloot'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
