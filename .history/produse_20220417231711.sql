DROP TYPE IF EXISTS categorie_produs;
DROP TYPE IF EXISTS tipuri_produse;

CREATE TYPE categorie_produs AS ENUM('electrocasnice_mari', 'electrocasnice_mici', 'audio_video', 'smartphone', 'clasic');
CREATE TYPE tipuri_produse AS ENUM('electronice', 'electrocasnice', 'ingrijire_personala', 'gaming', 'personal_use');


CREATE TABLE IF NOT EXISTS produse (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   imagine VARCHAR(300),
   pret NUMERIC(8,2) NOT NULL,
   greutate INT NOT NULL CHECK (greutate>=0),
   garantie INT NOT NULL CHECK (garantie>=0),
   data_adaugare TIMESTAMP DEFAULT current_timestamp,
   culoare VARCHAR(50) NOT NULL,
   specificatii VARCHAR [], -- sau materiale/altceva
   categorie categorie_produs DEFAULT 'clasic',
   tip_produs tipuri_produse DEFAULT 'electronice',
   premium BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT into produse (nume, descriere, imagine, pret, greutate, garantie, culoare, specificatii, categorie, tip_produs, premium) VALUES
('Iphone 12', 'Penultimul model', 'iphone_12.jpg', 5000, 350, 3, 'red', '{ "8 GB RAM", "512 GB stocare", "4000 mAh"}', 'smartphone', 'personal_use', True),
('Samsung S22', 'Ultimul model', 'samsung_s22.jpg', 4500, 375, 4, 'black', '{ "6 GB RAM", "256 GB stocare", "4500 mAh"}', 'smartphone', 'personal_use', True),
('Samsung Galaxy A53', 'Model practic', 'samsung_a53.jpg', 2200, 300, 2, 'white', '{ "8 GB RAM", "256 GB stocare", "3500 mAh"}', 'smartphone', 'personal_use', False),
('Xiaomi 11', 'New edition', 'xiaomi_11.jpg', 1500, 340, 2, 'green', '{ "6 GB RAM", "128 GB stocare", "4500 mAh"}', 'smartphone', 'personal_use', False),
('Huawei P50 Pro', 'Ultimul model', 'huawei_p50_pro.jpg', 5500, 375, 4, 'gold', '{ "8 GB RAM", "256 GB stocare", "4500 mAh"}', 'smartphone', 'personal_use', True),
('Allview V8', 'De buget', 'allview_v8.jpg', 2500, 270, 2, 'blue', '{ "4 GB RAM", "128 GB stocare", "3000 mAh"}', 'smartphone', 'personal_use', False),
('Huawei Nova 9', 'Ultimul model', 'huawei_nova9.jpg', 1600, 325, 3, 'blue', '{ "8 GB RAM", "128 GB stocare", "Dual SIM"}', 'smartphone', 'personal_use', False),
('Iphone 7', 'Model vechi', 'iphone_7.jpg', 1500, 350, 2, 'black', '{ "2 GB RAM", " 32 GB stocare", "2000 mAh"}', 'smartphone', 'personal_use', True),
('Samsung S21 FE', 'Penultimul model', 'samsung_s21fe.jpg', 2500, 350, 2, 'olive', '{ "6 GB RAM", "128 GB stocare", "4500 mAh"}', 'smartphone', 'personal_use', True),
('Iphone 11', 'Penultimul model', 'iphone_11.jpg', 2800, 400, 3, 'white', '{ "4 GB RAM", "64 GB stocare", "3100 mAh"}', 'smartphone', 'personal_use', True),
('Samsung S10', 'Model vechi', 'samsung_s10.jpg', 2300, 350, 2, 'blue', '{ "8 GB RAM", "128 GB stocare", "3500 mAh"}', 'smartphone', 'personal_use', True),
('Televizor Samsung 43TU7092', 'Ultimul model', 'samsung_tv.jpg', 1650, 8750, 3, 'black', '{ "Smart TV", "Screen mirroring", "Rezolutie 3840 x 2160"}', 'clasic', 'electronice', True),
('Laptop Gaming Lenovo IdeaPad 3 15ACH6', 'Best buy', 'lenovo_ip3.jpg', 6500, 3125, 4, 'black', '{ "AMD Ryzen 7 5800H", "15.6", "Full HD, 165Hz", "16GB RAM", "512 GB SSD", "NVIDIA GeForce RTX 3050 Ti 4G"}', 'clasic', 'gaming', True),
('Masina de spalat rufe cu uscator Samsung WD90TA046BE/LE', 'Ultimul model', 'samsung_masina_spalat.jpg', 2500, 66000, 5, 'white', '{ "9 kg Spalare", "6 kg Uscare", "1400 RPM"}', 'electrocasnice_mari', 'electrocasnice', True),
('Uscator de par Philips BHD351/10', 'Penultimul model', 'philips_uscator.jpg', 110, 450, 2, 'grey', '{ "2100W", "Thermo Protect", "6 setari de viteza/temperatura"}', 'clasic', 'ingrijire_personala', False);
