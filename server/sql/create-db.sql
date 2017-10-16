CREATE DATABASE url_shortener;

\c url_shortener;

CREATE USER url_shortener WITH PASSWORD 'qwerty';
GRANT ALL ON DATABASE url_shortener TO url_shortener;

CREATE SEQUENCE ids;
CREATE TABLE shortened_urls (
  id              INTEGER PRIMARY KEY DEFAULT NEXTVAL('ids'),
  original_url    TEXT CHECK (char_length(original_url) <= 1000),
  creation_date   TIMESTAMPTZ,
  short_url_hash TEXT UNIQUE,
  clicks          INTEGER
);

CREATE INDEX ON shortened_urls (original_url);
CREATE INDEX ON shortened_urls (short_url_hash);

GRANT ALL PRIVILEGES ON TABLE shortened_urls TO url_shortener;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO url_shortener;
