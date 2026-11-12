ALTER TABLE categories
  ADD COLUMN available boolean NOT NULL DEFAULT true;

INSERT INTO categories (name, description) VALUES
  ('Tecnologia', 'Tecnologia e inovação'),
  ('Meio ambiente', 'Meio ambiente e sustentabilidade'),
  ('Saúde', 'Saúde e bem-estar'),
  ('Economia', 'Economia e finanças'),
  ('Política', 'Política e governo'),
  ('Ciência', 'Ciência e pesquisa'),
  ('Educação', 'Educação e aprendizagem'),
  ('Sociedade', 'Sociedade e cultura'),
  ('Geral', 'Assuntos gerais')
ON CONFLICT (name) DO NOTHING;
