-- Table: public."Heatperiod" DBName Temp_history

-- DROP TABLE public."Heatperiod";

CREATE TABLE public."Heatperiod"
(
  "Id" integer NOT NULL DEFAULT nextval('"History_Id_seq"'::regclass),
  "Period" integer,
  "TimeStamp" timestamp with time zone DEFAULT now(),
  "Room" character varying(15),
  "Start" bigint,
  "End" bigint,
  CONSTRAINT mainkey PRIMARY KEY ("Id")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."Heatperiod"
  OWNER TO pi;