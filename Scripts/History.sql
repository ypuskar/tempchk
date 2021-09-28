-- Table: public."History" DBName Temp_history

-- DROP TABLE public."History";

CREATE TABLE public."History"
(
  "Id" integer NOT NULL DEFAULT nextval('"History_Id_seq"'::regclass),
  "Temp_garaaz" real,
  "Temp_Leiliruum" real,
  "Temp_Eesruum" real,
  "Temp_valjas" real,
  "Kyte_garaaz" boolean,
  "Kyte_eesruum" boolean,
  "TimeStamp" timestamp with time zone DEFAULT now(),
  "Kyte_leiliruum" boolean,
  CONSTRAINT peavoti PRIMARY KEY ("Id")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."History"
  OWNER TO pi;