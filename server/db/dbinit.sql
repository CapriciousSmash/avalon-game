-- Copied from another source, this isn't quite true
-- Currently not using since sequelize creates database but this can be used 
-- as a reference of how the database will be created or if you do not want to 
-- use ORM

CREATE TABLE IF NOT EXISTS users ( 
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  password INTEGER,
  salt VARCHAR(100),
  points INTEGER DEFAULT 0,
  games INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT now() 
);

-- Table for saved games