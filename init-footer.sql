-- Insert kreditarten links
INSERT INTO footer_kreditarten (id, _order, _parent_id, link_type, link_new_tab, link_url, link_label)
VALUES 
  (1, 1, 1, 'custom', false, '/ratenkredite', 'Ratenkredit'),
  (2, 2, 1, 'custom', false, '/autokredit', 'Autokredit'),
  (3, 3, 1, 'custom', false, '/umschuldung', 'Umschuldung'),
  (4, 4, 1, 'custom', false, '/sofortkredit', 'Sofortkredit'),
  (5, 5, 1, 'custom', false, '/schufa-neutral', 'SCHUFA-neutral'),
  (6, 6, 1, 'custom', false, '/kredit-selbststaendige', 'Kredit für Selbstständige');

-- Insert service links
INSERT INTO footer_service_links (id, _order, _parent_id, link_type, link_new_tab, link_url, link_label)
VALUES 
  (1, 1, 1, 'custom', false, '/ueber-uns', 'Über uns'),
  (2, 2, 1, 'custom', false, '/kontakt', 'Kontakt'),
  (3, 3, 1, 'custom', false, '/kreditarten', 'Kreditarten');

-- Insert legal links
INSERT INTO footer_legal_links (id, _order, _parent_id, link_type, link_new_tab, link_url, link_label)
VALUES 
  (1, 1, 1, 'custom', false, '/impressum', 'Impressum'),
  (2, 2, 1, 'custom', false, '/datenschutz', 'Datenschutz'),
  (3, 3, 1, 'custom', false, '/agb', 'AGB'),
  (4, 4, 1, 'custom', false, '/cookie-einstellungen', 'Cookie-Einstellungen');

-- Insert social media links
INSERT INTO footer_social_media (id, _order, _parent_id, platform, url)
VALUES 
  (1, 1, 1, 'facebook', 'https://facebook.com/kreditheld24'),
  (2, 2, 1, 'instagram', 'https://instagram.com/kreditheld24'),
  (3, 3, 1, 'linkedin', 'https://linkedin.com/company/kreditheld24');