--
-- PostgreSQL database dump
--

\restrict QcIbyqvnlfM1H6Ho69gNXdlFox8lduNcsSNqTBUOoGF9Av2QZxbeebm5jRCep46

-- Dumped from database version 14.20 (Homebrew)
-- Dumped by pg_dump version 14.20 (Homebrew)

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
-- Name: AppointmentStatus; Type: TYPE; Schema: public; Owner: vidarshanrathnayake
--

CREATE TYPE public."AppointmentStatus" AS ENUM (
    'SCHEDULED',
    'COMPLETED',
    'CANCELLED',
    'LATE'
);


ALTER TYPE public."AppointmentStatus" OWNER TO vidarshanrathnayake;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: vidarshanrathnayake
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'STAFF',
    'CLIENT'
);


ALTER TYPE public."Role" OWNER TO vidarshanrathnayake;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Appointment; Type: TABLE; Schema: public; Owner: vidarshanrathnayake
--

CREATE TABLE public."Appointment" (
    id text NOT NULL,
    "startTime" timestamp with time zone NOT NULL,
    "endTime" timestamp with time zone NOT NULL,
    status public."AppointmentStatus" NOT NULL,
    address text NOT NULL,
    "clientId" text NOT NULL,
    "staffId" text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completionSent" boolean DEFAULT false NOT NULL,
    price double precision,
    "reminder1dSent" boolean DEFAULT false NOT NULL,
    "reminder5dSent" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Appointment" OWNER TO vidarshanrathnayake;

--
-- Name: User; Type: TABLE; Schema: public; Owner: vidarshanrathnayake
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    role public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    password text NOT NULL
);


ALTER TABLE public."User" OWNER TO vidarshanrathnayake;

--
-- Name: VisitNote; Type: TABLE; Schema: public; Owner: vidarshanrathnayake
--

CREATE TABLE public."VisitNote" (
    id text NOT NULL,
    content text NOT NULL,
    "isClientVisible" boolean DEFAULT false NOT NULL,
    "appointmentId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."VisitNote" OWNER TO vidarshanrathnayake;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: vidarshanrathnayake
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO vidarshanrathnayake;

--
-- Data for Name: Appointment; Type: TABLE DATA; Schema: public; Owner: vidarshanrathnayake
--

COPY public."Appointment" (id, "startTime", "endTime", status, address, "clientId", "staffId", "createdAt", "completionSent", price, "reminder1dSent", "reminder5dSent") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: vidarshanrathnayake
--

COPY public."User" (id, name, email, role, "createdAt", password) FROM stdin;
15c09cc0-c755-4d35-9237-1b0efd1059f1	vidarshan	vidarshanadithya33@gmail.com	CLIENT	2026-02-05 01:35:26.714	$2b$10$hT55HYWnlvOxZbsRHZlIneMQdwk2WpKAROh7to6KcBZ47BpWJZ75u
49b6057e-0bda-49b4-9390-6d6dbcf0672a	admin	admin@ecoclean.com	ADMIN	2026-02-05 01:42:57.373	$2b$10$OduElcfjMko13dXuMfyvkOCgE00fnY0uHkx4kB6aeIWQbYuEknpO.
e9c352d2-ac5b-48a1-a1d3-f438d21c57d3	staff	staff@ecoclean.com	STAFF	2026-02-05 01:48:08.576	$2b$10$IzNF9jbE9yBXJJohhx0f8e2/1nql2J4ZT/8B1v5cbEe8pXKmEZlsC
\.


--
-- Data for Name: VisitNote; Type: TABLE DATA; Schema: public; Owner: vidarshanrathnayake
--

COPY public."VisitNote" (id, content, "isClientVisible", "appointmentId", "createdAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: vidarshanrathnayake
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
8f4b791a-7b0e-4b37-accb-0460761cf3e6	7a3061912b4fc0f40e6808599767cd9e22262c760c9af9674faf8612af73f9c3	2026-02-04 16:54:37.021591-08	20260127234057_init	\N	\N	2026-02-04 16:54:37.010755-08	1
9b5c6629-1568-4cfb-bd0d-114e600159c7	eb7b8daec0ee36044749897ffa29c96c41df26fac64762d6285882b2cbf3c99d	2026-02-04 16:54:37.023105-08	20260128002651_add_password	\N	\N	2026-02-04 16:54:37.021973-08	1
67ef367e-4320-42c7-a418-0a75befe68d1	2665f66c7140f724eae2abfd2d60615cf38be5d503aa70577d0c994e847d29c9	2026-02-04 16:54:40.603351-08	20260205005440_add_appointment_email_flags	\N	\N	2026-02-04 16:54:40.601746-08	1
922b5221-48e0-4fa2-8342-b7925ead77b6	401564fffd3aa392a02dc8d2957bee576e971f471ccca7be3d19b91875874dfa	2026-02-04 17:52:12.213733-08	20260205015212_use_timestamptz_for_dates	\N	\N	2026-02-04 17:52:12.208868-08	1
\.


--
-- Name: Appointment Appointment_pkey; Type: CONSTRAINT; Schema: public; Owner: vidarshanrathnayake
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: vidarshanrathnayake
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VisitNote VisitNote_pkey; Type: CONSTRAINT; Schema: public; Owner: vidarshanrathnayake
--

ALTER TABLE ONLY public."VisitNote"
    ADD CONSTRAINT "VisitNote_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: vidarshanrathnayake
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: vidarshanrathnayake
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Appointment Appointment_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vidarshanrathnayake
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Appointment Appointment_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vidarshanrathnayake
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VisitNote VisitNote_appointmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vidarshanrathnayake
--

ALTER TABLE ONLY public."VisitNote"
    ADD CONSTRAINT "VisitNote_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES public."Appointment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict QcIbyqvnlfM1H6Ho69gNXdlFox8lduNcsSNqTBUOoGF9Av2QZxbeebm5jRCep46

