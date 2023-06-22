CREATE TABLE IF NOT EXISTS Category (
    category_number SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Product (
    id_product SERIAL PRIMARY KEY,
    category_number SERIAL NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    charachteristics VARCHAR(100) NOT NULL,
    FOREIGN KEY(category_number)
        REFERENCES Category (category_number)
        ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Customer_Card (
  card_number VARCHAR(13) PRIMARY KEY,
  cust_name VARCHAR(50) NOT NULL,
  cust_surname VARCHAR(50) NOT NULL,
  cust_patronimic VARCHAR(50) NULL,
  phone_number VARCHAR(13)NOT NULL,
  city VARCHAR(50) NULL,
  street VARCHAR(50) NULL,
  zip_code VARCHAR(9) NULL,
  percent INT NULL CHECK (percent > 0)
);

CREATE TABLE IF NOT EXISTS Employee (
  id_employee VARCHAR(10) PRIMARY KEY,
  empl_name VARCHAR(50) NOT NULL,
  empl_surname VARCHAR(50) NOT NULL,
  empl_patronimic VARCHAR(50) NULL,
  empl_role VARCHAR(10) NOT NULL CHECK (empl_role in ('MANAGER', 'CASHIER')),
  salary NUMERIC(13, 4) NOT NULL CHECK (salary > 0),
  date_of_birth DATE NOT NULL 
  CHECK (AGE(current_date, date_of_birth) > INTERVAL '18 years'),
  date_of_start DATE NOT NULL,
  phone_number VARCHAR(13) NOT NULL,
  city VARCHAR(50) NOT NULL,
  street VARCHAR(50) NOT NULL,
  zip_code VARCHAR(9) NOT NULL,
  pass VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.Check (
  check_number VARCHAR(10) PRIMARY KEY,
  id_employee VARCHAR(10) NOT NULL,
  card_number VARCHAR(13) NULL,
  print_date DATE NOT NUll,
  sum_total NUMERIC(13, 4) NOT NULL CHECK (sum_total > 0),
  vat NUMERIC(13, 4) NOT NULL GENERATED ALWAYS AS (sum_total * 0.2) STORED,
  FOREIGN KEY(id_employee)
        REFERENCES Employee (id_employee)
        ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY(card_number)
        REFERENCES Customer_Card (card_number)
        ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Store_Product (
  UPC VARCHAR(12) PRIMARY KEY,
  UPC_Prom VARCHAR(12) NULL,
  id_product INT NOT NULL,
  selling_price NUMERIC(13, 4) NOT NULL CHECK (selling_price > 0),
  products_nubmer INT NOT NULL CHECK (products_nubmer >= 0),
  promotional_product BOOLEAN NOT NULL,
  FOREIGN KEY(UPC_Prom)
        REFERENCES Store_Product (UPC)
        ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY(id_product)
        REFERENCES Product (id_product)
        ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Sale (
  UPC VARCHAR(12) NOT NULL,
  check_number VARCHAR(10) NOT NULL,
  product_number INT NOT NULL CHECK (product_number > 0),
  selling_price NUMERIC(13, 4) NOT NULL CHECK (selling_price > 0),
  PRIMARY KEY(UPC, check_number),
  FOREIGN KEY(UPC)
        REFERENCES Store_Product (UPC)
        ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY(check_number)
        REFERENCES public.Check (check_number)
        ON DELETE CASCADE ON UPDATE CASCADE
);