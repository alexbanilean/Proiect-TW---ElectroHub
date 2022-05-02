--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-04-24 22:57:42

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 841 (class 1247 OID 32809)
-- Name: categorie_produs; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.categorie_produs AS ENUM (
    'electrocasnice_mari',
    'electrocasnice_mici',
    'audio_video',
    'smartphone',
    'clasic'
);


ALTER TYPE public.categorie_produs OWNER TO postgres;

--
-- TOC entry 832 (class 1247 OID 24726)
-- Name: roluri; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.roluri AS ENUM (
    'admin',
    'moderator',
    'comun'
);


ALTER TYPE public.roluri OWNER TO postgres;

--
-- TOC entry 844 (class 1247 OID 32820)
-- Name: tipuri_produse; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipuri_produse AS ENUM (
    'electronice',
    'electrocasnice',
    'ingrijire_personala',
    'gaming',
    'personal_use'
);


ALTER TYPE public.tipuri_produse OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 24748)
-- Name: accesari; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accesari (
    id integer NOT NULL,
    ip character varying(100) NOT NULL,
    user_id integer,
    pagina character varying(500) NOT NULL,
    data_accesare timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.accesari OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 24747)
-- Name: accesari_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accesari_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accesari_id_seq OWNER TO postgres;

--
-- TOC entry 3367 (class 0 OID 0)
-- Dependencies: 213
-- Name: accesari_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accesari_id_seq OWNED BY public.accesari.id;


--
-- TOC entry 216 (class 1259 OID 32832)
-- Name: produse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produse (
    id integer NOT NULL,
    nume character varying(50) NOT NULL,
    descriere text,
    imagine character varying(300),
    pret numeric(8,2) NOT NULL,
    greutate integer NOT NULL,
    garantie integer NOT NULL,
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    culoare character varying(50) NOT NULL,
    specificatii character varying[],
    categorie public.categorie_produs DEFAULT 'clasic'::public.categorie_produs,
    tip_produs public.tipuri_produse DEFAULT 'electronice'::public.tipuri_produse,
    premium boolean DEFAULT false NOT NULL,
    CONSTRAINT produse_garantie_check CHECK ((garantie >= 0)),
    CONSTRAINT produse_greutate_check CHECK ((greutate >= 0))
);


ALTER TABLE public.produse OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 32831)
-- Name: produse_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.produse_id_seq OWNER TO postgres;

--
-- TOC entry 3368 (class 0 OID 0)
-- Dependencies: 215
-- Name: produse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produse_id_seq OWNED BY public.produse.id;


--
-- TOC entry 210 (class 1259 OID 24578)
-- Name: tabel_test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tabel_test (
    id integer NOT NULL,
    nume character varying(100) NOT NULL,
    pret integer DEFAULT 100 NOT NULL
);


ALTER TABLE public.tabel_test OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 24577)
-- Name: tabel_test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tabel_test ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tabel_test_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 212 (class 1259 OID 24734)
-- Name: utilizatori; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilizatori (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    nume character varying(100) NOT NULL,
    prenume character varying(100) NOT NULL,
    parola character varying(500) NOT NULL,
    rol public.roluri DEFAULT 'comun'::public.roluri NOT NULL,
    email character varying(100) NOT NULL,
    culoare_chat character varying(50) NOT NULL,
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cod character varying(200),
    confirmat_mail boolean DEFAULT false
);


ALTER TABLE public.utilizatori OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 24733)
-- Name: utilizatori_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilizatori_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilizatori_id_seq OWNER TO postgres;

--
-- TOC entry 3371 (class 0 OID 0)
-- Dependencies: 211
-- Name: utilizatori_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilizatori_id_seq OWNED BY public.utilizatori.id;


--
-- TOC entry 3193 (class 2604 OID 24751)
-- Name: accesari id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari ALTER COLUMN id SET DEFAULT nextval('public.accesari_id_seq'::regclass);


--
-- TOC entry 3195 (class 2604 OID 32835)
-- Name: produse id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produse ALTER COLUMN id SET DEFAULT nextval('public.produse_id_seq'::regclass);


--
-- TOC entry 3189 (class 2604 OID 24737)
-- Name: utilizatori id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori ALTER COLUMN id SET DEFAULT nextval('public.utilizatori_id_seq'::regclass);


--
-- TOC entry 3359 (class 0 OID 24748)
-- Dependencies: 214
-- Data for Name: accesari; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3361 (class 0 OID 32832)
-- Dependencies: 216
-- Data for Name: produse; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (1, 'Iphone 12', 'Penultimul model', 'iphone_12.jpg', 5000.00, 350, 3, '2022-04-17 23:24:31.81292', 'red', '{"8 GB RAM","512 GB stocare","4000 mAh"}', 'smartphone', 'personal_use', true);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (2, 'Samsung S22', 'Ultimul model', 'samsung_s22.jpg', 4500.00, 375, 4, '2022-04-17 23:24:31.81292', 'black', '{"6 GB RAM","256 GB stocare","4500 mAh"}', 'smartphone', 'personal_use', true);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (3, 'Samsung Galaxy A53', 'Model practic', 'samsung_a53.jpg', 2200.00, 300, 2, '2022-04-17 23:24:31.81292', 'white', '{"8 GB RAM","256 GB stocare","3500 mAh"}', 'smartphone', 'personal_use', false);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (4, 'Xiaomi 11', 'New edition', 'xiaomi_11.jpg', 1500.00, 340, 2, '2022-04-17 23:24:31.81292', 'green', '{"6 GB RAM","128 GB stocare","4500 mAh"}', 'smartphone', 'personal_use', false);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (5, 'Huawei P50 Pro', 'Ultimul model', 'huawei_p50_pro.jpg', 5500.00, 375, 4, '2022-04-17 23:24:31.81292', 'gold', '{"8 GB RAM","256 GB stocare","4500 mAh"}', 'smartphone', 'personal_use', true);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (6, 'Allview V8', 'De buget', 'allview_v8.jpg', 2500.00, 270, 2, '2022-04-17 23:24:31.81292', 'blue', '{"4 GB RAM","128 GB stocare","3000 mAh"}', 'smartphone', 'personal_use', false);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (7, 'Huawei Nova 9', 'Ultimul model', 'huawei_nova9.jpg', 1600.00, 325, 3, '2022-04-17 23:24:31.81292', 'blue', '{"8 GB RAM","128 GB stocare","Dual SIM"}', 'smartphone', 'personal_use', false);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (8, 'Iphone 7', 'Model vechi', 'iphone_7.jpg', 1500.00, 350, 2, '2022-04-17 23:24:31.81292', 'black', '{"2 GB RAM"," 32 GB stocare","2000 mAh"}', 'smartphone', 'personal_use', true);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (9, 'Samsung S21 FE', 'Penultimul model', 'samsung_s21fe.jpg', 2500.00, 350, 2, '2022-04-17 23:24:31.81292', 'olive', '{"6 GB RAM","128 GB stocare","4500 mAh"}', 'smartphone', 'personal_use', true);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (10, 'Iphone 11', 'Penultimul model', 'iphone_11.jpg', 2800.00, 400, 3, '2022-04-17 23:24:31.81292', 'white', '{"4 GB RAM","64 GB stocare","3100 mAh"}', 'smartphone', 'personal_use', true);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (11, 'Samsung S10', 'Model vechi', 'samsung_s10.jpg', 2300.00, 350, 2, '2022-04-17 23:24:31.81292', 'blue', '{"8 GB RAM","128 GB stocare","3500 mAh"}', 'smartphone', 'personal_use', true);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (12, 'Televizor Samsung 43TU7092', 'Ultimul model', 'samsung_tv.jpg', 1650.00, 8750, 3, '2022-04-17 23:24:31.81292', 'black', '{"Smart TV","Screen mirroring","Rezolutie 3840 x 2160"}', 'clasic', 'electronice', true);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (13, 'Laptop Gaming Lenovo IdeaPad 3 15ACH6', 'Best buy', 'lenovo_ip3.jpg', 6500.00, 3125, 4, '2022-04-17 23:24:31.81292', 'black', '{"AMD Ryzen 7 5800H",15.6,"Full HD, 165Hz","16GB RAM","512 GB SSD","NVIDIA GeForce RTX 3050 Ti 4G"}', 'clasic', 'gaming', true);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (14, 'Masina de spalat rufe Samsung WD90TA046BE/LE', 'Ultimul model', 'samsung_masina_spalat.jpg', 2500.00, 66000, 5, '2022-04-17 23:24:31.81292', 'white', '{"9 kg Spalare","6 kg Uscare","1400 RPM"}', 'electrocasnice_mari', 'electrocasnice', true);
INSERT INTO public.produse (id, nume, descriere, imagine, pret, greutate, garantie, data_adaugare, culoare, specificatii, categorie, tip_produs, premium) VALUES (15, 'Uscator de par Philips BHD351/10', 'Penultimul model', 'philips_uscator.jpg', 110.00, 450, 2, '2022-04-17 23:24:31.81292', 'grey', '{2100W,"Thermo Protect","6 setari de viteza/temperatura"}', 'clasic', 'ingrijire_personala', false);


--
-- TOC entry 3355 (class 0 OID 24578)
-- Dependencies: 210
-- Data for Name: tabel_test; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tabel_test (id, nume, pret) OVERRIDING SYSTEM VALUE VALUES (1, 'abcd', 100);
INSERT INTO public.tabel_test (id, nume, pret) OVERRIDING SYSTEM VALUE VALUES (2, 'def', 17);
INSERT INTO public.tabel_test (id, nume, pret) OVERRIDING SYSTEM VALUE VALUES (3, 'xyz', 100);


--
-- TOC entry 3357 (class 0 OID 24734)
-- Dependencies: 212
-- Data for Name: utilizatori; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.utilizatori (id, username, nume, prenume, parola, rol, email, culoare_chat, data_adaugare, cod, confirmat_mail) VALUES (3, 'prof1234', 'Gogulescu', 'Gogu', '0aa3327fdf58f2b675570a174764e0fe547652500a04d9d55d6e073c82f4db816ebfd77726c16922736fd4dbe7ae9acd4b11863b6dd54119413ed449e2b5dddb', 'comun', 'profprofprof007@gmail.com', 'green', '2022-04-11 18:14:31.720297', NULL, false);
INSERT INTO public.utilizatori (id, username, nume, prenume, parola, rol, email, culoare_chat, data_adaugare, cod, confirmat_mail) VALUES (4, 'aa', 'aa', 'aa', '34116c16f1a4de4aa165423fa8b500495a5e2e4c2688152eeb8f7f92e9b90a7e0b7dcc49d2e5b4714e9d27c1d77134aaf83294eb66decd1700d7cfed04b456ef', 'comun', 'profprofprof007@gmail.com', 'red', '2022-04-21 14:33:24.246865', NULL, false);
INSERT INTO public.utilizatori (id, username, nume, prenume, parola, rol, email, culoare_chat, data_adaugare, cod, confirmat_mail) VALUES (5, 'abcd', 'Gogulescu', 'Denis', '34116c16f1a4de4aa165423fa8b500495a5e2e4c2688152eeb8f7f92e9b90a7e0b7dcc49d2e5b4714e9d27c1d77134aaf83294eb66decd1700d7cfed04b456ef', 'comun', 'clienti.electrohub@gmail.com', 'green', '2022-04-21 15:32:24.889128', NULL, false);


--
-- TOC entry 3372 (class 0 OID 0)
-- Dependencies: 213
-- Name: accesari_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accesari_id_seq', 1, false);


--
-- TOC entry 3373 (class 0 OID 0)
-- Dependencies: 215
-- Name: produse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produse_id_seq', 15, true);


--
-- TOC entry 3374 (class 0 OID 0)
-- Dependencies: 209
-- Name: tabel_test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tabel_test_id_seq', 3, true);


--
-- TOC entry 3375 (class 0 OID 0)
-- Dependencies: 211
-- Name: utilizatori_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilizatori_id_seq', 5, true);


--
-- TOC entry 3209 (class 2606 OID 24756)
-- Name: accesari accesari_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_pkey PRIMARY KEY (id);


--
-- TOC entry 3211 (class 2606 OID 32847)
-- Name: produse produse_nume_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produse
    ADD CONSTRAINT produse_nume_key UNIQUE (nume);


--
-- TOC entry 3213 (class 2606 OID 32845)
-- Name: produse produse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produse
    ADD CONSTRAINT produse_pkey PRIMARY KEY (id);


--
-- TOC entry 3203 (class 2606 OID 24582)
-- Name: tabel_test tabel_test_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tabel_test
    ADD CONSTRAINT tabel_test_pkey PRIMARY KEY (id);


--
-- TOC entry 3205 (class 2606 OID 24744)
-- Name: utilizatori utilizatori_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_pkey PRIMARY KEY (id);


--
-- TOC entry 3207 (class 2606 OID 24746)
-- Name: utilizatori utilizatori_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_username_key UNIQUE (username);


--
-- TOC entry 3214 (class 2606 OID 24757)
-- Name: accesari accesari_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.utilizatori(id);


--
-- TOC entry 3369 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE tabel_test; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tabel_test TO alex_test;


--
-- TOC entry 3370 (class 0 OID 0)
-- Dependencies: 209
-- Name: SEQUENCE tabel_test_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tabel_test_id_seq TO alex_test;


-- Completed on 2022-04-24 22:57:42

--
-- PostgreSQL database dump complete
--

