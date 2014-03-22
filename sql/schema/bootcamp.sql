-- phpMyAdmin SQL Dump
-- version 4.1.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 23, 2014 at 04:48 PM
-- Server version: 5.6.15-log
-- PHP Version: 5.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `bootcamp`
--

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `GetAllToursWithCamperCount`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllToursWithCamperCount`()
    DETERMINISTIC
    SQL SECURITY INVOKER
BEGIN

    SELECT
        t.id,
        t.startDate,
        t.endDate,
        COUNT(*) numCampers
    FROM
        tour t
    INNER JOIN
        camp c
    ON
        t.id = c.tour_id
    GROUP BY
        tour_id
    ORDER BY
        startDate
    DESC;

END$$

DROP PROCEDURE IF EXISTS `GetRollcall`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetRollcall`(IN __tour_id INT)
    DETERMINISTIC
    SQL SECURITY INVOKER
BEGIN
    SELECT
        c.id,
        c.user_id,
        u.oldid,
        u.firstName,
        u.lastName,
        c.rollcall
    FROM
        camp c
    INNER JOIN
        user u
    ON
        c.tour_id = __tour_id
        AND
        c.user_id = u.id
    ORDER BY
        u.oldid
    ASC;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `camp`
--

DROP TABLE IF EXISTS `camp`;
CREATE TABLE `camp` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tour_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `status` enum('grad', 'nograd', 'insession', 'other') NOT NULL DEFAULT 'other',
  `workoutTime` enum('workout530a','workout700a','workout600p') NOT NULL DEFAULT 'workout530a',
  `workoutGroup` enum('a','b','c') NOT NULL DEFAULT 'c',
  `workoutProgram` enum('base','buffet','daily','full') NOT NULL DEFAULT 'base',
  `rollcall` char(40) NOT NULL DEFAULT '0000000000000000000000000000000000000000',
  `price` int(10) unsigned NOT NULL,
  `credit` int(10) unsigned NOT NULL,
  `creditNote` varchar(100) NOT NULL,
  `payment` int(10) unsigned NOT NULL,
  `paymentMethod` enum('cash','check','trade','giftcard','creditcard','other') NOT NULL,
  `paymentNote` varchar(100) NOT NULL,
  `source` varchar(100) NOT NULL,
  `mile1` smallint(10) unsigned NOT NULL,
  `mile2` smallint(10) unsigned NOT NULL,
  `pushup1` smallint(10) unsigned NOT NULL,
  `pushup2` smallint(10) unsigned NOT NULL,
  `situp1` smallint(10) unsigned NOT NULL,
  `situp2` smallint(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tour_id` (`tour_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

--
-- Dumping data for table `camp`
--

-- --------------------------------------------------------

--
-- Table structure for table `tour`
--

DROP TABLE IF EXISTS `tour`;
CREATE TABLE `tour` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `days` int(10) unsigned NOT NULL,
  `basePrice` int(10) unsigned NOT NULL,
  `buffetPrice` int(10) unsigned NOT NULL,
  `dailyPrice` int(10) unsigned NOT NULL,
  `fullPrice` int(10) unsigned NOT NULL,
  `grads` smallint(5) unsigned NOT NULL,
  `nongrads` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tour`
--


-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `oldid` varchar(20) NOT NULL,
  `yearStarted` int(10) unsigned NOT NULL,
  `first_tour_id` int(10) unsigned NOT NULL,
  `current_tour_id` int(10) unsigned NOT NULL,
  `firstName` varchar(20) NOT NULL,
  `lastName` varchar(20) NOT NULL,
  `gender` enum('m','f', 'u') NOT NULL DEFAULT 'u',
  `ageRange` int(10) unsigned NOT NULL,
  `occupation` varchar(30) NOT NULL,
  `pet` varchar(100) NOT NULL,
  `camps` smallint(5) unsigned NOT NULL,
  `grads` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_ibfk_2` (`first_tour_id`),
  KEY `user_ibfk_1` (`current_tour_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--
--
-- Constraints for dumped tables
--

--
-- Constraints for table `camp`
--
ALTER TABLE `camp`
  ADD CONSTRAINT `camp_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tour` (`id`),
  ADD CONSTRAINT `camp_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`current_tour_id`) REFERENCES `tour` (`id`),
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`first_tour_id`) REFERENCES `tour` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
