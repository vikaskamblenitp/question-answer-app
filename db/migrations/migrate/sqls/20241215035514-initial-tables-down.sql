DROP TRIGGER IF EXISTS update_data_qas_updated_at ON data_qas;

DROP TABLE IF EXISTS data_qas;

DROP TABLE IF EXISTS data_file_embeddings;

DROP TRIGGER IF EXISTS update_data_files_updated_at_trigger ON data_files;

DROP TABLE IF EXISTS data_files;

DROP TRIGGER IF EXISTS update_data_users_updated_at_trigger ON data_users;

DROP TABLE IF EXISTS data_users;