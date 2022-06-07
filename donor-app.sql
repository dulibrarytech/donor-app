-- MySQL dump 10.14  Distrib 5.5.65-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: donordb
-- ------------------------------------------------------
-- Server version	5.5.65-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbl_donorgiftdescriptions`
--

DROP TABLE IF EXISTS `tbl_donorgiftdescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_donorgiftdescriptions` (
  `giftDescriptionID` int(10) NOT NULL AUTO_INCREMENT,
  `giftsID` int(10) DEFAULT NULL,
  `giftDescription1` varchar(255) DEFAULT NULL,
  `giftDetails` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`giftDescriptionID`),
  KEY `FK_tbl_donorGiftdescriptions_tbl_donorGifts` (`giftsID`)
) ENGINE=MyISAM AUTO_INCREMENT=2650 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_donorgifts`
--

DROP TABLE IF EXISTS `tbl_donorgifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_donorgifts` (
  `giftsID` int(10) NOT NULL AUTO_INCREMENT,
  `donorID` int(10) NOT NULL,
  `Cdate` datetime DEFAULT NULL,
  `dateOfGift` datetime DEFAULT NULL,
  `numberOfGifts` int(10) DEFAULT NULL,
  `important` tinyint(1) NOT NULL DEFAULT '0',
  `letter` tinyint(1) NOT NULL DEFAULT '0',
  `bypassLetter` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`giftsID`),
  KEY `FK_tbl_donorGifts_tbl_donorInfo` (`donorID`)
) ENGINE=MyISAM AUTO_INCREMENT=4325 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_donorinfo`
--

DROP TABLE IF EXISTS `tbl_donorinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_donorinfo` (
  `donorID` int(10) NOT NULL AUTO_INCREMENT,
  `titleID` int(10) DEFAULT NULL,
  `FirstName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) DEFAULT NULL,
  `Address1` varchar(255) DEFAULT NULL,
  `Address2` varchar(255) DEFAULT NULL,
  `City` varchar(50) DEFAULT NULL,
  `State` varchar(50) DEFAULT NULL,
  `PostalCode` varchar(50) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `Organization` varchar(255) NOT NULL,
  `anonymous` tinyint(1) NOT NULL DEFAULT '0',
  `Country` varchar(50) NOT NULL DEFAULT 'USA',
  PRIMARY KEY (`donorID`),
  KEY `FK_tbl_donorInfo_tbl_donorTitle_LKUP1` (`titleID`)
) ENGINE=MyISAM AUTO_INCREMENT=2971 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_donortitle_lkup`
--

DROP TABLE IF EXISTS `tbl_donortitle_lkup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_donortitle_lkup` (
  `titleID` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(20) DEFAULT 'None',
  PRIMARY KEY (`titleID`)
) ENGINE=MyISAM AUTO_INCREMENT=1547 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_donorusers`
--

DROP TABLE IF EXISTS `tbl_donorusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_donorusers` (
  `userID` int(3) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `roleID` int(3) NOT NULL,
  `firstname` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `id` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-12 12:16:18
