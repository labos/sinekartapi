-- phpMyAdmin SQL Dump
-- version 3.4.5deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generato il: Apr 20, 2012 alle 13:53
-- Versione del server: 5.1.61
-- Versione PHP: 5.3.6-13ubuntu3.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `aoo`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `AOO`
--

CREATE TABLE IF NOT EXISTS `AOO` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(45) NOT NULL,
  `DESCRIPTION` varchar(45) DEFAULT NULL,
   `titolariodefault`  varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `NAME_UNIQUE` (`NAME`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dump dei dati per la tabella `AOO`
--

INSERT INTO `AOO` (`ID`, `NAME`, `DESCRIPTION`,`titolariodefault`) VALUES
(1, 'A01', 'Area di test', 'Registro');
-- --------------------------------------------------------

--
-- Struttura della tabella `COUNTER`
--

CREATE TABLE IF NOT EXISTS `COUNTER` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `LASTVALUE` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dump dei dati per la tabella `COUNTER`
--

INSERT INTO `COUNTER` (`ID`, `LASTVALUE`) VALUES
(1, 27);

-- --------------------------------------------------------

--
-- Struttura della tabella `COUNTER_HAS_AOO`
--

CREATE TABLE IF NOT EXISTS `COUNTER_HAS_AOO` (
  `COUNTER_ID` bigint(20) NOT NULL,
  `AOO_ID` bigint(20) NOT NULL,
  `DT_INI_VAL` datetime NOT NULL,
  `DT_END_VAL` datetime NOT NULL,
  `ID_TITOLARIO` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`COUNTER_ID`,`AOO_ID`,`DT_INI_VAL`,`DT_END_VAL`),
  KEY `fk_COUNTER_has_AOO_COUNTER` (`COUNTER_ID`),
  KEY `fk_COUNTER_has_AOO_AOO1` (`AOO_ID`),
  KEY `FK_COUNTER_TITOLARIO` (`ID_TITOLARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `COUNTER_HAS_AOO`
--

INSERT INTO `COUNTER_HAS_AOO` (`COUNTER_ID`, `AOO_ID`, `DT_INI_VAL`, `DT_END_VAL`, `ID_TITOLARIO`) VALUES
(1, 1, '2013-01-01 00:00:00', '2014-01-01 00:00:00', 3);

-- --------------------------------------------------------

--
-- Struttura della tabella `TITOLARIO`
--

CREATE TABLE IF NOT EXISTS `TITOLARIO` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(45) NOT NULL,
  `DESCR` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `NAME_UNIQUE` (`NAME`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dump dei dati per la tabella `TITOLARIO`
--

INSERT INTO `TITOLARIO` (`ID`, `NAME`, `DESCR`) VALUES
(3, 'Titolario AOO 001', 'Titolario AOO 001');

-- --------------------------------------------------------

--
-- Struttura della tabella `TITOLARIO_TREE`
--

CREATE TABLE IF NOT EXISTS `TITOLARIO_TREE` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `TITOLARIO_ID` bigint(20) NOT NULL,
  `ID_OWNER` bigint(20) DEFAULT NULL,
  `NAME` varchar(45) NOT NULL,
  `DESCR` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_TITOLARIO_TREE_TITOLARIO1` (`TITOLARIO_ID`),
  KEY `FK_TITOLARIO_OWNER` (`ID_OWNER`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=115 ;

--
-- Dump dei dati per la tabella `TITOLARIO_TREE`
--

INSERT INTO TITOLARIO_TREE VALUES (1, 3, NULL, '01', '01 - ORGANI DELL''ASSOCIAZIONE');
INSERT INTO TITOLARIO_TREE VALUES (2, 3, 1, '0101', '0101 - Assemblea generale straordinaria e ord');
INSERT INTO TITOLARIO_TREE VALUES (3, 3, 1, '0102', '0102 - Presidente');
INSERT INTO TITOLARIO_TREE VALUES (4, 3, 1, '0103', '0103 - Consiglio dell''Associazione');
INSERT INTO TITOLARIO_TREE VALUES (5, 3, 1, '0104', '0104 - Consulte - Comitato Tecnico P.L.. - Co');
INSERT INTO TITOLARIO_TREE VALUES (6, 3, 1, '0105', '0105 - UFFICI REGIONALI');
INSERT INTO TITOLARIO_TREE VALUES (7, 3, 1, '0106', '0106 - Revisori dei Conti');
INSERT INTO TITOLARIO_TREE VALUES (8, 3, 1, '0107', '0107 - Direttivo - Presidenza');
INSERT INTO TITOLARIO_TREE VALUES (9, 3, 1, '0108', '0108 - Commissioni esterne, rappresentanza');
INSERT INTO TITOLARIO_TREE VALUES (10, 3, 1, '0109', '0109 - Vice Presidenti');
INSERT INTO TITOLARIO_TREE VALUES (13, 3, NULL, '02', '02 - FUNZIONAMENTO');
INSERT INTO TITOLARIO_TREE VALUES (14, 3, 13, '0201', '0201 - Direttore');
INSERT INTO TITOLARIO_TREE VALUES (15, 3, 13, '0202', '0202 - Personale, collaborazioni ');
INSERT INTO TITOLARIO_TREE VALUES (16, 3, 13, '0203', '0203 - Sede, Arredamento');
INSERT INTO TITOLARIO_TREE VALUES (17, 3, 13, '0204', '0204 - Comunicati stampa - Rassegna stampa');
INSERT INTO TITOLARIO_TREE VALUES (18, 3, 13, '0205', '0205 - Circolari,  Circolari Ministeriali e a');
INSERT INTO TITOLARIO_TREE VALUES (19, 3, 13, '0206', '0206 - Rivista');
INSERT INTO TITOLARIO_TREE VALUES (20, 3, 13, '0207', '0207 - Bolle di consegna');
INSERT INTO TITOLARIO_TREE VALUES (21, 3, 13, '0208', '0208 - Pubblicazioni e riviste varie - Tariff');
INSERT INTO TITOLARIO_TREE VALUES (22, 3, NULL, '03', '03 - AMMINISTRAZIONE');
INSERT INTO TITOLARIO_TREE VALUES (23, 3, 22, '0301', '0301 - Bilanci interni e scritture');
INSERT INTO TITOLARIO_TREE VALUES (24, 3, 22, '0302', '0302 - Contributi dei Comuni e USL');
INSERT INTO TITOLARIO_TREE VALUES (25, 3, 22, '0303', '0303 - Contributo altri enti - e richieste co');
INSERT INTO TITOLARIO_TREE VALUES (26, 3, 22, '0304', '0304 - Contabilita');
INSERT INTO TITOLARIO_TREE VALUES (27, 3, 22, '0305', '0305 - Movimento bancario e postale');
INSERT INTO TITOLARIO_TREE VALUES (28, 3, 22, '0306', '0306 - Societa partecipate (Formel, SOA, E-gl');
INSERT INTO TITOLARIO_TREE VALUES (29, 3, 22, '0307', '0307 - Contratti');
INSERT INTO TITOLARIO_TREE VALUES (30, 3, 22, '0308', '0308 - Regolamenti Interni ');
INSERT INTO TITOLARIO_TREE VALUES (31, 3, 22, '0309', '0309 - Sottoscrizione Protocolli d''intesa, Co');
INSERT INTO TITOLARIO_TREE VALUES (32, 3, 22, '0309SC', '0309SC - Servizio civile Veneto');
INSERT INTO TITOLARIO_TREE VALUES (33, 3, 22, '0309SCFVG', '0309SCFVG - Servizio civile Friuli Venezia Gi');
INSERT INTO TITOLARIO_TREE VALUES (34, 3, 22, '0309PCS', '0309PCS - Piccole Citta Storiche del Veneto');
INSERT INTO TITOLARIO_TREE VALUES (35, 3, NULL, '04', '04 - PERSONALE');
INSERT INTO TITOLARIO_TREE VALUES (36, 3, 35, '0401', '0401 - Segretari Comunali - Agenzia SEGRETARI');
INSERT INTO TITOLARIO_TREE VALUES (37, 3, 35, '0402', '0402 - Polizia Municipale - Associazione SCUO');
INSERT INTO TITOLARIO_TREE VALUES (38, 3, 35, '0403', '0403 - Dipendenti Comunali');
INSERT INTO TITOLARIO_TREE VALUES (39, 3, 35, '0404', '0404 - CGIL CISL UIL e sindacati altre catego');
INSERT INTO TITOLARIO_TREE VALUES (40, 3, 35, '0405', '0405 - Bandi e gare d''appalto');
INSERT INTO TITOLARIO_TREE VALUES (41, 3, 35, '0406', '0406 - Dipendenti ASL');
INSERT INTO TITOLARIO_TREE VALUES (42, 3, 35, '0407', '0407 - Osservatorio sulla contrattazione');
INSERT INTO TITOLARIO_TREE VALUES (43, 3, NULL, '05', '05 - FINANZA LOCALE');
INSERT INTO TITOLARIO_TREE VALUES (44, 3, 43, '0501', '0501 - Legislazione nazionale (Comunicazioni ');
INSERT INTO TITOLARIO_TREE VALUES (45, 3, 43, '0502', '0502 - Particolari regolamentazioni (Comunica');
INSERT INTO TITOLARIO_TREE VALUES (46, 3, 43, '0503', '0503 - Mutui finanziari');
INSERT INTO TITOLARIO_TREE VALUES (47, 3, 43, '0504', '0504 - Imposte e Tasse');
INSERT INTO TITOLARIO_TREE VALUES (48, 3, 43, '0505', '0505 - Bilanci di previsione regionali ed alt');
INSERT INTO TITOLARIO_TREE VALUES (49, 3, 43, '0506', '0506 - Conti Consuntivi');
INSERT INTO TITOLARIO_TREE VALUES (50, 3, NULL, '06', '06 - ECONOMIA');
INSERT INTO TITOLARIO_TREE VALUES (51, 3, 50, '0601', '0601 - Agricoltura (Veneto Agricoltura) - DEC');
INSERT INTO TITOLARIO_TREE VALUES (52, 3, 50, '0602', '0602 - Commercio');
INSERT INTO TITOLARIO_TREE VALUES (53, 3, 50, '0603', '0603 - Industria');
INSERT INTO TITOLARIO_TREE VALUES (54, 3, 50, '0604', '0604 - Artigianato');
INSERT INTO TITOLARIO_TREE VALUES (55, 3, 50, '0605', '0605 - Occupazione');
INSERT INTO TITOLARIO_TREE VALUES (56, 3, 50, '0606', '0606 - Emigrazione - immigrazione');
INSERT INTO TITOLARIO_TREE VALUES (57, 3, 50, '0607', '0607 - Programmazione');
INSERT INTO TITOLARIO_TREE VALUES (58, 3, 50, '0608', '0608 - Turismo');
INSERT INTO TITOLARIO_TREE VALUES (59, 3, NULL, '07', '07 - SANITA'' - ASSISTENZA');
INSERT INTO TITOLARIO_TREE VALUES (60, 3, 59, '0701', '0701 - Assistenza sociale  - domicilio di soc');
INSERT INTO TITOLARIO_TREE VALUES (61, 3, 59, '0702', '0702 - Assistenza scolastica');
INSERT INTO TITOLARIO_TREE VALUES (62, 3, 59, '0703', '0703 - Minori');
INSERT INTO TITOLARIO_TREE VALUES (63, 3, 59, '0704', '0704 - Conferenza dei Sindaci delle ASL - ASS');
INSERT INTO TITOLARIO_TREE VALUES (64, 3, 59, '0705', '0705 - Politiche Sociali - Citta sane');
INSERT INTO TITOLARIO_TREE VALUES (65, 3, 59, '0706', '0706 - Legge 626/94 - Sicurezza');
INSERT INTO TITOLARIO_TREE VALUES (66, 3, 59, '0707', '0707 - Eventi Calamitosi e Protezione Civile');
INSERT INTO TITOLARIO_TREE VALUES (67, 3, 59, '0708', '0708 - Sicurezza stradale');
INSERT INTO TITOLARIO_TREE VALUES (68, 3, 59, '0709', '0709 - Polizia mortuaria - CIMITERI');
INSERT INTO TITOLARIO_TREE VALUES (69, 3, NULL, '08', '08 - URBANISTICA - TERRITORIO - LL.PP.    AMB');
INSERT INTO TITOLARIO_TREE VALUES (70, 3, 69, '0801', '0801 - Ambiente - Inquinamento e tutela paesa');
INSERT INTO TITOLARIO_TREE VALUES (71, 3, 69, '0802', '0802 - Patrimonio Pubblico (beni demaniali st');
INSERT INTO TITOLARIO_TREE VALUES (72, 3, 69, '0803', '0803 - Comprensori');
INSERT INTO TITOLARIO_TREE VALUES (73, 3, 69, '0804', '0804 - Urbanistica e Catasto');
INSERT INTO TITOLARIO_TREE VALUES (74, 3, 69, '0805', '0805 - Strade autostrade : Regolamento codice');
INSERT INTO TITOLARIO_TREE VALUES (75, 3, 69, '0806', '0806 - Piani urbanistici di edilizia - Piani ');
INSERT INTO TITOLARIO_TREE VALUES (76, 3, 69, '0807', '0807 - Problemi della casa - FSA Veneto');
INSERT INTO TITOLARIO_TREE VALUES (77, 3, 69, '0808', '0808 - Parchi e riserve naturali');
INSERT INTO TITOLARIO_TREE VALUES (78, 3, 69, '0809', '0809 - Lavori pubblici');
INSERT INTO TITOLARIO_TREE VALUES (79, 3, NULL, '09', '09 - ISTRUZIONE - CULTURA - SPORT');
INSERT INTO TITOLARIO_TREE VALUES (80, 3, 79, '0901', '0901 - Istruzione - Scuola - MASTER ');
INSERT INTO TITOLARIO_TREE VALUES (81, 3, 79, '0902', '0902 - Cultura  - Tempo libero - Sport');
INSERT INTO TITOLARIO_TREE VALUES (82, 3, NULL, '10', '10 - SERVIZI');
INSERT INTO TITOLARIO_TREE VALUES (83, 3, 82, '1001', '1001 - Acquedotti');
INSERT INTO TITOLARIO_TREE VALUES (84, 3, 82, '1002', '1002 - Gasdotti');
INSERT INTO TITOLARIO_TREE VALUES (85, 3, 82, '1003', '1003 - Trasporti');
INSERT INTO TITOLARIO_TREE VALUES (86, 3, 82, '1004', '1004 - ');
INSERT INTO TITOLARIO_TREE VALUES (87, 3, 82, '1005', '1005 - Rifiuti Solidi Urbani');
INSERT INTO TITOLARIO_TREE VALUES (88, 3, 82, '1006', '1006 - Energia elettrica - Consorzio Energia ');
INSERT INTO TITOLARIO_TREE VALUES (89, 3, 82, '1007', '1007 - Informatica');
INSERT INTO TITOLARIO_TREE VALUES (90, 3, NULL, '11', '11 - VARIE');
INSERT INTO TITOLARIO_TREE VALUES (91, 3, 90, '1101', '1101 - Riconoscimenti ai Sindaci e cerimonial');
INSERT INTO TITOLARIO_TREE VALUES (92, 3, 90, '1102', '1102 - Organi regionali e Enti ');
INSERT INTO TITOLARIO_TREE VALUES (93, 3, 90, '1103', '1103 - Prefetture');
INSERT INTO TITOLARIO_TREE VALUES (94, 3, 90, '1104', '1104 - Province');
INSERT INTO TITOLARIO_TREE VALUES (95, 3, 90, '1105', '1105 - Regione');
INSERT INTO TITOLARIO_TREE VALUES (96, 3, 90, '1106', '1106 - Convegni, seminari, riunioni, viaggi');
INSERT INTO TITOLARIO_TREE VALUES (97, 3, 90, '1106DF', '1106DF - Dire & Fare');
INSERT INTO TITOLARIO_TREE VALUES (98, 3, 90, '1106CP', '1106CP - Richieste/Concessione patrocini');
INSERT INTO TITOLARIO_TREE VALUES (99, 3, 90, '1107', '1107 - Iniziative europee');
INSERT INTO TITOLARIO_TREE VALUES (100, 3, 90, '1108', '1108 - Varie');
INSERT INTO TITOLARIO_TREE VALUES (101, 3, NULL, '12', '12 - RAPPORTI INTERNAZIONALI');
INSERT INTO TITOLARIO_TREE VALUES (102, 3, 101, '1201', '1201 - Gemellaggi fra Comuni');
INSERT INTO TITOLARIO_TREE VALUES (103, 3, 101, '1202', '1202 - Organi CEE');
INSERT INTO TITOLARIO_TREE VALUES (104, 3, 101, '1203', '1203 - Esperienze Amministrative europee ed e');
INSERT INTO TITOLARIO_TREE VALUES (105, 3, 101, '1204', '1204 - Aiuti a terzi paesi');
INSERT INTO TITOLARIO_TREE VALUES (106, 3, NULL, '13', '13 - PROBLEMI ISTITUZIONALI');
INSERT INTO TITOLARIO_TREE VALUES (107, 3, 106, '1301', '1301 - Problemi e temi istituzionali dei Comu');
INSERT INTO TITOLARIO_TREE VALUES (108, 3, 106, '1302', '1302 - Decentramento');
INSERT INTO TITOLARIO_TREE VALUES (109, 3, 106, '1303', '1303 - Associazionismo');
INSERT INTO TITOLARIO_TREE VALUES (110, 3, 106, '1304', '1304 - Criminalita');
INSERT INTO TITOLARIO_TREE VALUES (111, 3, 106, '1305', '1305 - Composizione Organi Comunali');
INSERT INTO TITOLARIO_TREE VALUES (112, 3, 106, '1306', '1306 - Le Unioni dei Comuni');
INSERT INTO TITOLARIO_TREE VALUES (113, 3, 106, '1307', '1307 - Elezioni Amministrative e Prov.li  e R');
INSERT INTO TITOLARIO_TREE VALUES (114, 3, 106, '1308', '1308 - Piccoli Comuni');


--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `COUNTER_HAS_AOO`
--
ALTER TABLE `COUNTER_HAS_AOO`
  ADD CONSTRAINT `fk_COUNTER_has_AOO_AOO1` FOREIGN KEY (`AOO_ID`) REFERENCES `AOO` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_COUNTER_has_AOO_COUNTER` FOREIGN KEY (`COUNTER_ID`) REFERENCES `COUNTER` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_COUNTER_TITOLARIO` FOREIGN KEY (`ID_TITOLARIO`) REFERENCES `TITOLARIO` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limiti per la tabella `TITOLARIO_TREE`
--
ALTER TABLE `TITOLARIO_TREE`
  ADD CONSTRAINT `FK_TITOLARIO_OWNER` FOREIGN KEY (`ID_OWNER`) REFERENCES `TITOLARIO_TREE` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_TITOLARIO_TREE_TITOLARIO1` FOREIGN KEY (`TITOLARIO_ID`) REFERENCES `TITOLARIO` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
