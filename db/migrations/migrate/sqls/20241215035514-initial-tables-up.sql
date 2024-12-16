CREATE OR REPLACE FUNCTION update_updated_at() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE data_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_data_users_updated_at
BEFORE UPDATE ON data_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TABLE data_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  metadata JSONB NULL,
  uploaded_by uuid NOT NULL,
  is_processed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES data_users(id) ON DELETE CASCADE ON UPDATE RESTRICT
);

CREATE TRIGGER update_data_files_updated_at
BEFORE UPDATE ON data_files
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TABLE data_file_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id uuid NOT NULL,
  content VARCHAR NOT NULL,
  embeddings vector(1536) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_file_id FOREIGN KEY (file_id) REFERENCES data_files(id) ON DELETE CASCADE ON UPDATE RESTRICT
);

CREATE TABLE data_qas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id uuid NOT NULL,
  question VARCHAR(200) NOT NULL,
  embeddings vector NOT NULL,
  answer VARCHAR NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by uuid NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_file_id FOREIGN KEY (file_id) REFERENCES data_files(id) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES data_users(id) ON DELETE CASCADE ON UPDATE RESTRICT
);

CREATE TRIGGER update_data_qas_updated_at
BEFORE UPDATE ON data_qas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
