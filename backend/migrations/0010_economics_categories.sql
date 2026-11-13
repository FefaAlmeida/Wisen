INSERT INTO categories(name,description) VALUES
('Inflação','Preços e poder de compra'),('Juros','Juros e política monetária'),('Emprego','Trabalho e renda'),
('Contas públicas','Orçamento e política fiscal'),('Crédito','Crédito e financiamento'),('Comércio','Comércio e relações econômicas'),('Renda e consumo','Renda, consumo e orçamento familiar')
ON CONFLICT(name) DO NOTHING;
