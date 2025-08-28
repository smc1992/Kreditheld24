import * as migration_20250828_105830_footer_tables from './20250828_105830_footer_tables';

export const migrations = [
  {
    up: migration_20250828_105830_footer_tables.up,
    down: migration_20250828_105830_footer_tables.down,
    name: '20250828_105830_footer_tables'
  },
];
