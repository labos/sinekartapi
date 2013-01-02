SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;
--
-- Name: aoo_id_seq; Type: SEQUENCE; Schema: public; Owner: aoo
--

CREATE SEQUENCE aoo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- Name: aoo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aoo
--

SELECT pg_catalog.setval('aoo_id_seq', 3, true);


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: aoo; Type: TABLE; Schema: public; Owner: aoo; Tablespace: 
--

CREATE TABLE aoo (
    id integer DEFAULT nextval('aoo_id_seq'::regclass) NOT NULL,
    name character varying(45) NOT NULL,
    description character varying(45),
    titolariodefault character varying(45)
);



--
-- Name: counter_id_seq; Type: SEQUENCE; Schema: public; Owner: aoo
--

CREATE SEQUENCE counter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: counter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aoo
--

SELECT pg_catalog.setval('counter_id_seq', 12, true);


--
-- Name: counter; Type: TABLE; Schema: public; Owner: aoo; Tablespace: 
--

CREATE TABLE counter (
    id integer DEFAULT nextval('counter_id_seq'::regclass) NOT NULL,
    lastvalue bigint NOT NULL
);



--
-- Name: counter_has_aoo; Type: TABLE; Schema: public; Owner: aoo; Tablespace: 
--

CREATE TABLE counter_has_aoo (
    counter_id bigint NOT NULL,
    aoo_id bigint NOT NULL,
    dt_ini_val timestamp without time zone NOT NULL,
    dt_end_val timestamp without time zone NOT NULL,
    id_titolario bigint
);



--
-- Name: titolario_id_seq; Type: SEQUENCE; Schema: public; Owner: aoo
--

CREATE SEQUENCE titolario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: titolario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aoo
--

SELECT pg_catalog.setval('titolario_id_seq', 7, true);


--
-- Name: titolario; Type: TABLE; Schema: public; Owner: aoo; Tablespace: 
--

CREATE TABLE titolario (
    id integer DEFAULT nextval('titolario_id_seq'::regclass) NOT NULL,
    name character varying(45) NOT NULL,
    descr character varying(45)
);



--
-- Name: titolario_tree_id_seq; Type: SEQUENCE; Schema: public; Owner: aoo
--

CREATE SEQUENCE titolario_tree_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: titolario_tree_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aoo
--

SELECT pg_catalog.setval('titolario_tree_id_seq', 120, true);


--
-- Name: titolario_tree; Type: TABLE; Schema: public; Owner: aoo; Tablespace: 
--

CREATE TABLE titolario_tree (
    id integer DEFAULT nextval('titolario_tree_id_seq'::regclass) NOT NULL,
    titolario_id bigint NOT NULL,
    id_owner bigint,
    name character varying(45) NOT NULL,
    descr character varying(45) NOT NULL
);



--
-- Data for Name: aoo; Type: TABLE DATA; Schema: public; Owner: aoo
--

INSERT INTO aoo VALUES (1, 'A01', 'Area di test', 'Registro');



--
-- Data for Name: counter; Type: TABLE DATA; Schema: public; Owner: aoo
--

INSERT INTO counter VALUES (1, 53);


--
-- Data for Name: counter_has_aoo; Type: TABLE DATA; Schema: public; Owner: aoo
--

INSERT INTO counter_has_aoo VALUES (1, 1, '2013-01-01 00:00:00', '2014-01-01 00:00:00', 3);


--
-- Data for Name: titolario; Type: TABLE DATA; Schema: public; Owner: aoo
--

INSERT INTO titolario VALUES (3, 'Titolario AOO 001', 'Titolario AOO 001');



--
-- Data for Name: titolario_tree; Type: TABLE DATA; Schema: public; Owner: aoo
--

INSERT INTO titolario_tree VALUES (1, 3, NULL, '01', '01 - ORGANI DELL''ASSOCIAZIONE');
INSERT INTO titolario_tree VALUES (2, 3, 1, '0101', '0101 - Assemblea generale straordinaria e ord');
INSERT INTO titolario_tree VALUES (3, 3, 1, '0102', '0102 - Presidente');
INSERT INTO titolario_tree VALUES (4, 3, 1, '0103', '0103 - Consiglio dell''Associazione');
INSERT INTO titolario_tree VALUES (5, 3, 1, '0104', '0104 - Consulte - Comitato Tecnico P.L.. - Co');
INSERT INTO titolario_tree VALUES (6, 3, 1, '0105', '0105 - UFFICI REGIONALI');
INSERT INTO titolario_tree VALUES (7, 3, 1, '0106', '0106 - Revisori dei Conti');
INSERT INTO titolario_tree VALUES (8, 3, 1, '0107', '0107 - Direttivo - Presidenza');
INSERT INTO titolario_tree VALUES (9, 3, 1, '0108', '0108 - Commissioni esterne, rappresentanza');
INSERT INTO titolario_tree VALUES (10, 3, 1, '0109', '0109 - Vice Presidenti');
INSERT INTO titolario_tree VALUES (13, 3, NULL, '02', '02 - FUNZIONAMENTO');
INSERT INTO titolario_tree VALUES (14, 3, 13, '0201', '0201 - Direttore');
INSERT INTO titolario_tree VALUES (15, 3, 13, '0202', '0202 - Personale, collaborazioni ');
INSERT INTO titolario_tree VALUES (16, 3, 13, '0203', '0203 - Sede, Arredamento');
INSERT INTO titolario_tree VALUES (17, 3, 13, '0204', '0204 - Comunicati stampa - Rassegna stampa');
INSERT INTO titolario_tree VALUES (18, 3, 13, '0205', '0205 - Circolari,  Circolari Ministeriali e a');
INSERT INTO titolario_tree VALUES (19, 3, 13, '0206', '0206 - Rivista');
INSERT INTO titolario_tree VALUES (20, 3, 13, '0207', '0207 - Bolle di consegna');
INSERT INTO titolario_tree VALUES (21, 3, 13, '0208', '0208 - Pubblicazioni e riviste varie - Tariff');
INSERT INTO titolario_tree VALUES (22, 3, NULL, '03', '03 - AMMINISTRAZIONE');
INSERT INTO titolario_tree VALUES (23, 3, 22, '0301', '0301 - Bilanci interni e scritture');
INSERT INTO titolario_tree VALUES (24, 3, 22, '0302', '0302 - Contributi dei Comuni e USL');
INSERT INTO titolario_tree VALUES (25, 3, 22, '0303', '0303 - Contributo altri enti - e richieste co');
INSERT INTO titolario_tree VALUES (26, 3, 22, '0304', '0304 - Contabilita');
INSERT INTO titolario_tree VALUES (27, 3, 22, '0305', '0305 - Movimento bancario e postale');
INSERT INTO titolario_tree VALUES (28, 3, 22, '0306', '0306 - Societa partecipate (Formel, SOA, E-gl');
INSERT INTO titolario_tree VALUES (29, 3, 22, '0307', '0307 - Contratti');
INSERT INTO titolario_tree VALUES (30, 3, 22, '0308', '0308 - Regolamenti Interni ');
INSERT INTO titolario_tree VALUES (31, 3, 22, '0309', '0309 - Sottoscrizione Protocolli d''intesa, Co');
INSERT INTO titolario_tree VALUES (32, 3, 22, '0309SC', '0309SC - Servizio civile Veneto');
INSERT INTO titolario_tree VALUES (33, 3, 22, '0309SCFVG', '0309SCFVG - Servizio civile Friuli Venezia Gi');
INSERT INTO titolario_tree VALUES (34, 3, 22, '0309PCS', '0309PCS - Piccole Citta Storiche del Veneto');
INSERT INTO titolario_tree VALUES (35, 3, NULL, '04', '04 - PERSONALE');
INSERT INTO titolario_tree VALUES (36, 3, 35, '0401', '0401 - Segretari Comunali - Agenzia SEGRETARI');
INSERT INTO titolario_tree VALUES (37, 3, 35, '0402', '0402 - Polizia Municipale - Associazione SCUO');
INSERT INTO titolario_tree VALUES (38, 3, 35, '0403', '0403 - Dipendenti Comunali');
INSERT INTO titolario_tree VALUES (39, 3, 35, '0404', '0404 - CGIL CISL UIL e sindacati altre catego');
INSERT INTO titolario_tree VALUES (40, 3, 35, '0405', '0405 - Bandi e gare d''appalto');
INSERT INTO titolario_tree VALUES (41, 3, 35, '0406', '0406 - Dipendenti ASL');
INSERT INTO titolario_tree VALUES (42, 3, 35, '0407', '0407 - Osservatorio sulla contrattazione');
INSERT INTO titolario_tree VALUES (43, 3, NULL, '05', '05 - FINANZA LOCALE');
INSERT INTO titolario_tree VALUES (44, 3, 43, '0501', '0501 - Legislazione nazionale (Comunicazioni ');
INSERT INTO titolario_tree VALUES (45, 3, 43, '0502', '0502 - Particolari regolamentazioni (Comunica');
INSERT INTO titolario_tree VALUES (46, 3, 43, '0503', '0503 - Mutui finanziari');
INSERT INTO titolario_tree VALUES (47, 3, 43, '0504', '0504 - Imposte e Tasse');
INSERT INTO titolario_tree VALUES (48, 3, 43, '0505', '0505 - Bilanci di previsione regionali ed alt');
INSERT INTO titolario_tree VALUES (49, 3, 43, '0506', '0506 - Conti Consuntivi');
INSERT INTO titolario_tree VALUES (50, 3, NULL, '06', '06 - ECONOMIA');
INSERT INTO titolario_tree VALUES (51, 3, 50, '0601', '0601 - Agricoltura (Veneto Agricoltura) - DEC');
INSERT INTO titolario_tree VALUES (52, 3, 50, '0602', '0602 - Commercio');
INSERT INTO titolario_tree VALUES (53, 3, 50, '0603', '0603 - Industria');
INSERT INTO titolario_tree VALUES (54, 3, 50, '0604', '0604 - Artigianato');
INSERT INTO titolario_tree VALUES (55, 3, 50, '0605', '0605 - Occupazione');
INSERT INTO titolario_tree VALUES (56, 3, 50, '0606', '0606 - Emigrazione - immigrazione');
INSERT INTO titolario_tree VALUES (57, 3, 50, '0607', '0607 - Programmazione');
INSERT INTO titolario_tree VALUES (58, 3, 50, '0608', '0608 - Turismo');
INSERT INTO titolario_tree VALUES (59, 3, NULL, '07', '07 - SANITA'' - ASSISTENZA');
INSERT INTO titolario_tree VALUES (60, 3, 59, '0701', '0701 - Assistenza sociale  - domicilio di soc');
INSERT INTO titolario_tree VALUES (61, 3, 59, '0702', '0702 - Assistenza scolastica');
INSERT INTO titolario_tree VALUES (62, 3, 59, '0703', '0703 - Minori');
INSERT INTO titolario_tree VALUES (63, 3, 59, '0704', '0704 - Conferenza dei Sindaci delle ASL - ASS');
INSERT INTO titolario_tree VALUES (64, 3, 59, '0705', '0705 - Politiche Sociali - Citta sane');
INSERT INTO titolario_tree VALUES (65, 3, 59, '0706', '0706 - Legge 626/94 - Sicurezza');
INSERT INTO titolario_tree VALUES (66, 3, 59, '0707', '0707 - Eventi Calamitosi e Protezione Civile');
INSERT INTO titolario_tree VALUES (67, 3, 59, '0708', '0708 - Sicurezza stradale');
INSERT INTO titolario_tree VALUES (68, 3, 59, '0709', '0709 - Polizia mortuaria - CIMITERI');
INSERT INTO titolario_tree VALUES (69, 3, NULL, '08', '08 - URBANISTICA - TERRITORIO - LL.PP.    AMB');
INSERT INTO titolario_tree VALUES (70, 3, 69, '0801', '0801 - Ambiente - Inquinamento e tutela paesa');
INSERT INTO titolario_tree VALUES (71, 3, 69, '0802', '0802 - Patrimonio Pubblico (beni demaniali st');
INSERT INTO titolario_tree VALUES (72, 3, 69, '0803', '0803 - Comprensori');
INSERT INTO titolario_tree VALUES (73, 3, 69, '0804', '0804 - Urbanistica e Catasto');
INSERT INTO titolario_tree VALUES (74, 3, 69, '0805', '0805 - Strade autostrade : Regolamento codice');
INSERT INTO titolario_tree VALUES (75, 3, 69, '0806', '0806 - Piani urbanistici di edilizia - Piani ');
INSERT INTO titolario_tree VALUES (76, 3, 69, '0807', '0807 - Problemi della casa - FSA Veneto');
INSERT INTO titolario_tree VALUES (77, 3, 69, '0808', '0808 - Parchi e riserve naturali');
INSERT INTO titolario_tree VALUES (78, 3, 69, '0809', '0809 - Lavori pubblici');
INSERT INTO titolario_tree VALUES (79, 3, NULL, '09', '09 - ISTRUZIONE - CULTURA - SPORT');
INSERT INTO titolario_tree VALUES (80, 3, 79, '0901', '0901 - Istruzione - Scuola - MASTER ');
INSERT INTO titolario_tree VALUES (81, 3, 79, '0902', '0902 - Cultura  - Tempo libero - Sport');
INSERT INTO titolario_tree VALUES (82, 3, NULL, '10', '10 - SERVIZI');
INSERT INTO titolario_tree VALUES (83, 3, 82, '1001', '1001 - Acquedotti');
INSERT INTO titolario_tree VALUES (84, 3, 82, '1002', '1002 - Gasdotti');
INSERT INTO titolario_tree VALUES (85, 3, 82, '1003', '1003 - Trasporti');
INSERT INTO titolario_tree VALUES (86, 3, 82, '1004', '1004 - ');
INSERT INTO titolario_tree VALUES (87, 3, 82, '1005', '1005 - Rifiuti Solidi Urbani');
INSERT INTO titolario_tree VALUES (88, 3, 82, '1006', '1006 - Energia elettrica - Consorzio Energia ');
INSERT INTO titolario_tree VALUES (89, 3, 82, '1007', '1007 - Informatica');
INSERT INTO titolario_tree VALUES (90, 3, NULL, '11', '11 - VARIE');
INSERT INTO titolario_tree VALUES (91, 3, 90, '1101', '1101 - Riconoscimenti ai Sindaci e cerimonial');
INSERT INTO titolario_tree VALUES (92, 3, 90, '1102', '1102 - Organi regionali e Enti ');
INSERT INTO titolario_tree VALUES (93, 3, 90, '1103', '1103 - Prefetture');
INSERT INTO titolario_tree VALUES (94, 3, 90, '1104', '1104 - Province');
INSERT INTO titolario_tree VALUES (95, 3, 90, '1105', '1105 - Regione');
INSERT INTO titolario_tree VALUES (96, 3, 90, '1106', '1106 - Convegni, seminari, riunioni, viaggi');
INSERT INTO titolario_tree VALUES (97, 3, 90, '1106DF', '1106DF - Dire & Fare');
INSERT INTO titolario_tree VALUES (98, 3, 90, '1106CP', '1106CP - Richieste/Concessione patrocini');
INSERT INTO titolario_tree VALUES (99, 3, 90, '1107', '1107 - Iniziative europee');
INSERT INTO titolario_tree VALUES (100, 3, 90, '1108', '1108 - Varie');
INSERT INTO titolario_tree VALUES (101, 3, NULL, '12', '12 - RAPPORTI INTERNAZIONALI');
INSERT INTO titolario_tree VALUES (102, 3, 101, '1201', '1201 - Gemellaggi fra Comuni');
INSERT INTO titolario_tree VALUES (103, 3, 101, '1202', '1202 - Organi CEE');
INSERT INTO titolario_tree VALUES (104, 3, 101, '1203', '1203 - Esperienze Amministrative europee ed e');
INSERT INTO titolario_tree VALUES (105, 3, 101, '1204', '1204 - Aiuti a terzi paesi');
INSERT INTO titolario_tree VALUES (106, 3, NULL, '13', '13 - PROBLEMI ISTITUZIONALI');
INSERT INTO titolario_tree VALUES (107, 3, 106, '1301', '1301 - Problemi e temi istituzionali dei Comu');
INSERT INTO titolario_tree VALUES (108, 3, 106, '1302', '1302 - Decentramento');
INSERT INTO titolario_tree VALUES (109, 3, 106, '1303', '1303 - Associazionismo');
INSERT INTO titolario_tree VALUES (110, 3, 106, '1304', '1304 - Criminalita');
INSERT INTO titolario_tree VALUES (111, 3, 106, '1305', '1305 - Composizione Organi Comunali');
INSERT INTO titolario_tree VALUES (112, 3, 106, '1306', '1306 - Le Unioni dei Comuni');
INSERT INTO titolario_tree VALUES (113, 3, 106, '1307', '1307 - Elezioni Amministrative e Prov.li  e R');
INSERT INTO titolario_tree VALUES (114, 3, 106, '1308', '1308 - Piccoli Comuni');


--
-- Name: AOO_pkey; Type: CONSTRAINT; Schema: public; Owner: aoo; Tablespace: 
--

ALTER TABLE ONLY aoo
    ADD CONSTRAINT "AOO_pkey" PRIMARY KEY (id);


--
-- Name: COUNTER_HAS_AOO_pkey; Type: CONSTRAINT; Schema: public; Owner: aoo; Tablespace: 
--

ALTER TABLE ONLY counter_has_aoo
    ADD CONSTRAINT "COUNTER_HAS_AOO_pkey" PRIMARY KEY (counter_id, aoo_id, dt_ini_val, dt_end_val);


--
-- Name: COUNTER_pkey; Type: CONSTRAINT; Schema: public; Owner: aoo; Tablespace: 
--

ALTER TABLE ONLY counter
    ADD CONSTRAINT "COUNTER_pkey" PRIMARY KEY (id);


--
-- Name: TITOLARIO_TREE_pkey; Type: CONSTRAINT; Schema: public; Owner: aoo; Tablespace: 
--

ALTER TABLE ONLY titolario_tree
    ADD CONSTRAINT "TITOLARIO_TREE_pkey" PRIMARY KEY (id);


--
-- Name: TITOLARIO_pkey; Type: CONSTRAINT; Schema: public; Owner: aoo; Tablespace: 
--

ALTER TABLE ONLY titolario
    ADD CONSTRAINT "TITOLARIO_pkey" PRIMARY KEY (id);


--
-- Name: FK_COUNTER_TITOLARIO; Type: INDEX; Schema: public; Owner: aoo; Tablespace: 
--

CREATE INDEX "FK_COUNTER_TITOLARIO" ON counter_has_aoo USING btree (id_titolario);


--
-- Name: FK_TITOLARIO_OWNER; Type: INDEX; Schema: public; Owner: aoo; Tablespace: 
--

CREATE INDEX "FK_TITOLARIO_OWNER" ON titolario_tree USING btree (id_owner);


--
-- Name: NAME_UNIQUE; Type: INDEX; Schema: public; Owner: aoo; Tablespace: 
--

CREATE UNIQUE INDEX "NAME_UNIQUE" ON titolario USING btree (name);


--
-- Name: fk_COUNTER_has_AOO_AOO1; Type: INDEX; Schema: public; Owner: aoo; Tablespace: 
--

CREATE INDEX "fk_COUNTER_has_AOO_AOO1" ON counter_has_aoo USING btree (aoo_id);


--
-- Name: fk_COUNTER_has_AOO_COUNTER; Type: INDEX; Schema: public; Owner: aoo; Tablespace: 
--

CREATE INDEX "fk_COUNTER_has_AOO_COUNTER" ON counter_has_aoo USING btree (counter_id);


--
-- Name: fk_TITOLARIO_TREE_TITOLARIO1; Type: INDEX; Schema: public; Owner: aoo; Tablespace: 
--

CREATE INDEX "fk_TITOLARIO_TREE_TITOLARIO1" ON titolario_tree USING btree (titolario_id);


--
-- Name: COUNTER_HAS_AOO_AOO_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aoo
--

ALTER TABLE ONLY counter_has_aoo
    ADD CONSTRAINT "COUNTER_HAS_AOO_AOO_ID_fkey" FOREIGN KEY (aoo_id) REFERENCES aoo(id);


--
-- Name: COUNTER_HAS_AOO_COUNTER_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aoo
--

ALTER TABLE ONLY counter_has_aoo
    ADD CONSTRAINT "COUNTER_HAS_AOO_COUNTER_ID_fkey" FOREIGN KEY (counter_id) REFERENCES counter(id);


--
-- Name: COUNTER_HAS_AOO_ID_TITOLARIO_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aoo
--

ALTER TABLE ONLY counter_has_aoo
    ADD CONSTRAINT "COUNTER_HAS_AOO_ID_TITOLARIO_fkey" FOREIGN KEY (id_titolario) REFERENCES titolario(id);


--
-- Name: TITOLARIO_TREE_ID_OWNER_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aoo
--

ALTER TABLE ONLY titolario_tree
    ADD CONSTRAINT "TITOLARIO_TREE_ID_OWNER_fkey" FOREIGN KEY (id_owner) REFERENCES titolario_tree(id);


--
-- Name: TITOLARIO_TREE_TITOLARIO_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aoo
--

ALTER TABLE ONLY titolario_tree
    ADD CONSTRAINT "TITOLARIO_TREE_TITOLARIO_ID_fkey" FOREIGN KEY (titolario_id) REFERENCES titolario(id);



